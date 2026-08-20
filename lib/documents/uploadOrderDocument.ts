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

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  OTHER_ORDER_DOCUMENT_TYPE,
  PERSONAL_ORDER_DOCUMENT_TYPES,
} from "@/lib/documents/orderDocumentTypes";


const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const ALLOWED_MIME_TYPES =
  new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);


const FILE_EXTENSION_BY_MIME:
  Record<
    string,
    string
  > = {
    "application/pdf":
      "pdf",

    "image/jpeg":
      "jpg",

    "image/png":
      "png",

    "image/webp":
      "webp",
  };


interface ServiceOptionSnapshot {
  requiresDocumentReview?:
    boolean;
}


export async function uploadOrderDocument(
  orderId:
    string,
  formData:
    FormData
) {
  /*
   * ========================================
   * Authentication
   * ========================================
   */

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


  /*
   * ========================================
   * Basic Input
   * ========================================
   */

  const cleanOrderId =
    orderId.trim();


  if (
    !cleanOrderId
  ) {
    throw new Error(
      "缺少订单信息"
    );
  }


  const documentTypeRaw =
    formData.get(
      "documentType"
    );


  const fileRaw =
    formData.get(
      "file"
    );


  if (
    typeof documentTypeRaw !==
      "string"
  ) {
    throw new Error(
      "请选择资料类型"
    );
  }


  const documentType =
    documentTypeRaw
      .trim();


  if (
    !documentType ||
    documentType.length >
      100
  ) {
    throw new Error(
      "资料类型不正确"
    );
  }


  if (
    !(fileRaw instanceof File)
  ) {
    throw new Error(
      "请选择要上传的文件"
    );
  }


  const file =
    fileRaw;


  /*
   * ========================================
   * File Validation
   * ========================================
   */

  if (
    file.size <=
      0
  ) {
    throw new Error(
      "文件内容为空"
    );
  }


  if (
    file.size >
      MAX_FILE_SIZE
  ) {
    throw new Error(
      "单个文件不能超过 10 MB"
    );
  }


  if (
    !ALLOWED_MIME_TYPES.has(
      file.type
    )
  ) {
    throw new Error(
      "仅支持 PDF、JPG、PNG 或 WEBP 文件"
    );
  }


  /*
   * ========================================
   * Order Validation
   * ========================================
   */

  const {
    data:
      order,

    error:
      orderError,
  } =
    await supabase
      .from(
        "orders"
      )
      .select(`
        id,
        user_id,
        payment_status,
        service_option_id,
        service_option_snapshot,
        services (
          slug
        )
      `)
      .eq(
        "id",
        cleanOrderId
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (
    orderError ||
    !order
  ) {
    throw new Error(
      "订单不存在或无权访问"
    );
  }


  /*
   * ========================================
   * Payment Gate
   * ========================================
   */

  if (
    order.payment_status !==
      "paid"
  ) {
    throw new Error(
      "完成付款后才能上传办理资料"
    );
  }


  /*
   * ========================================
   * Document Review Gate
   * ========================================
   */

  const optionSnapshot =
    (
      order
        .service_option_snapshot ??
      null
    ) as
      ServiceOptionSnapshot |
      null;


  if (
    optionSnapshot
      ?.requiresDocumentReview !==
    true
  ) {
    throw new Error(
      "此订单不需要上传办理资料"
    );
  }


  if (
    !order
      .service_option_id
  ) {
    throw new Error(
      "订单服务方案配置不完整"
    );
  }

  const serviceRelation =
  Array.isArray(
    order.services
  )
    ? order.services[0]
    : order.services;


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


    const allowedDocumentTypeValues =
    new Set<string>([
      ...allowedDocumentTypes.map(
        item =>
          item.value
      ),
  
      OTHER_ORDER_DOCUMENT_TYPE
        .value,
    ]);


if (
  !allowedDocumentTypeValues
    .has(
      documentType
    )
) {
  throw new Error(
    "此订单不能上传该资料类型"
  );
}


  /*
   * ========================================
   * Limit Documents
   * ========================================
   */

  const admin =
    createAdminClient();


  const {
    count,
    error:
      countError,
  } =
    await admin
      .from(
        "order_documents"
      )
      .select(
        "id",
        {
          count:
            "exact",

          head:
            true,
        }
      )
      .eq(
        "order_id",
        cleanOrderId
      )
      .neq(
        "status",
        "content_deleted"
      );


  if (
    countError
  ) {
    throw new Error(
      "暂时无法检查资料数量"
    );
  }


  if (
    (
      count ??
      0
    ) >= 20
  ) {
    throw new Error(
      "本订单上传资料数量已达到上限"
    );
  }


  /*
   * ========================================
   * Storage Path
   * ========================================
   */

  const documentId =
    crypto.randomUUID();


  const extension =
    FILE_EXTENSION_BY_MIME[
      file.type
    ];


  const storagePath =
    [
      user.id,
      cleanOrderId,
      documentId,
      `document.${extension}`,
    ].join(
      "/"
    );


  /*
   * ========================================
   * Storage Upload
   * ========================================
   */

  const buffer =
    Buffer.from(
      await file.arrayBuffer()
    );


  const {
    error:
      uploadError,
  } =
    await admin.storage
      .from(
        "order-documents"
      )
      .upload(
        storagePath,
        buffer,
        {
          contentType:
            file.type,

          upsert:
            false,
        }
      );


  if (
    uploadError
  ) {
    console.error(
      "uploadOrderDocument storage error:",
      uploadError
    );

    throw new Error(
      "文件上传失败，请稍后再试"
    );
  }


  /*
   * ========================================
   * Database Record
   * ========================================
   */

  const {
    error:
      insertError,
  } =
    await admin
      .from(
        "order_documents"
      )
      .insert({
        id:
          documentId,

        order_id:
          cleanOrderId,

        service_option_id:
          order
            .service_option_id,

        document_type:
          documentType,

        original_filename:
          file.name
            .slice(
              0,
              255
            ),

        storage_path:
          storagePath,

        mime_type:
          file.type,

        size_bytes:
          file.size,

        status:
          "uploaded",
      });


  /*
   * 如果 DB 写入失败，
   * 把刚刚上传的实体文件删除，
   * 避免 Storage orphan。
   */

  if (
    insertError
  ) {
    console.error(
      "uploadOrderDocument insert error:",
      insertError
    );


    await admin.storage
      .from(
        "order-documents"
      )
      .remove([
        storagePath,
      ]);


    throw new Error(
      "无法保存资料记录，请稍后再试"
    );
  }


  revalidatePath(
    `/account/orders/${cleanOrderId}`
  );


  revalidatePath(
    `/admin/orders/${cleanOrderId}`
  );


  return {
    id:
      documentId,

    status:
      "uploaded" as const,
  };
}