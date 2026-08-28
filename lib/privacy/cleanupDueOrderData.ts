import "server-only";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


const STORAGE_BUCKET =
  "order-documents";


interface DueOrderRow {
  id:
    string;
}


interface OrderDocumentRow {
  id:
    string;

  storage_path:
    string | null;

  status:
    string;
}


export async function cleanupDueOrderData(
  limit:
    number = 50
) {
  const admin =
    createAdminClient();


  const now =
    new Date()
      .toISOString();


  /*
   * ========================================
   * Find due orders
   * ========================================
   */

  const {
    data:
      dueOrdersRaw,

    error:
      dueOrdersError,
  } =
    await admin
      .from(
        "orders"
      )
      .select(
        "id"
      )
      .in(
        "data_cleanup_status",
        [
          "scheduled",
          "failed",
        ]
      )
      .not(
        "data_cleanup_due_at",
        "is",
        null
      )
      .lte(
        "data_cleanup_due_at",
        now
      )
      .order(
        "data_cleanup_due_at",
        {
          ascending:
            true,
        }
      )
      .limit(
        limit
      );


  if (
    dueOrdersError
  ) {
    throw new Error(
      "DUE_ORDERS_READ_FAILED"
    );
  }


  const dueOrders =
    (
      dueOrdersRaw ??
      []
    ) as
      DueOrderRow[];


  let completed =
    0;

  let failed =
    0;


  for (
    const order
    of dueOrders
  ) {
    try {

      /*
       * ========================================
       * Read physical documents
       * ========================================
       */

      const {
        data:
          documentsRaw,

        error:
          documentsError,
      } =
        await admin
          .from(
            "order_documents"
          )
          .select(`
            id,
            storage_path,
            status
          `)
          .eq(
            "order_id",
            order.id
          )
          .not(
            "storage_path",
            "is",
            null
          )
          .neq(
            "status",
            "content_deleted"
          );


      if (
        documentsError
      ) {
        throw new Error(
          "ORDER_DOCUMENTS_READ_FAILED"
        );
      }


      const documents =
        (
          documentsRaw ??
          []
        ) as
          OrderDocumentRow[];


      /*
       * ========================================
       * Delete Storage objects
       * ========================================
       */

      const storagePaths =
        documents
          .map(
            document =>
              document
                .storage_path
          )
          .filter(
            (
              value
            ): value is string =>
              Boolean(
                value
              )
          );


      if (
        storagePaths.length >
        0
      ) {
        const {
          error:
            storageError,
        } =
          await admin
            .storage
            .from(
              STORAGE_BUCKET
            )
            .remove(
              storagePaths
            );


        if (
          storageError
        ) {
          throw new Error(
            "STORAGE_DELETE_FAILED"
          );
        }
      }


      /*
       * ========================================
       * Remove document personal metadata
       *
       * Keep document skeleton for audit:
       * id / order_id / document_type /
       * status / timestamps.
       * ========================================
       */

      if (
        documents.length >
        0
      ) {
        const documentIds =
          documents.map(
            document =>
              document.id
          );


        const {
          error:
            metadataError,
        } =
          await admin
            .from(
              "order_documents"
            )
            .update({
              original_filename:
                null,

              storage_path:
                null,

              mime_type:
                null,

              size_bytes:
                null,

              review_note:
                null,

              status:
                "content_deleted",

              content_deleted_at:
                new Date()
                  .toISOString(),
            })
            .in(
              "id",
              documentIds
            );


        if (
          metadataError
        ) {
          throw new Error(
            "DOCUMENT_METADATA_CLEANUP_FAILED"
          );
        }
      }


      /*
       * ========================================
       * Final DB cleanup
       *
       * SQL function will now verify that no
       * Storage-backed documents remain.
       * ========================================
       */

      const {
        error:
          cleanupError,
      } =
        await admin
          .rpc(
            "cleanup_order_temporary_data",
            {
              p_order_id:
                order.id,
            }
          );


      if (
        cleanupError
      ) {
        throw new Error(
          "DATABASE_CLEANUP_FAILED"
        );
      }


      completed +=
        1;

    } catch (
      error
    ) {
      failed +=
        1;


      const message =
        error instanceof Error
          ? error.message
          : "UNKNOWN_CLEANUP_ERROR";


      console.error(
        "cleanupDueOrderData:",
        order.id,
        message
      );


      /*
       * Do not mark completed.
       * Keep order retryable.
       */

      await admin
        .from(
          "orders"
        )
        .update({
          data_cleanup_status:
            "failed",

          data_cleanup_last_error:
            message.slice(
              0,
              1000
            ),
        })
        .eq(
          "id",
          order.id
        );
    }
  }


  return {
    scanned:
      dueOrders.length,

    completed,

    failed,
  };
}