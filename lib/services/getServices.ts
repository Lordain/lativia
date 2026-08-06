import { supabase } from "@/lib/supabase";
import type { Service } from "@/types/service";
import { normalizeService } from "./mapper";

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