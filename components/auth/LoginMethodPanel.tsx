"use client";

import {
  useState,
} from "react";

import LoginForm from "@/components/auth/LoginForm";
import EmailOtpLogin from "@/components/auth/EmailOtpLogin";


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