"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  notifyCustomerActionRejected,
} from "@/lib/notifications/notifyCustomerActionReview";

import {
  createCustomerActionActivity,
} from "@/lib/customerActions/createCustomerActionActivity";

export async function rejectCustomerActionSubmission(
  submissionId:
    string,

  reason:
    string
) {
  const profile =
    await requireAdmin();


  const cleanId =
    submissionId.trim();

  const cleanReason =
    reason.trim();


  if (!cleanId) {
    throw new Error(
      "SUBMISSION_ID_REQUIRED"
    );
  }


  if (!cleanReason) {
    throw new Error(
      "请填写驳回原因。"
    );
  }


  const admin =
    createAdminClient();


  const {
    data:
      submission,

    error:
      submissionError,
  } =
    await admin
      .from(
        "customer_action_submissions"
      )
      .select(`
        id,
        request_id,
        order_id,
        status
      `)
      .eq(
        "id",
        cleanId
      )
      .single();


  if (
    submissionError ||
    !submission
  ) {
    throw new Error(
      "找不到客户修正提交。"
    );
  }


  if (
    submission.status !==
    "submitted"
  ) {
    throw new Error(
      "此客户修正提交当前不能驳回。"
    );
  }


  const reviewedAt =
    new Date()
      .toISOString();


  /*
   * ========================================
   * 1. Reject Submission
   * ========================================
   */

  const {
    error:
      submissionUpdateError,
  } =
    await admin
      .from(
        "customer_action_submissions"
      )
      .update({
        status:
          "rejected",

        reviewed_by:
          profile.id,

        review_reason:
          cleanReason,

        reviewed_at:
          reviewedAt,
      })
      .eq(
        "id",
        submission.id
      )
      .eq(
        "status",
        "submitted"
      );


  if (
    submissionUpdateError
  ) {
    throw new Error(
      "更新客户修正提交失败。"
    );
  }


  /*
   * ========================================
   * 2. Re-open Request
   * ========================================
   *
   * Customer 可以再次提交新 Submission。
   */

  const {
    data:
      updatedRequest,
  
    error:
      requestUpdateError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .update({
        status:
          "pending",
  
        submitted_at:
          null,
      })
      .eq(
        "id",
        submission.request_id
      )
      .eq(
        "status",
        "submitted"
      )
      .select(`
        id,
        fulfillment_id
      `)
      .single();


  if (
    requestUpdateError ||
    !updatedRequest
  ) {
    throw new Error(
      "重新开启客户资料修正要求失败。"
    );
  }

  if (
    updatedRequest.fulfillment_id
  ) {
    await createCustomerActionActivity({
      fulfillmentId:
        updatedRequest.fulfillment_id,
  
      orderId:
        submission.order_id,
  
      actorType:
        "admin",
  
      actorUserId:
        profile.id,
  
      action:
        "customer_correction_rejected",
  
      message:
        `客户修正资料审核未通过：${cleanReason}`,
  
      metadata: {
        requestId:
          submission.request_id,
  
        submissionId:
          submission.id,
  
        reason:
          cleanReason,
      },
    });
  }

  await notifyCustomerActionRejected({
    orderId:
      submission.order_id,
  
    submissionId:
      submission.id,
  
    reason:
      cleanReason,
  });


  revalidatePath(
    `/admin/orders/${submission.order_id}`
  );

  revalidatePath(
    `/account/orders/${submission.order_id}`
  );


  return {
    success:
      true,
  };
}