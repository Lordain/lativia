import type {
  CompletionMode,
  CompletionMilestone,
  EligibilityItem,
  EligibilityMode,
  FulfillmentType,
  LaunchPriority,
  ResultDeliveryMode,
  Service,
  ServiceStatus,
  ServiceType,
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
            .split(
              /[\r\n,]+/
            )
            .map(
              (
                item: string
              ) =>
                item.trim()
            )
            .filter(
              Boolean
            )
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


    /*
     * =====================================
     * Service Architecture
     * =====================================
     */

    serviceType:
      (
        data.service_type ??
        "online_query"
      ) as ServiceType,

    launchPriority:
      (
        data.launch_priority ??
        "second"
      ) as LaunchPriority,

    serviceStatus:
      (
        data.service_status ??
        "active"
      ) as ServiceStatus,


    /*
     * =====================================
     * Eligibility
     * =====================================
     */

    eligibilityMode:
      (
        data.eligibility_mode ??
        "none"
      ) as EligibilityMode,

    eligibilitySchema:
      Array.isArray(
        data.eligibility_schema
      )
        ? data
            .eligibility_schema as
              EligibilityItem[]
        : [],


    /*
     * =====================================
     * Workspace
     * =====================================
     */

    workspaceRequired:
      Boolean(
        data.workspace_required
      ),


    /*
     * =====================================
     * Access / Completion
     * =====================================
     */

    accessDurationDays:
      typeof
        data.access_duration_days ===
      "number"
        ? data.access_duration_days
        : null,

    completionMode:
      (
        data.completion_mode ??
        "manual"
      ) as CompletionMode,

    completionMilestones:
      Array.isArray(
        data.completion_milestones
      )
        ? data
            .completion_milestones as
              CompletionMilestone[]
        : [],


    /*
     * =====================================
     * Value / Fulfillment
     * =====================================
     */

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


    /*
     * =====================================
     * Refund
     * =====================================
     */

    refundEligibleWhenFailed:
      data
        .refund_eligible_when_failed !==
      false,

    noRefundAfterCompletion:
      data
        .no_refund_after_completion !==
      false,


    /*
     * =====================================
     * Data / Result
     * =====================================
     */

    personalDataPolicy:
      data
        .personal_data_policy ??
      "",

    resultType:
      data.result_type ??
      "",

    resultIsOfficial:
      Boolean(
        data.result_is_official
      ),

    resultRequired:
      Boolean(
        data.result_required
      ),

    resultDeliveryMode:
      (
        data.result_delivery_mode ??
        "none"
      ) as ResultDeliveryMode,

    resultRetentionHours:
      typeof
        data.result_retention_hours ===
      "number"
        ? data.result_retention_hours
        : null,


    createdAt:
      data.created_at ??
      null,

    updatedAt:
      data.updated_at ??
      null,
  };
}