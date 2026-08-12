"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  setServiceActive,
} from "@/lib/services/setServiceActive";

interface Props {
  id: string;

  active: boolean;
}

export default function ServiceActiveButton({
  id,
  active,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const router =
    useRouter();

  async function handleClick() {
    setLoading(true);

    try {
      await setServiceActive(
        id,
        !active
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "修改服务状态失败"
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
      disabled={loading}
      onClick={
        handleClick
      }
      className={`
        rounded-lg
        border
        px-3
        py-2
        text-sm
        font-medium
        transition
        disabled:opacity-50
        ${
          active
            ? "border-red-200 text-red-700 hover:bg-red-50"
            : "border-green-200 text-green-700 hover:bg-green-50"
        }
      `}
    >
      {loading
        ? "处理中..."
        : active
          ? "停用"
          : "启用"}
    </button>
  );
}