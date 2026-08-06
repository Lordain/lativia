"use client";

import ServiceForm from "./ServiceForm";
import { createService } from "@/lib/services/createService";
import type { ServiceFormData } from "@/types/service";
import { useRouter } from "next/navigation";

export default function CreateServiceContainer() {

    const router = useRouter();

    async function handleSubmit(data: ServiceFormData) {
        try {
          await createService(data);
      
          router.push("/admin/services");
          router.refresh();
        } catch (error) {
          console.error(error);
      
          alert(
            error instanceof Error
              ? error.message
              : "发生未知错误"
          );
        }
      }

    return (
        <ServiceForm initialData={undefined} onSubmit={handleSubmit} />
    );
}