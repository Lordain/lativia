import type {
    OrderTimelineItem,
  } from "@/types/orderTimeline";
  
  interface Props {
    items:
      OrderTimelineItem[];
  }
  
  function getLevelClass(
    level:
      OrderTimelineItem["level"]
  ) {
    switch (level) {
      case "success":
        return "border-green-200 bg-green-50";
  
      case "warning":
        return "border-amber-200 bg-amber-50";
  
      case "error":
        return "border-red-200 bg-red-50";
  
      default:
        return "border-gray-200 bg-white";
    }
  }
  
  export default function AdminOrderTimeline({
    items,
  }: Props) {
    return (
      <section className="mt-8 rounded-xl border bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Order Timeline
          </p>
  
          <h2 className="mt-1 text-xl font-semibold">
            订单时间线
          </h2>
  
          <p className="mt-2 text-sm leading-6 text-gray-500">
            汇总付款、办理流程、人工处理和内部备注，
            方便管理员按时间查看订单完整过程。
          </p>
        </div>
  
        {items.length ===
        0 ? (
          <p className="mt-5 text-sm text-gray-500">
            暂无记录。
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    ${getLevelClass(
                      item.level
                    )}
                  `}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">
                        {
                          item.title
                        }
                      </p>
  
                      {item.description && (
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>
  
                    <span className="text-xs text-gray-400">
                      {new Date(
                        item.createdAt
                      ).toLocaleString(
                        "zh-CN"
                      )}
                    </span>
                  </div>
  
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    {item.actor && (
                      <span>
                        操作者：
                        {
                          item.actor
                        }
                      </span>
                    )}
  
                    <span>
                      来源：
                      {
                        item.source
                      }
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    );
  }