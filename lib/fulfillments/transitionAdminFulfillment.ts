"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import type {
  FulfillmentStatus,
} from "@/types/fulfillment";

import {
  notifyFulfillmentTransition,
} from "@/lib/notifications/notifyFulfillmentTransition";

import {
  safeEnsureOrderWorkspace,
} from "@/lib/workspaces/safeEnsureOrderWorkspace";

import {
  safeStartOrderWorkspace,
} from "@/lib/workspaces/safeStartOrderWorkspace";

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  PERSONAL_ORDER_DOCUMENT_TYPES,
} from "@/lib/documents/orderDocumentTypes";


export interface TransitionAdminFulfillmentInput {
  fulfillmentId:
    string;

  newStatus:
    FulfillmentStatus;

  message:
    string;

  currentStep:
    string;

  reason:
    string;
}


function getFriendlyError(
  message: string
) {
  if (
    message.includes(
      "COMPLETED_FULFILLMENT_IS_FINAL"
    )
  ) {
    return "此服务已经完成并交付，不能重新处理，也不能进入退款审核。";
  }

  if (
    message.includes(
      "RESULT_NOT_DELIVERED"
    )
  ) {
    return "此服务需要先完成结果交付，才能标记为服务完成。";
  }

  if (
    message.includes(
      "REQUIRED_DOCUMENTS_NOT_APPROVED"
    )
  ) {
    return "办理资料尚未全部检查通过，不能标记为服务完成。";
  }

  if (
    message.includes(
      "REQUIRED_MILESTONES_NOT_COMPLETED"
    )
  ) {
    return "客户服务进度尚未全部完成，不能确认整个服务已经完成。";
  }


  if (
    message.includes(
      "INVALID_FULFILLMENT_TRANSITION"
    )
  ) {
    return "当前办理状态不允许执行这个操作。请刷新页面后重试。";
  }


  if (
    message.includes(
      "HUMAN_REVIEW_REASON_REQUIRED"
    )
  ) {
    return "进入人工审核前必须填写人工审核原因。";
  }


  if (
    message.includes(
      "CUSTOMER_ACTION_REASON_REQUIRED"
    )
  ) {
    return "等待客户操作前必须说明客户需要补充或完成什么。";
  }


  if (
    message.includes(
      "FAILURE_REASON_REQUIRED"
    )
  ) {
    return "标记服务无法完成前必须填写具体原因。";
  }


  if (
    message.includes(
      "SERVICE_NOT_ELIGIBLE_FOR_REFUND_REVIEW"
    )
  ) {
    return "此服务当前不符合进入退款审核的条件。";
  }

  if (
    message.includes(
      "REFUND_REVIEW_REASON_REQUIRED"
    )
  ) {
    return "进入退款审核前必须填写具体审核原因。";
  }


  if (
    message.includes(
      "INVALID_REFUND_REVIEW_TRANSITION_FROM"
    )
  ) {
    return "当前办理状态不能直接进入退款审核。请先将服务标记为无法完成。";
  }


  if (
    message.includes(
      "SERVICE_NOT_ELIGIBLE_FOR_REFUND"
    )
  ) {
    return "当前服务不符合普通退款规则。";
  }


  if (
    message.includes(
      "FULFILLMENT_NOT_FOUND"
    )
  ) {
    return "找不到办理任务。";
  }


  return message;
}


export async function transitionAdminFulfillment(
  input:
    TransitionAdminFulfillmentInput
) {
  /*
   * ========================================
   * 1. Admin Authorization
   * ========================================
   */

  await requireAdmin();


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
      "管理员登录状态已失效"
    );
  }


  /*
   * ========================================
   * 2. Core Fulfillment Transition
   *
   * 使用当前登录 Admin 的 authenticated
   * Supabase client 执行正式 RPC。
   * ========================================
   */

/*
 * ========================================
 * 2A. Completion Guards
 *
 * 仅在准备进入 completed 时检查：
 *
 * 1. Required Documents
 * 2. Required Milestones
 * ========================================
 */

if (
  input.newStatus ===
  "completed"
) {
  const admin =
    createAdminClient();


  /*
   * ========================================
   * Read Fulfillment / Order Context
   * ========================================
   */

  const {
    data:
      fulfillmentForGuard,

    error:
      fulfillmentGuardError,
  } =
    await admin
      .from(
        "fulfillments"
      )
      .select(`
        id,
        order_id,
        orders (
          service_option_snapshot,
          services (
            slug
          )
        )
      `)
      .eq(
        "id",
        input.fulfillmentId
      )
      .maybeSingle();


  if (
    fulfillmentGuardError ||
    !fulfillmentForGuard
  ) {
    throw new Error(
      "FULFILLMENT_NOT_FOUND"
    );
  }


  /*
   * ========================================
   * 2A-1. Required Document Guard
   * ========================================
   */

  const orderRelation =
    Array.isArray(
      fulfillmentForGuard.orders
    )
      ? fulfillmentForGuard.orders[0]
      : fulfillmentForGuard.orders;


  const serviceOptionSnapshot =
    (
      orderRelation
        ?.service_option_snapshot ??
      null
    ) as
      | {
          requiresDocumentReview?:
            boolean;
        }
      | null;


  if (
    serviceOptionSnapshot
      ?.requiresDocumentReview ===
    true
  ) {
    const serviceRelation =
      Array.isArray(
        orderRelation?.services
      )
        ? orderRelation
            ?.services[0]
        : orderRelation
            ?.services;


    const serviceSlug =
      serviceRelation
        ?.slug ??
      "";


    const requiredDocumentTypes =
      serviceSlug.startsWith(
        "company-"
      )
        ? COMPANY_ORDER_DOCUMENT_TYPES
        : PERSONAL_ORDER_DOCUMENT_TYPES;


    const {
      data:
        approvedDocuments,

      error:
        approvedDocumentsError,
    } =
      await admin
        .from(
          "order_documents"
        )
        .select(`
          document_type
        `)
        .eq(
          "order_id",
          fulfillmentForGuard.order_id
        )
        .eq(
          "status",
          "approved"
        );


    if (
      approvedDocumentsError
    ) {
      console.error(
        "Required document guard lookup error:",
        approvedDocumentsError
      );


      throw new Error(
        "无法检查办理资料状态"
      );
    }


    const approvedTypes =
      new Set(
        (
          approvedDocuments ??
          []
        ).map(
          document =>
            document.document_type
        )
      );


    const missingDocumentTypes =
      requiredDocumentTypes.filter(
        item =>
          !approvedTypes.has(
            item.value
          )
      );


    if (
      missingDocumentTypes.length >
      0
    ) {
      throw new Error(
        "REQUIRED_DOCUMENTS_NOT_APPROVED"
      );
    }
  }


  /*
   * ========================================
   * 2A-2. Required Milestone Guard
   *
   * 如果订单存在 required Milestone，
   * 必须全部 completed，
   * 才允许整个 Fulfillment completed。
   *
   * 没有 required Milestone 的服务
   * 不受影响。
   * ========================================
   */

  const {
    data:
      requiredMilestones,

    error:
      requiredMilestonesError,
  } =
    await admin
      .from(
        "order_milestones"
      )
      .select(`
        id,
        milestone_key,
        label,
        status,
        required
      `)
      .eq(
        "order_id",
        fulfillmentForGuard.order_id
      )
      .eq(
        "required",
        true
      );


  if (
    requiredMilestonesError
  ) {
    console.error(
      "Required milestone guard lookup error:",
      requiredMilestonesError
    );


    throw new Error(
      "无法检查客户服务进度"
    );
  }


  const incompleteRequiredMilestones =
    (
      requiredMilestones ??
      []
    ).filter(
      milestone =>
        milestone.status !==
        "completed"
    );


  if (
    incompleteRequiredMilestones.length >
    0
  ) {
    console.error(
      "Required milestones not completed:",
      {
        orderId:
          fulfillmentForGuard.order_id,

        milestones:
          incompleteRequiredMilestones.map(
            milestone => ({
              id:
                milestone.id,

              key:
                milestone.milestone_key,

              label:
                milestone.label,

              status:
                milestone.status,
            })
          ),
      }
    );


    throw new Error(
      "REQUIRED_MILESTONES_NOT_COMPLETED"
    );
  }
}
  /*
   * ========================================
   * Queued -> Processing shortcut
   *
   * Admin UI 只需要点击一次“开始办理”。
   *
   * 为兼容现有 DB 状态机，
   * queued 状态内部先经过 validating，
   * 随后继续进入 processing。
   * ========================================
   */

  if (
    input.newStatus ===
    "processing"
  ) {
    const admin =
      createAdminClient();


    const {
      data:
        currentFulfillment,

      error:
        currentFulfillmentError,
    } =
      await admin
        .from(
          "fulfillments"
        )
        .select(`
          id,
          status
        `)
        .eq(
          "id",
          input.fulfillmentId
        )
        .maybeSingle();


    if (
      currentFulfillmentError ||
      !currentFulfillment
    ) {
      throw new Error(
        "找不到办理任务。"
      );
    }


    if (
      currentFulfillment.status ===
      "queued"
    ) {
      const {
        error:
          validatingError,
      } =
        await supabase.rpc(
          "transition_fulfillment_status",
          {
            p_fulfillment_id:
              input.fulfillmentId,

            p_new_status:
              "validating",

            p_actor_type:
              "admin",

            p_actor_user_id:
              user.id,

            p_message:
              "开始办理服务",

            p_current_step:
              "validating_application",

            p_reason:
              null,
          }
        );


      if (
        validatingError
      ) {
        console.error(
          "queued -> validating shortcut error:",
          validatingError
        );


        throw new Error(
          getFriendlyError(
            validatingError.message
          )
        );
      }
    }
  }


/*
 * ========================================
 * Refund Review
 *
 * refund_review 使用专用原子 RPC：
 *
 * failed
 * → refund_review
 * → Refund Case pending_review
 *
 * 对默认不退款的服务，
 * 这代表 Admin 主动开启特殊案件审核，
 * 并不代表退款已经批准。
 * ========================================
 */

if (
  input.newStatus ===
  "refund_review"
) {
  const cleanReason =
    input.reason.trim();


  if (!cleanReason) {
    throw new Error(
      "进入退款审核前必须填写具体审核原因。"
    );
  }


  const refundAdmin =
  createAdminClient();


const {
  error:
    refundReviewError,
} =
  await refundAdmin.rpc(
    "enter_admin_refund_review",
    {
      p_fulfillment_id:
        input.fulfillmentId,

      p_admin_user_id:
        user.id,

      p_reason:
        cleanReason,
    }
  );


  if (
    refundReviewError
  ) {
    console.error(
      "enter_admin_refund_review error:",
      refundReviewError
    );


    throw new Error(
      getFriendlyError(
        refundReviewError.message
      )
    );
  }

} else {
  /*
   * ========================================
   * Normal Fulfillment Transition
   * ========================================
   */

  const {
    error,
  } =
    await supabase.rpc(
      "transition_fulfillment_status",
      {
        p_fulfillment_id:
          input.fulfillmentId,

        p_new_status:
          input.newStatus,

        p_actor_type:
          "admin",

        p_actor_user_id:
          user.id,

        p_message:
          input.message
            .trim() ||
          null,

        p_current_step:
          input.currentStep
            .trim() ||
          null,

        p_reason:
          input.reason
            .trim() ||
          null,
      }
    );


  if (error) {
    console.error(
      "transitionAdminFulfillment error:",
      error
    );


    throw new Error(
      getFriendlyError(
        error.message
      )
    );
  }
}

  /*
   * ========================================
   * 3. Resolve Fulfillment for Notification
   * ========================================
   *
   * 注意：
   *
   * 这里不能继续使用普通 authenticated client。
   *
   * Admin 可以通过 RPC 修改 Fulfillment，
   * 但 fulfillments 表本身的 RLS 可能不允许
   * Admin Session 直接 SELECT 这条记录。
   *
   * Notification 属于服务器内部 side effect，
   * 因此这里使用 Service Role Admin Client。
   * ========================================
   */

  const admin =
    createAdminClient();


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
        order_id
      `)
      .eq(
        "id",
        input.fulfillmentId
      )
      .single();


  if (
    fulfillmentError ||
    !fulfillment
  ) {
    /*
     * Fulfillment transition 已经成功。
     *
     * Notification lookup 失败绝不能
     * 让主业务操作表现为失败。
     */

    console.error(
      "Fulfillment notification lookup error:",
      {
        fulfillmentId:
          input.fulfillmentId,

        error:
          fulfillmentError,
      }
    );


    return {
      success:
        true,
    };
  }

  /*
  * ========================================
  * Workspace Lifecycle
  * ========================================
  *
  * validating / processing
  * 代表 Admin 已经真正开始处理服务。
  *
  * 先确保 Workspace 存在，
  * 再启动服务期限。
  *
  * 两个函数均为幂等操作。
  */

  if (
    input.newStatus ===
      "validating" ||
    input.newStatus ===
      "processing"
  ) {
    await safeEnsureOrderWorkspace(
      fulfillment.order_id
    );

    await safeStartOrderWorkspace(
      fulfillment.order_id
    );
  }


  /*
   * ========================================
   * 4. Customer Notification
   * ========================================
   *
   * notifyFulfillmentTransition()
   * 最终使用 safeCreateNotification()。
   *
   * Notification 失败不会回滚
   * 已经成功的 Fulfillment transition。
   * ========================================
   */

  await notifyFulfillmentTransition({
    orderId:
      fulfillment.order_id,

    fulfillmentId:
      fulfillment.id,

    newStatus:
      input.newStatus,

    reason:
      input.reason,
  });


  return {
    success:
      true,
  };
}
