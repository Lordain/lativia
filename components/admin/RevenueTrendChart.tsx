interface TrendDay {
    date: string;
    label: string;
    revenueMXN: number;
    revenueCNY: number;
  }
  
  interface Props {
    days: TrendDay[];
  }
  
  export default function RevenueTrendChart({
    days,
  }: Props) {
    const maxRevenue =
      Math.max(
        ...days.flatMap(
          (day) => [
            day.revenueMXN,
            day.revenueCNY,
          ]
        ),
        1
      );
  
    return (
      <section className="rounded-xl border bg-white">
        <div className="border-b px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">
                最近 30 天收入趋势
              </h2>
  
              <p className="mt-1 text-xs text-gray-500">
                仅统计已确认支付，MXN 与 CNY 分开显示。
              </p>
            </div>
  
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
                MXN
              </span>
  
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-green-500" />
                CNY
              </span>
            </div>
          </div>
        </div>
  
        <div className="overflow-x-auto p-5">
          <div className="flex min-w-[900px] items-end gap-2">
            {days.map(
              (day) => {
                const mxnHeight =
                  Math.max(
                    (
                      day.revenueMXN /
                      maxRevenue
                    ) *
                      180,
                    day.revenueMXN >
                      0
                      ? 8
                      : 2
                  );
  
                const cnyHeight =
                  Math.max(
                    (
                      day.revenueCNY /
                      maxRevenue
                    ) *
                      180,
                    day.revenueCNY >
                      0
                      ? 8
                      : 2
                  );
  
                return (
                  <div
                    key={
                      day.date
                    }
                    className="flex min-w-0 flex-1 flex-col items-center"
                  >
                    <div className="flex h-[180px] w-full items-end justify-center gap-1">
                      <div
                        className="
                          w-2
                          rounded-t-sm
                          bg-blue-500
                          transition
                          hover:bg-blue-600
                        "
                        style={{
                          height: `${mxnHeight}px`,
                        }}
                        title={`${day.date} MXN: ${day.revenueMXN.toFixed(
                          2
                        )}`}
                      />
  
                      <div
                        className="
                          w-2
                          rounded-t-sm
                          bg-green-500
                          transition
                          hover:bg-green-600
                        "
                        style={{
                          height: `${cnyHeight}px`,
                        }}
                        title={`${day.date} CNY: ${day.revenueCNY.toFixed(
                          2
                        )}`}
                      />
                    </div>
  
                    <div className="mt-2 -rotate-45 whitespace-nowrap text-[10px] text-gray-400">
                      {
                        day.label
                      }
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    );
  }