"use server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createClient,
} from "@/lib/supabase/server";


interface AdminSignInInput {
  username:
    string;

  password:
    string;
}


interface AdminSignInResult {
  success:
    boolean;

  error:
    string | null;
}


export async function signInAdmin(
  input:
    AdminSignInInput
): Promise<AdminSignInResult> {
  const username =
    input.username
      .trim()
      .toLowerCase();

  const password =
    input.password;


  if (
    !username ||
    !password
  ) {
    return {
      success:
        false,

      error:
        "请输入管理员用户名和密码",
    };
  }


  /*
   * ========================================
   * Resolve Admin Identity
   * ========================================
   *
   * Username -> Auth user_id
   *
   * This lookup uses the server-only
   * Supabase admin client.
   */

  const admin =
    createAdminClient();


  const {
    data:
      identity,

    error:
      identityError,
  } =
    await admin
      .from(
        "admin_login_identities"
      )
      .select(`
        user_id
      `)
      .eq(
        "username",
        username
      )
      .maybeSingle();


  if (
    identityError ||
    !identity
  ) {
    return {
      success:
        false,

      error:
        "管理员用户名或密码错误",
    };
  }


  /*
   * ========================================
   * Verify Admin Role
   * ========================================
   */

  const {
    data:
      profile,

    error:
      profileError,
  } =
    await admin
      .from(
        "profiles"
      )
      .select(`
        role
      `)
      .eq(
        "id",
        identity.user_id
      )
      .maybeSingle();


  if (
    profileError ||
    !profile ||
    profile.role !==
      "admin"
  ) {
    return {
      success:
        false,

      error:
        "管理员用户名或密码错误",
    };
  }


  /*
   * ========================================
   * Resolve Internal Supabase Auth Email
   * ========================================
   *
   * Email is never requested from the Admin
   * login interface.
   */

  const {
    data:
      authUserResult,

    error:
      authUserError,
  } =
    await admin
      .auth
      .admin
      .getUserById(
        identity.user_id
      );


  const email =
    authUserResult
      .user
      ?.email
      ?.trim();


  if (
    authUserError ||
    !email
  ) {
    return {
      success:
        false,

      error:
        "管理员用户名或密码错误",
    };
  }


  /*
   * ========================================
   * Supabase Password Authentication
   * ========================================
   *
   * Password verification and session
   * creation remain fully managed by
   * Supabase Auth.
   */

  const supabase =
    await createClient();


  const {
    error:
      signInError,
  } =
    await supabase
      .auth
      .signInWithPassword({
        email,
        password,
      });


  if (
    signInError
  ) {
    return {
      success:
        false,

      error:
        "管理员用户名或密码错误",
    };
  }


  return {
    success:
      true,

    error:
      null,
  };
}