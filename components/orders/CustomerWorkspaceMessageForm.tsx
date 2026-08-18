"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  sendCustomerWorkspaceMessage,
} from "@/lib/workspaces/sendCustomerWorkspaceMessage";


interface Props {
  workspaceId:
    string;

  disabled?:
    boolean;
}


export default function CustomerWorkspaceMessageForm({
  workspaceId,
  disabled = false,
}: Props) {
  const router =
    useRouter();


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    if (!message.trim()) {
      return;
    }


    setLoading(
      true
    );


    try {
      await sendCustomerWorkspaceMessage(
        workspaceId,
        message
      );


      setMessage(
        ""
      );


      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "发送消息失败"
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-4"
    >
      <textarea
        value={
          message
        }

        onChange={
          event =>
            setMessage(
              event.target.value
            )
        }

        disabled={
          disabled ||
          loading
        }

        rows={
          3
        }

        maxLength={
          10000
        }

        placeholder="输入您的回复..."

        className="
          w-full
          rounded-xl
          border
          border-gray-300
          p-3
          text-sm
          leading-6
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
          disabled:bg-gray-100
        "
      />


      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-xs leading-5 text-gray-500">
          请勿发送银行密码、短信验证码、OTP、Token、CVV
          或其他账户安全凭证。
        </p>


        <button
          type="submit"

          disabled={
            disabled ||
            loading ||
            !message.trim()
          }

          className="
            shrink-0
            rounded-lg
            bg-blue-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {
            loading
              ? "发送中..."
              : "发送回复"
          }
        </button>
      </div>
    </form>
  );
}