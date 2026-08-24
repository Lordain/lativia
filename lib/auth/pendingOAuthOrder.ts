"use client";


const STORAGE_KEY =
  "lativia:pending-oauth-order:v1";

const TTL_MS =
  30 * 60 * 1000;


export interface PendingOAuthOrder {
  serviceId:
    string;

  priceId:
    string;

  formData:
    Record<string, string>;

  eligibilityAcknowledgementKeys:
    string[];

  createdAt:
    number;

  expiresAt:
    number;

    clientRequestId:
        string;
}


interface SavePendingOAuthOrderInput {
  serviceId:
    string;

  priceId:
    string;

  formData:
    Record<string, string>;

  eligibilityAcknowledgementKeys:
    string[];

    clientRequestId:
        string;
}


export function savePendingOAuthOrder(
  input:
    SavePendingOAuthOrderInput
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  const now =
    Date.now();

  const payload:
    PendingOAuthOrder = {
      serviceId:
        input.serviceId,

      priceId:
        input.priceId,

      formData:
        input.formData,

      eligibilityAcknowledgementKeys:
        input
          .eligibilityAcknowledgementKeys,

      clientRequestId:
        input.clientRequestId,

      createdAt:
        now,

      expiresAt:
        now +
        TTL_MS,
    };


  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      payload
    )
  );
}


export function getPendingOAuthOrder() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }


  const raw =
    sessionStorage.getItem(
      STORAGE_KEY
    );

  if (
    !raw
  ) {
    return null;
  }


  try {
    const parsed =
      JSON.parse(
        raw
      ) as
        Partial<PendingOAuthOrder>;


    if (
    !parsed.clientRequestId ||
    !parsed.serviceId ||
    !parsed.priceId ||
      !parsed.formData ||
      !Array.isArray(
        parsed
          .eligibilityAcknowledgementKeys
      ) ||
      typeof parsed.expiresAt !==
        "number"
    ) {
      clearPendingOAuthOrder();

      return null;
    }


    if (
      Date.now() >
      parsed.expiresAt
    ) {
      clearPendingOAuthOrder();

      return null;
    }


    return parsed as
      PendingOAuthOrder;

  } catch (
    error
  ) {
    console.error(
      "Invalid pending OAuth order:",
      error
    );

    clearPendingOAuthOrder();

    return null;
  }
}


export function clearPendingOAuthOrder() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  sessionStorage.removeItem(
    STORAGE_KEY
  );
}