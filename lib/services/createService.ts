
import { supabase } from "@/lib/supabase";
import type { ServiceFormData } from "@/types/service";

export async function createService(
    formData: ServiceFormData) {
    const service = {
        title: formData.title,
        short_description: formData.shortDescription,
        description: formData.description,
        price: formData.price,
        duration: formData.duration,
        requirements: formData.requirements,

        slug: formData.title.trim().toLowerCase().replace(/\s+/g, "-"),

        icon: "📄",

        category: "Other",

        popular: false,
    }

const { error } = await supabase.from("services").insert(service);

if (error) {
    throw new Error(error.message);
}

}