"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  setAdminOrderMilestoneStatus,
} from "@/lib/workspaces/setAdminOrderMilestoneStatus";


interface Props {
  milestoneId:
    string;

  orderId:
    string;

  label:
    string;

  completed:
    boolean;

  disabled?:
    boolean;
}


export default function AdminMilestoneControl({
  milestoneId,
  orderId,
  label,
  completed,
  disabled = false,
}: Props) {
  const router =
    useRouter();


  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );


  async function handleUpdate() {
    if (
      loading ||
      disabled
    ) {
      return;
    }


    const nextCompleted =
      !completed;


    const confirmed =
      window.confirm(
        nextCompleted
          ? `确认将「${label}」标记为已完成吗？客户将可以看到这个进度更新。`
          : `确认将「${label}」恢复为待完成吗？客户页面上的完成状态也会同步恢复。`
      );


    if (!confirmed) {
      return;
    }


    setLoading(
      true
    );


    try {
      await setAdminOrderMilestoneStatus(
        milestoneId,
        orderId,
        nextCompleted
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
          : "更新服务进度失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <button
      type="button"
      onClick={
        handleUpdate
      }
      disabled={
        disabled ||
        loading
      }
      className={`
        rounded-lg
        border
        px-3
        py-2
        text-xs
        font-semibold
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          completed
            ? "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }
      `}
    >
      {loading
        ? "更新中..."
        : completed
          ? "恢复为待完成"
          : "确认完成"}
    </button>
  );
}