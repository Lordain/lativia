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
    <section className="mt-6 rounded-xl border bg-white p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Workspace Welcome Message
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            自动首条服务消息
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
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
            rounded-full
            px-3
            py-1
            text-xs
            font-medium
            ${
              workspaceRequired
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
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


      {!workspaceRequired && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
          当前服务没有启用 Workspace。
          可以预先保存模板，但只有启用 Workspace
          的订单才会自动发送。
        </div>
      )}


      <div className="mt-5">
        <label className="text-sm font-medium text-gray-800">
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

          className="
            mt-2
            w-full
            rounded-xl
            border
            border-gray-300
            p-4
            text-sm
            leading-6
            outline-none
            focus:border-purple-500
            focus:ring-2
            focus:ring-purple-100
          "
        />


        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            {
              message.length
            }
            /10000
          </p>


          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-sm font-medium text-green-700">
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

              className="
                rounded-lg
                bg-purple-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-purple-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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


      <div className="mt-5 rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-700">
          安全提醒
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          欢迎消息不得要求客户提供银行密码、短信验证码、
          OTP、Token、CVV、账户登录密码或其他账户安全凭证。
        </p>
      </div>
    </section>
  );
}