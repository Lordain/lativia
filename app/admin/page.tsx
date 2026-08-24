import {
  getAdminDashboardStats,
} from "@/lib/admin/getAdminDashboardStats";

import AdminMetricCard from "@/components/admin/AdminMetricCard";

import {
  getRecentAdminActivity,
} from "@/lib/admin/getRecentAdminActivity";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import {
  getTodayAdminStats,
} from "@/lib/admin/getTodayAdminStats";

import {
  getAdmin30DayTrends,
} from "@/lib/admin/getAdmin30DayTrends";

import {
  getAdminOperationsQueue,
} from "@/lib/admin/getAdminOperationsQueue";

import DashboardStatCard from "@/components/admin/DashboardStatCard";
import TodayRevenueCard from "@/components/admin/TodayRevenueCard";
import RecentOrdersList from "@/components/admin/RecentOrdersList";
import RecentPaymentsList from "@/components/admin/RecentPaymentsList";
import OrdersTrendChart from "@/components/admin/OrdersTrendChart";
import RevenueTrendChart from "@/components/admin/RevenueTrendChart";
import OperationsQueueSummary from "@/components/admin/OperationsQueueSummary";
import OperationsQueueList from "@/components/admin/OperationsQueueList";

export default async function AdminPage() {
  const [
    stats,
    recentActivity,
    todayStats,
    trends,
    operationsQueue,
  ] = await Promise.all([
    getAdminDashboardStats(),
    getRecentAdminActivity(),
    getTodayAdminStats(),
    getAdmin30DayTrends(),
    getAdminOperationsQueue(),
  ]);

  return (
    <div>
      {/* =====================================
          Page Header
      ===================================== */}

        <AdminPageHeader
          title="管理控制台"
          description="查看订单、支付与今日运营情况，快速掌握业务动态。"
        />

      {/* =====================================
          Operations Center

          Admin Dashboard 最重要的行动区域。

          只显示真正需要管理员关注的任务。
          正常自动办理中的订单不会显示。
      ===================================== */}

      <OperationsQueueSummary
        counts={
          operationsQueue.counts
        }
      />

      <OperationsQueueList
        items={
          operationsQueue.items.slice(
            0,
            10
          )
        }
        showViewAll={
          operationsQueue.items.length >
          10
        }
      />

      {/* =====================================
          Today's Operations
      ===================================== */}

      <section className="mt-8">
        <div>
          <h2 className="text-xl font-semibold">
            今日运营
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            按墨西哥城当地时间统计今天的订单与支付情况。
          </p>
        </div>

        <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard
            label="今日新增订单"
            value={
              todayStats.newOrders
            }
            description="今天创建的订单"
          />

          <DashboardStatCard
            label="今日完成订单"
            value={
              todayStats.completedOrders
            }
            description="今天完成处理的订单"
          />

          <DashboardStatCard
            label="今日确认付款"
            value={
              todayStats.confirmedPayments
            }
            description="今天确认成功的支付交易"
          />

          <TodayRevenueCard
            mxn={
              todayStats.revenueMXN
            }
            cny={
              todayStats.revenueCNY
            }
          />
        </div>
      </section>

      {/* =====================================
          30-Day Trends
      ===================================== */}

      <section className="mt-10">
        <div>
          <h2 className="text-xl font-semibold">
            最近 30 天趋势
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            按墨西哥城当地日期查看订单与已确认收入变化。
          </p>
        </div>

        {/* 30-Day Summary */}

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <AdminMetricCard
            label="30 天订单"
            value={
              trends.totals.orders
            }
            description="最近 30 天创建的订单"
            tone="blue"
          />

          <AdminMetricCard
            label="30 天 MXN 收入"
            value={`$${trends.totals.revenueMXN.toFixed(
              2
            )}`}
            description="最近 30 天已确认 MXN 收入"
            tone="emerald"
          />

          <AdminMetricCard
            label="30 天 CNY 收入"
            value={`¥${trends.totals.revenueCNY.toFixed(
              2
            )}`}
            description="最近 30 天已确认 CNY 收入"
            tone="violet"
          />
        </div>

        {/* Charts */}

        <div className="mt-6 space-y-6">
          <OrdersTrendChart
            days={
              trends.days
            }
          />

          <RevenueTrendChart
            days={
              trends.days
            }
          />
        </div>
      </section>

      {/* =====================================
          Order Overview
      ===================================== */}

      <section className="mt-10">
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
            href="/admin/orders"
          />

          <DashboardStatCard
            label="待处理订单"
            value={
              stats.pendingOrders
            }
            description="等待管理员处理"
            href="/admin/orders?status=pending"
          />

          <DashboardStatCard
            label="处理中订单"
            value={
              stats.processingOrders
            }
            description="当前正在处理"
            href="/admin/orders?status=processing"
          />

          <DashboardStatCard
            label="已完成订单"
            value={
              stats.completedOrders
            }
            description="已经完成的服务订单"
            href="/admin/orders?status=completed"
          />

          <DashboardStatCard
            label="已付款订单"
            value={
              stats.paidOrders
            }
            description="已确认收到付款"
            href="/admin/orders?payment=paid"
          />

          <DashboardStatCard
            label="未付款订单"
            value={
              stats.unpaidOrders
            }
            description="尚未完成付款"
            href="/admin/orders?payment=unpaid"
          />
        </div>
      </section>

      {/* =====================================
          Payment Providers
      ===================================== */}

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

      {/* =====================================
          Recent Activity
      ===================================== */}

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
    </div>
  );
}