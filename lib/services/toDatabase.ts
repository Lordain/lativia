import type {
  ServiceFormData,
} from "@/types/service";

export function toDatabase(
  formData: ServiceFormData
) {
  return {
    slug:
      formData.slug
        .trim()
        .toLowerCase(),

    title:
      formData.title
        .trim(),

    short_description:
      formData
        .shortDescription
        .trim(),

    description:
      formData
        .description
        .trim(),

    category:
      formData.category
        .trim(),

    icon:
      formData.icon
        .trim(),

    price:
      formData.price
        .trim(),

    duration:
      formData.duration
        .trim(),

    requirements:
      formData.requirements
        .split(",")
        .map(
          (item) =>
            item.trim()
        )
        .filter(Boolean)
        .join(", "),

    popular:
      formData.popular,

    is_active:
      formData.isActive,

    form_schema:
      formData.formSchema.map(
        (field) => ({
          name:
            field.name
              .trim(),

          label:
            field.label
              .trim(),

          type:
            field.type,

          placeholder:
            field.placeholder
              ?.trim() ??
            "",

          required:
            Boolean(
              field.required
            ),
        })
      ),

    /*
     * =====================================
     * Service Value / Outcome
     * =====================================
     */

    customer_value:
      formData
        .customerValue
        .trim(),

    expected_outcome:
      formData
        .expectedOutcome
        .trim(),

    /*
     * =====================================
     * Fulfillment
     * =====================================
     */

    fulfillment_type:
      formData
        .fulfillmentType,

    human_review_required:
      formData
        .humanReviewRequired,

    human_review_notes:
      formData
        .humanReviewNotes
        .trim(),

    /*
     * =====================================
     * Refund
     * =====================================
     */

    refund_eligible_when_failed:
      formData
        .refundEligibleWhenFailed,

    /*
     * 不接受前端输入。
     * 服务完成后不退款属于系统级规则。
     */
    no_refund_after_completion:
      true,

    /*
     * =====================================
     * Privacy / Result
     * =====================================
     */

    personal_data_policy:
      formData
        .personalDataPolicy
        .trim(),

    result_type:
      formData
        .resultType
        .trim(),
  };
}