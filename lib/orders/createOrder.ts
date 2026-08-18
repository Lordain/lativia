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
        amount,
        currency,
        payment_method,
        payment_provider,
        active
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
   * Create Order
   * ========================================
   */

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

        service_id:
          serviceId,

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
        amount,
        currency,
        payment_method,
        payment_provider,
        payment_status
      `)
      .single();

  if (error) {
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