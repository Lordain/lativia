import Link from "next/link";

import {
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";


interface RecentPayment {
  id:
    string;

  order_id:
    string;

  provider:
    string;

  amount:
    number |
    string;

  currency:
    string;

  status:
    string;

  created_at:
    string;
}


interface Props {
  payments:
    RecentPayment[];
}


function getProviderLabel(
  provider:
    string
) {
  switch (
    provider
  ) {
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
    <section className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex min-h-[86px] items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-950">
            最近支付
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            最近确认的 5 笔支付交易
          </p>
        </div>

        <Link
          href="/admin/payments/reconciliation"
          prefetch={false}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          查看支付 →
        </Link>
      </div>

      {payments.length ===
      0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500">
          暂无支付交易。
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {payments.map(
            payment => (
              <Link
                key={
                  payment.id
                }
                href={`/admin/orders/${payment.order_id}`}
                prefetch={false}
                className="group flex min-h-[110px] items-center px-5 py-4 transition hover:bg-slate-50"
              >
                <div className="flex w-full items-center justify-between gap-5">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {
                        getProviderLabel(
                          payment.provider
                        )
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {
                        formatBusinessDateTime(
                          payment.created_at
                        )
                      }
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-bold text-slate-950">
                      {payment.currency ===
                      "CNY"
                        ? `¥${Number(
                            payment.amount
                          ).toFixed(
                            2
                          )} CNY`
                        : `$${Number(
                            payment.amount
                          ).toFixed(
                            2
                          )} ${payment.currency}`}
                    </p>

                    <p
                      className={`
                        mt-1
                        text-xs
                        font-semibold
                        ${
                          payment.status ===
                          "paid"
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }
                      `}
                    >
                      {payment.status ===
                      "paid"
                        ? "已付款"
                        : payment.status}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
                      查看订单 →
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </section>
  );
}