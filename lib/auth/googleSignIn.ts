"use client";

import {
  createClient,
} from "@/lib/supabase/client";


interface GoogleSignInOptions {
  redirectTo?:
    string;
}


export async function signInWithGoogle(
  options:
    GoogleSignInOptions = {}
) {
  const supabase =
    createClient();

  const origin =
    window.location.origin;

  const destination =
    options.redirectTo ??
    "/account/orders";

  const callbackUrl =
    new URL(
      "/auth/callback",
      origin
    );

  callbackUrl
    .searchParams
    .set(
      "next",
      destination
    );

  const {
    data,
    error,
  } =
    await supabase
      .auth
      .signInWithOAuth({
        provider:
          "google",

        options: {
          redirectTo:
            callbackUrl
              .toString(),
        },
      });


  if (
    error
  ) {
    throw new Error(
      error.message
    );
  }


  return data;
}