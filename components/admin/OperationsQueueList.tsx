import Link from "next/link";

import type {
  AdminOperationItem,
  AdminOperationPriority,
  AdminOperationType,
} from "@/types/adminOperation";

interface Props {
  items:
    AdminOperationItem[];

  showViewAll?: boolean;
}

function getTypeLabel(
  type:
    AdminOperationType
) {
  switch (type) {
    case "waiting_human":
      return "需要人工处理";

    case "waiting_customer":
      return "等待客户资料";

    case "manual_review":
      return "人工复核";

    case "failed_pending_review":
      return "服务失败待判断";

    case "refund_review":
      return "退款审核";

    case "missing_fulfillment":
      return "缺少办理任务";

    case "paid_without_transaction":
      return "缺少支付交易";

    case "transaction_paid_order_unpaid":
      return "付款状态未同步";
  }
}

function getPriorityLabel(
  priority:
    AdminOperationPriority
) {
  switch (priority) {
    case "critical":
      return "紧急";

    case "high":
      return "高";

    case "medium":
      return "中";

    case "low":
      return "低";
  }
}

function getPriorityClass(
  priority:
    AdminOperationPriority
) {
  switch (priority) {
    case "critical":
      return "border-red-200 bg-red-50 text-red-700";

    case "high":
      return "border-orange-200 bg-orange-50 text-orange-700";

    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "low":
      return "border-gray-200 bg-gray-50 text-gray-600";
  }
}

function getTypeClass(
  type:
    AdminOperationType
) {
  switch (type) {
    case "missing_fulfillment":
    case "paid_without_transaction":
    case "transaction_paid_order_unpaid":
    case "failed_pending_review":
      return "bg-red-100 text-red-700";

    case "refund_review":
      return "bg-orange-100 text-orange-700";

    case "manual_review":
      return "bg-purple-100 text-purple-700";

    case "waiting_human":
      return "bg-amber-100 text-amber-700";

    case "waiting_customer":
      return "bg-blue-100 text-blue-700";
  }
}

export default function OperationsQueueList({
  items,
  showViewAll = false,
}: Props) {
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            当前待办
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            已按风险和等待时间排序。
            支付异常、服务失败和长期未处理任务会优先显示。
          </p>
        </div>

        {showViewAll &&
          items.length >
            0 && (
            <Link
              href="/admin/operations"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              查看全部待办
            </Link>
          )}
      </div>

      {items.length ===
      0 ? (
        <div className="mt-4 rounded-xl border bg-white p-8 text-center">
          <p className="font-medium text-green-700">
            当前没有需要处理的运营任务
          </p>

          <p className="mt-2 text-sm text-gray-500">
            正常自动办理中的订单不会显示在这里。
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map(
            (
              item
            ) => (
              <article
                key={`${item.type}-${item.orderId}`}
                className="rounded-xl border bg-white p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${getTypeClass(
                            item.type
                          )}
                        `}
                      >
                        {getTypeLabel(
                          item.type
                        )}
                      </span>

                      <span
                        className={`
                          rounded-full
                          border
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${getPriorityClass(
                            item.priority
                          )}
                        `}
                      >
                        优先级：
                        {getPriorityLabel(
                          item.priority
                        )}
                      </span>

                      {item.ageHours >=
                        24 && (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                          已等待{" "}
                          {
                            item.ageHours
                          }{" "}
                          小时
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3 text-lg font-semibold">
                      {
                        item.serviceTitle
                      }
                    </h4>

                    {item.reason && (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                        {
                          item.reason
                        }
                      </p>
                    )}

                    <div className="mt-4 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                      <p>
                        客户：
                        {
                          item.customerName ??
                          "未填写姓名"
                        }
                      </p>

                      <p>
                        电话：
                        {
                          item.customerPhone ??
                          "未填写"
                        }
                      </p>

                      <p className="break-all">
                        订单：
                        {
                          item.orderId
                        }
                      </p>

                      <p>
                        当前步骤：
                        {
                          item.currentStep ??
                          "未记录"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/admin/orders/${item.orderId}`}
                      className="
                        inline-flex
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      立即处理
                    </Link>
                  </div>
                </div>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}