import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from "./payment";

export type OrderStatus =
  | "pending"
  | "processing"
  | "waiting_documents"
  | "waiting_customer"
  | "completed"
  | "cancelled";

/*
 * =========================================
 * Eligibility
 * =========================================
 *
 * 客户只提交自己确认过的 eligibility key。
 *
 * label 等内容不能信任 Client，
 * createOrder 会从 services.eligibility_schema
 * 在 Server 端重新取得。
 */

export interface EligibilityAcknowledgement {
  key: string;
  label: string;
}

export interface Order {
  id: string;

  userId: string;

  serviceId: string;

  status: OrderStatus;

  formData:
    Record<string, string>;

  adminNote:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;

  paymentStatus:
    PaymentStatus;

  amount:
    number | null;

  currency:
    Currency | null;

  paymentMethod:
    PaymentMethod | null;

  paymentProvider:
    PaymentProvider;

  paidAt:
    string | null;

  eligibilityAcknowledgements:
    EligibilityAcknowledgement[];

  eligibilityConfirmedAt:
    string | null;
}

export interface CreateOrderInput {
  serviceId: string;

  priceId: string;

  formData:
    Record<string, string>;

  /*
   * 只传 key。
   *
   * Server 会重新读取 Service，
   * 验证这些 key 是否真的属于
   * 当前 Service 的 eligibilitySchema。
   */
  eligibilityAcknowledgementKeys:
    string[];
}