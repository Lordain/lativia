import Link from "next/link";

import {
  getAdminNotificationDeliveries,
} from "@/lib/notifications/getAdminNotificationDeliveries";

import RetryNotificationEmailButton from "@/components/admin/RetryNotificationEmailButton";


function getStatusStyle(
  status:
    string
) {
  switch (
    status
  ) {
    case "sent":
      return "bg-green-50 text-green-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "processing":
      return "bg-blue-50 text-blue-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "unknown":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-gray-100 text-gray-700";
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


  /*
   * ========================================
   * Email Delivery Only
   * ========================================
   */

  const emailItems =
    items.filter(
      item =>
        item.channel ===
        "email"
    );


  /*
   * ========================================
   * Summary
   * ========================================
   */

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* =====================================
          Header
      ===================================== */}

      <div>
        <p className="text-sm font-medium text-blue-600">
          Admin
        </p>

        <h1 className="mt-1 text-3xl font-bold">
          通知管理
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-500">
          查看客户 Email 通知的发送状态、
          Provider Message ID、失败原因、
          重试次数，以及需要人工核对的异常投递。
        </p>
      </div>


      {/* =====================================
          Summary Cards
      ===================================== */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            已发送
          </p>

          <p className="mt-2 text-2xl font-semibold text-green-700">
            {sentCount}
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            处理中
          </p>

          <p className="mt-2 text-2xl font-semibold text-blue-700">
            {processingCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            包括 pending 和 processing
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            发送失败
          </p>

          <p className="mt-2 text-2xl font-semibold text-red-600">
            {failedCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            可在下方人工重试
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            待人工核对
          </p>

          <p className="mt-2 text-2xl font-semibold text-purple-600">
            {unknownCount}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Provider 结果可能已成功，禁止直接重发
          </p>
        </div>
      </div>


      {/* =====================================
          Important State Explanation
      ===================================== */}

      {unknownCount > 0 && (
        <div className="mt-6 rounded-xl border border-purple-200 bg-purple-50 p-5">
          <p className="font-medium text-purple-800">
            有 Email 需要人工核对
          </p>

          <p className="mt-2 text-sm leading-6 text-purple-700">
            「待人工核对」表示邮件 Provider
            可能已经接受发送请求，
            但系统未能确认本地最终状态。
            为避免客户收到重复邮件，
            此状态不会提供自动重试按钮。
            请先根据 Provider Message ID
            到邮件服务商后台确认实际发送结果。
          </p>
        </div>
      )}


      {/* =====================================
          Delivery Table
      ===================================== */}

      <div className="mt-8 overflow-hidden rounded-xl border bg-white">
        {emailItems.length ===
        0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-gray-700">
              当前没有 Email Delivery
            </p>

            <p className="mt-2 text-sm text-gray-500">
              客户通知开始通过 Email 发送后，
              投递记录会显示在这里。
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">
                    通知
                  </th>

                  <th className="px-4 py-3">
                    订单
                  </th>

                  <th className="px-4 py-3">
                    收件人
                  </th>

                  <th className="px-4 py-3">
                    状态
                  </th>

                  <th className="px-4 py-3">
                    尝试次数
                  </th>

                  <th className="px-4 py-3">
                    Provider ID
                  </th>

                  <th className="px-4 py-3">
                    最后尝试
                  </th>

                  <th className="px-4 py-3">
                    失败 / 异常原因
                  </th>

                  <th className="px-4 py-3">
                    操作
                  </th>
                </tr>
              </thead>


              <tbody className="divide-y">
                {emailItems.map(
                  item => {
                    const canRetry =
                      item.deliveryStatus ===
                        "failed" &&
                      item.attemptCount <
                        5;


                    return (
                      <tr
                        key={
                          `${item.notificationId}:${item.channel}`
                        }
                        className="align-top"
                      >
                        {/* Notification */}

                        <td className="min-w-56 px-4 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {
                              item.notificationTitle
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {
                              item.notificationType
                            }
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            通知建立：
                            {new Date(
                              item.createdAt
                            ).toLocaleString()}
                          </p>
                        </td>


                        {/* Order */}

                        <td className="px-4 py-4">
                          {item.orderId ? (
                            <Link
                              href={`/admin/orders/${item.orderId}`}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              查看订单
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-400">
                              —
                            </span>
                          )}
                        </td>


                        {/* Recipient */}

                        <td className="max-w-xs break-all px-4 py-4 text-sm text-gray-600">
                          {
                            item.recipient ??
                            "—"
                          }
                        </td>


                        {/* Status */}

                        <td className="px-4 py-4">
                          <span
                            className={`
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              px-2.5
                              py-1
                              text-xs
                              font-medium
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


                        {/* Attempts */}

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {
                            item.attemptCount
                          }
                          /5
                        </td>


                        {/* Provider Message ID */}

                        <td className="max-w-xs break-all px-4 py-4 text-xs text-gray-500">
                          {
                            item.providerMessageId ??
                            "—"
                          }
                        </td>


                        {/* Last Attempt */}

                        <td className="min-w-40 px-4 py-4 text-xs text-gray-500">
                          {item.lastAttemptAt
                            ? new Date(
                                item.lastAttemptAt
                              ).toLocaleString()
                            : "—"}
                        </td>


                        {/* Failure / Unknown Reason */}

                        <td className="max-w-sm px-4 py-4">
                          {item.failureReason ? (
                            <p
                              className={`
                                text-xs
                                leading-5
                                ${
                                  item.deliveryStatus ===
                                  "unknown"
                                    ? "text-purple-700"
                                    : "text-red-600"
                                }
                              `}
                            >
                              {
                                item.failureReason
                              }
                            </p>
                          ) : (
                            <span className="text-xs text-gray-400">
                              —
                            </span>
                          )}


                          {item.failedAt && (
                            <p className="mt-2 text-xs text-gray-400">
                              失败时间：
                              {new Date(
                                item.failedAt
                              ).toLocaleString()}
                            </p>
                          )}


                          {item.sentAt && (
                            <p className="mt-2 text-xs text-gray-400">
                              发送时间：
                              {new Date(
                                item.sentAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </td>


                        {/* Action */}

                        <td className="px-4 py-4">
                          {canRetry ? (
                            <RetryNotificationEmailButton
                              notificationId={
                                item.notificationId
                              }
                            />
                          ) : item.deliveryStatus ===
                            "unknown" ? (
                            <div className="max-w-40">
                              <p className="text-xs font-medium text-purple-700">
                                请人工核对
                              </p>

                              <p className="mt-1 text-xs leading-5 text-gray-400">
                                禁止直接重发
                              </p>
                            </div>
                          ) : item.deliveryStatus ===
                              "failed" &&
                            item.attemptCount >=
                              5 ? (
                            <div className="max-w-40">
                              <p className="text-xs font-medium text-red-700">
                                已达重试上限
                              </p>

                              <p className="mt-1 text-xs leading-5 text-gray-400">
                                请人工检查配置或 Provider
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
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
        )}
      </div>


      {/* =====================================
          Footer Notes
      ===================================== */}

      <div className="mt-6 rounded-xl bg-gray-50 p-5 text-sm leading-6 text-gray-600">
        <p>
          <strong>
            发送失败：
          </strong>{" "}
          Provider 明确返回失败，可以在修复原因后重试。
        </p>

        <p className="mt-2">
          <strong>
            待人工核对：
          </strong>{" "}
          Provider 可能已经接受邮件，但系统无法确认最终状态。
          为避免重复邮件，必须先人工核对。
        </p>

        <p className="mt-2">
          <strong>
            已发送：
          </strong>{" "}
          已取得 Provider Message ID，
          系统不会再次发送同一 Notification。
        </p>
      </div>
    </div>
  );
}