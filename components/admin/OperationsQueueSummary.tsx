import type {
  AdminOperationsQueue,
} from "@/types/adminOperation";

interface Props {
  counts:
    AdminOperationsQueue["counts"];
}

interface SummaryItem {
  label: string;
  value: number;
  description: string;
}

export default function OperationsQueueSummary({
  counts,
}: Props) {
  const items:
    SummaryItem[] = [
      {
        label:
          "全部待办",

        value:
          counts.total,

        description:
          "当前需要关注的运营任务",
      },

      {
        label:
          "人工办理",

        value:
          counts.waitingHuman +
          counts.manualReview,

        description:
          "需要工作人员操作或进一步判断",
      },

      {
        label:
          "等待客户",

        value:
          counts.waitingCustomer,

        description:
          "等待客户补充资料或完成必要操作",
      },

      {
        label:
          "失败待判断",

        value:
          counts.failedPendingReview,

        description:
          "服务已经失败，但尚未决定下一步处理方式",
      },

      {
        label:
          "退款审核",

        value:
          counts.refundReview,

        description:
          "服务未完成，需要确认退款资格",
      },

      {
        label:
          "支付 / 系统异常",

        value:
          counts.missingFulfillment +
          counts.paidWithoutTransaction +
          counts.transactionPaidOrderUnpaid,

        description:
          "付款、交易或办理任务存在数据异常",
      },
    ];

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Operations Center
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            运营待办
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            汇总自动流程无法继续、需要人工判断、
            等待客户、服务失败、退款审核及支付系统异常。
            正常自动办理中的订单不会显示在这里。
          </p>
        </div>

        {counts.overdue24h >
          0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs text-red-600">
              待办超过 24 小时
            </p>

            <p className="mt-1 text-xl font-bold text-red-700">
              {
                counts.overdue24h
              }
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(
          (
            item
          ) => (
            <div
              key={
                item.label
              }
              className="rounded-xl border bg-white p-5"
            >
              <p className="text-sm font-medium text-gray-600">
                {
                  item.label
                }
              </p>

              <p className="mt-2 text-3xl font-bold">
                {
                  item.value
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {
                  item.description
                }
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}