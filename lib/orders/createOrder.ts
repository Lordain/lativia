"use server";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  CreateOrderInput,
  EligibilityAcknowledgement,
} from "@/types/order";

import type {
  FormFieldSchema,
} from "@/types/form";

interface EligibilitySchemaItem {
  key: string;
  label: string;
  required?: boolean;
}

/*
 * ========================================
 * Customer Form Validation
 * ========================================
 */

function validateAndSanitizeFormData(
  formSchema: FormFieldSchema[],
  submittedData: Record<
    string,
    string
  >
): Record<string, string> {
  const cleanData:
    Record<string, string> =
      {};

  for (
    const field
    of formSchema
  ) {
    /*
     * 不直接信任 Client。
     *
     * 即使 TypeScript 写的是 string，
     * 浏览器请求仍可能被人为修改。
     */

    const rawValue =
      submittedData?.[
        field.name
      ];

    if (
      rawValue ===
        undefined ||
      rawValue ===
        null
    ) {
      if (
        field.required
      ) {
        throw new Error(
          `请填写：${field.label}`
        );
      }

      continue;
    }

    if (
      typeof rawValue !==
      "string"
    ) {
      throw new Error(
        `${field.label} 格式不正确`
      );
    }

    const value =
      rawValue.trim();

    /*
     * Required
     */

    if (
      field.required &&
      !value
    ) {
      throw new Error(
        `请填写：${field.label}`
      );
    }

    /*
     * Optional 空值无需保存。
     */

    if (!value) {
      continue;
    }

    /*
     * ========================================
     * Basic type validation
     * ========================================
     */

    switch (
      field.type
    ) {
      case "email": {
        const emailPattern =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
          !emailPattern.test(
            value
          )
        ) {
          throw new Error(
            `${field.label} 不是有效的电子邮箱`
          );
        }

        break;
      }

      case "number": {
        if (
          !Number.isFinite(
            Number(
              value
            )
          )
        ) {
          throw new Error(
            `${field.label} 必须是数字`
          );
        }

        break;
      }

      case "date": {
        const datePattern =
          /^\d{4}-\d{2}-\d{2}$/;

        if (
          !datePattern.test(
            value
          )
        ) {
          throw new Error(
            `${field.label} 日期格式不正确`
          );
        }

        break;
      }

      case "textarea": {
        if (
          value.length >
          10000
        ) {
          throw new Error(
            `${field.label} 内容过长`
          );
        }

        break;
      }

      default: {
        if (
          value.length >
          2000
        ) {
          throw new Error(
            `${field.label} 内容过长`
          );
        }
      }
    }

    /*
     * 只保存 Service formSchema
     * 明确定义的字段。
     *
     * Client 偷偷增加的字段
     * 不会进入 orders.form_data。
     */

    cleanData[
      field.name
    ] =
      value;
  }

  return cleanData;
}

function normalizeUppercaseValue(
  value:
    unknown
) {
  return typeof value ===
    "string"
    ? value
        .trim()
        .toUpperCase()
    : "";
}


function isValidCurp(
  value:
    string
) {
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(
    value
  );
}


function isValidPersonalRfc(
  value:
    string
) {
  /*
   * Persona Física
   * 4 letters + 6 date digits + 3 homoclave
   * Total: 13 characters
   *
   * 这里只做基础格式检查，
   * 不代表 SAT 已确认 RFC 存在或有效。
   */
  return /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/.test(
    value
  );
}


function isValidCompanyRfc(
  value:
    string
) {
  /*
   * Persona Moral
   * 3 letters + 6 date digits + 3 homoclave
   * Total: 12 characters
   *
   * 这里只做基础格式检查，
   * 不代表 SAT 已确认 RFC 存在或有效。
   */
  return /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/.test(
    value
  );
}


export async function createOrder(
  input:
    CreateOrderInput
) {
  /*
   * ========================================
   * Server Supabase Client
   * ========================================
   */

  const supabase =
    await createClient();

  /*
   * ========================================
   * Authentication
   * ========================================
   */

  const {
    data: {
      user,
    },

    error:
      userError,
  } =
    await supabase
      .auth
      .getUser();

  if (
    userError ||
    !user
  ) {
    throw new Error(
      "请先登录后再提交申请"
    );
  }

  /*
   * ========================================
   * Basic Input
   * ========================================
   */

  const serviceId =
    input.serviceId
      ?.trim();

  const priceId =
    input.priceId
      ?.trim();

      const clientRequestId =
      input
        .clientRequestId
        ?.trim();


    if (
      !clientRequestId
    ) {
      throw new Error(
        "订单请求编号无效"
      );
    }


    const isValidClientRequestId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(
          clientRequestId
        );


    if (
      !isValidClientRequestId
    ) {
      throw new Error(
        "订单请求编号格式无效"
      );
    }

  if (
    !serviceId
  ) {
    throw new Error(
      "缺少服务信息"
    );
  }

  if (
    !priceId
  ) {
    throw new Error(
      "请选择付款方式"
    );
  }

  /*
   * ========================================
   * Service
   * ========================================
   *
   * Server 重新读取所有与购买资格相关
   * 的 Service 配置。
   */

  const {
    data:
      service,

    error:
      serviceError,
  } =
    await supabase
      .from(
        "services"
      )
      .select(`
        id,
        service_status,
        eligibility_mode,
        eligibility_schema,
        form_schema
      `)
      .eq(
        "id",
        serviceId
      )
      .maybeSingle();

  if (
    serviceError ||
    !service
  ) {
    throw new Error(
      "服务不存在"
    );
  }

  /*
   * ========================================
   * Service Status
   * ========================================
   */

  if (
    service
      .service_status ===
    "paused"
  ) {
    throw new Error(
      "此服务目前暂停受理"
    );
  }

  if (
    service
      .service_status !==
    "active"
  ) {
    throw new Error(
      "此服务目前不可办理"
    );
  }

  /*
   * ========================================
   * Eligibility
   * ========================================
   */

  const eligibilityMode =
    service
      .eligibility_mode ??
    "none";

  const eligibilitySchema =
    Array.isArray(
      service
        .eligibility_schema
    )
      ? (
          service
            .eligibility_schema as
            EligibilitySchemaItem[]
        )
      : [];

  const acknowledgedKeys =
    new Set(
      (
        input
          .eligibilityAcknowledgementKeys ??
        []
      )
        .filter(
          (
            key
          ): key is string =>
            typeof key ===
            "string"
        )
        .map(
          key =>
            key.trim()
        )
        .filter(
          Boolean
        )
    );

  let eligibilityAcknowledgements:
    EligibilityAcknowledgement[] =
      [];

  let eligibilityConfirmedAt:
    string | null =
      null;

  if (
    eligibilityMode ===
    "self_check"
  ) {
    const requiredItems =
      eligibilitySchema.filter(
        item =>
          item.required !==
          false
      );

    for (
      const item
      of requiredItems
    ) {
      if (
        !item.key ||
        !item.label
      ) {
        throw new Error(
          "服务资格配置不完整，请联系管理员"
        );
      }

      if (
        !acknowledgedKeys.has(
          item.key
        )
      ) {
        throw new Error(
          `请先确认办理条件：${item.label}`
        );
      }
    }

    /*
     * Snapshot 由 Server 根据数据库
     * 中的 eligibilitySchema 创建。
     */

    eligibilityAcknowledgements =
      requiredItems.map(
        item => ({
          key:
            item.key,

          label:
            item.label,
        })
      );

    eligibilityConfirmedAt =
      new Date()
        .toISOString();
  }

  /*
   * ========================================
   * Customer Form Schema
   * ========================================
   */

  const formSchema =
    Array.isArray(
      service
        .form_schema
    )
      ? (
          service
            .form_schema as
            FormFieldSchema[]
        )
      : [];

  /*
   * 真正存入 Order 的 form_data
   * 只能由当前 Service 的 formSchema
   * 生成。
   */

  const cleanFormData =
    validateAndSanitizeFormData(
      formSchema,
      input.formData ??
        {}
    );

    const email =
    cleanFormData
      .email
      ?.trim()
      .toLowerCase();


  const emailConfirmation =
    cleanFormData
      .email_confirmation
      ?.trim()
      .toLowerCase();


  if (
    emailConfirmation &&
    email !==
      emailConfirmation
  ) {
    throw new Error(
      "两次输入的电子邮箱不一致"
    );
  }

  if (
    cleanFormData.curp
  ) {
    const curp =
      normalizeUppercaseValue(
        cleanFormData.curp
      );


    if (
      !isValidCurp(
        curp
      )
    ) {
      throw new Error(
        "CURP 格式不正确，请检查后重新填写"
      );
    }


    cleanFormData.curp =
      curp;
  }

  /*
 * ========================================
 * RFC Validation
 * ========================================
 *
 * rfc：
 * Persona Física，13 位
 *
 * company_rfc：
 * Persona Moral，12 位
 *
 * legal_representative_rfc：
 * 法定代表人为自然人，13 位
 */

if (
  cleanFormData.rfc
) {
  const rfc =
    normalizeUppercaseValue(
      cleanFormData.rfc
    );


  if (
    !isValidPersonalRfc(
      rfc
    )
  ) {
    throw new Error(
      "个人 RFC 格式不正确。应为 13 位：前 4 位为字母，中间 6 位为日期数字，最后 3 位为字母或数字。"
    );
  }


  cleanFormData.rfc =
    rfc;
}


if (
  cleanFormData
    .company_rfc
) {
  const companyRfc =
    normalizeUppercaseValue(
      cleanFormData
        .company_rfc
    );


  if (
    !isValidCompanyRfc(
      companyRfc
    )
  ) {
    throw new Error(
      "企业 RFC 格式不正确。应为 12 位：前 3 位为字母，中间 6 位为日期数字，最后 3 位为字母或数字。"
    );
  }


  cleanFormData
    .company_rfc =
    companyRfc;
}


if (
  cleanFormData
    .legal_representative_rfc
) {
  const representativeRfc =
    normalizeUppercaseValue(
      cleanFormData
        .legal_representative_rfc
    );


  if (
    !isValidPersonalRfc(
      representativeRfc
    )
  ) {
    throw new Error(
      "法定代表人 RFC 格式不正确。应为 13 位个人 RFC：前 4 位为字母，中间 6 位为日期数字，最后 3 位为字母或数字。"
    );
  }


  cleanFormData
    .legal_representative_rfc =
    representativeRfc;
}

/*
 * ========================================
 * Mexico Postal Code Validation
 * ========================================
 */

if (
  cleanFormData
    .postalCode
) {
  const postalCode =
    cleanFormData
      .postalCode
      .trim();


  if (
    !/^\d{5}$/.test(
      postalCode
    )
  ) {
    throw new Error(
      "墨西哥邮编格式不正确。请输入 5 位数字。"
    );
  }


  cleanFormData
    .postalCode =
    postalCode;
}

  if (
    cleanFormData
      .siger_registered
  ) {
    const allowedSigerValues = [
      "yes",
      "no",
      "unknown",
    ];


    if (
      !allowedSigerValues
        .includes(
          cleanFormData
            .siger_registered
        )
    ) {
      throw new Error(
        "SIGER 登记状态无效"
      );
    }
  }

  /*
   * ========================================
   * Payment Option
   * ========================================
   *
   * 金额、币种、支付 Provider
   * 一律重新从 service_prices 读取。
   *
   * Client 不能自己决定价格。
   */

  const {
    data:
      price,

    error:
      priceError,
  } =
    await supabase
      .from(
        "service_prices"
      )
      .select(`
        id,
        service_id,
        service_option_id,
        amount,
        currency,
        payment_method,
        payment_provider,
        active,

        service_options (
          id,
          option_key,
          title,
          service_mode,
          onsite_available,
          allowed_regions,
          requires_document_review,
          workspace_required,
          active
        )


      `)
      .eq(
        "id",
        priceId
      )
      .eq(
        "service_id",
        serviceId
      )
      .eq(
        "active",
        true
      )
      .single();

  if (
    priceError ||
    !price
  ) {
    throw new Error(
      "付款方案不存在或已失效"
    );
  }

    /*
   * ========================================
   * Service Option
   * ========================================
   */

    const serviceOption =
    Array.isArray(
      price.service_options
    )
      ? (
          price.service_options[0] ??
          null
        )
      : (
          price.service_options ??
          null
        );


  /*
   * 旧服务允许没有 Service Option。
   *
   * Batch 33-A 新服务会通过
   * service_prices.service_option_id
   * 绑定明确的业务方案。
   */

  if (
    price.service_option_id &&
    !serviceOption
  ) {
    throw new Error(
      "服务方案不存在或配置不完整"
    );
  }


  if (
    serviceOption &&
    serviceOption.active !==
      true
  ) {
    throw new Error(
      "所选服务方案目前不可使用"
    );
  }

  if (
    serviceOption &&
    serviceOption.id !==
      price.service_option_id
  ) {
    throw new Error(
      "服务方案与付款方案不匹配"
    );
  }

    /*
   * ========================================
   * Onsite Region Validation
   * ========================================
   */

    if (
      cleanFormData
        .service_region
    ) {
      const allowedServiceRegions = [
        "ciudad_de_mexico",
        "estado_de_mexico",
        "other",
      ];


      if (
        !allowedServiceRegions
          .includes(
            cleanFormData
              .service_region
          )
      ) {
        throw new Error(
          "办理地区无效"
        );
      }
    }

    if (
      serviceOption
        ?.service_mode ===
      "appointment_plus_onsite"
    ) {
      const selectedRegion =
        cleanFormData
          .service_region
          ?.trim();


      if (
        !selectedRegion
      ) {
        throw new Error(
          "请选择现场办理地区"
        );
      }


      const allowedRegions =
        Array.isArray(
          serviceOption
            .allowed_regions
        )
          ? serviceOption
              .allowed_regions
              .filter(
                (
                  region
                ): region is string =>
                  typeof region ===
                  "string"
              )
          : [];


      if (
        !allowedRegions.includes(
          selectedRegion
        )
      ) {
        throw new Error(
          "当前现场办理陪同(翻译)仅提供墨西哥城（CDMX）及墨西哥州（Estado de México），其他地区请选择预约协助服务"
        );
      }
    }


      /*
   * ========================================
   * Service Option Snapshot
   * ========================================
   */

  const serviceOptionSnapshot =
  serviceOption
    ? {
        optionKey:
          serviceOption
            .option_key,

        title:
          serviceOption
            .title,

        serviceMode:
          serviceOption
            .service_mode,

        onsiteAvailable:
          serviceOption
            .onsite_available,

        requiresDocumentReview:
          serviceOption
            .requires_document_review,

        workspaceRequired:
            serviceOption
              .workspace_required,

        allowedRegions:
          Array.isArray(
            serviceOption
              .allowed_regions
          )
            ? serviceOption
                .allowed_regions
            : [],
      }
    : null;

  /*
   * ========================================
   * Create Order
   * ========================================
   */

      const {
        data:
          existingOrder,
        error:
          existingOrderError,
      } =
        await supabase
          .from(
            "orders"
          )
          .select(`
            id,
            service_option_id,
            service_option_snapshot,
            amount,
            currency,
            payment_method,
            payment_provider,
            payment_status
          `)
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "client_request_id",
            clientRequestId
          )
          .maybeSingle();


      if (
        existingOrderError
      ) {
        console.error(
          "createOrder idempotency lookup error:",
          existingOrderError
        );

        throw new Error(
          "检查订单请求失败，请稍后再试"
        );
      }


      if (
        existingOrder
      ) {
        return existingOrder;
      }

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "orders"
          )
          .insert({
        user_id:
          user.id,

        client_request_id:
          clientRequestId,

        service_id:
          serviceId,

        service_option_id:
          serviceOption
            ?.id ??
          null,

        service_option_snapshot:
          serviceOptionSnapshot,

        /*
         * 只写入 Server 清理后的
         * Service-approved fields。
         */

        form_data:
          cleanFormData,

        status:
          "pending",

        payment_status:
          "unpaid",

        /*
         * Payment snapshot
         * 来自数据库，不来自 Client。
         */

        amount:
          price.amount,

        currency:
          price.currency,

        payment_method:
          price
            .payment_method,

        payment_provider:
          price
            .payment_provider,

        /*
         * Eligibility snapshot
         */

        eligibility_acknowledgements:
          eligibilityAcknowledgements,

        eligibility_confirmed_at:
          eligibilityConfirmedAt,
      })
      .select(`
        id,
        service_option_id,
        service_option_snapshot,
        amount,
        currency,
        payment_method,
        payment_provider,
        payment_status
      `)
      .single();

      if (
        error
      ) {
        /*
         * PostgreSQL unique_violation。
         *
         * 两个并发请求即使同时通过前面的查询，
         * 数据库 Unique Index 仍会保证只建立一个订单。
         */
        if (
          error.code ===
          "23505"
        ) {
          const {
            data:
              duplicateOrder,
            error:
              duplicateOrderError,
          } =
            await supabase
              .from(
                "orders"
              )
              .select(`
                id,
                service_option_id,
                service_option_snapshot,
                amount,
                currency,
                payment_method,
                payment_provider,
                payment_status
              `)
              .eq(
                "user_id",
                user.id
              )
              .eq(
                "client_request_id",
                clientRequestId
              )
              .maybeSingle();


          if (
            duplicateOrder &&
            !duplicateOrderError
          ) {
            return duplicateOrder;
          }
        }


        console.error(
          "createOrder error:",
          error
        );

        throw new Error(
          "建立订单失败，请稍后再试"
        );
      }

  return data;
}
