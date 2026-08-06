
import { supabase } from "@/lib/supabase";
import type { ServiceFormData } from "@/types/service";
import { toDatabase } from "./toDatabase";

export async function createService(
    formData: ServiceFormData) {
    const service = toDatabase(formData);

const { error } = await supabase.from("services").insert(service);

if (error) {
    throw new Error(error.message);
}

}