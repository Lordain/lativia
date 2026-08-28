"use server";

import {
  createHash,
} from "node:crypto";

import {
  headers,
} from "next/headers";

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


interface AdminLoginRateLimitContext {
  identifierHash:
    string;

  sourceHash:
    string;
}


function sha256(
  value:
    string
) {
  return createHash(
    "sha256"
  )
    .update(
      value
    )
    .digest(
      "hex"
    );
}


async function getAdminLoginRateLimitContext(
  username:
    string
): Promise<
  AdminLoginRateLimitContext
> {
  const requestHeaders =
    await headers();


  const forwardedFor =
    requestHeaders
      .get(
        "x-forwarded-for"
      )
      ?.split(
        ","
      )[0]
      ?.trim();


  const realIp =
    requestHeaders
      .get(
        "x-real-ip"
      )
      ?.trim();


  const userAgent =
    requestHeaders
      .get(
        "user-agent"
      )
      ?.trim() ??
    "unknown";


  /*
   * Vercel normally supplies x-forwarded-for.
   *
   * User-Agent is only used as a fallback so that
   * missing source headers do not put every request
   * into one global "unknown" bucket.
   */
  const source =
    forwardedFor ||
    realIp ||
    `unknown:${userAgent}`;


  return {
    identifierHash:
      sha256(
        username
      ),

    sourceHash:
      sha256(
        source
      ),
  };
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


  const rateLimitContext =
    await getAdminLoginRateLimitContext(
      username
    );


  const admin =
    createAdminClient();


  /*
   * ========================================
   * Admin Login Rate Limit
   * ========================================
   *
   * Rate limit is consumed BEFORE resolving
   * the username or calling Supabase Auth.
   *
   * This protects:
   *
   * - admin_login_identities
   * - profiles
   * - Supabase password authentication
   */

  const {
    data:
      retryAfterSeconds,

    error:
      rateLimitError,
  } =
    await admin.rpc(
      "consume_admin_login_attempt",
      {
        p_identifier_hash:
          rateLimitContext
            .identifierHash,

        p_source_hash:
          rateLimitContext
            .sourceHash,
      }
    );


  if (
    rateLimitError ||
    typeof retryAfterSeconds !==
      "number"
  ) {
    console.error(
      "Admin login rate limit check failed"
    );

    return {
      success:
        false,

      error:
        "登录暂时不可用，请稍后再试",
    };
  }


  if (
    retryAfterSeconds >
    0
  ) {
    return {
      success:
        false,

      error:
        "登录尝试过多，请稍后再试",
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


  /*
   * Successful login.
   *
   * Remove attempts for this username + source
   * so legitimate future logins do not accumulate
   * toward the rate limit.
   */

  const {
    error:
      clearRateLimitError,
  } =
    await admin.rpc(
      "clear_admin_login_attempts",
      {
        p_identifier_hash:
          rateLimitContext
            .identifierHash,

        p_source_hash:
          rateLimitContext
            .sourceHash,
      }
    );


  /*
   * Authentication already succeeded.
   *
   * Rate-limit cleanup must therefore never
   * invalidate the successful login.
   */
  if (
    clearRateLimitError
  ) {
    console.error(
      "Admin login rate limit cleanup failed"
    );
  }

  if (
    !clearRateLimitError
  ) {
    const {
      count:
        remainingAttempts,

      error:
        cleanupVerificationError,
    } =
      await admin
        .from(
          "admin_login_attempts"
        )
        .select(
          "id",
          {
            count:
              "exact",

            head:
              true,
          }
        )
        .eq(
          "identifier_hash",
          rateLimitContext
            .identifierHash
        )
        .eq(
          "source_hash",
          rateLimitContext
            .sourceHash
        );


    if (
      cleanupVerificationError
    ) {
      console.error(
        "Admin login rate limit cleanup verification failed"
      );

    } else if (
      remainingAttempts &&
      remainingAttempts >
        0
    ) {
      console.warn(
        "Admin login rate limit cleanup left matching attempts"
      );
    }
  }


  return {
    success:
      true,

    error:
      null,
  };
}