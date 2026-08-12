"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  updateAdminOrder,
} from "@/lib/orders/updateAdminOrder";

import type {
  OrderStatus,
} from "@/types/order";

interface Props {
  orderId: string;

  initialStatus:
    OrderStatus;
}

const STATUS_LABELS:
  Record<
    OrderStatus,
    string
  > = {
    pending:
      "待处理",

    processing:
      "处理中",

    waiting_documents:
      "等待补件",

    completed:
      "已完成",

    cancelled:
      "已取消",
  };

function getAllowedStatuses(
  current:
    OrderStatus
): OrderStatus[] {
  switch (current) {
    case "pending":
      return [
        "pending",
        "processing",
        "cancelled",
      ];

    case "processing":
      return [
        "processing",
        "waiting_documents",
        "completed",
        "cancelled",
      ];

    case "waiting_documents":
      return [
        "waiting_documents",
        "processing",
        "cancelled",
      ];

    case "completed":
      return [
        "completed",
      ];

    case "cancelled":
      return [
        "cancelled",
      ];

    default:
      return [
        current,
      ];
  }
}

export default function OrderManagementForm({
  orderId,
  initialStatus,
}: Props) {
  const router =
    useRouter();

  const [
    status,
    setStatus,
  ] =
    useState<OrderStatus>(
      initialStatus
    );

  const [
    note,
    setNote,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const allowedStatuses =
    getAllowedStatuses(
      initialStatus
    );

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    try {
      await updateAdminOrder(
        orderId,
        {
          status,
          note,
        }
      );

      setNote("");

      alert(
        "订单已更新"
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "更新订单失败"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  const locked =
    initialStatus ===
      "completed" ||
    initialStatus ===
      "cancelled";

  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">
          订单处理
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          更新订单处理状态。付款状态由支付系统自动维护。
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 space-y-5"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            订单状态
          </label>

          <select
            value={
              status
            }
            disabled={
              locked
            }
            onChange={(
              event
            ) =>
              setStatus(
                event
                  .target
                  .value as
                  OrderStatus
              )
            }
            className="
              w-full
              rounded-lg
              border
              bg-white
              p-3
              disabled:bg-gray-50
              disabled:text-gray-500
            "
          >
            {allowedStatuses.map(
              (
                option
              ) => (
                <option
                  key={
                    option
                  }
                  value={
                    option
                  }
                >
                  {
                    STATUS_LABELS[
                      option
                    ]
                  }
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            本次操作备注
          </label>

          <textarea
            rows={4}
            value={
              note
            }
            onChange={(
              event
            ) =>
              setNote(
                event.target
                  .value
              )
            }
            placeholder="例如：资料已确认，开始办理..."
            className="w-full rounded-lg border p-3"
          />

          <p className="mt-2 text-xs text-gray-500">
            备注会记录在订单操作历史中。
          </p>
        </div>

        {locked ? (
          <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
            此订单已经
            {initialStatus ===
            "completed"
              ? "完成"
              : "取消"}
            ，状态已锁定。
          </div>
        ) : (
          <button
            type="submit"
            disabled={
              loading
            }
            className="
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "保存中..."
              : "更新订单"}
          </button>
        )}
      </form>
    </section>
  );
}