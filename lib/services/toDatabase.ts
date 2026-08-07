import type { ServiceFormData } from "@/types/service";
import type { FormFieldSchema } from "@/types/form";

export function toDatabase(
  formData: ServiceFormData
) {
  return {

    title: formData.title,

    short_description:
      formData.shortDescription,

    description:
      formData.description,

    price:
      formData.price,

    duration:
      formData.duration,

    requirements:
      formData.requirements,

    slug:
      formData.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),

    form_schema:[]

  };
}