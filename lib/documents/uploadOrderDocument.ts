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


const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const MAX_DOCUMENTS_PER_ORDER =
  20;


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


interface PendingDocument {
  id:
    string;

  file:
    File;

  storagePath:
    string;
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


  const rawFiles =
    formData.getAll(
      "files"
    );


  const files =
    rawFiles.filter(
      (
        value
      ): value is File =>
        value instanceof
        File
    );


  if (
    files.length ===
    0
  ) {
    throw new Error(
      "请选择要上传的文件"
    );
  }


  /*
   * ========================================
   * File Validation
   * ========================================
   */

  for (
    const file of files
  ) {
    if (
      file.size <=
      0
    ) {
      throw new Error(
        `文件「${file.name}」内容为空`
      );
    }


    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      throw new Error(
        `文件「${file.name}」超过 10 MB`
      );
    }


    if (
      !ALLOWED_MIME_TYPES.has(
        file.type
      )
    ) {
      throw new Error(
        `文件「${file.name}」格式不支持，仅支持 PDF、JPG、PNG 或 WEBP`
      );
    }
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
        service_option_snapshot
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


  /*
   * ========================================
   * Document Limit
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


  const currentCount =
    count ??
    0;


  if (
    currentCount +
      files.length >
    MAX_DOCUMENTS_PER_ORDER
  ) {
    const remaining =
      Math.max(
        0,
        MAX_DOCUMENTS_PER_ORDER -
          currentCount
      );


    throw new Error(
      `当前最多还能上传 ${remaining} 个文件`
    );
  }


  /*
   * ========================================
   * Prepare Uploads
   * ========================================
   */

  const pendingDocuments:
    PendingDocument[] =
    files.map(
      file => {
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


        return {
          id:
            documentId,

          file,

          storagePath,
        };
      }
    );


  /*
   * ========================================
   * Storage Upload
   *
   * 任何一个文件失败：
   * 删除本次已经上传的所有文件。
   * ========================================
   */

  const uploadedPaths:
    string[] =
    [];


  try {
    for (
      const item of
        pendingDocuments
    ) {
      const buffer =
        Buffer.from(
          await item.file
            .arrayBuffer()
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
            item.storagePath,
            buffer,
            {
              contentType:
                item.file.type,

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
          `文件「${item.file.name}」上传失败`
        );
      }


      uploadedPaths.push(
        item.storagePath
      );
    }
  } catch (
    error
  ) {
    if (
      uploadedPaths.length >
      0
    ) {
      await admin.storage
        .from(
          "order-documents"
        )
        .remove(
          uploadedPaths
        );
    }


    throw error;
  }


  /*
   * ========================================
   * Database Records
   *
   * 客户上传阶段统一：
   * document_type = unclassified
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
      .insert(
        pendingDocuments.map(
          item => ({
            id:
              item.id,

            order_id:
              cleanOrderId,

            service_option_id:
              order
                .service_option_id,

            document_type:
              "unclassified",

            original_filename:
              item.file.name
                .slice(
                  0,
                  255
                ),

            storage_path:
              item.storagePath,

            mime_type:
              item.file.type,

            size_bytes:
              item.file.size,

            status:
              "uploaded",
          })
        )
      );


  /*
   * DB 写入失败：
   * 删除本次所有 Storage objects。
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
      .remove(
        uploadedPaths
      );


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
    count:
      pendingDocuments.length,

    ids:
      pendingDocuments.map(
        item =>
          item.id
      ),

    status:
      "uploaded" as const,
  };
}