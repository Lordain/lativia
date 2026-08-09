import { getMyOrders } from "@/lib/orders/getMyOrders";
import StatusBadge from "@/components/orders/StatusBadge";
import Link from "next/link";

export default async function MyOrdersPage() {
  const orders = await getMyOrders();

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        我的申请
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          目前还没有申请记录。
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              href={`/account/orders/${order.id}`} 
              key={order.id}
              className="block rounded-lg border p-4 transition hover:bg-gray-50">
            
              <h2 className="font-semibold">
                {order.services?.title ?? "服务"}
              </h2>

              <div className="mt-2">
                <StatusBadge status={order.status} />
              </div>

              <p className="mt-1 text-sm text-gray-500">
                创建时间：
                {new Date(order.created_at).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}