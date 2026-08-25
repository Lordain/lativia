"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  useRouter,
} from "next/navigation";

import PaymentOptionSelector from "@/components/payments/PaymentOptionSelector";

import ServiceOptionSelector from "@/components/service/ServiceOptionSelector";

import {
  createOrder,
} from "@/lib/orders/createOrder";

import SoftAuthGate from "@/components/auth/SoftAuthGate";

import {
  savePendingOAuthOrder,
} from "@/lib/auth/pendingOAuthOrder";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  ServicePrice,
} from "@/types/servicePrice";

import type {
  FormFieldSchema,
} from "@/types/form";

import type {
  EligibilityItem,
  EligibilityMode,
} from "@/types/service";

type DynamicFormData =
  Record<string, string>;

  type PendingSubmission = {
    clientRequestId:
      string;

    priceId:
      string;

    formData:
      DynamicFormData;

    eligibilityAcknowledgementKeys:
      string[];
  };

interface Props {
  serviceId: string;

  schema:
    FormFieldSchema[];

  prices:
    ServicePrice[];

  eligibilityMode:
    EligibilityMode;

  eligibilitySchema:
    EligibilityItem[];

}

function getPreferredPrice(
  prices: ServicePrice[]
) {
  return (
    prices.find(
      price =>
        price.paymentMethod ===
          "card" &&
        price.currency ===
          "MXN"
    ) ??
    prices.find(
      price =>
        price.paymentMethod ===
          "local_payment" &&
        price.currency ===
          "MXN"
    ) ??
    prices.find(
      price =>
        price.currency ===
          "MXN"
    ) ??
    prices.find(
      price =>
        price.paymentMethod !==
          "wechat_pay"
    ) ??
    prices[0] ??
    null
  );
}

export default function DynamicForm({
  serviceId,
  schema,
  prices,
  eligibilityMode,
  eligibilitySchema,
}: Props) {
  const serviceOptions =
  useMemo(
    () => {
      const map =
        new Map<
          string,
          NonNullable<
            ServicePrice["serviceOption"]
          >
        >();


      for (
        const price
        of prices
      ) {
        if (
          price.serviceOption &&
          price.serviceOptionId
        ) {
          map.set(
            price.serviceOptionId,
            price.serviceOption
          );
        }
      }


      return Array.from(
        map.values()
      ).sort(
        (
          a,
          b
        ) =>
          a.sortOrder -
          b.sortOrder
      );
    },
    [
      prices,
    ]
  );


const hasServiceOptions =
  serviceOptions.length >
  0;


const [
  selectedServiceOptionId,
  setSelectedServiceOptionId,
] =
  useState(
    serviceOptions[0]?.id ??
      ""
  );


const filteredPrices =
  useMemo(
    () => {
      if (
        !hasServiceOptions
      ) {
        return prices;
      }


      return prices.filter(
        price =>
          price.serviceOptionId ===
          selectedServiceOptionId
      );
    },
    [
      prices,
      hasServiceOptions,
      selectedServiceOptionId,
    ]
  );


  const [
    selectedPriceId,
    setSelectedPriceId,
  ] =
    useState(
      getPreferredPrice(
        hasServiceOptions
          ? filteredPrices
          : prices
      )?.id ??
        ""
    );

  const [
    acknowledgedEligibility,
    setAcknowledgedEligibility,
  ] =
    useState<
      Record<
        string,
        boolean
      >
    >({});

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

    const [
      pendingSubmission,
      setPendingSubmission,
    ] =
      useState<
        PendingSubmission | null
      >(
        null
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
    filteredPrices.length >
    0;

  const requiresEligibility =
    eligibilityMode ===
      "self_check" &&
    eligibilitySchema.length >
      0;

  const requiredEligibilityItems =
    useMemo(
      () =>
        eligibilitySchema.filter(
          item =>
            item.required !==
            false
        ),
      [
        eligibilitySchema,
      ]
    );

  const allEligibilityConfirmed =
    !requiresEligibility ||
    requiredEligibilityItems.every(
      item =>
        acknowledgedEligibility[
          item.key
        ] ===
        true
    );

    function handleServiceOptionChange(
      serviceOptionId:
        string
    ) {
      setSelectedServiceOptionId(
        serviceOptionId
      );


      const optionPrices =
      prices.filter(
        price =>
          price.serviceOptionId ===
          serviceOptionId
      );


    const preferredPrice =
      getPreferredPrice(
        optionPrices
      );


    setSelectedPriceId(
      preferredPrice?.id ??
        ""
    );
    }


  function toggleEligibility(
    key: string,
    checked: boolean
  ) {
    setAcknowledgedEligibility(
      current => ({
        ...current,

        [key]:
          checked,
      })
    );
  }

  async function createPendingOrder(
    submission:
      PendingSubmission
  ) {
    if (
      submitting
    ) {
      return;
    }

    setSubmitting(
      true
    );

    try {
      const order =
      await createOrder({
        serviceId,

        clientRequestId:
          submission
            .clientRequestId,

        priceId:
          submission.priceId,

        formData:
          submission.formData,

        eligibilityAcknowledgementKeys:
          submission
            .eligibilityAcknowledgementKeys,
      });

      setPendingSubmission(
        null
      );

      router.push(
        `/account/orders/${order.id}/payment`
      );

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "提交失败，请稍后再试"
      );

      setSubmitting(
        false
      );
    }
  }

  async function submitForm(
    data:
      DynamicFormData
  ) {
    if (
      submitting
    ) {
      return;
    }

    try {
      const email =
        data.email
          ?.trim()
          .toLowerCase();

      const emailConfirmation =
        data
          .email_confirmation
          ?.trim()
          .toLowerCase();


      if (
        emailConfirmation &&
        email !==
          emailConfirmation
      ) {
        alert(
          "两次输入的电子邮箱不一致，请重新确认。"
        );

        return;
      }


      if (
        hasServiceOptions &&
        !selectedServiceOptionId
      ) {
        alert(
          "请选择服务方案"
        );

        return;
      }


      if (
        !selectedPriceId
      ) {
        alert(
          "请选择付款方式"
        );

        return;
      }


      const selectedServiceOption =
        serviceOptions.find(
          option =>
            option.id ===
            selectedServiceOptionId
        );


      if (
        selectedServiceOption
          ?.serviceMode ===
        "appointment_plus_onsite"
      ) {
        const selectedRegion =
          data
            .service_region
            ?.trim();


        if (
          !selectedRegion
        ) {
          alert(
            "请选择现场办理地区"
          );

          return;
        }


        if (
          !selectedServiceOption
            .allowedRegions
            .includes(
              selectedRegion
            )
        ) {
          alert(
            "现场办理陪同（翻译）目前仅提供墨西哥城（CDMX）及墨西哥州（Estado de México），其他地区请选择预约协助服务"
          );

          return;
        }
      }


      if (
        !allEligibilityConfirmed
      ) {
        alert(
          "请先确认全部必填办理条件"
        );

        return;
      }


      const eligibilityAcknowledgementKeys =
        requiredEligibilityItems
          .filter(
            item =>
              acknowledgedEligibility[
                item.key
              ] ===
              true
          )
          .map(
            item =>
              item.key
          );


          const submission:
          PendingSubmission = {
            clientRequestId:
              crypto.randomUUID(),

            priceId:
              selectedPriceId,

            formData:
              data,

            eligibilityAcknowledgementKeys,
          };


      /*
       * =====================================
       * Soft Login Gate
       * =====================================
       *
       * 已登录：
       * 直接建立订单。
       *
       * 未登录：
       * 先保存当前申请，
       * 完成邮箱 OTP 后再继续建立订单。
       */

      const supabase =
        createClient();

      const {
        data: {
          user,
        },
        error:
          userError,
      } =
        await supabase.auth.getUser();


      if (
        user &&
        !userError
      ) {
        await createPendingOrder(
          submission
        );

        return;
      }


      setPendingSubmission(
        submission
      );

    } catch (
      error
    ) {
      console.error(
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "提交失败，请稍后再试"
      );

      setSubmitting(
        false
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit(
          submitForm,

          formErrors => {
            console.log(
              "validation errors:",
              formErrors
            );
          }
        )
      }
      className="space-y-6"
    >
      {/* Eligibility */}

      {requiresEligibility && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-950">
              办理前请确认
            </h2>

            <p className="mt-2 text-sm leading-6 text-blue-800">
              请确认您符合以下办理条件。
              未满足必填条件时，请不要继续付款。
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {eligibilitySchema.map(
              item => (
                <label
                  key={
                    item.key
                  }
                  className="
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-blue-100
                    bg-white
                    p-4
                  "
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0"
                    checked={
                      acknowledgedEligibility[
                        item.key
                      ] ??
                      false
                    }
                    onChange={
                      event =>
                        toggleEligibility(
                          item.key,
                          event
                            .target
                            .checked
                        )
                    }
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {
                        item.label
                      }

                      {item.required !==
                        false && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}
                    </p>
                  </div>
                </label>
              )
            )}
          </div>

          {!allEligibilityConfirmed && (
            <p className="mt-4 text-sm font-medium text-blue-900">
              请确认所有标有 * 的办理条件后再继续。
            </p>
          )}
        </section>
      )}

      {/* Form fields */}

      {schema.length >
        0 && (
        <section>
          <h2 className="text-xl font-semibold">
            填写办理资料
          </h2>

          <div className="mt-4 space-y-5">
            {schema.map(
              field => (
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
                        rows={
                          4
                        }
                        className={`w-full rounded-lg border p-3 ${
                          errors[
                            field.name
                          ]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />

                    ) : field.type ===
                      "select" ? (

                      <select
                        {...register(
                          field.name,
                          {
                            required:
                              field.required
                                ? `${field.label} 为必填`
                                : false,
                          }
                        )}
                        defaultValue=""
                        className={`w-full rounded-lg border bg-white p-3 ${
                          errors[
                            field.name
                          ]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option
                          value=""
                          disabled
                        >
                          {field.placeholder ??
                            "请选择"}
                        </option>

                        {(field.options ??
                          []).map(
                          option => (
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

                  {field.helperText && (
                    <p className="text-sm leading-6 text-gray-500">
                      {
                        field.helperText
                      }
                    </p>
                  )}

                  {errors[
                    field.name
                  ] && (
                    <p className="text-sm text-red-500">
                      {
                        errors[
                          field
                            .name
                        ]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* Service Option */}

      {hasServiceOptions && (
        <section>
          <h2 className="text-lg font-bold text-slate-950">
            选择服务方案
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            不同服务方案的服务范围、办理地区和价格可能不同。
          </p>

          <div className="mt-4">
            <ServiceOptionSelector
              prices={
                prices
              }

              value={
                selectedServiceOptionId
              }

              onChange={
                handleServiceOptionChange
              }
            />
          </div>
        </section>
      )}


      {/* Payment */}

      <section>
      <h2 className="text-lg font-bold text-slate-950">
        选择付款方式
      </h2>

        {hasPrices ? (
          <div className="mt-4">
            <PaymentOptionSelector
              prices={
                filteredPrices
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

      {/* Commerce Notice */}

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs leading-6 text-slate-600 sm:text-sm">
        <p>
          提交申请代表您确认所填写的信息和办理条件真实有效，
          并已了解本服务的内容、范围及办理条件。
        </p>

        <p className="mt-2">
          如后续出现无法继续办理、资料条件不符或其他特殊情况，
          将根据实际情况和平台规则进行人工处理。
        </p>
      </section>

{/* Soft Login */}

{pendingSubmission && (
  <SoftAuthGate
    initialEmail={
      pendingSubmission
        .formData
        .email
        ?.trim()
        .toLowerCase() ??
      ""
    }

    onVerified={
      async () => {
        await createPendingOrder(
          pendingSubmission
        );
      }
    }

    onBeforeGoogleSignIn={
      () => {
        savePendingOAuthOrder({
          clientRequestId:
          pendingSubmission
            .clientRequestId,

          serviceId,

          priceId:
            pendingSubmission
              .priceId,

          formData:
            pendingSubmission
              .formData,

          eligibilityAcknowledgementKeys:
            pendingSubmission
              .eligibilityAcknowledgementKeys,
        });
      }
    }
  />
)}


{/* Submit */}

{!pendingSubmission && (
  <button
    type="submit"
    disabled={
      (
        hasServiceOptions &&
        !selectedServiceOptionId
      ) ||
      !hasPrices ||
      !allEligibilityConfirmed ||
      submitting
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
      disabled:bg-gray-400
      disabled:opacity-60
    "
  >
    {submitting
      ? "正在创建订单..."
      : "提交申请"}
  </button>
)}
    </form>
  );
}
