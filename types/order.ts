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
}

export interface CreateOrderInput {
  serviceId: string;

  formData: Record<string, string>;
}