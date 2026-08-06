import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";
import { normalizeService } from "./mapper";

export async function getServiceById(
  id: string
): Promise<Service | null> {

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return normalizeService(data);
}