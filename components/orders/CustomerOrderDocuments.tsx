"use client";

import {
  useRef,
  useState,
} from "react";

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  OTHER_ORDER_DOCUMENT_TYPE,
  PERSONAL_ORDER_DOCUMENT_TYPES,
  getOrderDocumentTypeLabel,
} from "@/lib/documents/orderDocumentTypes";

import {
  useRouter,
} from "next/navigation";

import {
  uploadOrderDocument,
} from "@/lib/documents/uploadOrderDocument";

import type {
  OrderDocument,
} from "@/types/orderDocument";


interface Props {
  orderId:
    string;

  documents:
    OrderDocument[];

  documentProfile:
    "personal" |
    "company";
}



function getStatusLabel(
  status:
    OrderDocument["status"]
) {
  switch (
    status
  ) {
    case "uploaded":
      return "待检查";

    case "approved":
      return "已通过";

    case "rejected":
      return "需重新提交";

    case "content_deleted":
      return "资料已清理";
  }
}


function formatSize(
  value:
    number | null
) {
  if (
    value ===
      null
  ) {
    return null;
  }


  if (
    value <
      1024 * 1024
  ) {
    return `${(
      value /
      1024
    ).toFixed(
      1
    )} KB`;
  }


  return `${(
    value /
    1024 /
    1024
  ).toFixed(
    1
  )} MB`;
}


export default function CustomerOrderDocuments({
  orderId,
  documents,
  documentProfile,
}: Props) {
  const router =
    useRouter();

  const fileInputRef =
    useRef<
      HTMLInputElement |
      null
    >(null);

    const documentTypes =
    documentProfile ===
      "company"
      ? COMPANY_ORDER_DOCUMENT_TYPES
      : PERSONAL_ORDER_DOCUMENT_TYPES;
  
  
      const [
        documentType,
        setDocumentType,
      ] =
        useState<string>(
          documentTypes[0]
            .value
        );


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);



  async function handleUpload(
    event:
      React.FormEvent<
        HTMLFormElement
      >
  ) {
    event.preventDefault();


    if (
      submitting
    ) {
      return;
    }


    const file =
      fileInputRef
        .current
        ?.files?.[0];


    if (
      !file
    ) {
      alert(
        "请选择要上传的文件"
      );

      return;
    }


    try {
      setSubmitting(
        true
      );


      const data =
        new FormData();


      data.set(
        "documentType",
        documentType
      );


      data.set(
        "file",
        file
      );


      await uploadOrderDocument(
        orderId,
        data
      );


      if (
        fileInputRef
          .current
      ) {
        fileInputRef
          .current
          .value =
          "";
      }


      router.refresh();
    } catch (
      error
    ) {
      console.error(
        error
      );


      alert(
        error instanceof
          Error
          ? error.message
          : "上传失败，请稍后再试"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }


  return (
    <section className="mt-8 rounded-2xl border bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">
          办理资料检查
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          为便于现场办理前提前检查资料，请上传与本次办理相关的文件。
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          支持 PDF、JPG、PNG、WEBP，单个文件不超过 10 MB。
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          请勿上传银行密码、验证码、OTP、Token、CVV、e.firma 私钥密码或其他非办理必要的认证信息。
        </p>
      </div>


      <form
        onSubmit={
          handleUpload
        }
        className="mt-5 space-y-4 rounded-xl border bg-gray-50 p-4"
      >
        <div>
          <label className="text-sm font-medium">
            资料类型
          </label>

          <select
          value={
            documentType
          }
          onChange={
            event =>
              setDocumentType(
                event.target
                  .value
              )
          }
          className="mt-2 w-full rounded-lg border bg-white p-3"
        >
          {documentTypes.map(
            item => (
              <option
                key={
                  item.value
                }
                value={
                  item.value
                }
              >
                {
                  item.label
                }
              </option>
            )
          )}

          <option
            value={
              OTHER_ORDER_DOCUMENT_TYPE
                .value
            }
          >
            {
              OTHER_ORDER_DOCUMENT_TYPE
                .label
            }
          </option>
        </select>
        </div>


        <div>
          <label className="text-sm font-medium">
            选择文件
          </label>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className="mt-2 block w-full text-sm"
          />
        </div>


        <button
          type="submit"
          disabled={
            submitting
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting
            ? "上传中..."
            : "上传资料"}
        </button>
      </form>


      <div className="mt-6">
        <h3 className="font-medium">
          已提交资料
        </h3>


        {documents.length ===
        0 ? (
          <div className="mt-3 rounded-xl border border-dashed p-5 text-sm text-gray-500">
            目前还没有上传资料。
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {documents.map(
              document => (
                <div
                  key={
                    document.id
                  }
                  className="rounded-xl border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                    <p className="font-medium">
                      {getOrderDocumentTypeLabel(
                        document.documentType
                      )}
                    </p>

                      {document.originalFilename && (
                        <p className="mt-1 break-all text-sm text-gray-500">
                          {
                            document.originalFilename
                          }
                        </p>
                      )}

                      {document.sizeBytes !==
                        null && (
                        <p className="mt-1 text-xs text-gray-400">
                          {formatSize(
                            document.sizeBytes
                          )}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {getStatusLabel(
                        document.status
                      )}
                    </span>
                  </div>


                  {document.status ===
                    "rejected" &&
                    document.reviewNote && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className="text-xs font-medium text-amber-800">
                          需要修正
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                          {
                            document.reviewNote
                          }
                        </p>
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}