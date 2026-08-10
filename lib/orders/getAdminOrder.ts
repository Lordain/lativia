import { createClient } from "@/lib/supabase/server";

export async function getAdminOrder(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      service_id,
      status,
      form_data,
      admin_note,
      created_at,
      updated_at,
      services (
        title,
        slug,
        form_schema
      ),
      profiles (
        name,
        phone
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}