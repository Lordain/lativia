import Link from "next/link";

import {
  getAdminNotificationDeliveries,
} from "@/lib/notifications/getAdminNotificationDeliveries";

import RetryNotificationEmailButton from "@/components/admin/RetryNotificationEmailButton";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminMetricCard from "@/components/admin/AdminMetricCard";

import AdminEmptyState from "@/components/admin/AdminEmptyState";


function getStatusStyle(
  status:
    string
) {
  switch (
    status
  ) {
    case "sent":
      return "bg-emerald-50 text-emerald-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "processing":
      return "bg-blue-50 text-blue-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "unknown":
      return "bg-violet-50 text-violet-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}


function getStatusLabel(
  status:
    string
) {
  switch (
    status
  ) {
    case "sent":
      return "已发送";

    case "failed":
      return "发送失败";

    case "processing":
      return "处理中";

    case "pending":
      return "等待发送";

    case "unknown":
      return "待人工核对";

    default:
      return status;
  }
}


export default async function AdminNotificationsPage() {
  const items =
    await getAdminNotificationDeliveries();


  const emailItems =
    items.filter(
      item =>
        item.channel ===
        "email"
    );


  const sentCount =
    emailItems.filter(
      item =>
        item.deliveryStatus ===
        "sent"
    ).length;


  const processingCount =
    emailItems.filter(
      item =>
        item.deliveryStatus ===
          "processing" ||
        item.deliveryStatus ===
          "pending"
    ).length;


  const failedCount =
    emailItems.filter(
      item =>
        item.deliveryStatus ===
        "failed"
    ).length;


  const unknownCount =
    emailItems.filter(
      item =>
        item.deliveryStatus ===
        "unknown"
    ).length;


  return (
    <div>
      <AdminPageHeader
        title="通知管理"
        description="查看客户 Email 通知的发送状态、Provider Message ID、失败原因、重试次数，以及需要人工核对的异常投递。"
      />

      <section className="mt-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard
            label="已发送"
            value={
              sentCount
            }
            description="Provider 已确认接受发送"
            tone="emerald"
          />

          <AdminMetricCard
            label="处理中"
            value={
              processingCount
            }
            description="包括 pending 和 processing"
            tone="blue"
          />

          <AdminMetricCard
            label="发送失败"
            value={
              failedCount
            }
            description="可在修复问题后人工重试"
            tone={
              failedCount >
              0
                ? "red"
                : "slate"
            }
          />

          <AdminMetricCard
            label="待人工核对"
            value={
              unknownCount
            }
            description="禁止直接重发，避免客户重复收件"
            tone={
              unknownCount >
              0
                ? "violet"
                : "slate"
            }
          />
        </div>
      </section>

      {unknownCount >
        0 && (
        <section className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-5 shadow-sm">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              !
            </div>

            <div>
              <h2 className="font-bold text-violet-950">
                有 Email 需要人工核对
              </h2>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-violet-800">
                「待人工核对」表示邮件 Provider
                可能已经接受发送请求，
                但系统未能确认本地最终状态。
                为避免客户收到重复邮件，
                此状态不会提供自动重试按钮。
                请先根据 Provider Message ID
                到邮件服务商后台确认实际发送结果。
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">
            Email 投递记录
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            查看每一笔客户通知的发送状态与 Provider 回传信息。
          </p>
        </div>

        {emailItems.length ===
        0 ? (
          <AdminEmptyState
            title="当前没有 Email Delivery"
            description="客户通知开始通过 Email 发送后，投递记录会显示在这里。"
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3.5">
                      通知
                    </th>

                    <th className="px-5 py-3.5">
                      订单
                    </th>

                    <th className="px-5 py-3.5">
                      收件人
                    </th>

                    <th className="px-5 py-3.5">
                      状态
                    </th>

                    <th className="px-5 py-3.5">
                      尝试
                    </th>

                    <th className="px-5 py-3.5">
                      Provider ID
                    </th>

                    <th className="px-5 py-3.5">
                      最后尝试
                    </th>

                    <th className="px-5 py-3.5">
                      失败 / 异常原因
                    </th>

                    <th className="px-5 py-3.5">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {emailItems.map(
                    item => {
                      const canRetry =
                        item.deliveryStatus ===
                          "failed" &&
                        item.attemptCount <
                          5;


                      return (
                        <tr
                          key={`${item.notificationId}:${item.channel}`}
                          className="align-top transition hover:bg-slate-50/70"
                        >
                          <td className="min-w-60 px-5 py-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                item.notificationTitle
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                item.notificationType
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              通知建立：
                              {new Date(
                                item.createdAt
                              ).toLocaleString()}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            {item.orderId ? (
                              <Link
                                href={`/admin/orders/${item.orderId}`}
                                className="whitespace-nowrap text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                              >
                                查看订单
                              </Link>
                            ) : (
                              <span className="text-sm text-slate-400">
                                —
                              </span>
                            )}
                          </td>

                          <td className="max-w-xs break-all px-5 py-4 text-sm text-slate-600">
                            {
                              item.recipient ??
                              "—"
                            }
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                whitespace-nowrap
                                rounded-full
                                px-2.5
                                py-1
                                text-xs
                                font-semibold
                                ${getStatusStyle(
                                  item.deliveryStatus
                                )}
                              `}
                            >
                              {
                                getStatusLabel(
                                  item.deliveryStatus
                                )
                              }
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {
                              item.attemptCount
                            }
                            /5
                          </td>

                          <td className="max-w-xs break-all px-5 py-4 font-mono text-xs text-slate-500">
                            {
                              item.providerMessageId ??
                              "—"
                            }
                          </td>

                          <td className="min-w-44 px-5 py-4 text-xs text-slate-500">
                            {item.lastAttemptAt
                              ? new Date(
                                  item.lastAttemptAt
                                ).toLocaleString()
                              : "—"}
                          </td>

                          <td className="max-w-sm px-5 py-4">
                            {item.failureReason ? (
                              <p
                                className={`
                                  text-xs
                                  leading-5
                                  ${
                                    item.deliveryStatus ===
                                    "unknown"
                                      ? "text-violet-700"
                                      : "text-red-600"
                                  }
                                `}
                              >
                                {
                                  item.failureReason
                                }
                              </p>
                            ) : (
                              <span className="text-xs text-slate-400">
                                —
                              </span>
                            )}

                            {item.failedAt && (
                              <p className="mt-2 text-xs text-slate-400">
                                失败时间：
                                {new Date(
                                  item.failedAt
                                ).toLocaleString()}
                              </p>
                            )}

                            {item.sentAt && (
                              <p className="mt-2 text-xs text-slate-400">
                                发送时间：
                                {new Date(
                                  item.sentAt
                                ).toLocaleString()}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            {canRetry ? (
                              <RetryNotificationEmailButton
                                notificationId={
                                  item.notificationId
                                }
                              />
                            ) : item.deliveryStatus ===
                              "unknown" ? (
                              <div className="max-w-40">
                                <p className="text-xs font-semibold text-violet-700">
                                  请人工核对
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                  禁止直接重发
                                </p>
                              </div>
                            ) : item.deliveryStatus ===
                                "failed" &&
                              item.attemptCount >=
                                5 ? (
                              <div className="max-w-40">
                                <p className="text-xs font-semibold text-red-700">
                                  已达重试上限
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                  请检查配置或 Provider
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-100/70 p-5 text-sm leading-6 text-slate-600">
        <p>
          <strong className="text-slate-900">
            发送失败：
          </strong>{" "}
          Provider 明确返回失败，可以在修复原因后重试。
        </p>

        <p className="mt-2">
          <strong className="text-slate-900">
            待人工核对：
          </strong>{" "}
          Provider 可能已经接受邮件，但系统无法确认最终状态。
          为避免重复邮件，必须先人工核对。
        </p>

        <p className="mt-2">
          <strong className="text-slate-900">
            已发送：
          </strong>{" "}
          已取得 Provider Message ID，
          系统不会再次发送同一 Notification。
        </p>
      </section>
    </div>
  );
}