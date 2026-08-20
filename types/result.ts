export type OrderResultStatus =
  | "draft"
  | "delivered";


export type OrderResultDeliveryMode =
  | "none"
  | "email"
  | "workspace"
  | "email_and_workspace";


export interface OrderResult {
  id: string;

  orderId: string;

  serviceId: string;

  workspaceId: string | null;

  resultType: string;

  resultIsOfficial: boolean;

  title: string;

  summary: string;

  metadata: Record<string, unknown>;

  status: OrderResultStatus;

  deliveryMode:
    OrderResultDeliveryMode;

  deliveredAt: string | null;

  deliveredBy: string | null;

  createdAt: string;

  updatedAt: string;
}