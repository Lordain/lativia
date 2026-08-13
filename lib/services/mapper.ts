import type {
  FulfillmentType,
  Service,
} from "@/types/service";

export function normalizeService(
  data: any
): Service {
  return {
    id:
      data.id,

    slug:
      data.slug ?? "",

    title:
      data.title ?? "",

    shortDescription:
      data.short_description ??
      "",

    description:
      data.description ??
      "",

    icon:
      data.icon ?? "📄",

    category:
      data.category ??
      "",

    popular:
      Boolean(
        data.popular
      ),

    price:
      data.price ?? "",

    duration:
      data.duration ??
      "",

    requirements:
      data.requirements
        ? String(
            data.requirements
          )
            .split(",")
            .map(
              (
                item: string
              ) =>
                item.trim()
            )
            .filter(Boolean)
        : [],

    formSchema:
      Array.isArray(
        data.form_schema
      )
        ? data.form_schema
        : [],

    isActive:
      data.is_active !==
      false,

    customerValue:
      data.customer_value ??
      "",

    expectedOutcome:
      data.expected_outcome ??
      "",

    fulfillmentType:
      (
        data.fulfillment_type ??
        "semi_automatic"
      ) as FulfillmentType,

    humanReviewRequired:
      data
        .human_review_required !==
      false,

    humanReviewNotes:
      data
        .human_review_notes ??
      "",

    refundEligibleWhenFailed:
      data
        .refund_eligible_when_failed !==
      false,

    noRefundAfterCompletion:
      data
        .no_refund_after_completion !==
      false,

    personalDataPolicy:
      data
        .personal_data_policy ??
      "",

    resultType:
      data.result_type ??
      "",

    createdAt:
      data.created_at ??
      null,

    updatedAt:
      data.updated_at ??
      null,
  };
}