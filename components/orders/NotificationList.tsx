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
      return "bg-green-50 text-green-700";

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
      <div className="rounded-xl border bg-white p-8 text-center">
        <p className="text-lg font-medium">
          目前没有通知
        </p>

        <p className="mt-2 text-sm text-gray-500">
          付款、办理进度和退款状态变化后，
          系统会在这里通知您。
        </p>
      </div>
    );
  }


  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          未读通知：
          <span className="ml-1 font-semibold text-gray-900">
            {unreadCount}
          </span>
        </p>


        <button
          type="button"
          onClick={
            handleMarkAllRead
          }
          disabled={
            loadingAll ||
            unreadCount === 0
          }
          className="
            rounded-lg
            border
            px-4
            py-2
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loadingAll
            ? "处理中..."
            : "全部标记为已读"}
        </button>
      </div>


      <div className="space-y-4">
        {notifications.map(
          notification => {
            const unread =
              notification.status ===
              "unread";


            const content = (
              <div
                className={`
                  rounded-xl
                  border
                  p-5
                  transition
                  ${
                    unread
                      ? "border-blue-200 bg-blue-50/40"
                      : "bg-white"
                  }
                `}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${getTypeStyle(
                            notification.type
                          )}
                        `}
                      >
                        {getTypeLabel(
                          notification.type
                        )}
                      </span>


                      {unread && (
                        <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                          未读
                        </span>
                      )}
                    </div>


                    <h2 className="mt-3 text-lg font-semibold">
                      {
                        notification.title
                      }
                    </h2>


                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {
                        notification.message
                      }
                    </p>
                  </div>


                  <p className="shrink-0 text-xs text-gray-400">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>
                </div>


                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {notification.orderId && (
                    <Link
                      href={`/account/orders/${notification.orderId}`}
                      onClick={() => {
                        if (unread) {
                          void handleMarkRead(
                            notification
                          );
                        }
                      }}
                      className="
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-blue-700
                      "
                    >
                      查看订单
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
                      className="
                        rounded-lg
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-gray-50
                        disabled:opacity-50
                      "
                    >
                      {loadingId ===
                      notification.id
                        ? "处理中..."
                        : "标记已读"}
                    </button>
                  )}
                </div>
              </div>
            );


            return (
              <div
                key={
                  notification.id
                }
              >
                {content}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}