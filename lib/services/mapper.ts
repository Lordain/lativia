import type { Service } from "@/types/service";

export function normalizeService(data: any): Service {
  return {
    ...data,

    shortDescription: data.short_description,

    requirements: data.requirements
      ? data.requirements
          .split(",")
          .map((item: string) => item.trim())
      : [],

    formSchema: data.form_schema ?? [],
  };
}