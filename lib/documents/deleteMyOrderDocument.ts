"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


export async function deleteMyOrderDocument(
  documentId:
    string
) {
  const supabase =
    await createClient();


  const {
    data: {
      user,
    },

    error:
      userError,
  } =
    await supabase.auth.getUser();


  if (
    userError ||
    !user
  ) {
    throw new Error(
      "请先登录"
    );
  }


  const cleanDocumentId =
    documentId.trim();


  if (
    !cleanDocumentId
  ) {
    throw new Error(
      "缺少资料信息"
    );
  }


  const admin =
    createAdminClient();


  /*
   * ========================================
   * Read document + verify ownership
   * ========================================
   */

  const {
    data:
      document,

    error:
      documentError,
  } =
    await admin
      .from(
        "order_documents"
      )
      .select(`
        id,
        order_id,
        status,
        storage_path,
        orders!inner (
          user_id
        )
      `)
      .eq(
        "id",
        cleanDocumentId
      )
      .maybeSingle();


  if (
    documentError ||
    !document
  ) {
    throw new Error(
      "资料不存在"
    );
  }


  const orderRelation =
    Array.isArray(
      document.orders
    )
      ? document.orders[0]
      : document.orders;


  if (
    !orderRelation ||
    orderRelation.user_id !==
      user.id
  ) {
    throw new Error(
      "无权删除这份资料"
    );
  }


  if (
    document.status ===
      "content_deleted"
  ) {
    return {
      status:
        "content_deleted" as const,
    };
  }


  /*
   * ========================================
   * Delete actual Storage content
   * ========================================
   */

  if (
    document.storage_path
  ) {
    const {
      error:
        storageDeleteError,
    } =
      await admin.storage
        .from(
          "order-documents"
        )
        .remove([
          document.storage_path,
        ]);


    if (
      storageDeleteError
    ) {
      console.error(
        "deleteMyOrderDocument storage error:",
        storageDeleteError
      );


      throw new Error(
        "无法删除文件内容，请稍后再试"
      );
    }
  }


  /*
   * ========================================
   * Keep minimum audit skeleton only
   * ========================================
   */

  const now =
    new Date()
      .toISOString();


  const {
    error:
      updateError,
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

        status:
          "content_deleted",

        review_note:
          null,

        content_deleted_at:
          now,

        updated_at:
          now,
      })
      .eq(
        "id",
        cleanDocumentId
      );


  if (
    updateError
  ) {
    console.error(
      "deleteMyOrderDocument update error:",
      updateError
    );


    throw new Error(
      "文件已经删除，但无法更新资料记录"
    );
  }


  revalidatePath(
    `/account/orders/${document.order_id}`
  );


  revalidatePath(
    `/admin/orders/${document.order_id}`
  );


  return {
    status:
      "content_deleted" as const,
  };
}