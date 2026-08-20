import type {
  Currency,
  PaymentMethod,
  PaymentProvider,
} from "./payment";


export type ServiceMode =
  | "appointment_only"
  | "appointment_plus_onsite";


export interface ServiceOptionSummary {
  id: string;

  optionKey: string;

  title: string;

  description:
    string | null;

  serviceMode:
    ServiceMode;

  onsiteAvailable:
    boolean;

  allowedRegions:
    string[];

  requiresDocumentReview:
    boolean;

  workspaceRequired:
    boolean;

  active:
    boolean;

  sortOrder:
    number;
}


export interface ServicePrice {
  id: string;

  serviceId: string;

  serviceOptionId:
    string | null;

  serviceOption:
    ServiceOptionSummary | null;

  currency:
    Currency;

  amount:
    number;

  paymentMethod:
    PaymentMethod;

  paymentProvider:
    PaymentProvider;

  active:
    boolean;
}