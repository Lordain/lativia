"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";


export async function reviewOrderDocument(
  documentId:
    string,
  action:
    "approve" |
    "reject",
  note:
    string
) {
  const adminProfile =
    await requireAdmin();


  const admin =
    createAdminClient();


  const cleanNote =
    note.trim();


  if (
    action ===
      "reject" &&
    !cleanNote
  ) {
    throw new Error(
      "标记为需重新提交时，请填写原因"
    );
  }


  if (
    cleanNote.length >
      2000
  ) {
    throw new Error(
      "审核说明过长"
    );
  }


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
      "content_deleted"
  ) {
    throw new Error(
      "该资料内容已经清理，无法继续审核"
    );
  }


  const nextStatus =
    action ===
      "approve"
      ? "approved"
      : "rejected";


  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "order_documents"
      )
      .update({
        status:
          nextStatus,

        review_note:
          cleanNote ||
          null,

        reviewed_by:
          adminProfile.id,

        reviewed_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        documentId
      );


  if (
    updateError
  ) {
    console.error(
      "reviewOrderDocument error:",
      updateError
    );

    throw new Error(
      "无法保存审核结果"
    );
  }


  revalidatePath(
    `/admin/orders/${document.order_id}`
  );


  revalidatePath(
    `/account/orders/${document.order_id}`
  );


  return {
    status:
      nextStatus,
  };
}