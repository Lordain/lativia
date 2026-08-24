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
  switch (
    level
  ) {
    case "success":
      return "border-emerald-200 bg-emerald-50";

    case "warning":
      return "border-amber-200 bg-amber-50";

    case "error":
      return "border-red-200 bg-red-50";

    default:
      return "border-slate-200 bg-white";
  }
}


function getDotClass(
  level:
    OrderTimelineItem["level"]
) {
  switch (
    level
  ) {
    case "success":
      return "bg-emerald-500";

    case "warning":
      return "bg-amber-500";

    case "error":
      return "bg-red-500";

    default:
      return "bg-slate-400";
  }
}


export default function AdminOrderTimeline({
  items,
}: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-slate-950">
          订单时间线
        </h2>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
          汇总付款、办理流程、人工处理和内部备注，
          方便管理员按时间查看订单完整过程。
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {items.length ===
        0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            暂无记录。
          </div>
        ) : (
          <div className="relative space-y-4">
            {items.map(
              item => (
                <div
                  key={
                    item.id
                  }
                  className={`
                    relative
                    rounded-2xl
                    border
                    p-4
                    pl-5
                    ${getLevelClass(
                      item.level
                    )}
                  `}
                >
                  <span
                    className={`
                      absolute
                      left-0
                      top-6
                      h-2.5
                      w-2.5
                      -translate-x-1/2
                      rounded-full
                      ring-4
                      ring-white
                      ${getDotClass(
                        item.level
                      )}
                    `}
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {
                          item.title
                        }
                      </p>

                      {item.description && (
                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {
                            item.description
                          }
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 text-xs text-slate-400">
                      {
                        new Date(
                          item.createdAt
                        ).toLocaleString(
                          "zh-CN"
                        )
                      }
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
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
      </div>
    </section>
  );
}