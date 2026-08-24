"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  sendEmailOtp,
  verifyEmailOtp,
} from "@/lib/auth/emailOtp";

import GoogleLoginButton from "@/components/auth/GoogleLoginButton";


interface Props {
  initialEmail?:
    string;

  onVerified:
    () => Promise<void>;

  onBeforeGoogleSignIn?:
    () =>
      | void
      | Promise<void>;
}


export default function SoftAuthGate({
  initialEmail = "",
  onVerified,
  onBeforeGoogleSignIn,
}: Props) {
  const [
    email,
    setEmail,
  ] =
    useState(
      initialEmail
        .trim()
        .toLowerCase()
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


  /*
   * 如果 Service Form 本身有 Email，
   * 自动作为 Soft Login 的预填值。
   *
   * 如果没有，例如 Cetes，
   * 用户可以直接在这里填写账户 Email。
   */
  useEffect(() => {
    if (
      step !==
      "email"
    ) {
      return;
    }

    const normalizedEmail =
      initialEmail
        .trim()
        .toLowerCase();

    if (
      normalizedEmail
    ) {
      setEmail(
        normalizedEmail
      );
    }
  }, [
    initialEmail,
    step,
  ]);


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
          shouldCreateUser:
            true,
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

    const normalizedToken =
      token
        .trim();

    if (
      !normalizedToken
    ) {
      setError(
        "请输入验证码"
      );

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
        normalizedToken
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

    <div className="mt-4">
      <GoogleLoginButton
        redirectTo="/auth/continue-order"
        beforeSignIn={
          onBeforeGoogleSignIn
        }
      />
    </div>


    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-blue-100" />

      <span className="text-xs font-medium text-slate-400">
        或使用 Email
      </span>

      <div className="h-px flex-1 bg-blue-100" />
    </div>


      {step ===
      "email" ? (
        <div className="mt-4">
          <label
            htmlFor="soft-auth-email"
            className="text-sm font-semibold text-slate-900"
          >
            Email
          </label>

          <input
            id="soft-auth-email"
            type="email"
            autoComplete="email"
            value={
              email
            }
            onChange={
              event => {
                setEmail(
                  event
                    .target
                    .value
                );

                setError(
                  null
                );
              }
            }
            placeholder="name@example.com"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {initialEmail && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              已根据您填写的服务资料自动预填，
              如有需要可以修改。
            </p>
          )}

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
          <div className="rounded-xl border border-blue-100 bg-white px-3 py-2.5">
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
            htmlFor="soft-auth-token"
            className="mt-4 block text-sm font-semibold text-slate-900"
          >
            邮箱验证码
          </label>

          <input
            id="soft-auth-token"
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
              !token.trim()
            }
            className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying
              ? "正在验证..."
              : "验证并继续"}
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
                ? "正在重新发送..."
                : "重新发送验证码"}
            </button>
          </div>
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
        这个 Email
        用于识别您的 Lativia
        账户和订单，不要求服务本身必须包含
        Email 资料字段。
      </p>
    </div>
  );
}