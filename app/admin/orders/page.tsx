import Link from "next/link";

import { getAdminOrders } from "@/lib/orders/getAdminOrders";

import StatusBadge from "@/components/orders/StatusBadge";

import type {
  OrderStatus,
} from "@/types/order";

interface Props {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    overdue?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: Props) {
  // ========================================
  // 1. 读取 URL 筛选条件
  // ========================================

  const filters =
    await searchParams;

  // ========================================
  // 2. 获取全部订单
  // ========================================

  const orders =
    await getAdminOrders();

  // ========================================
  // 3. 计算 24 小时前的时间
  // ========================================

  const twentyFourHoursAgo =
    Date.now() -
    24 * 60 * 60 * 1000;

  // ========================================
  // 4. 根据 URL 参数筛选订单
  // ========================================

  const filteredOrders =
    orders.filter((order) => {
      // ------------------------------
      // Status 筛选
      // 例如：
      // ?status=pending
      // ------------------------------

      if (
        filters.status &&
        order.status !==
          filters.status
      ) {
        return false;
      }

      // ------------------------------
      // Payment Status 筛选
      // 例如：
      // ?payment=unpaid
      // ------------------------------

      if (
        filters.payment &&
        order.payment_status !==
          filters.payment
      ) {
        return false;
      }

      // ------------------------------
      // 超过 24 小时筛选
      // 例如：
      // ?overdue=24h
      // ------------------------------

      if (
        filters.overdue ===
        "24h"
      ) {
        const createdAt =
          new Date(
            order.created_at
          ).getTime();

        if (
          createdAt >=
          twentyFourHoursAgo
        ) {
          return false;
        }
      }

      return true;
    });

  // ========================================
  // 5. 判断当前是否正在使用筛选
  // ========================================

  const hasFilters =
    Boolean(
      filters.status ||
        filters.payment ||
        filters.overdue
    );

  return (
    <div>
      {/* =====================================
          Page Header
      ===================================== */}

      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">
            订单管理
          </h1>

          <p className="mt-2 text-gray-500">
            查看并处理客户提交的服务订单。
          </p>
        </div>

        <div className="text-sm text-gray-500">
          共 {filteredOrders.length} 笔
        </div>
      </div>

      {/* =====================================
          当前筛选提示
      ===================================== */}

      {hasFilters && (
        <div className="mt-6 rounded-xl border bg-blue-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-blue-900">
                当前正在筛选订单
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {filters.status && (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-blue-700">
                    状态：
                    {filters.status}
                  </span>
                )}

                {filters.payment && (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-blue-700">
                    付款：
                    {filters.payment}
                  </span>
                )}

                {filters.overdue ===
                  "24h" && (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-blue-700">
                    超过 24 小时
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/admin/orders"
              className="
                rounded-lg
                border
                bg-white
                px-4
                py-2
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              清除筛选
            </Link>
          </div>
        </div>
      )}

      {/* =====================================
          没有订单
      ===================================== */}

      {filteredOrders.length ===
        0 && (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center">
          <p className="text-gray-500">
            没有符合当前筛选条件的订单。
          </p>

          {hasFilters && (
            <Link
              href="/admin/orders"
              className="
                mt-4
                inline-flex
                rounded-lg
                border
                px-4
                py-2
                text-sm
                font-medium
                hover:bg-gray-50
              "
            >
              查看全部订单
            </Link>
          )}
        </div>
      )}

      {/* =====================================
          Order List
      ===================================== */}

      {filteredOrders.length >
        0 && (
        <div className="mt-8 space-y-4">
          {filteredOrders.map(
            (order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="
                  block
                  rounded-xl
                  border
                  bg-white
                  p-6
                  transition
                  hover:shadow-md
                "
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  {/* -------------------------
                      左侧订单资料
                  ------------------------- */}

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {order.services
                          ?.title ??
                          "未知服务"}
                      </h2>

                      <StatusBadge
                        status={
                          order.status as OrderStatus
                        }
                      />
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      客户：
                      {order.profiles
                        ?.name ??
                        "未填写姓名"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      订单 ID：
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      创建时间：
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </p>
                  </div>

                  {/* -------------------------
                      右侧支付资料
                  ------------------------- */}

                  <div className="md:text-right">
                    <p className="text-sm text-gray-500">
                      付款状态
                    </p>

                    <p className="mt-1 font-medium">
                      {order.payment_status ===
                      "paid"
                        ? "已付款"
                        : "未付款"}
                    </p>

                    {order.amount !==
                      null &&
                      order.amount !==
                        undefined &&
                      order.currency && (
                        <p className="mt-2 text-sm text-gray-500">
                          {order.currency ===
                          "CNY"
                            ? `¥${Number(
                                order.amount
                              ).toFixed(
                                2
                              )} CNY`
                            : `$${Number(
                                order.amount
                              ).toFixed(
                                2
                              )} ${order.currency}`}
                        </p>
                      )}
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}