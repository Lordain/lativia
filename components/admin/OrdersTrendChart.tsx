interface TrendDay {
  date:
    string;

  label:
    string;

  orders:
    number;
}


interface Props {
  days:
    TrendDay[];
}


export default function OrdersTrendChart({
  days,
}: Props) {
  const maxOrders =
    Math.max(
      ...days.map(
        day =>
          day.orders
      ),
      1
    );


  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <h2 className="font-bold text-slate-950">
          最近 30 天订单趋势
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          按墨西哥城当地日期统计每日新增订单。
        </p>
      </div>

      <div className="overflow-x-auto p-5">
        <div className="flex min-w-[900px] items-end gap-2">
          {days.map(
            day => {
              const height =
                Math.max(
                  (
                    day.orders /
                    maxOrders
                  ) *
                    180,
                  day.orders >
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
                  <div className="mb-2 text-xs font-semibold text-slate-600">
                    {
                      day.orders
                    }
                  </div>

                  <div className="flex h-[180px] w-full items-end justify-center">
                    <div
                      className="w-full max-w-6 rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                      style={{
                        height:
                          `${height}px`,
                      }}
                      title={`${day.date}: ${day.orders} 笔订单`}
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