"use client";

import {
  useRouter,
} from "next/navigation";

import ServiceForm from "./ServiceForm";

import {
  updateService,
} from "@/lib/services/updateService";

import type {
  ServiceFormData,
} from "@/types/service";

interface Props {
  id: string;

  initialData:
    ServiceFormData;
}

export default function EditServiceContainer({
  id,
  initialData,
}: Props) {
  const router =
    useRouter();

  async function handleSubmit(
    data:
      ServiceFormData
  ) {
    try {
      await updateService(
        id,
        data
      );

      /*
       * 不跳回列表。
       *
       * 保存后刷新当前页面，
       * Admin 可以继续配置付款方式。
       */

      router.refresh();

      alert(
        "服务资料已更新"
      );
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "更新服务失败"
      );
    }
  }

  return (
    <ServiceForm
      initialData={
        initialData
      }
      onSubmit={
        handleSubmit
      }
    />
  );
}