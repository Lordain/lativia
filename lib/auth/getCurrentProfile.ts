import {
  createClient,
} from "@/lib/supabase/server";


export async function getCurrentProfile() {
  const supabase =
    await createClient();


  const {
    data: {
      user,
    },

    error:
      userError,
  } =
    await supabase.auth.getUser();


  if (
    userError ||
    !user
  ) {
    return null;
  }


  const {
    data,
    error,
  } =
    await supabase
      .from(
        "profiles"
      )
      .select(`
        id,
        name,
        phone,
        role,
        created_at
      `)
      .eq(
        "id",
        user.id
      )
      .single();


  if (
    error ||
    !data
  ) {
    return null;
  }


  return data;
}