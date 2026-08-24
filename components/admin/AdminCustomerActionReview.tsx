"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  approveCustomerActionSubmission,
} from "@/lib/customerActions/approveCustomerActionSubmission";

import {
  rejectCustomerActionSubmission,
} from "@/lib/customerActions/rejectCustomerActionSubmission";

import type {
  CustomerActionRequest,
  CustomerActionSubmission,
} from "@/types/customerAction";


interface Props {
  request:
    CustomerActionRequest;

  submission:
    CustomerActionSubmission | null;

  currentFormData:
    Record<
      string,
      string
    >;
}


export default function AdminCustomerActionReview({
  request,
  submission,
  currentFormData,
}: Props) {
  const router =
    useRouter();


  const [
    loading,
    setLoading,
  ] =
    useState(
      false
    );


  const [
    rejectReason,
    setRejectReason,
  ] =
    useState(
      ""
    );


  if (
    request.status !==
      "submitted" ||
    !submission ||
    submission.status !==
      "submitted"
  ) {
    return null;
  }


  async function handleApprove() {
    if (
      loading ||
      !submission
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        "确定审核通过这次资料修正吗？通过后，新值会正式更新到订单资料。"
      );


    if (!confirmed) {
      return;
    }


    setLoading(
      true
    );


    try {
      await approveCustomerActionSubmission(
        submission.id
      );


      alert(
        "资料修正已经审核通过。"
      );


      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "审核失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  async function handleReject() {
    if (
      loading ||
      !submission
    ) {
      return;
    }


    const reason =
      rejectReason.trim();


    if (!reason) {
      alert(
        "请填写驳回原因。"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "确定驳回这次资料修正，并要求客户重新填写吗？"
      );


    if (!confirmed) {
      return;
    }


    setLoading(
      true
    );


    try {
      await rejectCustomerActionSubmission(
        submission.id,
        reason
      );


      alert(
        "已经要求客户重新填写资料。"
      );


      router.refresh();

    } catch (
      error
    ) {
      console.error(
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "驳回失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <section className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div>
        <h4 className="font-bold text-blue-950">
          审核客户修正资料
        </h4>

        <p className="mt-1.5 text-sm leading-6 text-blue-700">
          请比较订单当前资料与客户重新填写的资料。
          只有审核通过后，新值才会正式更新到订单。
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {Object.entries(
          request
            .requestedFields
        ).map(
          ([
            fieldName,
            field,
          ]) => {
            const oldValue =
              currentFormData[
                fieldName
              ] ??
              "";

            const newValue =
              submission
                .submittedData[
                  fieldName
                ] ??
              "";


            return (
              <div
                key={
                  fieldName
                }
                className="rounded-xl border border-blue-200 bg-white p-5"
              >
                <p className="font-semibold text-slate-900">
                  {
                    field.label
                  }
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  要求修正原因：
                  {
                    field.reason
                  }
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      当前订单资料
                    </p>

                    <p className="mt-2 break-words text-sm text-slate-700">
                      {oldValue.trim()
                        ? oldValue
                        : "未填写"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold text-emerald-700">
                      客户重新填写
                    </p>

                    <p className="mt-2 break-words text-sm font-semibold text-emerald-800">
                      {newValue.trim()
                        ? newValue
                        : "未填写"}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={
            handleApprove
          }
          disabled={
            loading
          }
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading
            ? "处理中..."
            : "审核通过"}
        </button>
      </div>

      <div className="mt-6 border-t border-blue-200 pt-5">
        <label className="text-sm font-semibold text-slate-700">
          驳回原因
        </label>

        <textarea
          value={
            rejectReason
          }
          onChange={
            event =>
              setRejectReason(
                event.target
                  .value
              )
          }
          rows={
            3
          }
          placeholder="例如：CURP 仍然不正确，请重新确认后填写。"
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={
            handleReject
          }
          disabled={
            loading
          }
          className="mt-3 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
        >
          {loading
            ? "处理中..."
            : "驳回并要求重新填写"}
        </button>
      </div>
    </section>
  );
}
