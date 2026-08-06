import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";

function normalizeService(data: any): Service {
  return {
    ...data,

    shortDescription: data.short_description,

    requirements: data.requirements
      ? data.requirements
          .split(",")
          .map((item: string) => item.trim())
      : [],
  };
}

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