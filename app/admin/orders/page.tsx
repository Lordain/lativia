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
  // 1. 读取 URL Filter
  // ========================================

  const filters =
    await searchParams;

  // ========================================
  // 2. 获取全部订单
  // ========================================

  const orders =
    await getAdminOrders();

  // ========================================
  // 3. 计算 24 小时前
  // ========================================

  const twentyFourHoursAgo =
    Date.now() -
    24 * 60 * 60 * 1000;

  // ========================================
  // 4. 根据 URL 参数筛选
  // ========================================

  const filteredOrders =
    orders.filter((order) => {
      // Order Status
      if (
        filters.status &&
        order.status !==
          filters.status
      ) {
        return false;
      }

      // Payment Status
      if (
        filters.payment &&
        order.payment_status !==
          filters.payment
      ) {
        return false;
      }

      // Overdue
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
  // 5. 是否存在 Filter
  // ========================================

  const hasFilters =
    Boolean(
      filters.status ||
        filters.payment ||
        filters.overdue
    );

  // ========================================
  // 6. Build Filter URL
  // 保留现有条件，只改变当前点击的条件
  // ========================================

  function buildFilterUrl(
    updates: {
      status?: string | null;
      payment?: string | null;
      overdue?: string | null;
    }
  ) {
    const params =
      new URLSearchParams();

    const status =
      updates.status !==
      undefined
        ? updates.status
        : filters.status ??
          null;

    const payment =
      updates.payment !==
      undefined
        ? updates.payment
        : filters.payment ??
          null;

    const overdue =
      updates.overdue !==
      undefined
        ? updates.overdue
        : filters.overdue ??
          null;

    if (status) {
      params.set(
        "status",
        status
      );
    }

    if (payment) {
      params.set(
        "payment",
        payment
      );
    }

    if (overdue) {
      params.set(
        "overdue",
        overdue
      );
    }

    const query =
      params.toString();

    return query
      ? `/admin/orders?${query}`
      : "/admin/orders";
  }

  // ========================================
  // 7. Filter Button Active Style
  // ========================================

  function getFilterClass(
    active: boolean
  ) {
    return `
      rounded-lg
      border
      px-3
      py-2
      text-sm
      font-medium
      transition
      ${
        active
          ? "border-blue-600 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }
    `;
  }

  // ========================================
  // 8. Status Label
  // ========================================

  function getStatusLabel(
    status?: string
  ) {
    switch (status) {
      case "pending":
        return "待处理";

      case "processing":
        return "处理中";

      case "completed":
        return "已完成";

      default:
        return (
          status ??
          ""
        );
    }
  }

  // ========================================
  // 9. Payment Label
  // ========================================

  function getPaymentLabel(
    payment?: string
  ) {
    switch (payment) {
      case "paid":
        return "已付款";

      case "unpaid":
        return "未付款";

      default:
        return (
          payment ??
          ""
        );
    }
  }

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
          Filter UI
      ===================================== */}

      <section className="mt-6 space-y-5 rounded-xl border bg-white p-5">
        {/* Order Status */}

        <div>
          <p className="text-sm font-medium text-gray-700">
            订单状态
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl({
                status: null,
              })}
              className={getFilterClass(
                !filters.status
              )}
            >
              全部
            </Link>

            <Link
              href={buildFilterUrl({
                status:
                  "pending",
              })}
              className={getFilterClass(
                filters.status ===
                  "pending"
              )}
            >
              待处理
            </Link>

            <Link
              href={buildFilterUrl({
                status:
                  "processing",
              })}
              className={getFilterClass(
                filters.status ===
                  "processing"
              )}
            >
              处理中
            </Link>

            <Link
              href={buildFilterUrl({
                status:
                  "completed",
              })}
              className={getFilterClass(
                filters.status ===
                  "completed"
              )}
            >
              已完成
            </Link>
          </div>
        </div>

        {/* Payment Status */}

        <div>
          <p className="text-sm font-medium text-gray-700">
            付款状态
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl({
                payment:
                  null,
              })}
              className={getFilterClass(
                !filters.payment
              )}
            >
              全部
            </Link>

            <Link
              href={buildFilterUrl({
                payment:
                  "unpaid",
              })}
              className={getFilterClass(
                filters.payment ===
                  "unpaid"
              )}
            >
              未付款
            </Link>

            <Link
              href={buildFilterUrl({
                payment:
                  "paid",
              })}
              className={getFilterClass(
                filters.payment ===
                  "paid"
              )}
            >
              已付款
            </Link>
          </div>
        </div>

        {/* Time */}

        <div>
          <p className="text-sm font-medium text-gray-700">
            时间
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={buildFilterUrl({
                overdue:
                  null,
              })}
              className={getFilterClass(
                !filters.overdue
              )}
            >
              全部
            </Link>

            <Link
              href={buildFilterUrl({
                overdue:
                  "24h",
              })}
              className={getFilterClass(
                filters.overdue ===
                  "24h"
              )}
            >
              超过 24 小时
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================
          Current Filters
      ===================================== */}

      {hasFilters && (
        <section className="mt-6 rounded-xl border bg-blue-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-blue-900">
                当前正在筛选订单
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {filters.status && (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-blue-700">
                    状态：
                    {getStatusLabel(
                      filters.status
                    )}
                  </span>
                )}

                {filters.payment && (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-blue-700">
                    付款：
                    {getPaymentLabel(
                      filters.payment
                    )}
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
        </section>
      )}

      {/* =====================================
          Empty State
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
                transition
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
                  {/* Left */}

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

                  {/* Right */}

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