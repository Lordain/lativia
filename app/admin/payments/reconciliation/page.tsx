import Link from "next/link";

import { requireAdmin } from "@/lib/auth/requireAdmin";

import {
  getPaymentReconciliationIssues,
} from "@/lib/payments/getPaymentReconciliationIssues";

import ReconciliationBadge from "@/components/admin/ReconciliationBadge";

import ReverifyStripeButton from "@/components/admin/ReverifyStripeButton";

export default async function PaymentReconciliationPage() {
  await requireAdmin();

  const issues =
    await getPaymentReconciliationIssues();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">
        支付对账
      </h1>

      <p className="mt-2 text-gray-500">
        检查订单与支付交易之间的数据异常。
      </p>

      {issues.length === 0 ? (
        <div className="mt-8 rounded-xl border p-6">
          <p className="font-medium">
            当前没有发现支付异常。
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {issues.map(
            (issue, index) => (
              <div
                key={`${issue.orderId}-${issue.type}-${index}`}
                className="rounded-xl border p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <ReconciliationBadge
                    type={issue.type}
                  />

                  <Link
                    href={`/admin/orders/${issue.orderId}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    查看订单
                  </Link>

                  <ReverifyStripeButton
                    orderId={issue.orderId}
                  />
                </div>

                <p className="mt-4">
                  {issue.message}
                </p>

                <p className="mt-3 break-all text-sm text-gray-500">
                  Order ID：
                  {issue.orderId}
                </p>

                {issue.transactionId && (
                  <p className="mt-1 break-all text-sm text-gray-500">
                    Transaction ID：
                    {issue.transactionId}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}