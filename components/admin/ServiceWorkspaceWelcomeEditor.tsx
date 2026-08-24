"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  updateServiceWorkspaceWelcomeMessage,
} from "@/lib/services/updateServiceWorkspaceWelcomeMessage";


interface Props {
  serviceId:
    string;

  initialMessage:
    string;

  workspaceRequired:
    boolean;
}


export default function ServiceWorkspaceWelcomeEditor({
  serviceId,
  initialMessage,
  workspaceRequired,
}: Props) {
  const router =
    useRouter();


  const [
    message,
    setMessage,
  ] =
    useState(
      initialMessage
    );


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    saved,
    setSaved,
  ] =
    useState(false);


  async function handleSave() {
    setLoading(
      true
    );

    setSaved(
      false
    );


    try {
      await updateServiceWorkspaceWelcomeMessage(
        serviceId,
        message
      );


      setSaved(
        true
      );


      router.refresh();

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "保存欢迎消息失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            自动首条服务消息
          </h2>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
            客户付款并建立订单服务空间后，
            系统会自动发送此消息作为第一条服务沟通。
            修改模板只影响以后尚未发送欢迎消息的 Workspace，
            不会修改已经发送给客户的历史消息。
          </p>
        </div>

        <span
          className={`
            inline-flex
            w-fit
            shrink-0
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            ${
              workspaceRequired
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }
          `}
        >
          {
            workspaceRequired
              ? "Workspace 已启用"
              : "Workspace 未启用"
          }
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {!workspaceRequired && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            当前服务没有启用 Workspace。
            可以预先保存消息模板，但只有启用 Workspace
            的订单才会自动发送。
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-slate-900">
            首条消息模板
          </label>

          <textarea
            value={
              message
            }
            onChange={
              event => {
                setMessage(
                  event.target.value
                );

                setSaved(
                  false
                );
              }
            }
            rows={
              12
            }
            maxLength={
              10000
            }
            placeholder={`例如：

  您好，我们已经收到您的服务订单。

  开始服务前，请确认已经准备好相关办理条件。

  下一步请按照订单服务空间中的指引继续操作。`}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          />

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              {
                message.length
              }
              /10000
            </p>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-sm font-semibold text-emerald-700">
                  已保存
                </span>
              )}

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  loading
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {
                  loading
                    ? "保存中..."
                    : "保存首条消息"
                }
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">
                安全提醒
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                欢迎消息不得要求客户提供银行密码、短信验证码、
                OTP、Token、CVV、账户登录密码或其他账户安全凭证。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
