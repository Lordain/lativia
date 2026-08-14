"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  retryNotificationEmail,
} from "@/lib/notifications/retryNotificationEmail";


interface Props {
  notificationId:
    string;
}


export default function RetryNotificationEmailButton({
  notificationId,
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


  async function handleRetry() {
    if (loading) {
      return;
    }


    const confirmed =
      window.confirm(
        "确定重新发送这封 Email 吗？"
      );


    if (!confirmed) {
      return;
    }


    setLoading(
      true
    );


    try {
      await retryNotificationEmail(
        notificationId
      );


      alert(
        "Email 重试完成。"
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
          : "Email 重试失败"
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
        handleRetry
      }
      disabled={
        loading
      }
      className="
        rounded-lg
        border
        border-orange-300
        bg-white
        px-3
        py-2
        text-xs
        font-medium
        text-orange-700
        transition
        hover:bg-orange-50
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading
        ? "重试中..."
        : "重试 Email"}
    </button>
  );
}