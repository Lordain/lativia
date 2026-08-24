"use client";

import {
  useState,
} from "react";

import {
  signInWithGoogle,
} from "@/lib/auth/googleSignIn";


interface Props {
    redirectTo?:
      string;
  
    beforeSignIn?:
      () =>
        | void
        | Promise<void>;
  }


  export default function GoogleLoginButton({
    redirectTo =
      "/account/orders",
  
    beforeSignIn,
  }: Props) {
  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );


  async function handleClick() {
    if (
      loading
    ) {
      return;
    }

    setLoading(
      true
    );

    setError(
      null
    );

    try {
        if (
          beforeSignIn
        ) {
          await beforeSignIn();
        }
      
        await signInWithGoogle({
          redirectTo,
        });

    } catch (
      currentError
    ) {
      console.error(
        currentError
      );

      setError(
        currentError instanceof Error
          ? currentError.message
          : "Google 登录失败，请稍后再试"
      );

      setLoading(
        false
      );
    }
  }


  return (
    <div>
      <button
        type="button"
        onClick={
          handleClick
        }
        disabled={
          loading
        }
        className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path
            fill="#4285F4"
            d="M21.6 12.23c0-.71-.06-1.39-.18-2.04H12v3.86h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z"
          />

          <path
            fill="#34A853"
            d="M12 22c2.7 0 4.97-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z"
          />

          <path
            fill="#FBBC05"
            d="M6.39 13.9A6.02 6.02 0 0 1 6.08 12c0-.66.11-1.3.31-1.9V7.51H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.49l3.35-2.59Z"
          />

          <path
            fill="#EA4335"
            d="M12 5.97c1.47 0 2.79.51 3.83 1.5l2.87-2.88C16.96 2.97 14.7 2 12 2a10 10 0 0 0-8.96 5.51L6.39 10.1C7.18 7.73 9.39 5.97 12 5.97Z"
          />
        </svg>

        <span>
          {loading
            ? "正在连接 Google..."
            : "使用 Google 继续"}
        </span>
      </button>


      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          {
            error
          }
        </p>
      )}
    </div>
  );
}