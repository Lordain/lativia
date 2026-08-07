"use client";

import { useForm } from "react-hook-form";
import type { FormFieldSchema } from "@/types/form";

type DynamicFormData = Record<string, string>;

interface Props {
  schema: FormFieldSchema[];
}

export default function DynamicForm({
  schema,
}: Props) {
  const {
    register,
    handleSubmit,
  } = useForm<DynamicFormData>();

  function submitForm(data: DynamicFormData) {
    console.log("Dynamic Form Data:", data);
  }

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
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

          <input
            type="text"
            placeholder={field.placeholder}
            {...register(field.name)}
            className="w-full rounded-lg border p-3"
          />
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