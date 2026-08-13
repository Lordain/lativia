import type {
  FormFieldSchema,
} from "./form";

export type FulfillmentType =
  | "automatic"
  | "semi_automatic"
  | "manual";

export interface Service {
  id: string;

  slug: string;
  title: string;

  shortDescription: string;
  description: string;

  icon: string;
  category: string;

  popular: boolean;

  /**
   * 仅作为前台展示。
   * 实际支付金额来自 service_prices。
   */
  price: string;

  duration: string;

  requirements: string[];

  formSchema:
    FormFieldSchema[];

  isActive: boolean;

  /*
   * =====================================
   * Service Outcome / Automation
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

  /**
   * 系统级原则：
   * 成功完成并交付以后不支持退款。
   */
  noRefundAfterCompletion:
    boolean;

  /*
   * =====================================
   * Data / Result
   * =====================================
   */

  personalDataPolicy:
    string;

  resultType:
    string;

  createdAt:
    string | null;

  updatedAt:
    string | null;
}

export interface ServiceFormData {
  slug: string;

  title: string;

  shortDescription: string;

  description: string;

  category: string;

  icon: string;

  price: string;

  duration: string;

  requirements: string;

  popular: boolean;

  isActive: boolean;

  formSchema:
    FormFieldSchema[];

  customerValue: string;

  expectedOutcome: string;

  fulfillmentType:
    FulfillmentType;

  humanReviewRequired:
    boolean;

  humanReviewNotes:
    string;

  refundEligibleWhenFailed:
    boolean;

  personalDataPolicy:
    string;

  resultType:
    string;
}

export interface CreateServiceInput
  extends ServiceFormData {}