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
    data: ServiceFormData
  ) {
    try {
      await createService(
        data
      );

      router.push(
        "/admin/services"
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