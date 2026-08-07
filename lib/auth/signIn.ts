import { supabase } from "@/lib/supabase";
import type { LoginFormData } from "@/types/auth";

export async function signIn(data: LoginFormData) {
  const { data: authData, error } =
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

  if (error) {
    throw new Error(error.message);
  }

  return authData.user;
}