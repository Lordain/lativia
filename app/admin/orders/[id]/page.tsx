import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getAdminOrder } from "@/lib/orders/getAdminOrder";

import StatusBadge from "@/components/orders/StatusBadge";

import type { OrderStatus } from "@/types/order";
import type { FormFieldSchema } from "@/types/form";

import OrderManagementForm from "@/components/admin/OrderManagementForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({
  params,
}: Props) {
  await requireAdmin();

  const { id } = await params;

  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  const formSchema =
    (order.services?.form_schema ?? []) as FormFieldSchema[];

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">
        {order.services?.title ?? "订单详情"}
      </h1>

      <div className="mt-4">
        <StatusBadge
          status={order.status as OrderStatus}
        />
      </div>

      <div className="mt-6 space-y-2 text-sm text-gray-600">
        <p>
          客户：
          {order.profiles?.name ?? "未知用户"}
        </p>

        <p>
          电话：
          {order.profiles?.phone ?? "未填写"}
        </p>

        <p>
          提交时间：
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          申请资料
        </h2>

        <div className="mt-4 space-y-3">
          {Object.entries(order.form_data ?? {}).map(
            ([key, value]) => {
              const field = formSchema.find(
                (item) => item.name === key
              );

              return (
                <div
                  key={key}
                  className="rounded-lg border p-4"
                >
                  <p className="text-sm text-gray-500">
                    {field?.label ?? key}
                  </p>

                  <p className="mt-1">
                    {String(value) || "未填写"}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>
      <OrderManagementForm
        orderId={order.id}
        initialStatus={order.status as OrderStatus}
        initialAdminNote={order.admin_note}
      />

    </main>
  );
}