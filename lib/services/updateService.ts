import { supabase } from "@/lib/supabase";
import type { ServiceFormData } from "@/types/service";
import { toDatabase } from "./toDatabase";

export async function updateService(
  id: string,
  formData: ServiceFormData
) {
  const service = toDatabase(formData);

  const { error } = await supabase
    .from("services")
    .update(service)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}