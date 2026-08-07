import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";
import { normalizeService } from "./mapper";


export async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

    if (error) {
      console.error("getService Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    
      return null;
    }
    
    if (!data) {
      console.error("getService: service not found:", slug);
      return null;
    }

  return normalizeService(data);
}