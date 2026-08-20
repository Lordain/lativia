"use server";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


export async function createOrderDocumentSignedUrl(
  documentId:
    string
) {
  await requireAdmin();


  const admin =
    createAdminClient();


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
        storage_path,
        status
      `)
      .eq(
        "id",
        documentId
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


  if (
    document.status ===
      "content_deleted" ||
    !document.storage_path
  ) {
    throw new Error(
      "该资料内容已经清理"
    );
  }


  const {
    data,
    error,
  } =
    await admin.storage
      .from(
        "order-documents"
      )
      .createSignedUrl(
        document.storage_path,
        300
      );


  if (
    error ||
    !data?.signedUrl
  ) {
    throw new Error(
      "暂时无法打开资料"
    );
  }


  return {
    url:
      data.signedUrl,
  };
}