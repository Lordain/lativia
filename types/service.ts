import type {
  FormFieldSchema,
} from "./form";

/*
 * =====================================
 * Service Architecture Types
 * =====================================
 */

export type FulfillmentType =
  | "automatic"
  | "semi_automatic"
  | "manual";

export type ServiceType =
  | "online_query"
  | "accompaniment"
  | "agency"
  | "consultation";

export type LaunchPriority =
  | "first"
  | "second";

export type ServiceStatus =
  | "active"
  | "paused"
  | "hidden";

export type EligibilityMode =
  | "none"
  | "self_check";

export type CompletionMode =
  | "manual"
  | "time_based"
  | "milestone_based"
  | "time_or_milestone";

export type ResultDeliveryMode =
  | "none"
  | "email"
  | "workspace"
  | "email_and_workspace";

export interface EligibilityItem {
  key: string;

  label: string;

  required: boolean;
}

export interface CompletionMilestone {
  key: string;

  label: string;

  required: boolean;
}

/*
 * =====================================
 * Full Service Model
 *
 * 数据库 / 系统内部完整模型。
 * 不等于 Admin ServiceForm。
 * =====================================
 */

export interface Service {
  id: string;

  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  icon: string;

  category: string;

  popular: boolean;

  /*
   * 当前暂时保留用于前台展示。
   * 实际收费金额由 service_prices 管理。
   */
  price: string;

  duration: string;

  requirements: string[];

  formSchema:
    FormFieldSchema[];

  /*
   * Legacy compatibility.
   * Admin 不再直接维护。
   */
  isActive: boolean;

  /*
   * =====================================
   * Service Architecture
   * =====================================
   */

  serviceType:
    ServiceType;

  launchPriority:
    LaunchPriority;

  serviceStatus:
    ServiceStatus;

  eligibilityMode:
    EligibilityMode;

  eligibilitySchema:
    EligibilityItem[];

  workspaceRequired:
    boolean;

  accessDurationDays:
    number | null;

  completionMode:
    CompletionMode;

  completionMilestones:
    CompletionMilestone[];

  /*
   * =====================================
   * Internal Service Design
   * =====================================
   */

  customerValue: string;

  expectedOutcome: string;

  fulfillmentType:
    FulfillmentType;

  humanReviewRequired:
    boolean;

  humanReviewNotes:
    string;

  /*
   * =====================================
   * Refund
   * =====================================
   */

  refundEligibleWhenFailed:
    boolean;

  noRefundAfterCompletion:
    boolean;

  /*
   * =====================================
   * Privacy / Result
   * =====================================
   */

  personalDataPolicy:
    string;

  resultType:
    string;

  resultIsOfficial:
    boolean;

  resultDeliveryMode:
    ResultDeliveryMode;

  resultRetentionHours:
    number | null;

  createdAt:
    string | null;

  updatedAt:
    string | null;
}

/*
 * =====================================
 * Admin Service Form
 *
 * 这里只保留运营人员真正需要决定的内容。
 * 技术实现与平台级规则由系统自动补齐。
 * =====================================
 */

export interface ServiceFormData {
  /*
   * Basic
   */

  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  category: string;

  icon: string;

  /*
   * 本轮暂时保留。
   * 后续统一改由 service_prices
   * 作为唯一价格来源。
   */
  price: string;

  duration: string;

  requirements: string;

  popular: boolean;

  /*
   * Service Settings
   */

  serviceType:
    ServiceType;

  launchPriority:
    LaunchPriority;

  serviceStatus:
    ServiceStatus;

  /*
   * Eligibility
   */

  eligibilityMode:
    EligibilityMode;

  eligibilitySchema:
    EligibilityItem[];

  /*
   * Customer Order Form
   */

  formSchema:
    FormFieldSchema[];

  /*
   * Execution
   */

  workspaceRequired:
    boolean;

  completionMode:
    CompletionMode;

  accessDurationDays:
    number | null;

  completionMilestones:
    CompletionMilestone[];

  /*
   * Result
   */

  expectedOutcome:
    string;

  resultIsOfficial:
    boolean;

  /*
   * Admin 只需要回答：
   * “有没有结果文件？”
   *
   * 系统自动转换：
   *
   * true
   * → email_and_workspace
   * → 48h
   *
   * false
   * → none
   * → null
   */
  hasResultFile:
    boolean;

  /*
   * Refund
   */

  refundEligibleWhenFailed:
    boolean;
}

export interface CreateServiceInput
  extends ServiceFormData {}