import type {
  ServiceFormData,
} from "@/types/service";

/*
 * =====================================
 * Platform-level rules
 * =====================================
 */

const DEFAULT_PERSONAL_DATA_POLICY =
  "客户提交的个人资料仅用于完成本次服务。办理期间仅保留完成服务所必要的资料；当资料用途结束、订单完成或确认不再需要后，相关临时资料默认进入 48 小时删除流程。";

const DEFAULT_RESULT_RETENTION_HOURS =
  48;

export function toDatabase(
  formData:
    ServiceFormData
) {
  const hasResultFile =
    formData.hasResultFile;

  return {
    /*
     * =====================================
     * Basic
     * =====================================
     */

    slug:
      formData.slug
        .trim(),

    title:
      formData.title
        .trim(),

    short_description:
      formData
        .shortDescription
        .trim(),

    description:
      formData.description
        .trim(),

    category:
      formData.category
        .trim(),

    icon:
      formData.icon
        .trim(),

    /*
     * Legacy display price.
     * 实际支付金额由 service_prices 控制。
     */
    price:
      formData.price
        .trim(),

    duration:
      formData.duration
        .trim(),

    requirements:
      formData.requirements
        .trim(),

    popular:
      formData.popular,

    /*
     * =====================================
     * Legacy Availability Compatibility
     * =====================================
     */

    is_active:
      formData
        .serviceStatus !==
      "hidden",

    /*
     * =====================================
     * Customer Order Form
     * =====================================
     */

    form_schema:
      formData
        .formSchema
        .map(
          field => ({
            ...field,

            name:
              field.name
                .trim(),

            label:
              field.label
                .trim(),

            placeholder:
              field
                .placeholder
                ?.trim() ||
              undefined,
          })
        ),

    /*
     * =====================================
     * Service Architecture
     * =====================================
     */

    service_type:
      formData.serviceType,

    launch_priority:
      formData.launchPriority,

    service_status:
      formData.serviceStatus,

    /*
     * =====================================
     * Eligibility
     * =====================================
     */

    eligibility_mode:
      formData.eligibilityMode,

    eligibility_schema:
      formData.eligibilityMode ===
        "self_check"
        ? formData
            .eligibilitySchema
            .map(
              item => ({
                key:
                  item.key
                    .trim(),

                label:
                  item.label
                    .trim(),

                required:
                  item.required,
              })
            )
        : [],

    /*
     * =====================================
     * Workspace / Completion
     * =====================================
     */

    workspace_required:
      formData
        .workspaceRequired,

    access_duration_days:
      (
        formData
          .completionMode ===
          "time_based" ||
        formData
          .completionMode ===
          "time_or_milestone"
      )
        ? formData
            .accessDurationDays
        : null,

    completion_mode:
      formData.completionMode,

    completion_milestones:
      (
        formData
          .completionMode ===
          "milestone_based" ||
        formData
          .completionMode ===
          "time_or_milestone"
      )
        ? formData
            .completionMilestones
            .map(
              milestone => ({
                key:
                  milestone.key
                    .trim(),

                label:
                  milestone.label
                    .trim(),

                required:
                  milestone.required,
              })
            )
        : [],

    /*
     * =====================================
     * Internal Fulfillment
     *
     * Admin 不再配置技术办理模式。
     * Phase 1 所有服务都保留人工处理能力。
     * =====================================
     */

    fulfillment_type:
      "manual",

    human_review_required:
      true,

    human_review_notes:
      null,

    /*
     * =====================================
     * Service Result
     * =====================================
     *
     * customer_value 已不再需要
     * Admin 单独填写。
     *
     * 为兼容当前数据库，
     * 使用简短说明作为内部值。
     */

    customer_value:
      formData
        .shortDescription
        .trim(),

    expected_outcome:
      formData
        .expectedOutcome
        .trim(),

    /*
     * result_type 不再让 Admin
     * 重复填写，直接使用客户最终获得。
     */

    result_type:
      formData
        .expectedOutcome
        .trim(),

    result_is_official:
      formData
        .resultIsOfficial,

    /*
     * Admin 只判断有没有结果文件。
     *
     * 有：
     * Email + Workspace
     * 平台临时副本 48h
     *
     * 无：
     * 无文件交付
     * 不产生结果文件 retention
     */

    result_delivery_mode:
      hasResultFile
        ? "email_and_workspace"
        : "none",

    result_retention_hours:
      hasResultFile
        ? DEFAULT_RESULT_RETENTION_HOURS
        : null,

    /*
     * =====================================
     * Privacy
     * =====================================
     */

    personal_data_policy:
      DEFAULT_PERSONAL_DATA_POLICY,

    /*
     * =====================================
     * Refund
     * =====================================
     */

    refund_eligible_when_failed:
      formData
        .refundEligibleWhenFailed,

    /*
     * 系统级规则。
     * Admin 不允许关闭。
     */

    no_refund_after_completion:
      true,
  };
}