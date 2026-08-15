export type CustomerActionRequestStatus =
  | "pending"
  | "submitted"
  | "resolved"
  | "cancelled";


export type CustomerActionSubmissionStatus =
  | "submitted"
  | "approved"
  | "rejected";


/*
 * =========================================
 * Requested Field
 * =========================================
 *
 * key:
 * 使用原 service form_schema 的 field.name
 *
 * label:
 * 客户看到的字段名称
 *
 * reason:
 * 管理员要求客户修正该字段的原因
 */

export interface CustomerActionRequestedField {
  label: string;

  reason: string;
}


export type CustomerActionRequestedFields =
  Record<
    string,
    CustomerActionRequestedField
  >;


/*
 * =========================================
 * Customer Action Request
 * =========================================
 */

export interface CustomerActionRequest {
  id: string;

  orderId: string;

  userId: string;

  fulfillmentId:
    string | null;

  status:
    CustomerActionRequestStatus;

  requestedFields:
    CustomerActionRequestedFields;

  message:
    string | null;

  requestedBy:
    string | null;

  requestedAt:
    string;

  submittedAt:
    string | null;

  resolvedAt:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
}


/*
 * =========================================
 * Customer Action Submission
 * =========================================
 */

export interface CustomerActionSubmission {
  id: string;

  requestId: string;

  orderId: string;

  userId: string;

  submittedData:
    Record<string, string>;

  status:
    CustomerActionSubmissionStatus;

  reviewedBy:
    string | null;

  reviewReason:
    string | null;

  submittedAt:
    string;

  reviewedAt:
    string | null;

  createdAt:
    string;
}


/*
 * =========================================
 * Admin Create Request
 * =========================================
 */

export interface CreateCustomerActionRequestInput {
  orderId: string;

  fulfillmentId:
    string | null;

  requestedFields:
    CustomerActionRequestedFields;

  message?:
    string | null;
}


/*
 * =========================================
 * Customer Submit Correction
 * =========================================
 */

export interface SubmitCustomerActionInput {
  requestId: string;

  submittedData:
    Record<string, string>;
}