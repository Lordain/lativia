"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import type {
  ServicePriceFormData,
} from "@/types/servicePriceAdmin";


export async function updateServicePrice(
  serviceId: string,
  priceId: string,
  input: ServicePriceFormData
) {
  await requireAdmin();


  const amount =
    Number(
      input.amount
    );


  if (
    !Number.isFinite(
      amount
    ) ||
    amount <= 0
  ) {
    throw new Error(
      "请输入有效金额"
    );
  }


  const currency =
    input.currency
      .trim()
      .toUpperCase();


  if (
    currency !== "MXN" &&
    currency !== "CNY"
  ) {
    throw new Error(
      "请选择有效币种"
    );
  }


  const paymentMethod =
    input.paymentMethod
      .trim();


  if (
    paymentMethod !== "local_payment" &&
    paymentMethod !== "card" &&
    paymentMethod !== "wechat_pay"
  ) {
    throw new Error(
      "请选择有效付款方式"
    );
  }


  const paymentProvider =
    input.paymentProvider ||
    null;


  const isManualWeChatPayment =
    currency ===
      "CNY" &&
    paymentMethod ===
      "wechat_pay" &&
    paymentProvider ===
      null;


  if (
    input.active &&
    !paymentProvider &&
    !isManualWeChatPayment
  ) {
    throw new Error(
      "启用付款方式前必须选择 Payment Provider；仅人民币微信人工付款允许不绑定 Provider"
    );
  }


  const supabase =
    createAdminClient();


  const {
    error,
  } =
    await supabase
      .from(
        "service_prices"
      )
      .update({
        currency,

        amount,

        payment_method:
          paymentMethod,

        payment_provider:
          paymentProvider,

        active:
          input.active,
      })
      .eq(
        "id",
        priceId
      )
      .eq(
        "service_id",
        serviceId
      );


  if (
    error
  ) {
    console.error(
      "updateServicePrice error:",
      error
    );

    throw new Error(
      error.message
    );
  }


  revalidatePath(
    `/admin/services/${serviceId}`
  );
}
