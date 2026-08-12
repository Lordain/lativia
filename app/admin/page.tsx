import Link from "next/link";

import {
  getAdminDashboardStats,
} from "@/lib/admin/getAdminDashboardStats";

import DashboardStatCard from "@/components/admin/DashboardStatCard";

export default async function AdminPage() {
  const stats =
    await getAdminDashboardStats();

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">
          管理控制台
        </h1>

        <p className="mt-2 text-gray-500">
          查看订单与支付状态概览。
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          订单概览
        </h2>

        <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            label="总订单"
            value={
              stats.totalOrders
            }
            description="系统中的全部订单"
          />

          <DashboardStatCard
            label="待处理订单"
            value={
              stats.pendingOrders
            }
            description="等待管理员处理"
          />

          <DashboardStatCard
            label="处理中订单"
            value={
              stats.processingOrders
            }
            description="当前正在处理"
          />

          <DashboardStatCard
            label="已完成订单"
            value={
              stats.completedOrders
            }
            description="已经完成的服务订单"
          />

          <DashboardStatCard
            label="已付款订单"
            value={
              stats.paidOrders
            }
            description="已确认收到付款"
          />

          <DashboardStatCard
            label="未付款订单"
            value={
              stats.unpaidOrders
            }
            description="尚未完成付款"
          />
        </div>
      </section>

      <section className="mt-10">
  <h2 className="text-xl font-semibold">
    支付渠道
  </h2>

  <div className="mt-4 grid gap-6 md:grid-cols-2">
    <DashboardStatCard
      label="Stripe"
      value={
        stats.stripeOrders
      }
      description="国际信用卡 / 借记卡订单"
    />

    <DashboardStatCard
      label="Mercado Pago"
      value={
        stats.mercadoPagoOrders
      }
      description="墨西哥本地付款订单"
    />
  </div>
</section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">
          快速入口
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/orders"
            className="
              rounded-xl
              border
              bg-white
              p-5
              font-medium
              transition
              hover:shadow-md
            "
          >
            查看订单
          </Link>

          <Link
            href="/admin/services"
            className="
              rounded-xl
              border
              bg-white
              p-5
              font-medium
              transition
              hover:shadow-md
            "
          >
            管理服务
          </Link>

          <Link
            href="/admin/payments/reconciliation"
            className="
              rounded-xl
              border
              bg-white
              p-5
              font-medium
              transition
              hover:shadow-md
            "
          >
            支付对账
          </Link>
        </div>
      </section>
    </div>
  );
}