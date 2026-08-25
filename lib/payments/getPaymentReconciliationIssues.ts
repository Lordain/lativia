import { createClient } from "@/lib/supabase/server";

import type { PaymentReconciliationIssue } from "@/types/paymentReconciliation";

export async function getPaymentReconciliationIssues() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        amount,
        currency,
        payment_status,
        payment_method,
        payment_provider,

        payment_transactions (
          id,
          amount,
          currency,
          status
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const issues: PaymentReconciliationIssue[] = [];

  for (const order of orders ?? []) {
    const transactions = order.payment_transactions ?? [];

    const paidTransactions = transactions.filter(
      (transaction) => transaction.status === "paid",
    );

    const isManualWeChatPayment =
      order.payment_method === "wechat_pay" && order.payment_provider === null;

    // 1. Order 已付款，但是没有 transaction
    if (
      order.payment_status === "paid" &&
      paidTransactions.length === 0 &&
      !isManualWeChatPayment
    ) {
      issues.push({
        orderId: order.id,

        type: "missing_transaction",

        message: "订单显示已付款，但没有对应的已付款交易记录。",

        orderPaymentStatus: order.payment_status,
      });

      continue;
    }

    for (const transaction of paidTransactions) {
      // 2. Transaction 已付款，但 Order 未付款
      if (order.payment_status !== "paid") {
        issues.push({
          orderId: order.id,

          type: "payment_status_mismatch",

          message: "支付交易显示已付款，但订单仍未标记为已付款。",

          orderPaymentStatus: order.payment_status,

          transactionId: transaction.id,

          transactionStatus: transaction.status,
        });
      }

      // 3. 金额不一致
      if (Number(transaction.amount) !== Number(order.amount)) {
        issues.push({
          orderId: order.id,

          type: "amount_mismatch",

          message: "订单金额与支付交易金额不一致。",

          orderPaymentStatus: order.payment_status,

          transactionId: transaction.id,

          transactionStatus: transaction.status,
        });
      }

      // 4. 币种不一致
      if (transaction.currency !== order.currency) {
        issues.push({
          orderId: order.id,

          type: "currency_mismatch",

          message: "订单币种与支付交易币种不一致。",

          orderPaymentStatus: order.payment_status,

          transactionId: transaction.id,

          transactionStatus: transaction.status,
        });
      }
    }
  }

  return issues;
}
