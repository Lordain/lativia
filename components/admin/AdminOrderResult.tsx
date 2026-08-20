"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  OrderResult,
} from "@/types/result";

import {
  deliverAdminOrderResult,
} from "@/lib/results/deliverAdminOrderResult";


interface Props {
  orderId:
    string;

  results:
    OrderResult[];
}


function formatDateTime(
  value:
    string | null
) {
  if (!value) {
    return "—";
  }


  return new Date(
    value
  ).toLocaleString();
}


export default function AdminOrderResult({
  orderId,
  results,
}: Props) {
  const router =
    useRouter();


  const [
    isPending,
    startTransition,
  ] =
    useTransition();


  const [
    title,
    setTitle,
  ] =
    useState("");


  const [
    summary,
    setSummary,
  ] =
    useState("");


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );


  const deliveredResult =
    results.find(
      item =>
        item.status ===
        "delivered"
    ) ??
    null;


  function handleDeliver() {
    setError(
      null
    );


    startTransition(
      async () => {
        try {
          await deliverAdminOrderResult({
            orderId,

            title,

            summary,

            deliveryMode:
              "workspace",
          });


          setTitle(
            ""
          );

          setSummary(
            ""
          );


          router.refresh();

        } catch (
          caught
        ) {
          setError(
            caught instanceof Error
              ? caught.message
              : "服务结果交付失败"
          );
        }
      }
    );
  }


  return (
    <div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          Result Delivery
        </p>

        <h3 className="mt-1 text-lg font-semibold">
          服务结果交付
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          正式记录本订单已经向客户交付的服务结果。
          已交付结果不会作为普通聊天消息处理。
        </p>
      </div>


      {deliveredResult ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {
                  deliveredResult
                    .resultIsOfficial
                    ? "官方结果已交付"
                    : "服务完成记录已交付"
                }
              </p>

              <h4 className="mt-2 text-lg font-semibold text-emerald-950">
                {
                  deliveredResult.title
                }
              </h4>
            </div>


            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-700">
              已交付
            </span>
          </div>


          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {
              deliveredResult.summary
            }
          </p>


          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                结果类型
              </p>

              <p className="mt-1 text-sm font-medium">
                {
                  deliveredResult
                    .resultType
                }
              </p>
            </div>


            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-gray-500">
                交付时间
              </p>

              <p className="mt-1 text-sm font-medium">
                {
                  formatDateTime(
                    deliveredResult
                      .deliveredAt
                  )
                }
              </p>
            </div>
          </div>


          <p className="mt-4 text-xs leading-5 text-gray-500">
            {
              deliveredResult
                .resultIsOfficial
                ? "此结果已由服务配置标记为官方结果。"
                : "此记录表示平台服务已经完成交付，不代表政府或官方机构签发的官方文件。"
            }
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border bg-gray-50 p-5">
          <div>
            <label className="text-sm font-medium text-gray-900">
              结果标题
            </label>

            <input
              value={
                title
              }

              onChange={
                event =>
                  setTitle(
                    event.target.value
                  )
              }

              disabled={
                isPending
              }

              placeholder="例如：Cetesdirecto 咨询服务完成"

              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>


          <div className="mt-4">
            <label className="text-sm font-medium text-gray-900">
              结果说明
            </label>

            <textarea
              value={
                summary
              }

              onChange={
                event =>
                  setSummary(
                    event.target.value
                  )
              }

              disabled={
                isPending
              }

              rows={
                6
              }

              placeholder="填写客户本次实际获得的服务结果、已经完成的事项，以及必要的后续说明。"

              className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-blue-500"
            />
          </div>


          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {
                error
              }
            </div>
          )}


          <div className="mt-4 flex justify-end">
            <button
              type="button"

              disabled={
                isPending ||
                !title.trim() ||
                !summary.trim()
              }

              onClick={
                handleDeliver
              }

              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {
                isPending
                  ? "正在交付..."
                  : "确认交付服务结果"
              }
            </button>
          </div>


          <p className="mt-3 text-xs leading-5 text-gray-500">
            当前阶段通过客户订单 Workspace 交付。
            正式交付后不能直接覆盖，请确认内容无误后再提交。
          </p>
        </div>
      )}
    </div>
  );
}