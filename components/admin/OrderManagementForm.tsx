"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { OrderStatus } from "@/types/order";
import { updateAdminOrder } from "@/lib/orders/updateAdminOrder";

interface Props {
  orderId: string;
  initialStatus: OrderStatus;
  initialAdminNote: string | null;
}

export default function OrderManagementForm({
  orderId,
  initialStatus,
  initialAdminNote,
}: Props) {
  const router = useRouter();

  const [status, setStatus] =
    useState<OrderStatus>(initialStatus);

  const [adminNote, setAdminNote] =
    useState(initialAdminNote ?? "");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      await updateAdminOrder(orderId, {
        status,
        adminNote,
      });

      alert("订单已更新");

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "更新失败"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 space-y-6 rounded-lg border p-6"
    >
      <div>
        <label className="mb-2 block font-medium">
          订单状态
        </label>

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as OrderStatus
            )
          }
          className="w-full rounded-lg border p-3"
        >
          <option value="pending">
            等待处理
          </option>

          <option value="processing">
            办理中
          </option>

          <option value="waiting_documents">
            等待补件
          </option>

          <option value="completed">
            已完成
          </option>

          <option value="cancelled">
            已取消
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium">
          管理员备注
        </label>

        <textarea
          rows={5}
          value={adminNote}
          onChange={(e) =>
            setAdminNote(e.target.value)
          }
          placeholder="填写内部处理备注..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          rounded-lg
          bg-blue-600
          px-6
          py-3
          text-white
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? "保存中..." : "保存修改"}
      </button>
    </form>
  );
}