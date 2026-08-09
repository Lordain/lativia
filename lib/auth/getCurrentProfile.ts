import { createClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("getCurrentProfile user:", user);
  console.log("getCurrentProfile userError:", userError);

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      name,
      phone,
      role,
      created_at
    `)
    .eq("id", user.id)
    .single();

  console.log("getCurrentProfile profile:", data);
  console.log("getCurrentProfile profileError:", error);

  if (error) {
    return null;
  }

  return data;
}