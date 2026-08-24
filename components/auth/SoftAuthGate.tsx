"use client";

import {
  useState,
} from "react";

import {
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/auth/emailOtp";


interface Props {
  email:
    string;

  onVerified:
    () => Promise<void>;
}


export default function SoftAuthGate({
  email,
  onVerified,
}: Props) {
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
    token,
    setToken,
  ] =
    useState(
      ""
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

    setSending(
      true
    );

    setError(
      null
    );

    try {
      await sendEmailOtp(
        email,
        {
          shouldCreateUser:
            true,
        }
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

      await onVerified();

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


  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-950">
            验证邮箱后继续
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            为了将订单保存到您的账户，
            请先完成一次邮箱验证。
            无需先创建密码。
          </p>
        </div>
      </div>


      {step ===
      "email" ? (
        <div className="mt-4">
          <div className="rounded-xl border border-blue-100 bg-white px-3 py-2.5">
            <p className="text-xs text-slate-400">
              验证邮箱
            </p>

            <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
              {email}
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleSendOtp
            }
            disabled={
              sending ||
              !email.trim()
            }
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending
              ? "正在发送..."
              : "发送邮箱验证码"}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <label className="text-sm font-semibold text-slate-900">
            邮箱验证码
          </label>

          <input
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
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying
              ? "正在验证..."
              : "验证并继续"}
          </button>

          <button
            type="button"
            onClick={
              handleSendOtp
            }
            disabled={
              sending
            }
            className="mt-3 w-full text-center text-xs font-semibold text-blue-700 transition hover:text-blue-800 disabled:opacity-50"
          >
            {sending
              ? "正在重新发送..."
              : "没有收到？重新发送验证码"}
          </button>
        </div>
      )}


      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700">
          {
            error
          }
        </p>
      )}


      <p className="mt-3 text-xs leading-5 text-slate-500">
        已有 Lativia
        账号也可以使用同一个邮箱验证码继续，
        不需要先输入密码。
      </p>
    </div>
  );
}