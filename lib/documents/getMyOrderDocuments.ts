import {
    createClient,
  } from "@/lib/supabase/server";
  
  import type {
    OrderDocument,
    OrderDocumentStatus,
  } from "@/types/orderDocument";
  
  
  export async function getMyOrderDocuments(
    orderId:
      string
  ): Promise<
    OrderDocument[]
  > {
    const supabase =
      await createClient();
  
  
    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser();
  
  
    if (
      !user
    ) {
      return [];
    }
  
  
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "order_documents"
        )
        .select(`
          id,
          order_id,
          service_option_id,
          document_type,
          original_filename,
          mime_type,
          size_bytes,
          status,
          review_note,
          reviewed_at,
          uploaded_at,
          content_deleted_at
        `)
        .eq(
          "order_id",
          orderId
        )
        .order(
          "uploaded_at",
          {
            ascending:
              false,
          }
        );
  
  
    if (
      error
    ) {
      console.error(
        "getMyOrderDocuments error:",
        error.message
      );
  
      return [];
    }
  
  
    return (
      data ??
      []
    ).map(
      row => ({
        id:
          row.id,
  
        orderId:
          row.order_id,
  
        serviceOptionId:
          row.service_option_id,
  
        documentType:
          row.document_type,
  
        originalFilename:
          row.original_filename,
  
        mimeType:
          row.mime_type,
  
        sizeBytes:
          row.size_bytes ===
            null
            ? null
            : Number(
                row.size_bytes
              ),
  
        status:
          row.status as
            OrderDocumentStatus,
  
        reviewNote:
          row.review_note,
  
        reviewedAt:
          row.reviewed_at,
  
        uploadedAt:
          row.uploaded_at,
  
        contentDeletedAt:
          row.content_deleted_at,
      })
    );
  }