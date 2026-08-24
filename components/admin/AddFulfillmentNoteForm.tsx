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
    } catch (
      error
    ) {
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-bold text-slate-950">
          新增内部备注
        </h2>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
          用于记录人工处理、客户沟通、资料确认或其他运营信息。
          备注仅供管理员查看，不会显示给客户。
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="p-5 sm:p-6"
      >
        <textarea
          rows={
            4
          }
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
          placeholder="例如：已与客户确认资料内容，信息一致，可以继续办理。"
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            此内容属于内部运营记录。
          </p>

          <button
            type="submit"
            disabled={
              loading
            }
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
