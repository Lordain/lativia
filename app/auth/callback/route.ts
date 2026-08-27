import {
    NextResponse,
  } from "next/server";

  import {
    createClient,
  } from "@/lib/supabase/server";


  function getSafeNextPath(
    value:
      string | null
  ) {
    const fallback =
      "/account/orders";


    if (!value) {
      return fallback;
    }


    try {
      const safeOrigin =
        "https://lativia.local";

      const parsed =
        new URL(
          value,
          safeOrigin
        );


      if (
        parsed.origin !==
        safeOrigin
      ) {
        return fallback;
      }


      if (
        !parsed.pathname.startsWith(
          "/"
        )
      ) {
        return fallback;
      }


      return (
        parsed.pathname +
        parsed.search +
        parsed.hash
      );
    } catch {
      return fallback;
    }
  }


  export async function GET(
    request:
      Request
  ) {
    const requestUrl =
      new URL(
        request.url
      );

    const code =
      requestUrl
        .searchParams
        .get(
          "code"
        );

    const next =
      getSafeNextPath(
        requestUrl
          .searchParams
          .get(
            "next"
          )
      );


    if (
      !code
    ) {
      const errorUrl =
        new URL(
          "/auth/login",
          requestUrl.origin
        );

      errorUrl
        .searchParams
        .set(
          "error",
          "oauth_callback_failed"
        );

      return NextResponse.redirect(
        errorUrl
      );
    }


    const supabase =
      await createClient();


    const {
      error,
    } =
      await supabase
        .auth
        .exchangeCodeForSession(
          code
        );


    if (
      error
    ) {
      console.error(
        "Google OAuth callback error:",
        error
      );

      const errorUrl =
        new URL(
          "/auth/login",
          requestUrl.origin
        );

      errorUrl
        .searchParams
        .set(
          "error",
          "oauth_callback_failed"
        );

      return NextResponse.redirect(
        errorUrl
      );
    }


    return NextResponse.redirect(
      new URL(
        next,
        requestUrl.origin
      )
    );
  }