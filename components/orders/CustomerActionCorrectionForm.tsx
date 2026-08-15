"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  submitCustomerActionCorrection,
} from "@/lib/customerActions/submitCustomerActionCorrection";

import type {
  CustomerActionRequest,
} from "@/types/customerAction";


interface Props {
  request:
    CustomerActionRequest;

  currentFormData:
    Record<
      string,
      string
    >;
}


export default function CustomerActionCorrectionForm({
  request,
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
    values,
    setValues,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(
      () => {
        const initial:
          Record<
            string,
            string
          > =
          {};


        for (
          const fieldName
          of Object.keys(
            request.requestedFields
          )
        ) {
          initial[
            fieldName
          ] =
            currentFormData[
              fieldName
            ] ??
            "";
        }


        return initial;
      }
    );


  async function handleSubmit(
    event:
      React.FormEvent<
        HTMLFormElement
      >
  ) {
    event.preventDefault();


    if (loading) {
      return;
    }


    setLoading(
      true
    );


    try {
      await submitCustomerActionCorrection({
        requestId:
          request.id,

        submittedData:
          values,
      });


      alert(
        "修正资料已经提交，我们会重新审核。"
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
          : "提交修正资料失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  if (
    request.status ===
    "submitted"
  ) {
    return (
      <section className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h2 className="text-lg font-semibold text-blue-800">
          修正资料已提交
        </h2>

        <p className="mt-2 text-sm leading-6 text-blue-700">
          我们已经收到您重新填写的资料，
          目前正在审核。
          审核完成后会更新订单状态。
        </p>
      </section>
    );
  }


  return (
    <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Action Required
        </p>

        <h2 className="mt-1 text-xl font-semibold text-amber-900">
          请修正以下资料
        </h2>


        {request.message && (
          <p className="mt-3 text-sm leading-6 text-amber-800">
            {
              request.message
            }
          </p>
        )}
      </div>


      <form
        onSubmit={
          handleSubmit
        }
        className="mt-6 space-y-5"
      >
        {Object.entries(
          request
            .requestedFields
        ).map(
          ([
            fieldName,
            field,
          ]) => (
            <div
              key={
                fieldName
              }
              className="rounded-lg border border-amber-200 bg-white p-4"
            >
              <label
                htmlFor={`correction-${fieldName}`}
                className="font-medium text-gray-900"
              >
                {
                  field.label
                }
              </label>


              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-xs font-medium text-gray-400">
                  当前资料
                </p>

                <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                  {currentFormData[
                    fieldName
                  ]?.trim()
                    ? currentFormData[
                        fieldName
                      ]
                    : "未填写"}
                </p>
              </div>


              <div className="mt-3 rounded-lg bg-red-50 p-3">
                <p className="text-xs font-medium text-red-700">
                  需要修正的原因
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {
                    field.reason
                  }
                </p>
              </div>


              <input
                id={`correction-${fieldName}`}
                type="text"
                value={
                  values[
                    fieldName
                  ] ??
                  ""
                }
                onChange={
                  event =>
                    setValues(
                      current => ({
                        ...current,

                        [
                          fieldName
                        ]:
                          event.target
                            .value,
                      })
                    )
                }
                className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                placeholder={`重新填写${field.label}`}
                required
              />
            </div>
          )
        )}


        <button
          type="submit"
          disabled={
            loading
          }
          className="
            rounded-lg
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading
            ? "提交中..."
            : "提交修正资料"}
        </button>
      </form>
    </section>
  );
}