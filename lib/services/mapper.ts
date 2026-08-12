import type {
  Service,
} from "@/types/service";

export function normalizeService(
  data: any
): Service {
  return {
    id:
      data.id,

    slug:
      data.slug ?? "",

    title:
      data.title ?? "",

    shortDescription:
      data.short_description ??
      "",

    description:
      data.description ?? "",

    icon:
      data.icon ?? "📄",

    category:
      data.category ?? "",

    popular:
      Boolean(
        data.popular
      ),

    price:
      data.price ?? "",

    duration:
      data.duration ?? "",

    requirements:
      data.requirements
        ? String(
            data.requirements
          )
            .split(",")
            .map(
              (
                item: string
              ) =>
                item.trim()
            )
            .filter(Boolean)
        : [],

    formSchema:
      Array.isArray(
        data.form_schema
      )
        ? data.form_schema
        : [],

    isActive:
      data.is_active !==
      false,

    createdAt:
      data.created_at ??
      null,

    updatedAt:
      data.updated_at ??
      null,
  };
}