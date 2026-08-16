import {
    createClient,
  } from "@/lib/supabase/server";
  
  
  interface LatestRejectedSubmission {
    id: string;
  
    requestId: string;
  
    reviewReason:
      string | null;
  
    reviewedAt:
      string | null;
  }
  
  
  interface SubmissionRow {
    id: string;
  
    request_id: string;
  
    review_reason:
      string | null;
  
    reviewed_at:
      string | null;
  }
  
  
  export async function getMyLatestRejectedSubmission(
    requestId:
      string
  ): Promise<
    LatestRejectedSubmission | null
  > {
    const cleanRequestId =
      requestId.trim();
  
  
    if (!cleanRequestId) {
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
          "customer_action_submissions"
        )
        .select(`
          id,
          request_id,
          review_reason,
          reviewed_at
        `)
        .eq(
          "request_id",
          cleanRequestId
        )
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "status",
          "rejected"
        )
        .order(
          "reviewed_at",
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
        "getMyLatestRejectedSubmission error:",
        error
      );
  
      throw new Error(
        "读取最近一次资料审核结果失败"
      );
    }
  
  
    if (!data) {
      return null;
    }
  
  
    const row =
      data as SubmissionRow;
  
  
    return {
      id:
        row.id,
  
      requestId:
        row.request_id,
  
      reviewReason:
        row.review_reason,
  
      reviewedAt:
        row.reviewed_at,
    };
  }