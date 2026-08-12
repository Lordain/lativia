"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import PaymentOptionSelector from "@/components/payments/PaymentOptionSelector";

import { createOrder } from "@/lib/orders/createOrder";

import type { ServicePrice } from "@/types/servicePrice";
import type { FormFieldSchema } from "@/types/form";

type DynamicFormData =
  Record<string, string>;

interface Props {
  serviceId: string;

  schema:
    FormFieldSchema[];

  prices:
    ServicePrice[];
}

export default function DynamicForm({
  serviceId,
  schema,
  prices,
}: Props) {
  const [
    selectedPriceId,
    setSelectedPriceId,
  ] = useState(
    prices[0]?.id ?? ""
  );

  const router =
    useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<DynamicFormData>();

  const hasPrices =
    prices.length > 0;

  async function submitForm(
    data: DynamicFormData
  ) {
    try {
      if (
        !selectedPriceId
      ) {
        alert(
          "请选择付款方式"
        );

        return;
      }

      const order =
        await createOrder({
          serviceId,
          priceId:
            selectedPriceId,
          formData:
            data,
        });

      router.push(
        `/account/orders/${order.id}/payment`
      );
    } catch (error) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "提交失败，请稍后再试"
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(
        submitForm,
        (
          formErrors
        ) => {
          console.log(
            "validation errors:",
            formErrors
          );
        }
      )}
      className="space-y-6"
    >
      {/* =====================================
          Payment Options
      ===================================== */}

      <section>
        <h2 className="text-xl font-semibold">
          选择付款方式
        </h2>

        {hasPrices ? (
          <div className="mt-4">
            <PaymentOptionSelector
              prices={
                prices
              }
              value={
                selectedPriceId
              }
              onChange={
                setSelectedPriceId
              }
            />
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              此服务目前暂无可用付款方式
            </p>

            <p className="mt-1 text-xs text-amber-700">
              请稍后再试或联系管理员。
            </p>
          </div>
        )}
      </section>

      {/* =====================================
          Dynamic Fields
      ===================================== */}

      {schema.map(
        (field) => (
          <div
            key={
              field.name
            }
            className="space-y-2"
          >
            <label className="font-medium">
              {
                field.label
              }

              {field.required && (
                <span className="ml-1 text-red-500">
                  *
                </span>
              )}
            </label>

            {field.type ===
            "textarea" ? (
              <textarea
                placeholder={
                  field.placeholder
                }
                {...register(
                  field.name,
                  {
                    required:
                      field.required
                        ? `${field.label} 为必填`
                        : false,
                  }
                )}
                rows={4}
                className={`w-full rounded-lg border p-3 ${
                  errors[
                    field.name
                  ]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            ) : (
              <input
                type={
                  field.type
                }
                placeholder={
                  field.placeholder
                }
                {...register(
                  field.name,
                  {
                    required:
                      field.required
                        ? `${field.label} 为必填`
                        : false,
                  }
                )}
                className={`w-full rounded-lg border p-3 ${
                  errors[
                    field.name
                  ]
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            )}

            {errors[
              field.name
            ] && (
              <p className="text-sm text-red-500">
                {
                  errors[
                    field.name
                  ]
                    ?.message as string
                }
              </p>
            )}
          </div>
        )
      )}

      {/* =====================================
          Submit
      ===================================== */}

      <button
        type="submit"
        disabled={
          !hasPrices
        }
        className="
          w-full
          rounded-lg
          bg-blue-600
          px-6
          py-3
          font-medium
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:bg-gray-400
          disabled:opacity-60
        "
      >
        提交申请
      </button>
    </form>
  );
}