import type {
  ServiceFormData,
} from "@/types/service";

export function toDatabase(
  formData: ServiceFormData
) {
  return {
    slug:
      formData.slug
        .trim()
        .toLowerCase(),

    title:
      formData.title.trim(),

    short_description:
      formData
        .shortDescription
        .trim(),

    description:
      formData
        .description
        .trim(),

    category:
      formData.category.trim(),

    icon:
      formData.icon.trim(),

    price:
      formData.price.trim(),

    duration:
      formData.duration.trim(),

    requirements:
      formData.requirements
        .split(",")
        .map(
          (item) =>
            item.trim()
        )
        .filter(Boolean)
        .join(", "),

    popular:
      formData.popular,

    is_active:
      formData.isActive,
  };
}