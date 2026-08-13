export type OrderTimelineSource =
  | "payment"
  | "payment_audit"
  | "fulfillment";

export type OrderTimelineLevel =
  | "info"
  | "success"
  | "warning"
  | "error";

export interface OrderTimelineItem {
  id: string;

  source:
    OrderTimelineSource;

  level:
    OrderTimelineLevel;

  title: string;

  description:
    string | null;

  actor:
    string | null;

  createdAt:
    string;

  metadata:
    Record<
      string,
      unknown
    >;
}