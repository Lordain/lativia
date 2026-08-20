export type OrderDocumentStatus =
  | "uploaded"
  | "approved"
  | "rejected"
  | "content_deleted";


export interface OrderDocument {
  id:
    string;

  orderId:
    string;

  serviceOptionId:
    string | null;

  documentType:
    string;

  originalFilename:
    string | null;

  mimeType:
    string | null;

  sizeBytes:
    number | null;

  status:
    OrderDocumentStatus;

  reviewNote:
    string | null;

  reviewedAt:
    string | null;

  uploadedAt:
    string;

  contentDeletedAt:
    string | null;
}