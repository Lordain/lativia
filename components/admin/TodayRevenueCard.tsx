interface Props {
    mxn: number;
    cny: number;
  }
  
  export default function TodayRevenueCard({
    mxn,
    cny,
  }: Props) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <p className="text-sm font-medium text-gray-500">
          今日收入
        </p>
  
        <div className="mt-3 space-y-1">
          <p className="text-2xl font-bold">
            $
            {mxn.toFixed(2)} MXN
          </p>
  
          <p className="text-lg font-semibold text-gray-600">
            ¥
            {cny.toFixed(2)} CNY
          </p>
        </div>
  
        <p className="mt-2 text-sm text-gray-500">
          今日已确认支付收入
        </p>
      </div>
    );
  }