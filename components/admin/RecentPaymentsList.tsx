import Link from "next/link";

interface RecentPayment {
  id: string;
  order_id: string;
  provider: string;
  amount: number | string;
  currency: string;
  status: string;
  created_at: string;
}

interface Props {
  payments: RecentPayment[];
}

function getProviderLabel(
  provider: string
) {
  switch (provider) {
    case "stripe":
      return "Stripe";

    case "mercado_pago":
      return "Mercado Pago";

    case "wechat_pay":
      return "WeChat Pay";

    default:
      return provider;
  }
}

export default function RecentPaymentsList({
  payments,
}: Props) {
  return (
    <section className="h-full overflow-hidden rounded-xl border bg-white">
      {/* Header */}
      <div className="flex h-[86px] items-center justify-between border-b px-5">
        <div>
          <h2 className="font-semibold">
            最近支付
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            最近确认的 5 笔支付交易
          </p>
        </div>

        <Link
          href="/admin/payments/reconciliation"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          查看支付
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="p-5 text-sm text-gray-500">
          暂无支付交易。
        </div>
      ) : (
        <div className="divide-y">
          {payments.map((payment) => (
            <Link
              key={payment.id}
              href={`/admin/orders/${payment.order_id}`}
              className="
                flex
                min-h-[110px]
                items-center
                px-5
                py-4
                transition
                hover:bg-gray-50
              "
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {getProviderLabel(
                      payment.provider
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(
                      payment.created_at
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-semibold">
                    {payment.currency ===
                    "CNY"
                      ? `¥${Number(
                          payment.amount
                        ).toFixed(2)} CNY`
                      : `$${Number(
                          payment.amount
                        ).toFixed(2)} ${payment.currency}`}
                  </p>

                  <p className="mt-1 text-xs text-green-700">
                    {payment.status ===
                    "paid"
                      ? "已付款"
                      : payment.status}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}