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
  transitionAdminFulfillment,
} from "@/lib/fulfillments/transitionAdminFulfillment";

import type {
  CustomerActionRequestedFields,
} from "@/types/customerAction";


export async function approveCustomerActionSubmission(
  submissionId:
    string
) {
  const profile =
    await requireAdmin();


  const cleanId =
    submissionId.trim();


  if (!cleanId) {
    throw new Error(
      "SUBMISSION_ID_REQUIRED"
    );
  }


  const admin =
    createAdminClient();


  /*
   * ========================================
   * 1. Read Submission + Request
   * ========================================
   */

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
        user_id,
        submitted_data,
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
      "此客户修正提交当前不能审核通过。"
    );
  }


  const {
    data:
      request,

    error:
      requestError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .select(`
        id,
        order_id,
        fulfillment_id,
        status,
        requested_fields
      `)
      .eq(
        "id",
        submission.request_id
      )
      .single();


  if (
    requestError ||
    !request
  ) {
    throw new Error(
      "找不到对应的客户资料修正要求。"
    );
  }


  if (
    request.status !==
    "submitted"
  ) {
    throw new Error(
      "此资料修正要求当前不能审核通过。"
    );
  }


  const requestedFields =
    (
      request.requested_fields ??
      {}
    ) as
      CustomerActionRequestedFields;


  const submittedData =
    (
      submission.submitted_data ??
      {}
    ) as
      Record<
        string,
        string
      >;


  /*
   * ========================================
   * 2. Validate Submission Keys
   * ========================================
   */

  const requestedKeys =
    Object.keys(
      requestedFields
    );


  for (
    const key
    of requestedKeys
  ) {
    if (
      typeof submittedData[
        key
      ] !==
      "string" ||
      !submittedData[
        key
      ].trim()
    ) {
      throw new Error(
        `${requestedFields[key].label} 缺少有效修正值。`
      );
    }
  }


  /*
   * ========================================
   * 3. Read Existing Order Form Data
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
        form_data
      `)
      .eq(
        "id",
        submission.order_id
      )
      .single();


  if (
    orderError ||
    !order
  ) {
    throw new Error(
      "找不到订单。"
    );
  }


  const existingFormData =
    (
      order.form_data ??
      {}
    ) as
      Record<
        string,
        string
      >;


  const mergedFormData = {
    ...existingFormData,
  };


  for (
    const key
    of requestedKeys
  ) {
    mergedFormData[
      key
    ] =
      submittedData[
        key
      ].trim();
  }


  const reviewedAt =
    new Date()
      .toISOString();


  /*
   * ========================================
   * 4. Update Order Form Data
   * ========================================
   */

  const {
    error:
      orderUpdateError,
  } =
    await admin
      .from(
        "orders"
      )
      .update({
        form_data:
          mergedFormData,
      })
      .eq(
        "id",
        order.id
      );


  if (
    orderUpdateError
  ) {
    throw new Error(
      "更新订单资料失败。"
    );
  }


  /*
   * ========================================
   * 5. Mark Submission Approved
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
          "approved",

        reviewed_by:
          profile.id,

        review_reason:
          null,

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
      "更新修正提交审核状态失败。"
    );
  }


  /*
   * ========================================
   * 6. Resolve Request
   * ========================================
   */

  const {
    error:
      requestUpdateError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .update({
        status:
          "resolved",

        resolved_at:
          reviewedAt,
      })
      .eq(
        "id",
        request.id
      )
      .eq(
        "status",
        "submitted"
      );


  if (
    requestUpdateError
  ) {
    throw new Error(
      "更新客户资料修正要求状态失败。"
    );
  }


  /*
   * ========================================
   * 7. Continue Fulfillment
   * ========================================
   */

  if (
    request.fulfillment_id
  ) {
    await transitionAdminFulfillment({
      fulfillmentId:
        request.fulfillment_id,

      newStatus:
        "processing",

      message:
        "客户修正资料已经审核通过，继续办理。",

      currentStep:
        "processing",

      reason:
        "",
    });
  }


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