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

import {
  getRefundProvider,
} from "@/lib/refunds/providers/getRefundProvider";

import type {
  Currency,
  PaymentProvider,
} from "@/types/payment";


interface RefundExecutionRow {
  id: string;

  order_id: string;

  provider: string;

  provider_payment_id:
    string | null;

  amount:
    number | string;

  currency: string;

  status: string;

  idempotency_key: string;
}


export async function executeAdminRefund(
  refundId: string,
  orderId: string
) {
  await requireAdmin();


  /*
   * ======================================
   * Current Admin Identity
   * ======================================
   */

  const supabase =
    await createClient();


  const {
    data: {
      user,
    },

    error:
      userError,
  } =
    await supabase.auth.getUser();


  if (
    userError ||
    !user
  ) {
    throw new Error(
      "无法确认当前管理员身份"
    );
  }


  const admin =
    createAdminClient();


  /*
   * ======================================
   * 1. Claim execution atomically
   * ======================================
   */

  const {
    error:
      claimError,
  } =
    await admin.rpc(
      "claim_refund_execution",
      {
        p_refund_id:
          refundId,

        p_admin_user_id:
          user.id,
      }
    );


  if (
    claimError
  ) {
    console.error(
      "claim_refund_execution error:",
      claimError
    );


    if (
      claimError.message.includes(
        "REFUND_ALREADY_PROCESSING"
      )
    ) {
      throw new Error(
        "退款正在处理中，请勿重复执行。"
      );
    }


    if (
      claimError.message.includes(
        "COMPLETED_SERVICE_CANNOT_BE_REFUNDED"
      )
    ) {
      throw new Error(
        "服务已经完成，系统禁止退款。"
      );
    }


    throw new Error(
      claimError.message
    );
  }


  /*
   * ======================================
   * 2. Read claimed Refund
   * ======================================
   */

  const {
    data:
      refundData,

    error:
      refundError,
  } =
    await admin
      .from(
        "refunds"
      )
      .select(`
        id,
        order_id,
        provider,
        provider_payment_id,
        amount,
        currency,
        status,
        idempotency_key
      `)
      .eq(
        "id",
        refundId
      )
      .single();


  if (
    refundError ||
    !refundData
  ) {
    throw new Error(
      "无法读取退款执行资料"
    );
  }


  const refund =
    refundData as
      RefundExecutionRow;


  /*
   * claim_refund_execution()
   * 对已经 succeeded 的退款
   * 必须保持幂等。
   */

  if (
    refund.status ===
    "succeeded"
  ) {
    return {
      status:
        "succeeded" as const,
    };
  }


  /*
   * ======================================
   * 3. Provider validation
   * ======================================
   */

  if (
    !refund
      .provider_payment_id
  ) {
    const {
      error:
        missingProviderIdError,
    } =
      await admin.rpc(
        "mark_refund_failed",
        {
          p_refund_id:
            refundId,

          p_failure_reason:
            "PROVIDER_PAYMENT_ID_MISSING",

          p_provider_refund_id:
            null,

          p_metadata: {
            stage:
              "provider_validation",
          },
        }
      );


    if (
      missingProviderIdError
    ) {
      console.error(
        "mark_refund_failed provider validation error:",
        missingProviderIdError
      );
    }


    throw new Error(
      "原付款缺少支付平台付款 ID，无法自动退款。"
    );
  }


  const provider =
    getRefundProvider(
      refund.provider as
        PaymentProvider
    );


  /*
   * ======================================
   * 4. Execute Provider Refund
   *
   * 这里只捕获 Provider 调用本身的异常。
   *
   * Provider 成功之后的本地同步错误，
   * 绝对不能重新标记为 Provider Failed。
   * ======================================
   */

  let providerResult:
    Awaited<
      ReturnType<
        typeof provider.executeFullRefund
      >
    >;


  try {
    providerResult =
      await provider
        .executeFullRefund({
          refundId:
            refund.id,

          orderId:
            refund.order_id,

          providerPaymentId:
            refund
              .provider_payment_id,

          amount:
            Number(
              refund.amount
            ),

          currency:
            refund.currency as
              Currency,

          idempotencyKey:
            refund
              .idempotency_key,
        });

  } catch (
    error
  ) {
    console.error(
      "executeAdminRefund provider error:",
      error
    );


    const message =
      error instanceof Error
        ? error.message
        : "UNKNOWN_PROVIDER_REFUND_ERROR";


    /*
     * Provider 调用失败或结果不确定。
     *
     * Retry 时继续使用相同 idempotency key。
     */

    const {
      error:
        failError,
    } =
      await admin.rpc(
        "mark_refund_failed",
        {
          p_refund_id:
            refundId,

          p_failure_reason:
            message,

          p_provider_refund_id:
            null,

          p_metadata: {
            stage:
              "provider_execution",
          },
        }
      );


    if (
      failError
    ) {
      console.error(
        "mark_refund_failed error:",
        failError
      );
    }


    throw new Error(
      `退款执行失败：${message}`
    );
  }


  /*
   * ======================================
   * 5A. Provider Final Success
   * ======================================
   */

  if (
    providerResult.finalState ===
    "succeeded"
  ) {
    const {
      error:
        successError,
    } =
      await admin.rpc(
        "mark_refund_succeeded",
        {
          p_refund_id:
            refundId,

          p_provider_refund_id:
            providerResult
              .providerRefundId,

          p_provider_status:
            providerResult
              .providerStatus,

          p_metadata:
            providerResult
              .metadata,
        }
      );


    if (
      successError
    ) {
      console.error(
        "mark_refund_succeeded error:",
        successError
      );


      /*
       * 重要：
       *
       * Provider 已经退款成功。
       * 这里绝不能调用 mark_refund_failed()。
       *
       * 此状态需要进入 reconciliation。
       */

      throw new Error(
        "支付平台退款成功，但本地状态同步失败，请立即进行退款对账。"
      );
    }


    /*
     * 不在 Server Action 内进行多个 revalidatePath。
     *
     * Client 成功返回后统一 router.refresh()，
     * 让当前订单页读取最新数据库状态。
     */

    return {
      status:
        "succeeded" as const,
    };
  }


  /*
   * ======================================
   * 5B. Provider Accepted / Pending
   * ======================================
   */

  const {
    error:
      pendingError,
  } =
    await admin.rpc(
      "record_refund_processing_result",
      {
        p_refund_id:
          refundId,

        p_provider_refund_id:
          providerResult
            .providerRefundId,

        p_provider_status:
          providerResult
            .providerStatus,

        p_metadata:
          providerResult
            .metadata,
      }
    );


  if (
    pendingError
  ) {
    console.error(
      "record_refund_processing_result error:",
      pendingError
    );


    /*
     * Provider 已接受退款请求。
     * 不应把这种本地同步问题误标成 Provider Failed。
     */

    throw new Error(
      "支付平台已经接受退款，但本地处理状态同步失败，请进行退款对账。"
    );
  }


  return {
    status:
      "processing" as const,
  };
}