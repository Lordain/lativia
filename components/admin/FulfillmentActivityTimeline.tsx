import type {
    FulfillmentActivity,
  } from "@/types/fulfillment";
  
  interface Props {
    activity:
      FulfillmentActivity[];
  }
  
  function getActorLabel(
    actor:
      FulfillmentActivity["actorType"]
  ) {
    switch (actor) {
      case "system":
        return "系统";
  
      case "admin":
        return "管理员";
  
      case "customer":
        return "客户";
    }
  }
  
  export default function FulfillmentActivityTimeline({
    activity,
  }: Props) {
    return (
      <section className="mt-6 rounded-xl border bg-white p-6">
        <div>
          <h3 className="font-semibold">
            办理记录
          </h3>
  
          <p className="mt-1 text-sm text-gray-500">
            记录系统自动处理、人工审核和办理状态变化，
            方便追踪每一步操作。
          </p>
        </div>
  
        {activity.length ===
        0 ? (
          <p className="mt-4 text-sm text-gray-500">
            暂无办理记录。
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {activity.map(
              (
                item
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="border-l-2 border-gray-200 pl-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">
                      {getActorLabel(
                        item.actorType
                      )}
                    </span>
  
                    {item.fromStatus &&
                      item.toStatus && (
                        <span className="text-gray-500">
                          {
                            item.fromStatus
                          }
                          {" → "}
                          {
                            item.toStatus
                          }
                        </span>
                      )}
                  </div>
  
                  {item.message && (
                    <p className="mt-1 text-sm text-gray-700">
                      {
                        item.message
                      }
                    </p>
                  )}
  
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(
                      item.createdAt
                    ).toLocaleString(
                      "zh-CN"
                    )}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>
    );
  }