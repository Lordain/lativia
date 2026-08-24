"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/auth/emailOtp";


export default function EmailOtpLogin() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] =
    useState(
      ""
    );

  const [
    token,
    setToken,
  ] =
    useState(
      ""
    );

  const [
    step,
    setStep,
  ] =
    useState<
      "email" |
      "otp"
    >(
      "email"
    );

  const [
    sending,
    setSending,
  ] =
    useState(
      false
    );

  const [
    verifying,
    setVerifying,
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


  async function handleSendOtp() {
    if (
      sending
    ) {
      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (
      !normalizedEmail
    ) {
      setError(
        "请输入电子邮箱"
      );

      return;
    }

    setSending(
      true
    );

    setError(
      null
    );

    try {
      await sendEmailOtp(
        normalizedEmail,
        {
          /*
           * 登录页面不负责创建新账号。
           * 新用户仍通过注册页或服务下单 Soft Login 建立账号。
           */
          shouldCreateUser:
            false,
        }
      );

      setEmail(
        normalizedEmail
      );

      setStep(
        "otp"
      );

    } catch (
      currentError
    ) {
      console.error(
        currentError
      );

      setError(
        currentError instanceof Error
          ? currentError.message
          : "验证码发送失败"
      );

    } finally {
      setSending(
        false
      );
    }
  }


  async function handleVerifyOtp() {
    if (
      verifying
    ) {
      return;
    }

    setVerifying(
      true
    );

    setError(
      null
    );

    try {
      await verifyEmailOtp(
        email,
        token
      );

      router.push(
        "/account/orders"
      );

      router.refresh();

    } catch (
      currentError
    ) {
      console.error(
        currentError
      );

      setError(
        currentError instanceof Error
          ? currentError.message
          : "邮箱验证失败"
      );

    } finally {
      setVerifying(
        false
      );
    }
  }


  if (
    step ===
    "email"
  ) {
    return (
      <div>
        <label
          htmlFor="otp-email"
          className="text-sm font-medium text-slate-900"
        >
          Email
        </label>

        <input
          id="otp-email"
          type="email"
          autoComplete="email"
          value={
            email
          }
          onChange={
            event =>
              setEmail(
                event
                  .target
                  .value
              )
          }
          placeholder="name@example.com"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="button"
          onClick={
            handleSendOtp
          }
          disabled={
            sending
          }
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending
            ? "正在发送..."
            : "发送邮箱验证码"}
        </button>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
            {
              error
            }
          </p>
        )}

        <p className="mt-3 text-xs leading-5 text-slate-400">
          此方式仅用于已有账号登录。
          如果您还没有 Lativia
          账号，请先创建账号，
          或直接在购买服务时完成邮箱验证。
        </p>
      </div>
    );
  }


  return (
    <div>
      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
        <p className="text-xs text-slate-400">
          验证码已发送至
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {
            email
          }
        </p>
      </div>


      <label
        htmlFor="otp-code"
        className="mt-4 block text-sm font-medium text-slate-900"
      >
        邮箱验证码
      </label>

      <input
        id="otp-code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={
          token
        }
        onChange={
          event =>
            setToken(
              event
                .target
                .value
                .replace(
                  /\D/g,
                  ""
                )
            )
        }
        placeholder="请输入验证码"
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.25em] text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />


      <button
        type="button"
        onClick={
          handleVerifyOtp
        }
        disabled={
          verifying ||
          token.length ===
            0
        }
        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {verifying
          ? "正在验证..."
          : "验证并登录"}
      </button>


      <div className="mt-3 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            setStep(
              "email"
            );

            setToken(
              ""
            );

            setError(
              null
            );
          }}
          className="text-xs font-semibold text-slate-500 transition hover:text-slate-800"
        >
          修改 Email
        </button>

        <button
          type="button"
          onClick={
            handleSendOtp
          }
          disabled={
            sending
          }
          className="text-xs font-semibold text-blue-700 transition hover:text-blue-800 disabled:opacity-50"
        >
          {sending
            ? "正在发送..."
            : "重新发送"}
        </button>
      </div>


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