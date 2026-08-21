"use client";

import {
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  uploadOrderDocument,
} from "@/lib/documents/uploadOrderDocument";

import type {
  OrderDocument,
} from "@/types/orderDocument";

import {
  deleteMyOrderDocument,
} from "@/lib/documents/deleteMyOrderDocument";


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

const MAX_BATCH_SIZE =
  40 * 1024 * 1024;

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
}: Props) {
  const router =
    useRouter();


  const fileInputRef =
    useRef<
      HTMLInputElement |
      null
    >(null);


  const [
    selectedFiles,
    setSelectedFiles,
  ] =
    useState<
      File[]
    >([]);


  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
      deletingId,
      setDeletingId,
    ] =
      useState<
        string | null
      >(null);


    const visibleDocuments =
      documents.filter(
        document =>
          document.status !==
          "content_deleted"
      );
    
    
    const activeDocumentCount =
      visibleDocuments.length;


  const remainingSlots =
    Math.max(
      0,
      20 -
        activeDocumentCount
    );


  async function handleUpload() {
    if (
      submitting ||
      selectedFiles.length ===
        0
    ) {
      return;
    }


    try {
      setSubmitting(
        true
      );


      const data =
        new FormData();


      selectedFiles.forEach(
        file => {
          data.append(
            "files",
            file
          );
        }
      );


      await uploadOrderDocument(
        orderId,
        data
      );


      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }


      setSelectedFiles(
        []
      );


      router.refresh();
    } catch (
      error
    ) {
      console.error(
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "上传失败，请稍后再试"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  async function handleDelete(
    documentId:
      string
  ) {
    const confirmed =
      window.confirm(
        "确定删除这份资料吗？\n\n删除后文件将从平台储存中移除，无法恢复。若该资料为办理所需文件，您可能需要重新上传。"
      );
  
  
    if (
      !confirmed
    ) {
      return;
    }
  
  
    try {
      setDeletingId(
        documentId
      );
  
  
      await deleteMyOrderDocument(
        documentId
      );
  
  
      router.refresh();
    } catch (
      error
    ) {
      console.error(
        error
      );
  
  
      alert(
        error instanceof Error
          ? error.message
          : "删除失败，请稍后再试"
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }


  return (
    <section className="mt-8 rounded-2xl border bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">
          办理资料
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          请上传与本次办理相关的资料。
          您可以一次选择一个或多个文件，
          也可以之后继续补充上传。
        </p>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          支持 PDF、JPG、PNG、WEBP；
          单个文件不超过 10 MB；
          每个订单最多保留 20 个有效文件。
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          无需自行判断资料分类，
          工作人员会在检查时完成分类。
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          请勿上传银行密码、验证码、OTP、
          Token、CVV、e.firma 私钥密码
          或其他非办理必要的认证信息。
        </p>
      </div>


      <div className="mt-5 rounded-xl border bg-gray-50 p-5">
        <input
          ref={
            fileInputRef
          }
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={
            event => {
              const newFiles =
                Array.from(
                  event.target
                    .files ??
                    []
                );
          
          
              if (
                newFiles.length ===
                0
              ) {
                return;
              }
          
          
              const combinedFiles =
                [
                  ...selectedFiles,
                  ...newFiles,
                ];
          
          
              /*
               * 防止同一个文件被重复加入。
               *
               * 使用：
               * name + size + lastModified
               * 作为浏览器端临时唯一标识。
               */
              const uniqueFiles =
                combinedFiles.filter(
                  (
                    file,
                    index,
                    allFiles
                  ) =>
                    allFiles.findIndex(
                      candidate =>
                        candidate.name ===
                          file.name &&
                        candidate.size ===
                          file.size &&
                        candidate.lastModified ===
                          file.lastModified
                    ) ===
                    index
                );
          
          
              if (
                uniqueFiles.length >
                remainingSlots
              ) {
                alert(
                  `当前最多还能上传 ${remainingSlots} 个文件`
                );
          
                /*
                 * 只清空原生 input，
                 * 不清掉之前已经选择的文件。
                 */
                event.target.value =
                  "";
          
                return;
              }

              const totalSelectedSize =
                  uniqueFiles.reduce(
                    (
                      total,
                      file
                    ) =>
                      total +
                      file.size,
                    0
                  );


                if (
                  totalSelectedSize >
                  MAX_BATCH_SIZE
                ) {
                  alert(
                    "本次选择的文件总大小不能超过 40 MB，请分批上传"
                  );

                  event.target.value =
                    "";

                  return;
                }
          
          
              setSelectedFiles(
                uniqueFiles
              );
          
          
              /*
               * 必须清空 input。
               *
               * 这样用户下一次还可以再次选择
               * 同一个文件，onChange 也会触发。
               */
              event.target.value =
                "";
            }
          }
        />


        <button
          type="button"
          disabled={
            submitting ||
            remainingSlots ===
              0
          }
          onClick={
            () =>
              fileInputRef.current?.click()
          }
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-blue-600 bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + 选择办理资料
        </button>


        <p className="mt-3 text-sm text-gray-500">
          {remainingSlots ===
          0
            ? "本订单已达到 20 个有效文件上限。"
            : `还可以上传 ${remainingSlots} 个文件。`}
        </p>


        {selectedFiles.length >
          0 && (
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-gray-900">
                已选择{" "}
                {
                  selectedFiles.length
                }{" "}
                个文件
              </p>

              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={
                  () => {
                    setSelectedFiles(
                      []
                    );

                    if (
                      fileInputRef.current
                    ) {
                      fileInputRef.current.value =
                        "";
                    }
                  }
                }
                className="text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50"
              >
                清除选择
              </button>
            </div>


            <div className="mt-3 space-y-2">
              {selectedFiles.map(
                (
                  file,
                  index
                ) => (
                  <div
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex flex-col gap-1 rounded-lg border bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="break-all text-sm font-medium">
                      {
                        file.name
                      }
                    </p>

                    <p className="shrink-0 text-xs text-gray-400">
                      {
                        formatSize(
                          file.size
                        )
                      }
                    </p>
                  </div>
                )
              )}
            </div>


            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={
                  submitting ||
                  selectedFiles.length >=
                    remainingSlots
                }
                onClick={
                  () =>
                    fileInputRef.current?.click()
                }
                className="rounded-xl border border-blue-600 bg-white px-5 py-3 font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + 添加办理资料
              </button>

              <button
                type="button"
                disabled={
                  submitting
                }
                onClick={
                  handleUpload
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "上传中..."
                  : `上传 ${selectedFiles.length} 个文件`}
              </button>
            </div>
          </div>
        )}
      </div>


      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-medium">
            已提交资料
          </h3>

          {activeDocumentCount >
            0 && (
            <p className="text-sm text-gray-500">
              共{" "}
              {
                activeDocumentCount
              }{" "}
              个有效文件
            </p>
          )}
        </div>


        {visibleDocuments.length ===
        0 ? (
          <div className="mt-3 rounded-xl border border-dashed p-5 text-sm text-gray-500">
            目前还没有上传资料。
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {visibleDocuments.map(
              document => (
                <div
                  key={
                    document.id
                  }
                  className="rounded-xl border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="break-all font-medium">
                        {document.originalFilename ??
                          "办理资料"}
                      </p>

                      {document.sizeBytes !==
                        null && (
                        <p className="mt-1 text-xs text-gray-400">
                          {
                            formatSize(
                              document.sizeBytes
                            )
                          }
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                          <span
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                              document.status ===
                                "approved"
                                ? "bg-green-100 text-green-700"
                                : document.status ===
                                    "rejected"
                                  ? "bg-amber-100 text-amber-800"
                                  : document.status ===
                                      "uploaded"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {
                              getStatusLabel(
                                document.status
                              )
                            }
                          </span>

                          {document.status !==
                            "content_deleted" && (
                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                document.id
                              }
                              onClick={
                                () =>
                                  handleDelete(
                                    document.id
                                  )
                              }
                              className="text-xs font-medium text-gray-400 underline-offset-4 hover:text-gray-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              document.id
                                ? "删除中..."
                                : "删除资料"}
                            </button>
                          )}
                        </div>
                  </div>


                  {document.status ===
                    "uploaded" && (
                    <p className="mt-3 text-sm text-gray-500">
                      工作人员将检查并分类这份资料。
                    </p>
                  )}


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