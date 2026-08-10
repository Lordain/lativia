import { notFound } from "next/navigation";

import { getMyOrder } from "@/lib/orders/getMyOrder";
import PaymentBadge from "@/components/orders/PaymentBadge";
import type { PaymentStatus } from "@/types/payment";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PaymentPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await getMyOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">
        确认付款
      </h1>

      <p className="mt-2 text-gray-500">
        请确认订单与付款方式。
      </p>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="text-xl font-semibold">
          {order.services?.title ?? "服务订单"}
        </h2>

        <div className="mt-4">
          <PaymentBadge
            status={
              order.payment_status as PaymentStatus
            }
          />
        </div>

        <div className="mt-6 space-y-3">
          <p>
            <span className="text-gray-500">
              订单金额：
            </span>

            <span className="ml-2 font-semibold">
              {order.currency === "CNY"
                ? `¥${Number(order.amount).toFixed(2)} CNY`
                : `$${Number(order.amount).toFixed(2)} MXN`}
            </span>
          </p>

          <p>
            <span className="text-gray-500">
              付款方式：
            </span>

            <span className="ml-2">
              {order.payment_method === "wechat_pay"
                ? "微信支付"
                : "墨西哥本地付款"}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}