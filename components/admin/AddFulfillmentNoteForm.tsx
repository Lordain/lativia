"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  addAdminFulfillmentNote,
} from "@/lib/fulfillments/addAdminFulfillmentNote";

interface Props {
  fulfillmentId:
    string;
}

export default function AddFulfillmentNoteForm({
  fulfillmentId,
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

    const cleanNote =
      note.trim();

    if (!cleanNote) {
      alert(
        "请输入内部备注"
      );

      return;
    }

    setLoading(
      true
    );

    try {
      await addAdminFulfillmentNote(
        fulfillmentId,
        cleanNote
      );

      setNote(
        ""
      );

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
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Internal Note
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          新增内部备注
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          用于记录人工处理、客户沟通、
          资料确认或其他运营信息。
          备注仅供管理员查看，不会显示给客户。
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="mt-5"
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
              event
                .target
                .value
            )
          }
          placeholder="例如：已通过 WhatsApp 与客户确认护照号码，资料一致，可以继续办理。"
          className="
            w-full
            rounded-lg
            border
            bg-white
            p-3
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          "
        />

        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            此内容属于内部运营记录。
          </p>

          <button
            type="submit"
            disabled={
              loading
            }
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
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "保存中..."
              : "新增备注"}
          </button>
        </div>
      </form>
    </section>
  );
}