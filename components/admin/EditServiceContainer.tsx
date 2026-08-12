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
    data: ServiceFormData
  ) {
    try {
      await updateService(
        id,
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