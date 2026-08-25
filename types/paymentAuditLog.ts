export type PaymentAuditAction = "reverify" | "repair" | "manual_confirm";

export type PaymentAuditResult = "success" | "failed" | "blocked";

export interface PaymentAuditLog {
  id: string;

  orderId: string | null;

  adminUserId: string | null;

  action: PaymentAuditAction;

  provider: string | null;

  result: PaymentAuditResult;

  message: string | null;

  metadata: Record<string, unknown>;

  createdAt: string;
}
