import { supabase } from "@/lib/supabase";

export async function getServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
    .order("title");

    if (error) {
        throw new Error(error.message);
    }

    return data;
}