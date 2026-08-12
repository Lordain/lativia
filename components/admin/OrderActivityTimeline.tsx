import {
    formatBusinessDateTime,
  } from "@/lib/time/formatBusinessDateTime";
  
  import type {
    OrderActivityItem,
  } from "@/lib/orders/getOrderActivity";
  
  const STATUS_LABELS:
    Record<
      string,
      string
    > = {
      pending:
        "待处理",
  
      processing:
        "处理中",
  
      waiting_documents:
        "等待补件",
  
      completed:
        "已完成",
  
      cancelled:
        "已取消",
    };
  
  interface Props {
    activity:
      OrderActivityItem[];
  }
  
  export default function OrderActivityTimeline({
    activity,
  }: Props) {
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          订单操作记录
        </h2>
  
        <p className="mt-2 text-sm text-gray-500">
          保存订单状态变化与管理员内部备注。
        </p>
  
        {activity.length ===
        0 ? (
          <div className="mt-4 rounded-xl border bg-white p-6 text-sm text-gray-500">
            暂无操作记录。
          </div>
        ) : (
          <div className="mt-4 rounded-xl border bg-white">
            <div className="divide-y">
              {activity.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        {item.action ===
                        "status_changed" ? (
                          <p className="font-medium">
                            状态变更：
                            {
                              STATUS_LABELS[
                                item
                                  .from_status ??
                                  ""
                              ] ??
                              item.from_status
                            }
                            {" → "}
                            {
                              STATUS_LABELS[
                                item
                                  .to_status ??
                                  ""
                              ] ??
                              item.to_status
                            }
                          </p>
                        ) : (
                          <p className="font-medium">
                            新增内部备注
                          </p>
                        )}
  
                        {item.note && (
                          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                            {
                              item.note
                            }
                          </p>
                        )}
                      </div>
  
                      <p className="shrink-0 text-xs text-gray-400">
                        {formatBusinessDateTime(
                          item.created_at
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </section>
    );
  }