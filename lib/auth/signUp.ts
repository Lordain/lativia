import { supabase } from "@/lib/supabase";
import type { RegisterFormData } from "@/types/auth";

export async function signUp(data: RegisterFormData) {
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email: data.email,
      password: data.password,

      options: {
        data: {
          name: data.name,
          phone: data.phone || null,
        },
      },
    });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("用户建立失败");
  }

  return authData.user;
}