"use client";

import {
  useEffect,
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
import EligibilityBuilder from "@/components/admin/EligibilityBuilder";
import CompletionMilestoneBuilder from "@/components/admin/CompletionMilestoneBuilder";

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
    watch,
    reset,
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
          /*
           * =====================================
           * Basic
           * =====================================
           */

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

          /*
           * =====================================
           * Settings
           * =====================================
           */

          serviceType:
            "online_query",

          launchPriority:
            "second",

          serviceStatus:
            "active",

          /*
           * =====================================
           * Eligibility
           * =====================================
           */

          eligibilityMode:
            "none",

          eligibilitySchema:
            [],

          /*
           * =====================================
           * Customer Form
           * =====================================
           */

          formSchema:
            [],

          /*
           * =====================================
           * Execution
           * =====================================
           */

          workspaceRequired:
            false,

          completionMode:
            "manual",

          accessDurationDays:
            null,

          completionMilestones:
            [],

          /*
           * =====================================
           * Result
           * =====================================
           */

          expectedOutcome:
            "",

            resultIsOfficial:
            false,
          
          resultRequired:
            false,
          
          hasResultFile:
            false,

          /*
           * =====================================
           * Refund
           * =====================================
           */

          refundEligibleWhenFailed:
            true,
        },
    });

  /*
   * =====================================
   * Keep React Hook Form synchronized
   *
   * 编辑服务保存后 router.refresh()
   * 会重新取得服务器 initialData。
   *
   * React Hook Form 的 defaultValues
   * 不会自动响应 initialData 变化，
   * 因此这里主动 reset。
   * =====================================
   */

  useEffect(
    () => {
      if (
        initialData
      ) {
        reset(
          initialData
        );
      }
    },
    [
      initialData,
      reset,
    ]
  );

  /*
   * =====================================
   * Conditional Fields
   * =====================================
   */

  const eligibilityMode =
    watch(
      "eligibilityMode"
    );

  const completionMode =
    watch(
      "completionMode"
    );

  const showDuration =
    completionMode ===
      "time_based" ||
    completionMode ===
      "time_or_milestone";

  const showMilestones =
    completionMode ===
      "milestone_based" ||
    completionMode ===
      "time_or_milestone";

  /*
   * =====================================
   * Submit
   * =====================================
   */

  async function submitForm(
    data: ServiceFormData
  ) {
    setLoading(
      true
    );

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
          submitForm,

          validationErrors => {
            console.error(
              "ServiceForm validation failed:",
              validationErrors
            );

            alert(
              "表单中仍有未通过验证的内容，请检查页面中的红色提示。"
            );
          }
        )
      }
      className="mt-6 space-y-6"
    >
      {/* =====================================
          1. Basic
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">
            服务基本资料
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            设置客户在前台看到的服务名称、说明和基本办理信息。
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
              placeholder="例如：个人 RFC 首次申请"
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
              placeholder="例如：personal-rfc"
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
              placeholder="例如：税务 / 移民 / 投资咨询"
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
            label="简短说明"
            error={
              errors
                .shortDescription
                ?.message
            }
          >
            <Input
              type="text"
              placeholder="一句话说明客户为什么需要这个服务"
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
              placeholder="说明适用对象、服务内容和主要办理流程。"
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
              placeholder="例如：MX$1,500"
              error={
                !!errors.price
              }
              {...register(
                "price"
              )}
            />

            <p className="mt-2 text-xs leading-5 text-gray-500">
              当前仅用于页面展示；实际付款金额由付款方式配置决定。
            </p>
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

        <div className="mt-6">
          <FormField
            label="客户需要准备的资料"
            error={
              errors
                .requirements
                ?.message
            }
          >
            <Textarea
              rows={3}
              placeholder="例如：护照、居留卡、CURP"
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

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "popular"
            )}
          />

          <div>
            <p className="font-medium">
              热门服务
            </p>

            <p className="mt-1 text-sm text-gray-500">
              在客户前台优先展示。
            </p>
          </div>
        </label>
      </section>

      {/* =====================================
          2. Settings
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">
            服务设置
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            设置服务类型、上线优先级和当前受理状态。
          </p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium">
              服务类型
            </label>

            <select
              {...register(
                "serviceType"
              )}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="online_query">
                在线查询
              </option>

              <option value="accompaniment">
                陪同办理
              </option>

              <option value="agency">
                代办服务
              </option>

              <option value="consultation">
                咨询服务
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              上线优先级
            </label>

            <select
              {...register(
                "launchPriority"
              )}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="first">
                第一优先级
              </option>

              <option value="second">
                第二优先级
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              服务状态
            </label>

            <select
              {...register(
                "serviceStatus"
              )}
              className="w-full rounded-lg border bg-white p-3"
            >
              <option value="active">
                正常受理
              </option>

              <option value="paused">
                暂停受理
              </option>

              <option value="hidden">
                前台隐藏
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* =====================================
          3. Customer Conditions / Data
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">
            客户条件与下单资料
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            设置客户付款前需要确认的办理条件，以及下单时需要填写的信息。
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            付款前条件确认
          </label>

          <select
            {...register(
              "eligibilityMode"
            )}
            className="w-full rounded-lg border bg-white p-3"
          >
            <option value="none">
              无需确认
            </option>

            <option value="self_check">
              客户付款前确认
            </option>
          </select>

          {errors
            .eligibilitySchema
            ?.message && (
            <p className="mt-2 text-sm text-red-600">
              {
                errors
                  .eligibilitySchema
                  .message
              }
            </p>
          )}
        </div>

        {eligibilityMode ===
          "self_check" && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <EligibilityBuilder
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
          </div>
        )}

        <div className="mt-8 border-t pt-6">
          <div className="mb-4">
            <h3 className="font-semibold">
              下单时需要填写
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              只添加完成本服务真正必要的信息。
            </p>
          </div>

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
        </div>
      </section>

      {/* =====================================
          4. Execution
      ===================================== */}

      <section className="rounded-2xl border bg-white p-6">
        <div>
          <h2 className="text-xl font-semibold">
            服务执行
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            普通服务通常由管理员确认完成；复杂咨询或代办服务可开启服务空间、期限或完成节点。
          </p>
        </div>

        <label className="mt-6 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            {...register(
              "workspaceRequired"
            )}
          />

          <div>
            <p className="font-medium">
              开启订单专属服务空间
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              适用于购买后需要咨询、人工沟通、培训或持续协助的服务。
            </p>
          </div>
        </label>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            服务完成方式
          </label>

          <select
            {...register(
              "completionMode"
            )}
            className="w-full rounded-lg border bg-white p-3"
          >
            <option value="manual">
              管理员确认完成
            </option>

            <option value="time_based">
              服务期限届满
            </option>

            <option value="milestone_based">
              完成全部节点
            </option>

            <option value="time_or_milestone">
              到期或完成节点，以较早者为准
            </option>
          </select>
        </div>

        {showDuration && (
          <div className="mt-6">
            <FormField
              label="服务有效天数"
              error={
                errors
                  .accessDurationDays
                  ?.message
              }
            >
              <Input
                type="number"
                placeholder="例如：14"
                error={
                  !!errors
                    .accessDurationDays
                }
                {...register(
                  "accessDurationDays",
                  {
                    setValueAs:
                      value =>
                        value ===
                          "" ||
                        value ===
                          undefined
                          ? null
                          : Number(
                              value
                            ),
                  }
                )}
              />
            </FormField>
          </div>
        )}

        {showMilestones && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            {errors
              .completionMilestones
              ?.message && (
              <p className="mb-3 text-sm text-red-600">
                {
                  errors
                    .completionMilestones
                    .message
                }
              </p>
            )}

            <CompletionMilestoneBuilder
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
          </div>
        )}
      </section>

{/* =====================================
    5. Result / Refund
===================================== */}

<section className="rounded-2xl border bg-white p-6">
  <div>
    <h2 className="text-xl font-semibold">
      结果与退款
    </h2>

    <p className="mt-2 text-sm leading-6 text-gray-500">
      说明客户最终获得什么，以及是否需要交付官方或结果文件。
    </p>
  </div>


  {/* =====================================
      Expected Outcome
  ===================================== */}

  <div className="mt-6">
    <FormField
      label="客户最终获得"
      error={
        errors
          .expectedOutcome
          ?.message
      }
    >
      <Textarea
        rows={4}
        placeholder="例如：获得 SAT 官方 RFC 查询结果及必要的中文说明。"
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


  {/* =====================================
      Result Settings
  ===================================== */}

  <div className="mt-6 grid gap-4 md:grid-cols-3">
    {/* Official Result */}

    <label className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        {...register(
          "resultIsOfficial"
        )}
      />

      <div>
        <p className="font-medium">
          最终结果由官方机构出具
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          只有政府或相关官方机构实际出具的结果才可以勾选。
        </p>
      </div>
    </label>


    {/* Result Required */}

    <label className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        {...register(
          "resultRequired"
        )}
      />

      <div>
        <p className="font-medium">
          服务完成前需要正式交付结果
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          适用于需要在订单服务空间中留下正式完成或结果记录的服务。
        </p>
      </div>
    </label>


    {/* Result File */}

    <label className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4"
        {...register(
          "hasResultFile"
        )}
      />

      <div>
        <p className="font-medium">
          有结果文件需要交付
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          勾选后由系统按既定交付和临时资料保留规则处理。
        </p>
      </div>
    </label>
  </div>


  {/* =====================================
      Refund Eligibility
  ===================================== */}

  <label className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
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

      <p className="mt-1 text-sm leading-6 text-gray-600">
        是否最终退款仍根据失败原因、已发生费用及退款规则处理。
      </p>
    </div>
  </label>


  {/* =====================================
      Fixed Policies
  ===================================== */}

  <div className="mt-6 grid gap-4 md:grid-cols-2">
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="font-semibold text-red-700">
        完成交付后不退款
      </p>

      <p className="mt-1 text-sm leading-6 text-red-700">
        服务成功完成并向客户交付后，不支持退款。
        该规则由系统统一执行。
      </p>
    </div>


    <div className="rounded-xl bg-blue-50 p-4">
      <p className="font-semibold text-blue-800">
        临时资料默认 48 小时清理
      </p>

      <p className="mt-1 text-sm leading-6 text-blue-700">
        当资料用途结束、订单完成或确认不再需要后，
        相关临时资料默认进入 48 小时删除流程。
      </p>
    </div>
  </div>
</section>

{/* =====================================
    Payment Reminder
===================================== */}

<div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-800">
  {initialData ? (
    <>
      实际收费金额以页面「付款方式」区域中启用的付款方案为准。
      服务基础资料中的展示价格仅用于兼容旧数据。
    </>
  ) : (
    <>
      创建服务后，系统会自动进入该服务的编辑页面。
      请在那里继续配置实际可用的付款方式和收费金额。
    </>
  )}
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
            : "创建服务"}
      </button>
    </form>
  );
}