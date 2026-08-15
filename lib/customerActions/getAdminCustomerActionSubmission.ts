import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    CustomerActionSubmission,
  } from "@/types/customerAction";
  
  
  interface CustomerActionSubmissionRow {
    id: string;
  
    request_id: string;
  
    order_id: string;
  
    user_id: string;
  
    submitted_data:
      Record<
        string,
        string
      >;
  
    status: string;
  
    reviewed_by:
      string | null;
  
    review_reason:
      string | null;
  
    submitted_at: string;
  
    reviewed_at:
      string | null;
  
    created_at: string;
  }
  
  
  function mapSubmission(
    row:
      CustomerActionSubmissionRow
  ): CustomerActionSubmission {
    return {
      id:
        row.id,
  
      requestId:
        row.request_id,
  
      orderId:
        row.order_id,
  
      userId:
        row.user_id,
  
      submittedData:
        row.submitted_data,
  
      status:
        row.status as
          CustomerActionSubmission["status"],
  
      reviewedBy:
        row.reviewed_by,
  
      reviewReason:
        row.review_reason,
  
      submittedAt:
        row.submitted_at,
  
      reviewedAt:
        row.reviewed_at,
  
      createdAt:
        row.created_at,
    };
  }
  
  
  export async function getAdminCustomerActionSubmission(
    requestId:
      string
  ): Promise<
    CustomerActionSubmission | null
  > {
    await requireAdmin();
  
  
    const cleanRequestId =
      requestId.trim();
  
  
    if (!cleanRequestId) {
      return null;
    }
  
  
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin
        .from(
          "customer_action_submissions"
        )
        .select(`
          id,
          request_id,
          order_id,
          user_id,
          submitted_data,
          status,
          reviewed_by,
          review_reason,
          submitted_at,
          reviewed_at,
          created_at
        `)
        .eq(
          "request_id",
          cleanRequestId
        )
        .order(
          "submitted_at",
          {
            ascending:
              false,
          }
        )
        .limit(
          1
        )
        .maybeSingle();
  
  
    if (error) {
      console.error(
        "getAdminCustomerActionSubmission error:",
        error
      );
  
      throw new Error(
        "读取客户修正提交失败"
      );
    }
  
  
    if (!data) {
      return null;
    }
  
  
    return mapSubmission(
      data as
        CustomerActionSubmissionRow
    );
  }