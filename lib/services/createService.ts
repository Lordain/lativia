import { supabase } from "@/lib/supabase";
import type { ServiceFormData } from "@/types/service";

export async function createService(formData: ServiceFormData) {
    const service = {
        ...formData,

        slug: formData.title.trim().toLowerCase().replace(/\s+/g, "-"),

        icon: "📄",

        category: "Other",

        popular: false,
    }

console.log(service);
}