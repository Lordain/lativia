import {
    createClient,
  } from "@/lib/supabase/server";
  
  import type {
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
  
  
  export async function getMyCustomerActionRequest(
    orderId:
      string
  ): Promise<
    CustomerActionRequest | null
  > {
    const cleanOrderId =
      orderId.trim();
  
  
    if (!cleanOrderId) {
      return null;
    }
  
  
    const supabase =
      await createClient();
  
  
    const {
      data: {
        user,
      },
  
      error:
        userError,
    } =
      await supabase.auth
        .getUser();
  
  
    if (
      userError ||
      !user
    ) {
      return null;
    }
  
  
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "customer_action_requests"
        )
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
        .eq(
          "order_id",
          cleanOrderId
        )
        .eq(
          "user_id",
          user.id
        )
        .in(
          "status",
          [
            "pending",
            "submitted",
          ]
        )
        .maybeSingle();
  
  
    if (error) {
      console.error(
        "getMyCustomerActionRequest error:",
        error
      );
  
  
      throw new Error(
        "读取客户资料修正要求失败"
      );
    }
  
  
    if (!data) {
      return null;
    }
  
  
    return mapRequest(
      data as
        CustomerActionRequestRow
    );
  }