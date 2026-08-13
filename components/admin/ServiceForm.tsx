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
  initialData?: ServiceFormData;

  onSubmit: (
    data: ServiceFormData
  ) => Promise<void>;
}

export default function ServiceForm({
  initialData,
  onSubmit,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

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

          /*
           * =====================================
           * Service Business Design
           * =====================================
           */

          customerValue:
            "",

          expectedOutcome:
            "",

          /*
           * =====================================
           * Fulfillment / Automation
           * =====================================
           */

          fulfillmentType:
            "semi_automatic",

          humanReviewRequired:
            true,

          humanReviewNotes:
            "",

          /*
           * =====================================
           * Refund
           * =====================================
           */

          refundEligibleWhenFailed:
            true,

          /*
           * =====================================
           * Privacy / Result
           * =====================================
           */

          personalDataPolicy:
            "客户提交的个人资料仅用于完成本次服务，不用于建立长期个人身份档案。服务完成或退款流程结束后，将按照数据保留政策删除不再必要的办理资料。",

          resultType:
            "",
        },
    });

  async function submitForm(
    data: ServiceFormData
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
      {/* =====================================
          Basic Information
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">
            服务基本资料
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            定义服务名称、分类、基本说明和前台展示信息。
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <FormField
            label="服务名称"
            error={
              errors.title
                ?.message
            }
          >
            <Input
              type="text"
              placeholder="例如：RFC 查询与结果确认"
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

        <div className="mt-6 space-y-6">
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
              placeholder="例如：快速查询并确认您的墨西哥 RFC 信息"
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
              errors
                .description
                ?.message
            }
          >
            <Textarea
              rows={5}
              placeholder="说明这个服务解决什么问题、适合什么客户，以及办理的大致流程。"
              error={
                !!errors
                  .description
              }
              {...register(
                "description"
              )}
            />
          </FormField>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
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
              placeholder="例如：10～30 分钟"
              error={
                !!errors.duration
              }
              {...register(
                "duration"
              )}
            />
          </FormField>
        </div>

        <div className="mt-6">
          <FormField
            label="所需文件 / 资料"
            error={
              errors.requirements
                ?.message
            }
          >
            <Textarea
              rows={3}
              placeholder="例如：CURP, 护照"
              error={
                !!errors
                  .requirements
              }
              {...register(
                "requirements"
              )}
            />
          </FormField>
        </div>
      </section>

      {/* =====================================
          Flags
      ===================================== */}

      <section className="grid gap-4 rounded-2xl border bg-gray-50 p-5 md:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "popular"
            )}
          />

          <div>
            <p className="text-sm font-medium">
              热门服务
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              在前台优先展示此服务。
            </p>
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "isActive"
            )}
          />

          <div>
            <p className="text-sm font-medium">
              启用服务
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              停用后客户前台不会显示此服务。
            </p>
          </div>
        </label>
      </section>

      {/* =====================================
          Dynamic Form
      ===================================== */}

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

      {/* =====================================
          Service Business Design
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Service Design
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            服务价值与交付结果
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            不要只描述“我们做什么”。
            请明确客户为什么值得付费，以及完成后实际会获得什么。
            这会直接影响前台专业度和客户对结果的确定性。
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <FormField
            label="客户增值点"
            error={
              errors
                .customerValue
                ?.message
            }
          >
            <Textarea
              rows={4}
              placeholder="例如：客户无需自行研究复杂的 SAT 查询流程。系统会先检查资料完整性，并在查询异常时安排人工确认。"
              error={
                !!errors
                  .customerValue
              }
              {...register(
                "customerValue"
              )}
            />
          </FormField>

          <FormField
            label="明确交付结果"
            error={
              errors
                .expectedOutcome
                ?.message
            }
          >
            <Textarea
              rows={4}
              placeholder="例如：完成后提供查询到的 RFC 信息、结果状态及必要的中文说明。"
              error={
                !!errors
                  .expectedOutcome
              }
              {...register(
                "expectedOutcome"
              )}
            />
          </FormField>
        </div>
      </section>

      {/* =====================================
          Fulfillment / Automation
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Fulfillment
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            办理与自动化方式
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            自动化目标是减少客户等待和人工重复工作。
            CAPTCHA、本人认证、政府网站异常或结果无法确定等情况，
            应进入人工审核，而不是强行绕过。
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Fulfillment Type
          </label>

          <select
            {...register(
              "fulfillmentType"
            )}
            className="w-full rounded-lg border bg-white p-3"
          >
            <option value="automatic">
              Automatic — 理论上可全自动完成
            </option>

            <option value="semi_automatic">
              Semi-Automatic — 自动处理为主，必要时人工介入
            </option>

            <option value="manual">
              Manual — 主要由人工办理
            </option>
          </select>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            对政府网站存在 CAPTCHA、本人认证或无公开 API 的服务，
            第一阶段通常建议使用 Semi-Automatic。
          </p>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "humanReviewRequired"
            )}
          />

          <div>
            <p className="font-medium">
              支持 / 需要人工审核
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              当系统无法确定结果时，不直接判定失败，
              而是进入人工确认，提高服务完成的确定性。
            </p>
          </div>
        </label>

        <div className="mt-5">
          <FormField
            label="人工审核场景"
            error={
              errors
                .humanReviewNotes
                ?.message
            }
          >
            <Textarea
              rows={4}
              placeholder="例如：SAT CAPTCHA、政府网站异常、资料不一致、查询结果需要人工确认。"
              error={
                !!errors
                  .humanReviewNotes
              }
              {...register(
                "humanReviewNotes"
              )}
            />
          </FormField>
        </div>
      </section>

      {/* =====================================
          Refund
      ===================================== */}

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Refund Policy
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            办理保障与退款
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            退款用于处理确实无法完成的服务，
            不是服务完成后的撤销机制。
          </p>
        </div>

        <label className="mt-5 flex items-start gap-3 rounded-xl bg-white p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "refundEligibleWhenFailed"
            )}
          />

          <div>
            <p className="font-medium">
              服务无法完成时，可进入退款审核
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              是否最终退款将根据失败原因、客户资料情况、
              已产生的必要成本和退款规则进行判断。
            </p>
          </div>
        </label>

        <div className="mt-5 rounded-xl border border-red-200 bg-white p-4">
          <p className="font-semibold text-red-700">
            已完成并交付的服务不支持退款
          </p>

          <p className="mt-1 text-sm leading-6 text-gray-600">
            服务一旦成功完成并已经向客户交付办理结果，
            即视为服务履行完成，不支持退款。
            此规则属于系统级规则，管理员不能在此关闭。
          </p>
        </div>
      </section>

      {/* =====================================
          Personal Data / Result
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Data & Result
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            个人资料与结果
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            mex-helper 不以建立长期身份档案为目的。
            办理资料只应收集完成当前服务真正必要的信息，
            并在服务完成或退款流程结束后进入数据删除生命周期。
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <FormField
            label="个人资料处理说明"
            error={
              errors
                .personalDataPolicy
                ?.message
            }
          >
            <Textarea
              rows={4}
              placeholder="例如：CURP 等资料仅用于本次 RFC 查询；服务完成或退款流程结束后，将按数据保留政策删除不再必要的办理资料。"
              error={
                !!errors
                  .personalDataPolicy
              }
              {...register(
                "personalDataPolicy"
              )}
            />
          </FormField>

          <FormField
            label="结果类型"
            error={
              errors
                .resultType
                ?.message
            }
          >
            <Input
              type="text"
              placeholder="例如：RFC 查询结果及状态说明"
              error={
                !!errors
                  .resultType
              }
              {...register(
                "resultType"
              )}
            />
          </FormField>
        </div>

        <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
          建议结果描述强调“客户最终获得什么”，
          而不是只写内部操作名称。
          例如使用「RFC 查询结果及状态说明」，
          而不是简单写「RFC 查询」。
        </div>
      </section>

      {/* =====================================
          Price Information
      ===================================== */}

      <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
        「展示价格」仅用于页面显示。
        实际 Stripe、Mercado Pago
        和未来微信支付金额仍由
        service_prices 管理。
      </div>

      {/* =====================================
          Submit
      ===================================== */}

      <button
        type="submit"
        disabled={
          loading
        }
        className="
          w-full
          rounded-xl
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