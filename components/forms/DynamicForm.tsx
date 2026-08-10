"use client";

import { useState } from "react";
import PaymentOptionSelector from "@/components/payments/PaymentOptionSelector";
import type { ServicePrice } from "@/types/servicePrice";
import { useForm } from "react-hook-form";
import type { FormFieldSchema } from "@/types/form";
import { createOrder } from "@/lib/orders/createOrder";
import { useRouter } from "next/navigation";

type DynamicFormData = Record<string, string>;

interface Props {
  serviceId: string;
  schema: FormFieldSchema[];
  prices: ServicePrice[];
}

export default function DynamicForm({
  serviceId,
  schema,
  prices,
}: Props) {
  const [selectedPriceId, setSelectedPriceId] = useState(prices[0]?.id ?? "");
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormData>();

  async function submitForm(data: DynamicFormData) {
    try {
      if (!selectedPriceId) {
        alert("请选择付款方式");
        return;
      }
  
      const order = await createOrder({
        serviceId,
        priceId: selectedPriceId,
        formData: data,
      });
  
      router.push(`/account/orders/${order.id}/payment`);
    } catch (error) {
      console.error(error);
  
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
        (formErrors) => {
          console.log("validation errors:", formErrors);
        }
      )}
      className="space-y-6"
    >
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">
          选择付款方式
        </h2>
  
        <PaymentOptionSelector
          prices={prices}
          value={selectedPriceId}
          onChange={setSelectedPriceId}
        />
      </div>
  
      {schema.map((field) => (
        <div
          key={field.name}
          className="space-y-2"
        >
          <label className="font-medium">
            {field.label}
          </label>

          {field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              {...register(field.name, {
                required: field.required
                  ? `${field.label} 为必填`
                  : false,
              })}
              rows={4}
              className={`w-full rounded-lg border p-3 ${
                errors[field.name]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          ) : (
            <input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name, {
                required: field.required
                  ? `${field.label} 为必填`
                  : false,
              })}
              className={`w-full rounded-lg border p-3 ${
                errors[field.name]
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
          )}

          {errors[field.name] && (
            <p className="text-sm text-red-500">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        提交测试
      </button>
    </form>
  );
}