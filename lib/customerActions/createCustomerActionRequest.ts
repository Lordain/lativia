"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  transitionAdminFulfillment,
} from "@/lib/fulfillments/transitionAdminFulfillment";

import type {
  FormFieldSchema,
} from "@/types/form";

import type {
  CreateCustomerActionRequestInput,
  CustomerActionRequest,
  CustomerActionRequestedFields,
} from "@/types/customerAction";


interface CustomerActionRequestRow {
  id: string;

  order_id: string;

  user_id: string;

  fulfillment_id:
    string | null;

  status: string;

  requested_fields:
    CustomerActionRequestedFields;

  message:
    string | null;

  requested_by:
    string | null;

  requested_at: string;

  submitted_at:
    string | null;

  resolved_at:
    string | null;

  created_at: string;

  updated_at: string;
}


function mapRequest(
  row:
    CustomerActionRequestRow
): CustomerActionRequest {
  return {
    id:
      row.id,

    orderId:
      row.order_id,

    userId:
      row.user_id,

    fulfillmentId:
      row.fulfillment_id,

    status:
      row.status as
        CustomerActionRequest["status"],

    requestedFields:
      row.requested_fields,

    message:
      row.message,

    requestedBy:
      row.requested_by,

    requestedAt:
      row.requested_at,

    submittedAt:
      row.submitted_at,

    resolvedAt:
      row.resolved_at,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}


function validateRequestedFields(
  requestedFields:
    CustomerActionRequestedFields,

  schema:
    FormFieldSchema[]
) {
  const entries =
    Object.entries(
      requestedFields
    );


  if (
    entries.length ===
    0
  ) {
    throw new Error(
      "请至少选择一个需要客户修正的资料字段。"
    );
  }


  const schemaByName =
    new Map(
      schema.map(
        field => [
          field.name,
          field,
        ]
      )
    );


  const normalized:
    CustomerActionRequestedFields =
    {};


  for (
    const [
      fieldName,
      requestedField,
    ]
    of entries
  ) {
    const cleanFieldName =
      fieldName.trim();


    const schemaField =
      schemaByName.get(
        cleanFieldName
      );


    if (!schemaField) {
      throw new Error(
        `字段 ${cleanFieldName} 不属于此服务的客户资料。`
      );
    }


    const reason =
      requestedField.reason
        ?.trim();


    if (!reason) {
      throw new Error(
        `${schemaField.label} 必须填写修正原因。`
      );
    }


    /*
     * label 不接受客户端自己决定，
     * 始终采用正式 Service Schema 的 label。
     */

    normalized[
      cleanFieldName
    ] = {
      label:
        schemaField.label,

      reason,
    };
  }


  return normalized;
}


export async function createCustomerActionRequest(
  input:
    CreateCustomerActionRequestInput
): Promise<
  CustomerActionRequest
> {
  const profile =
    await requireAdmin();


  const admin =
    createAdminClient();


  /*
   * ========================================
   * 1. Validate Order
   * ========================================
   */

  const {
    data:
      order,

    error:
      orderError,
  } =
    await admin
      .from(
        "orders"
      )
      .select(`
        id,
        user_id,
        service_id,
        form_data,
        payment_status
      `)
      .eq(
        "id",
        input.orderId
      )
      .single();


  if (
    orderError ||
    !order
  ) {
    console.error(
      "createCustomerActionRequest order lookup error:",
      orderError
    );


    throw new Error(
      "找不到订单。"
    );
  }


  if (
    !order.user_id
  ) {
    throw new Error(
      "订单没有对应客户，无法建立资料修正要求。"
    );
  }


  if (
    order.payment_status !==
    "paid"
  ) {
    throw new Error(
      "订单尚未完成付款，不能进入资料修正流程。"
    );
  }


  /*
   * ========================================
   * 2. Validate Fulfillment
   * ========================================
   */

  if (
    !input.fulfillmentId
  ) {
    throw new Error(
      "订单没有办理任务，无法建立资料修正要求。"
    );
  }


  const {
    data:
      fulfillment,

    error:
      fulfillmentError,
  } =
    await admin
      .from(
        "fulfillments"
      )
      .select(`
        id,
        order_id,
        status
      `)
      .eq(
        "id",
        input.fulfillmentId
      )
      .eq(
        "order_id",
        order.id
      )
      .single();


  if (
    fulfillmentError ||
    !fulfillment
  ) {
    throw new Error(
      "找不到对应的办理任务。"
    );
  }


  if (
    fulfillment.status ===
      "completed" ||
    fulfillment.status ===
      "failed" ||
    fulfillment.status ===
      "refund_review"
  ) {
    throw new Error(
      "当前办理状态不能再要求客户修正资料。"
    );
  }


  if (
    fulfillment.status ===
    "waiting_customer"
  ) {
    throw new Error(
      "当前订单已经在等待客户处理，请先完成现有要求。"
    );
  }


  /*
   * ========================================
   * 3. Read Service Schema
   * ========================================
   */

  const {
    data:
      service,

    error:
      serviceError,
  } =
    await admin
      .from(
        "services"
      )
      .select(`
        id,
        form_schema
      `)
      .eq(
        "id",
        order.service_id
      )
      .single();


  if (
    serviceError ||
    !service
  ) {
    console.error(
      "createCustomerActionRequest service lookup error:",
      serviceError
    );


    throw new Error(
      "无法读取服务资料字段定义。"
    );
  }


  const schema =
    Array.isArray(
      service.form_schema
    )
      ? (
          service.form_schema as
            unknown as
            FormFieldSchema[]
        )
      : [];


  /*
   * ========================================
   * 4. Server-side Field Validation
   * ========================================
   */

  const requestedFields =
    validateRequestedFields(
      input.requestedFields,
      schema
    );


  /*
   * ========================================
   * 5. Check Existing Active Request
   * ========================================
   */

  const {
    data:
      existingRequest,

    error:
      existingError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .select(
        "id"
      )
      .eq(
        "order_id",
        order.id
      )
      .in(
        "status",
        [
          "pending",
          "submitted",
        ]
      )
      .maybeSingle();


  if (
    existingError
  ) {
    console.error(
      "createCustomerActionRequest active request check error:",
      existingError
    );


    throw new Error(
      "检查现有客户处理要求失败。"
    );
  }


  if (
    existingRequest
  ) {
    throw new Error(
      "此订单已经有尚未完成的客户资料修正要求。"
    );
  }


  /*
   * ========================================
   * 6. Create Request
   * ========================================
   */

  const cleanMessage =
    input.message
      ?.trim() ||
    null;


  const {
    data:
      requestData,

    error:
      requestError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .insert({
        order_id:
          order.id,

        user_id:
          order.user_id,

        fulfillment_id:
          fulfillment.id,

        status:
          "pending",

        requested_fields:
          requestedFields,

        message:
          cleanMessage,

        requested_by:
          profile.id,
      })
      .select(`
        id,
        order_id,
        user_id,
        fulfillment_id,
        status,
        requested_fields,
        message,
        requested_by,
        requested_at,
        submitted_at,
        resolved_at,
        created_at,
        updated_at
      `)
      .single();


  if (
    requestError ||
    !requestData
  ) {
    console.error(
      "createCustomerActionRequest insert error:",
      requestError
    );


    if (
      requestError?.code ===
      "23505"
    ) {
      throw new Error(
        "此订单已经有尚未完成的客户资料修正要求。"
      );
    }


    throw new Error(
      "建立客户资料修正要求失败。"
    );
  }


  /*
   * ========================================
   * 7. Move Fulfillment → waiting_customer
   * ========================================
   *
   * 使用现有正式状态机，因此：
   *
   * - Fulfillment Activity 自动记录
   * - Customer Action Notification 自动建立
   * - In-App + Email 自动发送
   */


  const reasonSummary =
    Object.values(
      requestedFields
    )
      .map(
        field =>
          `${field.label}：${field.reason}`
      )
      .join(
        "；"
      );


  try {
    await transitionAdminFulfillment({
      fulfillmentId:
        fulfillment.id,

      newStatus:
        "waiting_customer",

      message:
        "需要客户修正部分文字资料。",

      currentStep:
        "customer_data_correction",

      reason:
        cleanMessage
          ? `${cleanMessage} ${reasonSummary}`
          : reasonSummary,
    });

  } catch (
    error
  ) {
    /*
     * Request 已建立，但状态机失败。
     *
     * 该 Request 尚未真正对客户生效，
     * 因此做补偿删除，避免出现孤立 active request。
     */

    const {
      error:
        cleanupError,
    } =
      await admin
        .from(
          "customer_action_requests"
        )
        .delete()
        .eq(
          "id",
          requestData.id
        );


    if (
      cleanupError
    ) {
      console.error(
        "Customer action request rollback failed:",
        {
          requestId:
            requestData.id,

          error:
            cleanupError,
        }
      );
    }


    throw error;
  }


  return mapRequest(
    requestData as
      CustomerActionRequestRow
  );
}