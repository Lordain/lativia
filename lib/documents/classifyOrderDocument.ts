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

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  OTHER_ORDER_DOCUMENT_TYPE,
  PERSONAL_ORDER_DOCUMENT_TYPES,
} from "@/lib/documents/orderDocumentTypes";


export async function classifyOrderDocument(
  documentId:
    string,
  documentType:
    string
) {
  await requireAdmin();


  const admin =
    createAdminClient();


  const cleanDocumentId =
    documentId.trim();


  const cleanDocumentType =
    documentType.trim();


  if (
    !cleanDocumentId
  ) {
    throw new Error(
      "缺少资料信息"
    );
  }


  if (
    !cleanDocumentType ||
    cleanDocumentType ===
      "unclassified"
  ) {
    throw new Error(
      "请选择正确的资料分类"
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
        status,
        orders (
          services (
            slug
          )
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


  if (
    document.status ===
    "content_deleted"
  ) {
    throw new Error(
      "该资料内容已经清理，无法分类"
    );
  }


  if (
    document.status !==
    "uploaded"
  ) {
    throw new Error(
      "已完成审核的资料不能重新分类"
    );
  }


  const orderRelation =
    Array.isArray(
      document.orders
    )
      ? document.orders[0]
      : document.orders;


  const serviceRelation =
    Array.isArray(
      orderRelation?.services
    )
      ? orderRelation
          ?.services[0]
      : orderRelation
          ?.services;


  const serviceSlug =
    serviceRelation
      ?.slug ??
    "";


  const allowedDocumentTypes =
    serviceSlug.startsWith(
      "company-"
    )
      ? COMPANY_ORDER_DOCUMENT_TYPES
      : PERSONAL_ORDER_DOCUMENT_TYPES;


  const allowedValues =
    new Set<string>([
      ...allowedDocumentTypes.map(
        item =>
          item.value
      ),

      OTHER_ORDER_DOCUMENT_TYPE
        .value,
    ]);


  if (
    !allowedValues.has(
      cleanDocumentType
    )
  ) {
    throw new Error(
      "该资料分类不适用于此服务"
    );
  }


  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "order_documents"
      )
      .update({
        document_type:
          cleanDocumentType,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        cleanDocumentId
      );


  if (
    updateError
  ) {
    console.error(
      "classifyOrderDocument error:",
      updateError
    );


    throw new Error(
      "无法保存资料分类"
    );
  }


  revalidatePath(
    `/admin/orders/${document.order_id}`
  );


  revalidatePath(
    `/account/orders/${document.order_id}`
  );


  return {
    documentType:
      cleanDocumentType,
  };
}