"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createCustomerActionRequest,
} from "@/lib/customerActions/createCustomerActionRequest";

import type {
  CustomerActionRequest,
  CustomerActionRequestedFields,
} from "@/types/customerAction";

import type {
  FormFieldSchema,
} from "@/types/form";


interface Props {
  orderId: string;

  fulfillmentId:
    string | null;

  fulfillmentStatus:
    string | null;

  formSchema:
    FormFieldSchema[];

  formData:
    Record<
      string,
      string
    >;

  activeRequest:
    CustomerActionRequest | null;
}


export default function AdminCustomerActionRequest({
  orderId,
  fulfillmentId,
  fulfillmentStatus,
  formSchema,
  formData,
  activeRequest,
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
    message,
    setMessage,
  ] =
    useState(
      ""
    );


  const [
    selectedReasons,
    setSelectedReasons,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(
      {}
    );


  const availableFields =
    useMemo(
      () =>
        formSchema.filter(
          field =>
            Object.prototype
              .hasOwnProperty
              .call(
                formData,
                field.name
              )
        ),
      [
        formSchema,
        formData,
      ]
    );


  const canCreate =
    Boolean(
      fulfillmentId
    ) &&
    !activeRequest &&
    fulfillmentStatus !==
      "completed" &&
    fulfillmentStatus !==
      "failed" &&
    fulfillmentStatus !==
      "refund_review" &&
    fulfillmentStatus !==
      "waiting_customer";


  function toggleField(
    fieldName:
      string
  ) {
    setSelectedReasons(
      current => {
        if (
          Object.prototype
            .hasOwnProperty
            .call(
              current,
              fieldName
            )
        ) {
          const next = {
            ...current,
          };


          delete next[
            fieldName
          ];


          return next;
        }


        return {
          ...current,

          [
            fieldName
          ]:
            "",
        };
      }
    );
  }


  async function handleCreate() {
    if (
      loading ||
      !canCreate
    ) {
      return;
    }


    const requestedFields:
      CustomerActionRequestedFields =
      {};


    for (
      const field
      of availableFields
    ) {
      if (
        !Object.prototype
          .hasOwnProperty
          .call(
            selectedReasons,
            field.name
          )
      ) {
        continue;
      }


      const reason =
        selectedReasons[
          field.name
        ]?.trim();


      if (!reason) {
        alert(
          `${field.label} 必须填写修正原因。`
        );

        return;
      }


      requestedFields[
        field.name
      ] = {
        label:
          field.label,

        reason,
      };
    }


    if (
      Object.keys(
        requestedFields
      ).length ===
      0
    ) {
      alert(
        "请至少选择一个需要客户修正的资料字段。"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "确定要求客户修正这些资料吗？客户会收到站内通知和 Email。"
      );


    if (!confirmed) {
      return;
    }


    setLoading(
      true
    );


    try {
      await createCustomerActionRequest({
        orderId,

        fulfillmentId,

        requestedFields,

        message:
          message.trim() ||
          null,
      });


      alert(
        "客户资料修正要求已经建立。"
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
          : "建立资料修正要求失败"
      );

    } finally {
      setLoading(
        false
      );
    }
  }


  if (
    activeRequest
  ) {
    return (
      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Customer Action
        </p>

        <h2 className="mt-1 text-xl font-semibold text-amber-900">
          客户资料修正
        </h2>


        <p className="mt-3 text-sm text-amber-800">
          当前状态：
          <strong className="ml-1">
            {activeRequest.status ===
            "submitted"
              ? "客户已提交，等待审核"
              : "等待客户修正"}
          </strong>
        </p>


        <div className="mt-4 space-y-3">
          {Object.entries(
            activeRequest
              .requestedFields
          ).map(
            ([
              key,
              field,
            ]) => (
              <div
                key={
                  key
                }
                className="rounded-lg border border-amber-200 bg-white p-4"
              >
                <p className="font-medium">
                  {
                    field.label
                  }
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {
                    field.reason
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>
    );
  }


  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Customer Action
      </p>

      <h2 className="mt-1 text-xl font-semibold">
        要求客户修正资料
      </h2>


      <p className="mt-2 text-sm leading-6 text-gray-500">
        仅选择确实需要客户重新确认或修改的文字资料。
        客户只能修改您在这里指定的字段。
      </p>


      {!canCreate ? (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          当前办理状态不能建立新的客户资料修正要求。
        </div>
      ) : (
        <>
          <div className="mt-5 space-y-3">
            {availableFields.map(
              field => {
                const selected =
                  Object.prototype
                    .hasOwnProperty
                    .call(
                      selectedReasons,
                      field.name
                    );


                return (
                  <div
                    key={
                      field.name
                    }
                    className="rounded-lg border p-4"
                  >
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        onChange={() =>
                          toggleField(
                            field.name
                          )
                        }
                        className="mt-1"
                      />


                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {
                            field.label
                          }
                        </p>

                        <p className="mt-1 break-words text-sm text-gray-500">
                          当前：
                          {formData[
                            field.name
                          ]?.trim()
                            ? formData[
                                field.name
                              ]
                            : "未填写"}
                        </p>
                      </div>
                    </label>


                    {selected && (
                      <textarea
                        value={
                          selectedReasons[
                            field.name
                          ] ??
                          ""
                        }
                        onChange={
                          event =>
                            setSelectedReasons(
                              current => ({
                                ...current,

                                [
                                  field.name
                                ]:
                                  event.target
                                    .value,
                              })
                            )
                        }
                        rows={
                          3
                        }
                        placeholder={`说明为什么需要修正${field.label}`}
                        className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm"
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>


          <div className="mt-5">
            <label className="text-sm font-medium">
              给客户的整体说明（可选）
            </label>

            <textarea
              value={
                message
              }
              onChange={
                event =>
                  setMessage(
                    event.target
                      .value
                  )
              }
              rows={
                3
              }
              placeholder="例如：我们在审核资料时发现以下信息需要您重新确认。"
              className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm"
            />
          </div>


          <button
            type="button"
            onClick={
              handleCreate
            }
            disabled={
              loading
            }
            className="
              mt-5
              rounded-lg
              bg-amber-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-amber-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "建立中..."
              : "要求客户修正资料"}
          </button>
        </>
      )}
    </section>
  );
}