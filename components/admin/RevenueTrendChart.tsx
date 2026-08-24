interface TrendDay {
  date:
    string;

  label:
    string;

  revenueMXN:
    number;

  revenueCNY:
    number;
}


interface Props {
  days:
    TrendDay[];
}


export default function RevenueTrendChart({
  days,
}: Props) {
  const maxRevenue =
    Math.max(
      ...days.flatMap(
        day => [
          day.revenueMXN,
          day.revenueCNY,
        ]
      ),
      1
    );


  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-950">
              最近 30 天收入趋势
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              仅统计已确认支付，MXN 与 CNY 分开显示。
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500" />
              MXN
            </span>

            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              CNY
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-5">
        <div className="flex min-w-[900px] items-end gap-2">
          {days.map(
            day => {
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
                      className="w-2 rounded-t-md bg-blue-500 transition hover:bg-blue-600"
                      style={{
                        height:
                          `${mxnHeight}px`,
                      }}
                      title={`${day.date} MXN: ${day.revenueMXN.toFixed(
                        2
                      )}`}
                    />

                    <div
                      className="w-2 rounded-t-md bg-emerald-500 transition hover:bg-emerald-600"
                      style={{
                        height:
                          `${cnyHeight}px`,
                      }}
                      title={`${day.date} CNY: ${day.revenueCNY.toFixed(
                        2
                      )}`}
                    />
                  </div>

                  <div className="mt-2 -rotate-45 whitespace-nowrap text-[10px] text-slate-400">
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