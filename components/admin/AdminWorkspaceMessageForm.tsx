"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  sendAdminWorkspaceMessage,
} from "@/lib/workspaces/sendAdminWorkspaceMessage";


interface Props {
  workspaceId:
    string;

  disabled?:
    boolean;
}


export default function AdminWorkspaceMessageForm({
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


    const cleanMessage =
      message.trim();


    if (!cleanMessage) {
      return;
    }


    setLoading(
      true
    );


    try {
      await sendAdminWorkspaceMessage(
        workspaceId,
        cleanMessage
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
          4
        }

        maxLength={
          10000
        }

        placeholder="例如：请完成 Cetesdirecto 账户注册，完成后在这里回复我们。"

        className="
          w-full
          rounded-lg
          border
          border-gray-300
          p-3
          text-sm
          leading-6
          outline-none
          focus:border-purple-500
          focus:ring-2
          focus:ring-purple-100
          disabled:bg-gray-100
        "
      />


      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-xs leading-5 text-gray-500">
          此消息客户可以看到。
          请不要发送内部备注，也不要索取密码、OTP、Token、CVV
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
            bg-purple-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            hover:bg-purple-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {
            loading
              ? "发送中..."
              : "发送给客户"
          }
        </button>
      </div>
    </form>
  );
}