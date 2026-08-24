import Link from "next/link";

import { getAdminOrders } from "@/lib/orders/getAdminOrders";

import StatusBadge from "@/components/orders/StatusBadge";

import type {
  OrderStatus,
} from "@/types/order";

import { formatBusinessDateTime } from "@/lib/time/formatBusinessDateTime";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminEmptyState from "@/components/admin/AdminEmptyState";

interface Props {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    overdue?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: Props) {
  const filters =
    await searchParams;

  const searchTerm =
    filters.search
      ?.trim()
      .toLowerCase() ?? "";

  const orders =
    await getAdminOrders();

  const twentyFourHoursAgo =
    Date.now() -
    24 * 60 * 60 * 1000;

  const filteredOrders =
    orders.filter((order) => {
      if (
        filters.status &&
        order.status !==
          filters.status
      ) {
        return false;
      }

      if (
        filters.payment &&
        order.payment_status !==
          filters.payment
      ) {
        return false;
      }

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

      if (searchTerm) {
        const orderId =
          order.id
            ?.toLowerCase() ??
          "";

        const customerName =
          order.profiles?.name
            ?.toLowerCase() ??
          "";

        const customerPhone =
          order.profiles?.phone
            ?.toLowerCase() ??
          "";

        const serviceTitle =
          order.services?.title
            ?.toLowerCase() ??
          "";

        const matchesSearch =
          orderId.includes(
            searchTerm
          ) ||
          customerName.includes(
            searchTerm
          ) ||
          customerPhone.includes(
            searchTerm
          ) ||
          serviceTitle.includes(
            searchTerm
          );

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });

  const sortedOrders =
    [...filteredOrders].sort(
      (a, b) => {
        switch (filters.sort) {
          case "oldest":
            return (
              new Date(
                a.created_at
              ).getTime() -
              new Date(
                b.created_at
              ).getTime()
            );

          case "amount_desc":
            return (
              Number(
                b.amount ?? 0
              ) -
              Number(
                a.amount ?? 0
              )
            );

          case "amount_asc":
            return (
              Number(
                a.amount ?? 0
              ) -
              Number(
                b.amount ?? 0
              )
            );

          case "newest":
          default:
            return (
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
            );
        }
      }
    );

  const hasFilters =
    Boolean(
      filters.status ||
        filters.payment ||
        filters.overdue ||
        filters.search
    );

  function buildFilterUrl(
    updates: {
      status?: string | null;
      payment?: string | null;
      overdue?: string | null;
      search?: string | null;
      sort?: string | null;
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

    const search =
      updates.search !==
      undefined
        ? updates.search
        : filters.search ??
          null;

    const sort =
      updates.sort !==
      undefined
        ? updates.sort
        : filters.sort ??
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

    if (search) {
      params.set(
        "search",
        search
      );
    }

    if (sort) {
      params.set(
        "sort",
        sort
      );
    }

    const query =
      params.toString();

    return query
      ? `/admin/orders?${query}`
      : "/admin/orders";
  }

  function getFilterClass(
    active: boolean
  ) {
    return `
      rounded-lg
      border
      px-3
      py-1.5
      text-xs
      font-semibold
      transition
      ${
        active
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }
    `;
  }

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
        return status ?? "";
    }
  }

  function getPaymentLabel(
    payment?: string
  ) {
    switch (payment) {
      case "paid":
        return "已付款";

      case "unpaid":
        return "未付款";

      default:
        return payment ?? "";
    }
  }

  return (
    <div>
<AdminPageHeader
  title="订单管理"
  description="查看并处理客户提交的服务订单。"
  actions={
    <div className="text-sm font-medium text-slate-500">
      显示{" "}
      <span className="font-bold text-slate-900">
        {
          filteredOrders.length
        }
      </span>
      {" "}/{" "}
      {
        orders.length
      }
      {" "}笔
    </div>
  }
/>

      {/* =====================================
          Compact Filter Bar
      ===================================== */}

<section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          action="/admin/orders"
          method="get"
          className="flex gap-2"
        >
          {filters.status && (
            <input
              type="hidden"
              name="status"
              value={
                filters.status
              }
            />
          )}

          {filters.payment && (
            <input
              type="hidden"
              name="payment"
              value={
                filters.payment
              }
            />
          )}

          {filters.overdue && (
            <input
              type="hidden"
              name="overdue"
              value={
                filters.overdue
              }
            />
          )}

          {filters.sort && (
            <input
              type="hidden"
              name="sort"
              value={
                filters.sort
              }
            />
          )}

          <input
            type="text"
            name="search"
            defaultValue={
              filters.search ?? ""
            }
            placeholder="搜索订单 ID、姓名、手机号或服务"
            className="
            min-w-0
            flex-1
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-50
          "
          />

          <button
            type="submit"
            className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
          >
            搜索
          </button>
        </form>

        <div className="mt-4 space-y-2">
          {/* Status */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-xs font-medium text-slate-500">
              状态
            </span>

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

          {/* Payment */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-xs font-medium text-slate-500">
              付款
            </span>

            <Link
              href={buildFilterUrl({
                payment: null,
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

          {/* Time */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-xs font-medium text-slate-500">
              时间
            </span>

            <Link
              href={buildFilterUrl({
                overdue: null,
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
              超过24h
            </Link>
          </div>

          {/* Sort */}

          <div className="flex flex-wrap items-center gap-2">
            <span className="w-12 text-xs font-medium text-slate-500">
              排序
            </span>

            <Link
              href={buildFilterUrl({
                sort: "newest",
              })}
              className={getFilterClass(
                !filters.sort ||
                  filters.sort ===
                    "newest"
              )}
            >
              最新
            </Link>

            <Link
              href={buildFilterUrl({
                sort: "oldest",
              })}
              className={getFilterClass(
                filters.sort ===
                  "oldest"
              )}
            >
              最旧
            </Link>

            <Link
              href={buildFilterUrl({
                sort:
                  "amount_desc",
              })}
              className={getFilterClass(
                filters.sort ===
                  "amount_desc"
              )}
            >
              金额高
            </Link>

            <Link
              href={buildFilterUrl({
                sort:
                  "amount_asc",
              })}
              className={getFilterClass(
                filters.sort ===
                  "amount_asc"
              )}
            >
              金额低
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================
          Current Filters
      ===================================== */}

      {hasFilters && (
        <section className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-blue-50 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="text-xs text-blue-700">
                搜索：
                {
                  filters.search
                }
              </span>
            )}

            {filters.status && (
              <span className="text-xs text-blue-700">
                状态：
                {getStatusLabel(
                  filters.status
                )}
              </span>
            )}

            {filters.payment && (
              <span className="text-xs text-blue-700">
                付款：
                {getPaymentLabel(
                  filters.payment
                )}
              </span>
            )}

            {filters.overdue ===
              "24h" && (
              <span className="text-xs text-blue-700">
                超过24小时
              </span>
            )}
          </div>

          <Link
            href={buildFilterUrl({
              status: null,
              payment: null,
              overdue: null,
              search: null,
            })}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            清除筛选
          </Link>
        </section>
      )}

      {/* =====================================
          Empty
      ===================================== */}

    {filteredOrders.length ===
      0 && (
      <div className="mt-6">
        <AdminEmptyState
          title="没有符合当前筛选条件的订单"
          description="调整搜索条件或清除筛选后重新查看。"
          action={
            hasFilters ? (
              <Link
                href="/admin/orders"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                查看全部订单
              </Link>
            ) : null
          }
        />
      </div>
    )}

      {/* =====================================
          Orders
      ===================================== */}

      {sortedOrders.length >
        0 && (
        <div className="mt-6 space-y-4">
          {sortedOrders.map(
            (order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="
                group
                block
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:border-blue-200
                hover:shadow-md
              "
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

                    <p className="mt-2 text-sm text-slate-500">
                      客户：
                      {order.profiles
                        ?.name ??
                        "未填写姓名"}
                    </p>

                    {order.profiles
                      ?.phone && (
                      <p className="mt-1 text-sm text-slate-500">
                        手机：
                        {
                          order
                            .profiles
                            .phone
                        }
                      </p>
                    )}

                    <p className="mt-1 break-all text-sm text-slate-500">
                      订单 ID：
                      {order.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      创建时间：
                      {formatBusinessDateTime(
                        order.created_at
                      )}
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-slate-500">
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
                        <p className="mt-2 text-sm text-slate-500">
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