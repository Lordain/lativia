import { createClient } from "@/lib/supabase/server";

export async function getAdminOrders() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      user_id,
      service_id,
      status,
      created_at,
      updated_at,
      services (
        title,
        slug
      ),
      profiles (
        name
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getAdminOrders error:", error);
    throw new Error(error.message);
  }

  return data ?? [];
}