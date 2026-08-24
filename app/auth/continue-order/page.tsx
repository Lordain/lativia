"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  createOrder,
} from "@/lib/orders/createOrder";

import {
  clearPendingOAuthOrder,
  getPendingOAuthOrder,
} from "@/lib/auth/pendingOAuthOrder";

import {
  createClient,
} from "@/lib/supabase/client";


type ContinueStatus =
  | "checking"
  | "creating"
  | "error";


export default function ContinueOrderPage() {
  const router =
    useRouter();

  const startedRef =
    useRef(
      false
    );

  const [
    status,
    setStatus,
  ] =
    useState<ContinueStatus>(
      "checking"
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  useEffect(() => {
    if (
      startedRef.current
    ) {
      return;
    }

    startedRef.current =
      true;


    async function continueOrder() {
      const pending =
        getPendingOAuthOrder();


      if (
        !pending
      ) {
        setError(
          "没有找到待继续的申请，或者临时申请已经过期。"
        );

        setStatus(
          "error"
        );

        return;
      }


      const supabase =
        createClient();

      const {
        data: {
          user,
        },
        error:
          userError,
      } =
        await supabase
          .auth
          .getUser();


      if (
        userError ||
        !user
      ) {
        setError(
          "Google 登录状态尚未建立，请重新登录后再试。"
        );

        setStatus(
          "error"
        );

        return;
      }


      setStatus(
        "creating"
      );


      try {
        const order =
        await createOrder({
            clientRequestId:
              pending.clientRequestId,
          
            serviceId:
              pending.serviceId,

            priceId:
              pending.priceId,

            formData:
              pending.formData,

            eligibilityAcknowledgementKeys:
              pending
                .eligibilityAcknowledgementKeys,
          });


        /*
         * Order 创建成功后立即删除
         * 浏览器中的临时申请资料。
         */
        clearPendingOAuthOrder();


        router.replace(
          `/account/orders/${order.id}/payment`
        );

      } catch (
        currentError
      ) {
        console.error(
          "Continue OAuth order error:",
          currentError
        );

        /*
         * 创建失败时暂时保留 pending，
         * 用户可以重新尝试，
         * 但仍受 30 分钟 TTL 限制。
         */
        setError(
          currentError instanceof Error
            ? currentError.message
            : "创建订单失败，请稍后再试。"
        );

        setStatus(
          "error"
        );
      }
    }


    void continueOrder();

  }, [
    router,
  ]);


  if (
    status ===
      "checking" ||
    status ===
      "creating"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 animate-spin text-blue-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
            </svg>
          </div>

          <h1 className="mt-4 text-lg font-bold text-slate-950">
            正在继续您的申请
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Google 登录已经完成，
            正在建立订单并准备付款页面。
          </p>

          <p className="mt-4 text-xs text-slate-400">
            请勿关闭此页面。
          </p>
        </div>
      </main>
    );
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-700">
          !
        </div>

        <h1 className="mt-4 text-lg font-bold text-slate-950">
          无法继续申请
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {
            error
          }
        </p>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={() => {
              window
                .location
                .reload();
            }}
            className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            重新尝试
          </button>

          <Link
            href="/services"
            className="flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            返回服务列表
          </Link>
        </div>
      </div>
    </main>
  );
}