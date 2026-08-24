"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  markNotificationRead,
} from "@/lib/notifications/markNotificationRead";

import {
  markAllNotificationsRead,
} from "@/lib/notifications/markAllNotificationsRead";

import type {
  Notification,
} from "@/types/notification";


interface Props {
  notifications:
    Notification[];
}


function getTypeLabel(
  type:
    Notification["type"]
) {
  switch (type) {
    case "payment_confirmed":
      return "付款";

    case "fulfillment_started":
      return "办理";

    case "customer_action_required":
      return "需要操作";

    case "service_completed":
      return "完成";

    case "service_failed":
      return "服务异常";

    case "refund_review_started":
      return "退款审核";

    case "refund_approved":
      return "退款批准";

    case "refund_rejected":
      return "退款拒绝";

    case "refund_processing":
      return "退款处理中";

    case "refund_succeeded":
      return "退款完成";

    case "workspace_message":
      return "服务消息";

    default:
      return "通知";
  }
}


function getTypeStyle(
  type:
    Notification["type"]
) {
  switch (type) {
    case "payment_confirmed":
    case "service_completed":
    case "refund_succeeded":
      return "bg-emerald-50 text-emerald-700";

    case "customer_action_required":
    case "refund_review_started":
    case "refund_processing":
      return "bg-amber-50 text-amber-700";

    case "service_failed":
    case "refund_rejected":
      return "bg-red-50 text-red-700";

    default:
      return "bg-blue-50 text-blue-700";
  }
}


function formatNotificationDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(
    new Date(value)
  );
}


function notifyHeaderChanged() {
  if (
    typeof window !==
    "undefined"
  ) {
    window.dispatchEvent(
      new Event(
        "notifications:changed"
      )
    );
  }
}


export default function NotificationList({
  notifications,
}: Props) {
  const router =
    useRouter();

  const [
    loadingId,
    setLoadingId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    loadingAll,
    setLoadingAll,
  ] =
    useState(
      false
    );

  const unreadCount =
    notifications.filter(
      item =>
        item.status ===
        "unread"
    ).length;


  async function handleMarkRead(
    notification:
      Notification
  ) {
    if (
      notification.status ===
        "read" ||
      loadingId
    ) {
      return;
    }

    setLoadingId(
      notification.id
    );

    try {
      await markNotificationRead(
        notification.id
      );

      notifyHeaderChanged();

      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "更新通知失败"
      );

    } finally {
      setLoadingId(
        null
      );
    }
  }


  async function handleMarkAllRead() {
    if (
      loadingAll ||
      unreadCount === 0
    ) {
      return;
    }

    setLoadingAll(
      true
    );

    try {
      await markAllNotificationsRead();

      notifyHeaderChanged();

      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "更新通知失败"
      );

    } finally {
      setLoadingAll(
        false
      );
    }
  }


  if (
    notifications.length ===
    0
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
          </svg>
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-900">
          目前没有通知
        </p>

        <p className="mt-1 text-sm text-slate-500">
          订单状态变化后，
          系统会在这里通知您。
        </p>
      </div>
    );
  }


  return (
    <div>
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          {unreadCount >
          0 ? (
            <>
              <span className="font-semibold text-slate-900">
                {unreadCount}
              </span>
              {" "}
              条未读通知
            </>
          ) : (
            "暂无未读通知"
          )}
        </p>

        {unreadCount >
          0 && (
          <button
            type="button"
            onClick={
              handleMarkAllRead
            }
            disabled={
              loadingAll
            }
            className="text-xs font-semibold text-blue-700 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAll
              ? "处理中..."
              : "全部标为已读"}
          </button>
        )}
      </div>


      {/* Inbox */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {notifications.map(
          (
            notification,
            index
          ) => {
            const unread =
              notification.status ===
              "unread";

            return (
              <div
                key={
                  notification.id
                }
                className={[
                  "relative transition",
                  unread
                    ? "bg-blue-50/40"
                    : "bg-white",
                  index <
                  notifications.length -
                    1
                    ? "border-b border-slate-100"
                    : "",
                ].join(
                  " "
                )}
              >
                <div className="flex gap-3 px-4 py-4 sm:px-5">
                  {/* Unread indicator */}
                  <div className="flex w-2 shrink-0 justify-center pt-2">
                    {unread && (
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </div>


                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          getTypeStyle(
                            notification.type
                          ),
                        ].join(
                          " "
                        )}
                      >
                        {getTypeLabel(
                          notification.type
                        )}
                      </span>

                      <p className="text-xs text-slate-400">
                        {formatNotificationDate(
                          notification.createdAt
                        )}
                      </p>
                    </div>

                    <h2
                      className={[
                        "mt-2 text-sm text-slate-950",
                        unread
                          ? "font-bold"
                          : "font-semibold",
                      ].join(
                        " "
                      )}
                    >
                      {
                        notification.title
                      }
                    </h2>

                    <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-slate-500">
                      {
                        notification.message
                      }
                    </p>


                    <div className="mt-2.5 flex flex-wrap items-center gap-4">
                      {notification.orderId && (
                        <Link
                          href={`/account/orders/${notification.orderId}`}
                          onClick={() => {
                            if (
                              unread
                            ) {
                              void handleMarkRead(
                                notification
                              );
                            }
                          }}
                          className="text-xs font-semibold text-blue-700 transition hover:text-blue-800"
                        >
                          查看订单 →
                        </Link>
                      )}

                      {unread && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkRead(
                              notification
                            )
                          }
                          disabled={
                            loadingId ===
                            notification.id
                          }
                          className="text-xs font-medium text-slate-400 transition hover:text-slate-700 disabled:opacity-50"
                        >
                          {loadingId ===
                          notification.id
                            ? "处理中..."
                            : "标为已读"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}