import { supabase } from "@/lib/supabase";
import type { RegisterFormData } from "@/types/auth";

export async function signUp(data: RegisterFormData) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData.user;
}