"use client";

import {
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import type {
  ServiceFormData,
} from "@/types/service";

import {
  serviceSchema,
} from "@/lib/validation/serviceSchema";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

import DynamicFormBuilder from "@/components/admin/DynamicFormBuilder";

interface Props {
  initialData?:
    ServiceFormData;

  onSubmit:
    (
      data:
        ServiceFormData
    ) =>
      Promise<void>;
}

export default function ServiceForm({
  initialData,
  onSubmit,
}: Props) {
  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
    },
  } =
    useForm<ServiceFormData>({
      resolver:
        zodResolver(
          serviceSchema
        ),

      defaultValues:
        initialData ?? {
          slug: "",

          title: "",

          shortDescription:
            "",

          description:
            "",

          category:
            "General",

          icon:
            "📄",

          price:
            "",

          duration:
            "",

          requirements:
            "",

          popular:
            false,

          isActive:
            true,

          formSchema:
            [],
        },
    });

  async function submitForm(
    data:
      ServiceFormData
  ) {
    setLoading(true);

    try {
      await onSubmit(
        data
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit(
          submitForm
        )
      }
      className="mt-6 space-y-6"
    >
      {/* Basic Information */}

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="服务名称"
          error={
            errors.title
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：RFC"
            error={
              !!errors.title
            }
            {...register(
              "title"
            )}
          />
        </FormField>

        <FormField
          label="Slug"
          error={
            errors.slug
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：rfc"
            error={
              !!errors.slug
            }
            {...register(
              "slug"
            )}
          />
        </FormField>

        <FormField
          label="分类"
          error={
            errors.category
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：Tax"
            error={
              !!errors.category
            }
            {...register(
              "category"
            )}
          />
        </FormField>

        <FormField
          label="图标"
          error={
            errors.icon
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：🧾"
            error={
              !!errors.icon
            }
            {...register(
              "icon"
            )}
          />
        </FormField>
      </div>

      <FormField
        label="简短描述"
        error={
          errors
            .shortDescription
            ?.message
        }
      >
        <Input
          type="text"
          placeholder="例如：墨西哥税号申请"
          error={
            !!errors
              .shortDescription
          }
          {...register(
            "shortDescription"
          )}
        />
      </FormField>

      <FormField
        label="详细介绍"
        error={
          errors.description
            ?.message
        }
      >
        <Textarea
          rows={5}
          error={
            !!errors.description
          }
          {...register(
            "description"
          )}
        />
      </FormField>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          label="展示价格"
          error={
            errors.price
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：MX$400"
            error={
              !!errors.price
            }
            {...register(
              "price"
            )}
          />
        </FormField>

        <FormField
          label="办理时间"
          error={
            errors.duration
              ?.message
          }
        >
          <Input
            type="text"
            placeholder="例如：1～3 个工作日"
            error={
              !!errors.duration
            }
            {...register(
              "duration"
            )}
          />
        </FormField>
      </div>

      <FormField
        label="所需文件"
        error={
          errors.requirements
            ?.message
        }
      >
        <Textarea
          rows={3}
          placeholder="护照, 居留卡, CURP"
          error={
            !!errors.requirements
          }
          {...register(
            "requirements"
          )}
        />
      </FormField>

      {/* Flags */}

      <div className="grid gap-4 rounded-xl border bg-gray-50 p-4 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4"
            {...register(
              "popular"
            )}
          />

          <div>
            <p className="text-sm font-medium">
              热门服务
            </p>

            <p className="text-xs text-gray-500">
              在前台优先展示。
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4"
            {...register(
              "isActive"
            )}
          />

          <div>
            <p className="text-sm font-medium">
              启用服务
            </p>

            <p className="text-xs text-gray-500">
              停用后客户前台不会显示。
            </p>
          </div>
        </label>
      </div>

      {/* Dynamic Form */}

      <DynamicFormBuilder
        control={
          control
        }
        register={
          register
        }
        errors={
          errors
        }
      />

      {/* Price Information */}

      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        「展示价格」仅用于页面显示。
        实际 Stripe、Mercado Pago
        和未来微信支付金额仍由
        service_prices 管理。
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={
          loading
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
          disabled:opacity-60
        "
      >
        {loading
          ? "保存中..."
          : initialData
            ? "更新服务"
            : "新增服务"}
      </button>
    </form>
  );
}