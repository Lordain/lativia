"use client";

import {
  useRouter,
} from "next/navigation";

import ServiceForm from "./ServiceForm";

import {
  createService,
} from "@/lib/services/createService";

import type {
  ServiceFormData,
} from "@/types/service";

export default function CreateServiceContainer() {
  const router =
    useRouter();

  async function handleSubmit(
    data:
      ServiceFormData
  ) {
    try {
      const result =
        await createService(
          data
        );

      /*
       * 创建 Service 后不返回列表。
       *
       * 直接进入该 Service 编辑页，
       * 继续配置付款方式。
       */

      router.push(
        `/admin/services/${result.id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "新增服务失败"
      );
    }
  }

  return (
    <ServiceForm
      onSubmit={
        handleSubmit
      }
    />
  );
}