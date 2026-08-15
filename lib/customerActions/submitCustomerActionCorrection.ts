"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import type {
  SubmitCustomerActionInput,
  CustomerActionRequestedFields,
} from "@/types/customerAction";


export async function submitCustomerActionCorrection(
  input:
    SubmitCustomerActionInput
) {
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
    throw new Error(
      "请先登录"
    );
  }


  const requestId =
    input.requestId
      .trim();


  if (!requestId) {
    throw new Error(
      "CUSTOMER_ACTION_REQUEST_ID_REQUIRED"
    );
  }


  /*
   * ========================================
   * 1. Read Customer's Active Request
   * ========================================
   */

  const {
    data:
      request,

    error:
      requestError,
  } =
    await supabase
      .from(
        "customer_action_requests"
      )
      .select(`
        id,
        order_id,
        user_id,
        status,
        requested_fields
      `)
      .eq(
        "id",
        requestId
      )
      .eq(
        "user_id",
        user.id
      )
      .single();


  if (
    requestError ||
    !request
  ) {
    throw new Error(
      "找不到客户资料修正要求。"
    );
  }


  if (
    request.status !==
    "pending"
  ) {
    throw new Error(
      "此资料修正要求当前不能再次提交。"
    );
  }


  const requestedFields =
    (
      request.requested_fields ??
      {}
    ) as
      CustomerActionRequestedFields;


  const requestedKeys =
    Object.keys(
      requestedFields
    );


  if (
    requestedKeys.length ===
    0
  ) {
    throw new Error(
      "此资料修正要求没有可提交的字段。"
    );
  }


  /*
   * ========================================
   * 2. Validate Submitted Data
   * ========================================
   *
   * 客户只能提交管理员要求修正的字段。
   */

  const submittedData:
    Record<string, string> =
    {};


  for (
    const fieldName
    of requestedKeys
  ) {
    const rawValue =
      input.submittedData[
        fieldName
      ];


    if (
      typeof rawValue !==
      "string"
    ) {
      throw new Error(
        `${requestedFields[fieldName].label} 必须填写。`
      );
    }


    const cleanValue =
      rawValue.trim();


    if (!cleanValue) {
      throw new Error(
        `${requestedFields[fieldName].label} 不能为空。`
      );
    }


    submittedData[
      fieldName
    ] =
      cleanValue;
  }


  /*
   * 禁止额外字段。
   */

  const extraFields =
    Object.keys(
      input.submittedData
    )
      .filter(
        key =>
          !requestedKeys.includes(
            key
          )
      );


  if (
    extraFields.length >
    0
  ) {
    throw new Error(
      "提交内容包含未经要求的资料字段。"
    );
  }


  /*
   * ========================================
   * 3. Create Submission
   * ========================================
   *
   * RLS 会再次验证：
   * - user_id 是当前用户
   * - order_id 属于当前用户
   * - request_id 属于当前用户
   */

  const {
    data:
      submission,

    error:
      submissionError,
  } =
    await supabase
      .from(
        "customer_action_submissions"
      )
      .insert({
        request_id:
          request.id,

        order_id:
          request.order_id,

        user_id:
          user.id,

        submitted_data:
          submittedData,

        status:
          "submitted",
      })
      .select(`
        id
      `)
      .single();


  if (
    submissionError ||
    !submission
  ) {
    console.error(
      "submitCustomerActionCorrection insert error:",
      submissionError
    );


    throw new Error(
      "提交修正资料失败。"
    );
  }


  /*
   * ========================================
   * 4. Mark Request Submitted
   * ========================================
   *
   * 客户没有 UPDATE policy，
   * 因此这一步使用 Admin Client。
   *
   * 用户身份与数据权限已经在前面验证。
   */

  const admin =
    createAdminClient();


  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "customer_action_requests"
      )
      .update({
        status:
          "submitted",

        submitted_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        request.id
      )
      .eq(
        "user_id",
        user.id
      )
      .eq(
        "status",
        "pending"
      );


  if (
    updateError
  ) {
    console.error(
      "submitCustomerActionCorrection request update error:",
      updateError
    );


    throw new Error(
      "资料已经提交，但状态同步失败，请联系客服。"
    );
  }


  revalidatePath(
    `/account/orders/${request.order_id}`
  );


  return {
    success:
      true,

    submissionId:
      submission.id,
  };
}