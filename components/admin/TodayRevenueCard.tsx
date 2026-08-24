interface Props {
  mxn: number;

  cny: number;
}


export default function TodayRevenueCard({
  mxn,
  cny,
}: Props) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />

        <p className="text-sm font-semibold text-slate-600">
          今日收入
        </p>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-slate-950">
          $
          {mxn.toFixed(
            2
          )}{" "}
          MXN
        </p>

        <p className="mt-1 text-lg font-semibold text-slate-600">
          ¥
          {cny.toFixed(
            2
          )}{" "}
          CNY
        </p>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        今日已确认支付收入
      </p>
    </div>
  );
}