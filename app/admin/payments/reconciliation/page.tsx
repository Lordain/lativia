import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getPaymentReconciliationIssues,
} from "@/lib/payments/getPaymentReconciliationIssues";

import ReconciliationBadge from "@/components/admin/ReconciliationBadge";

import ReverifyStripeButton from "@/components/admin/ReverifyStripeButton";

import RepairStripePaymentButton from "@/components/admin/RepairStripePaymentButton";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminMetricCard from "@/components/admin/AdminMetricCard";

import AdminEmptyState from "@/components/admin/AdminEmptyState";


export default async function PaymentReconciliationPage() {
  await requireAdmin();


  const issues =
    await getPaymentReconciliationIssues();


  return (
    <div>
      <AdminPageHeader
        title="支付对账"
        description="检查订单与支付交易之间的数据异常。"
      />

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">
          对账概览
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="待核对"
            value={
              issues.length
            }
            description="当前待人工核对的支付异常"
            tone="blue"
          />

          <AdminMetricCard
            label="异常订单"
            value={
              issues.length
            }
            description="检测到支付数据异常的订单"
            tone={
              issues.length >
              0
                ? "red"
                : "slate"
            }
          />

          <AdminMetricCard
            label="当前正常"
            value={
              issues.length ===
              0
                ? "正常"
                : "需处理"
            }
            description="订单与支付交易当前一致性"
            tone={
              issues.length ===
              0
                ? "emerald"
                : "amber"
            }
          />

          <AdminMetricCard
            label="检查状态"
            value="实时"
            description="页面加载时重新读取对账数据"
            tone="violet"
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold text-slate-950">
          对账中心
        </h2>

        {issues.length ===
        0 ? (
          <div className="mt-4">
            <AdminEmptyState
              title="当前没有发现支付异常"
              description="订单与支付记录一致，暂无需要处理的异常数据。"
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {issues.map(
              (
                issue,
                index
              ) => (
                <article
                  key={`${issue.orderId}-${issue.type}-${index}`}
                  className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <ReconciliationBadge
                        type={
                          issue.type
                        }
                      />

                      <p className="mt-4 text-sm leading-6 text-slate-700">
                        {
                          issue.message
                        }
                      </p>

                      <div className="mt-4 space-y-1 text-sm text-slate-500">
                        <p className="break-all">
                          Order ID：
                          {
                            issue.orderId
                          }
                        </p>

                        {issue.transactionId && (
                          <p className="break-all">
                            Transaction ID：
                            {
                              issue.transactionId
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Link
                        href={`/admin/orders/${issue.orderId}`}
                        className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        查看订单
                      </Link>

                      <ReverifyStripeButton
                        orderId={
                          issue.orderId
                        }
                      />

                      {issue.type ===
                        "payment_status_mismatch" && (
                        <RepairStripePaymentButton
                          orderId={
                            issue.orderId
                          }
                        />
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}