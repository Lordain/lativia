import { createClient } from "@/lib/supabase/server";

export async function getMyOrder(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      payment_status,
      amount,
      currency,
      payment_method,
      payment_provider,
      paid_at,
      created_at,
      updated_at,
      form_data,

      eligibility_acknowledgements,
      eligibility_confirmed_at,

      service_option_id,
      service_option_snapshot,

      data_purpose_ended_at,
      data_cleanup_due_at,
      data_cleanup_status,
      data_cleaned_at,
      data_cleanup_last_error,

      service_id,

      services (
        title,
        slug,
        form_schema
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(
      "getMyOrder error:",
      error.message
    );

    return null;
  }

  if (!data) {
    return null;
  }

  return {
    ...data,

    services: Array.isArray(
      data.services
    )
      ? data.services[0] ?? null
      : data.services,
  };
}