import { supabase } from "@/lib/supabase";

export async function deleteService(id: string) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}