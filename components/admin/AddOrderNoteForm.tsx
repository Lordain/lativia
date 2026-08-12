"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  addAdminOrderNote,
} from "@/lib/orders/addAdminOrderNote";

interface Props {
  orderId: string;
}

export default function AddOrderNoteForm({
  orderId,
}: Props) {
  const router =
    useRouter();

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

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!note.trim()) {
      alert(
        "请输入内部备注"
      );

      return;
    }

    setLoading(true);

    try {
      await addAdminOrderNote(
        orderId,
        note
      );

      setNote("");

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "新增备注失败"
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      <h2 className="text-xl font-semibold">
        新增内部备注
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        仅供管理员查看，不会显示给客户。
      </p>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-4"
      >
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
          placeholder="填写处理进度、客户沟通或其他内部信息..."
          className="w-full rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={
            loading
          }
          className="
            mt-3
            rounded-lg
            border
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            transition
            hover:bg-gray-50
            disabled:opacity-60
          "
        >
          {loading
            ? "保存中..."
            : "新增备注"}
        </button>
      </form>
    </section>
  );
}