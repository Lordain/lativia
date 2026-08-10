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

      amount,
      currency,
      payment_status,
      payment_method,
      payment_provider,
      paid_at,

      services (
        id,
        title,
        slug,
        form_schema
      ),

      profiles (
        id,
        name,
        phone
      ),

      payment_transactions (
        id,
        order_id,
        provider,
        provider_event_id,
        provider_session_id,
        provider_payment_id,
        amount,
        currency,
        status,
        created_at,
        updated_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getAdminOrder error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return null;
  }

  return data;
}