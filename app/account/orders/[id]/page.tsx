import { notFound } from "next/navigation";

import { getMyOrder } from "@/lib/orders/getMyOrder";

import StatusBadge from "@/components/orders/StatusBadge";

import type { OrderStatus } from "@/types/order";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const order =
    await getMyOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">
        {order.services?.title ??
          "申请详情"}
      </h1>

      <div className="mt-4">
        <StatusBadge
          status={
            order.status as OrderStatus
          }
        />
      </div>

      <p className="mt-4 text-sm text-gray-500">
        申请时间：
        {new Date(
          order.created_at
        ).toLocaleString()}
      </p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          申请资料
        </h2>

        <div className="mt-4 space-y-3">
          {Object.entries(
            order.form_data ?? {}
          ).map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border p-4"
            >
              <p className="text-sm text-gray-500">
                {key}
              </p>

              <p className="mt-1">
                {String(value)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}