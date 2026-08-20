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

const FIELD_TYPES = [
  {
    value: "text",
    label: "文字",
  },

  {
    value: "email",
    label: "Email",
  },

  {
    value: "tel",
    label: "电话",
  },

  {
    value: "number",
    label: "数字",
  },

  {
    value: "date",
    label: "日期",
  },

  {
    value: "textarea",
    label: "多行文字",
  },

] as const;

export default function DynamicFormBuilder({
  control,
  register,
  errors,
}: Props) {
  const {
    fields,
    append,
    remove,
    move,
  } =
    useFieldArray({
      control,
      name:
        "formSchema",
    });

  function addField() {
    append({
      name:
        "",
    
      label:
        "",
    
      type:
        "text",
    
      placeholder:
        "",
    
      helperText:
        "",
    
      required:
        false,
    
      options:
        [],
    });
  }

  return (
    <section className="rounded-xl border bg-gray-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            客户申请表单
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            设置客户申请此服务时需要填写的个人资料。
          </p>
        </div>

        <button
          type="button"
          onClick={
            addField
          }
          className="
            rounded-lg
            border
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-blue-700
            transition
            hover:bg-blue-50
          "
        >
          ＋ 新增字段
        </button>
      </div>

      {fields.length ===
      0 ? (
        <div className="mt-5 rounded-lg border border-dashed bg-white p-6 text-center">
          <p className="text-sm text-gray-500">
            此服务目前不要求客户填写额外资料。
          </p>

          <button
            type="button"
            onClick={
              addField
            }
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            新增第一个字段
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {fields.map(
            (
              field,
              index
            ) => {
              const fieldErrors =
                errors
                  .formSchema?.[
                  index
                ];

              return (
                <div
                  key={
                    field.id
                  }
                  className="rounded-xl border bg-white p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      字段{" "}
                      {
                        index +
                        1
                      }
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={
                          index ===
                          0
                        }
                        onClick={() =>
                          move(
                            index,
                            index -
                              1
                          )
                        }
                        className="
                          rounded
                          border
                          px-2
                          py-1
                          text-xs
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        disabled={
                          index ===
                          fields.length -
                            1
                        }
                        onClick={() =>
                          move(
                            index,
                            index +
                              1
                          )
                        }
                        className="
                          rounded
                          border
                          px-2
                          py-1
                          text-xs
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          remove(
                            index
                          )
                        }
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {/* Type */}

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        字段类型
                      </label>

                      <select
                        {...register(
                          `formSchema.${index}.type`
                        )}
                        className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
                      >
                        {FIELD_TYPES.map(
                          (
                            option
                          ) => (
                            <option
                              key={
                                option.value
                              }
                              value={
                                option.value
                              }
                            >
                              {
                                option.label
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* Name */}

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        字段名称
                      </label>

                      <input
                        type="text"
                        placeholder="例如：curp"
                        {...register(
                          `formSchema.${index}.name`
                        )}
                        className={`
                          w-full
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-sm
                          ${
                            fieldErrors
                              ?.name
                              ? "border-red-500"
                              : ""
                          }
                        `}
                      />

                      {fieldErrors
                        ?.name
                        ?.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {
                            fieldErrors
                              .name
                              .message
                          }
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-400">
                        数据库字段键，例如 curp、passport_number。
                      </p>
                    </div>

                    {/* Label */}

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        显示名称
                      </label>

                      <input
                        type="text"
                        placeholder="例如：CURP"
                        {...register(
                          `formSchema.${index}.label`
                        )}
                        className={`
                          w-full
                          rounded-lg
                          border
                          px-3
                          py-2
                          text-sm
                          ${
                            fieldErrors
                              ?.label
                              ? "border-red-500"
                              : ""
                          }
                        `}
                      />

                      {fieldErrors
                        ?.label
                        ?.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {
                            fieldErrors
                              .label
                              .message
                          }
                        </p>
                      )}
                    </div>

                    {/* Placeholder */}

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        输入提示
                      </label>

                      <input
                        type="text"
                        placeholder="例如：请输入您的 CURP"
                        {...register(
                          `formSchema.${index}.placeholder`
                        )}
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                      />
                    </div>

                    {/* Helper Text */}

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">
                      中文说明
                    </label>

                    <textarea
                      rows={
                        2
                      }
                      placeholder="例如：CURP 是墨西哥个人身份登记号码..."
                      {...register(
                        `formSchema.${index}.helperText`
                      )}
                      className="w-full rounded-lg border px-3 py-2 text-sm"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                      用于说明 CURP、RFC、SIGER 等墨西哥专用字段；Email 等通用字段可留空。
                    </p>
                  </div>
                  {field.type ===
                    "select" && (
                    <div className="md:col-span-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-sm font-medium text-amber-900">
                        下拉选项
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800">
                        当前服务的下拉选项由服务配置保存。现阶段请勿在管理员页面修改此字段类型或选项，以免覆盖已有配置。
                      </p>
                    </div>
                  )}


                  </div>

                  {/* Required */}

                  <label className="mt-4 flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      {...register(
                        `formSchema.${index}.required`
                      )}
                    />

                    <span className="text-sm font-medium">
                      此字段为必填
                    </span>
                  </label>
                </div>
              );
            }
          )}
        </div>
      )}

      <div className="mt-5 rounded-lg bg-blue-50 p-4 text-xs text-blue-800">
        字段名称 name
        会成为订单 form_data
        中保存资料的键，请避免在同一个服务中重复使用。
      </div>
    </section>
  );
}