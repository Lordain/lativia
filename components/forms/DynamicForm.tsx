"use client";

import { useForm } from "react-hook-form";
import type { FormFieldSchema } from "@/types/form";
import { createOrder } from "@/lib/orders/createOrder";

type DynamicFormData = Record<string, string>;

interface Props {
  serviceId: string;
  schema: FormFieldSchema[];
}

export default function DynamicForm({
  serviceId,
  schema,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DynamicFormData>();

  async function submitForm(data: DynamicFormData) {
    console.log("submitForm triggered:", data);

    await createOrder({
      serviceId,
      formData: data,
    });
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