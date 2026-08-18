"use client";

import {
  useFieldArray,
} from "react-hook-form";

import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type {
  ServiceFormData,
} from "@/types/service";


interface Props {
  control:
    Control<ServiceFormData>;

  register:
    UseFormRegister<ServiceFormData>;

  errors:
    FieldErrors<ServiceFormData>;
}


export default function CompletionMilestoneBuilder({
  control,
  register,
  errors,
}: Props) {
  const {
    fields,
    append,
    remove,
  } =
    useFieldArray({
      control,
      name:
        "completionMilestones",
    });


  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">
            服务完成节点
          </p>

          <p className="mt-1 text-sm text-gray-500">
            用于需要按照特定阶段判断服务完成的项目。
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              key: "",
              label: "",
              required:
                true,
            })
          }
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          + 添加节点
        </button>
      </div>


      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
          尚未设置完成节点。
        </div>
      )}


      {fields.map(
        (
          field,
          index
        ) => (
          <div
            key={
              field.id
            }
            className="rounded-xl border bg-gray-50 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Key
                </label>

                <input
                  {...register(
                    `completionMilestones.${index}.key`
                  )}
                  placeholder="例如：account_opened"
                  className="w-full rounded-lg border bg-white p-3 text-sm"
                />

                {errors
                  .completionMilestones?.[
                    index
                  ]?.key
                  ?.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {
                      errors
                        .completionMilestones[
                          index
                        ]?.key
                        ?.message
                    }
                  </p>
                )}
              </div>


              <div>
                <label className="mb-2 block text-sm font-medium">
                  节点名称
                </label>

                <input
                  {...register(
                    `completionMilestones.${index}.label`
                  )}
                  placeholder="例如：完成 Cetesdirecto 开户"
                  className="w-full rounded-lg border bg-white p-3 text-sm"
                />
              </div>
            </div>


            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  {...register(
                    `completionMilestones.${index}.required`
                  )}
                />

                必须完成
              </label>


              <button
                type="button"
                onClick={() =>
                  remove(
                    index
                  )
                }
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                删除
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}