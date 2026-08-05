import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";

function normalizeService(data: any): Service {
    return {
      ...data,
      requirements: data.requirements
        ? data.requirements
            .split(",")
            .map((item: string) => item.trim())
        : [],
    };
  }

export async function getServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
    .order("title");

    if (error) {
        throw new Error(error.message);
    }

    return data.map(normalizeService);
}