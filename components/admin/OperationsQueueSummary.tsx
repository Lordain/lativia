import type {
  AdminOperationsQueue,
} from "@/types/adminOperation";

import AdminMetricCard from "@/components/admin/AdminMetricCard";


interface Props {
  counts:
    AdminOperationsQueue["counts"];
}


export default function OperationsQueueSummary({
  counts,
}: Props) {
  const items = [
    {
      label:
        "全部待办",

      value:
        counts.total,

      description:
        "当前需要处理的运营任务",

      tone:
        "blue" as const,
    },

    {
      label:
        "人工办理",

      value:
        counts.waitingHuman +
        counts.manualReview,

      description:
        "需要工作人员操作或进一步判断",

      tone:
        "emerald" as const,
    },

    {
      label:
        "等待客户",

      value:
        counts.waitingCustomer,

      description:
        "等待客户补充资料或完成必要操作",

      tone:
        "amber" as const,
    },

    {
      label:
        "失败待判断",

      value:
        counts.failedPendingReview,

      description:
        "服务已失败，待进一步处理",

      tone:
        "red" as const,
    },

    {
      label:
        "退款审核",

      value:
        counts.refundReview,

      description:
        "服务未完成，需要复核退款资格",

      tone:
        "violet" as const,
    },

    {
      label:
        "支付 / 系统异常",

      value:
        counts.missingFulfillment +
        counts.paidWithoutTransaction +
        counts.transactionPaidOrderUnpaid,

      description:
        "付款、交易或系统存在异常",

      tone:
        "blue" as const,
    },
  ];


  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Operations Center
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            运营待办概览
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            汇总自动流程无法继续、人工判断、
            等待客户、退款审核以及支付系统异常。
          </p>
        </div>

        {counts.overdue24h >
          0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 shadow-sm">
            <p className="text-xs font-medium text-red-600">
              待办超过 24 小时
            </p>

            <p className="mt-1 text-2xl font-bold text-red-700">
              {
                counts.overdue24h
              }
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(
          item => (
            <AdminMetricCard
              key={
                item.label
              }
              label={
                item.label
              }
              value={
                item.value
              }
              description={
                item.description
              }
              tone={
                item.tone
              }
            />
          )
        )}
      </div>
    </section>
  );
}