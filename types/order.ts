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
  | "completed"
  | "cancelled";

export interface Order {
  id: string;

  userId: string;

  serviceId: string;

  status: OrderStatus;

  formData: Record<string, string>;

  adminNote: string | null;

  createdAt: string;

  updatedAt: string;

  paymentStatus: PaymentStatus;

  amount: number | null;

  currency: Currency | null;

  paymentMethod: PaymentMethod | null;

  paymentProvider: PaymentProvider;

  paidAt: string | null;
}

export interface CreateOrderInput {
  serviceId: string;

  formData: Record<string, string>;
}