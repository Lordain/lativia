import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";
import { normalizeService } from "./mapper";


export async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return normalizeService(data);
}