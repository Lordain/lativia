import Link from "next/link";

import {
  getAdminDashboardStats,
} from "@/lib/admin/getAdminDashboardStats";

import DashboardStatCard from "@/components/admin/DashboardStatCard";

import { getRecentAdminActivity } from "@/lib/admin/getRecentAdminActivity";

import RecentOrdersList from "@/components/admin/RecentOrdersList";
import RecentPaymentsList from "@/components/admin/RecentPaymentsList";

export default async function AdminPage() {
  const [
    stats,
    recentActivity,
  ] = await Promise.all([
    getAdminDashboardStats(),
    getRecentAdminActivity(),
  ]);

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
    需要处理
  </h2>

  <p className="mt-2 text-sm text-gray-500">
    检查支付状态与交易记录是否一致。
  </p>

  <div className="mt-4 grid gap-6 md:grid-cols-3">
    <DashboardStatCard
      label="支付异常"
      value={stats.paymentExceptions}
      description="存在支付状态不一致的订单"
      href="/admin/payments/reconciliation"
    />

    <DashboardStatCard
      label="已付款但无交易记录"
      value={stats.paidWithoutTransaction}
      description="订单为已付款，但缺少支付交易"
    />

    <DashboardStatCard
      label="交易已付款但订单未更新"
      value={stats.transactionPaidOrderUnpaid}
      description="已有已付款交易，但订单仍未标记已付款"
    />
  </div>

  <div className="mt-6 grid gap-6 md:grid-cols-2">
    <DashboardStatCard
      label="未付款超过 24 小时"
      value={stats.overdueUnpaidOrders}
      description="创建超过 24 小时仍未完成付款"
      href="/admin/orders?payment=unpaid&overdue=24h"
    />

    <DashboardStatCard
      label="待处理超过 24 小时"
      value={stats.overduePendingOrders}
      description="创建超过 24 小时仍等待处理"
      href="/admin/orders?status=pending&overdue=24h"
    />
  </div>

  <Link
    href="/admin/payments/reconciliation"
    className="
      mt-4
      inline-flex
      rounded-lg
      border
      bg-white
      px-4
      py-2
      text-sm
      font-medium
      transition
      hover:bg-gray-50
    "
  >
    查看支付对账
  </Link>
</section>

<section className="mt-10">
  <div>
    <h2 className="text-xl font-semibold">
      最近活动
    </h2>

    <p className="mt-2 text-sm text-gray-500">
      查看最近创建的订单与支付交易。
    </p>
  </div>

  <div className="mt-4 grid gap-6 xl:grid-cols-2">
    <RecentOrdersList
      orders={
        recentActivity.recentOrders
      }
    />

    <RecentPaymentsList
      payments={
        recentActivity.recentPayments
      }
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