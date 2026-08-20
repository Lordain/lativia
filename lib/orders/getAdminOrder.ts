import { createClient } from "@/lib/supabase/server";

interface AdminOrderService {
  id: string;
  title: string;
  slug: string;
  form_schema: unknown;
}

interface AdminOrderProfile {
  id: string;
  name: string | null;
  phone: string | null;
}

export async function getAdminOrder(
  id: string
) {
  const supabase =
    await createClient();

  const { data, error } =
    await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        service_id,

        service_option_id,
        service_option_snapshot,

        status,
        form_data,
        admin_note,

        data_purpose_ended_at,
        data_cleanup_due_at,
        data_cleanup_status,
        data_cleaned_at,
        data_cleanup_last_error,

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
    console.error(
      "getAdminOrder error:",
      {
        message:
          error.message,

        details:
          error.details,

        hint:
          error.hint,

        code:
          error.code,
      }
    );

    return null;
  }

  if (!data) {
    return null;
  }

  const service:
    AdminOrderService | null =
    Array.isArray(data.services)
      ? (
          data.services[0] ??
          null
        ) as AdminOrderService | null
      : (
          data.services ??
          null
        ) as AdminOrderService | null;

  const profile:
    AdminOrderProfile | null =
    Array.isArray(data.profiles)
      ? (
          data.profiles[0] ??
          null
        ) as AdminOrderProfile | null
      : (
          data.profiles ??
          null
        ) as AdminOrderProfile | null;

  return {
    ...data,

    services:
      service,

    profiles:
      profile,
  };
}