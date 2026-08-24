"use client";

import {
  useState,
} from "react";

import LoginForm from "@/components/auth/LoginForm";
import EmailOtpLogin from "@/components/auth/EmailOtpLogin";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export default function LoginMethodPanel() {
  const [
    method,
    setMethod,
  ] =
    useState<
      "password" |
      "otp"
    >(
      "password"
    );


  return (
    <div>
        <GoogleLoginButton />

            <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs font-medium text-slate-400">
                或使用 Email
            </span>

            <div className="h-px flex-1 bg-slate-200" />
            </div>
      <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() =>
            setMethod(
              "password"
            )
          }
          className={[
            "rounded-lg px-3 py-2 text-sm font-semibold transition",
            method ===
            "password"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800",
          ].join(
            " "
          )}
        >
          密码登录
        </button>

        <button
          type="button"
          onClick={() =>
            setMethod(
              "otp"
            )
          }
          className={[
            "rounded-lg px-3 py-2 text-sm font-semibold transition",
            method ===
            "otp"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-500 hover:text-slate-800",
          ].join(
            " "
          )}
        >
          邮箱验证码
        </button>
      </div>


      {method ===
      "password" ? (
        <LoginForm />
      ) : (
        <EmailOtpLogin />
      )}
    </div>
  );
}