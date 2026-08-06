import { supabase } from "@/lib/supabase";
import type { ServiceFormData } from "@/types/service";

export async function updateService(
  id: string,
  formData: ServiceFormData
) {
  const service = {
    title: formData.title,

    short_description:
      formData.shortDescription,

    description: formData.description,

    price: formData.price,

    duration: formData.duration,

    requirements: formData.requirements,

    slug: formData.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-"),
  };

  const { error } = await supabase
    .from("services")
    .update(service)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}