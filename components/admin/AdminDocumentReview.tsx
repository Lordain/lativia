"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createOrderDocumentSignedUrl,
} from "@/lib/documents/createOrderDocumentSignedUrl";

import {
  reviewOrderDocument,
} from "@/lib/documents/reviewOrderDocument";

import {
  classifyOrderDocument,
} from "@/lib/documents/classifyOrderDocument";

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  OTHER_ORDER_DOCUMENT_TYPE,
  PERSONAL_ORDER_DOCUMENT_TYPES,
  getOrderDocumentTypeLabel,
} from "@/lib/documents/orderDocumentTypes";

import type {
  OrderDocument,
} from "@/types/orderDocument";


interface Props {
  documents:
    OrderDocument[];
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


function getDocumentTypeLabel(
  documentType:
    string
) {
  if (
    documentType ===
    "unclassified"
  ) {
    return "待分类";
  }


  return getOrderDocumentTypeLabel(
    documentType
  );
}


export default function AdminDocumentReview({
  documents,
}: Props) {
  const router =
    useRouter();


  const [
    loadingId,
    setLoadingId,
  ] =
    useState<
      string | null
    >(null);


  const [
    rejectNotes,
    setRejectNotes,
  ] =
    useState<
      Record<
        string,
        string
      >
    >({});


  const [
    classifications,
    setClassifications,
  ] =
    useState<
      Record<
        string,
        string
      >
    >(
      Object.fromEntries(
        documents.map(
          document => [
            document.id,
            document.documentType,
          ]
        )
      )
    );


  async function handleOpen(
    documentId:
      string
  ) {
    try {
      setLoadingId(
        documentId
      );


      const result =
        await createOrderDocumentSignedUrl(
          documentId
        );


      window.open(
        result.url,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (
      error
    ) {
      alert(
        error instanceof Error
          ? error.message
          : "无法打开资料"
      );
    } finally {
      setLoadingId(
        null
      );
    }
  }


  async function handleClassify(
    documentId:
      string
  ) {
    const documentType =
      classifications[
        documentId
      ]?.trim() ??
      "";


    if (
      !documentType ||
      documentType ===
        "unclassified"
    ) {
      alert(
        "请选择资料分类"
      );

      return;
    }


    try {
      setLoadingId(
        documentId
      );


      await classifyOrderDocument(
        documentId,
        documentType
      );


      router.refresh();
    } catch (
      error
    ) {
      alert(
        error instanceof Error
          ? error.message
          : "保存资料分类失败"
      );
    } finally {
      setLoadingId(
        null
      );
    }
  }


  async function handleApprove(
    documentId:
      string,
    documentType:
      string
  ) {
    if (
      documentType ===
      "unclassified"
    ) {
      alert(
        "请先完成资料分类"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "确认此资料检查通过吗？"
      );


    if (
      !confirmed
    ) {
      return;
    }


    try {
      setLoadingId(
        documentId
      );


      await reviewOrderDocument(
        documentId,
        "approve",
        ""
      );


      router.refresh();
    } catch (
      error
    ) {
      alert(
        error instanceof Error
          ? error.message
          : "保存审核结果失败"
      );
    } finally {
      setLoadingId(
        null
      );
    }
  }


  async function handleReject(
    documentId:
      string
  ) {
    const note =
      rejectNotes[
        documentId
      ]?.trim() ??
      "";


    if (
      !note
    ) {
      alert(
        "请填写要求客户重新提交的原因"
      );

      return;
    }


    const confirmed =
      window.confirm(
        "确认要求客户重新提交这份资料吗？"
      );


    if (
      !confirmed
    ) {
      return;
    }


    try {
      setLoadingId(
        documentId
      );


      await reviewOrderDocument(
        documentId,
        "reject",
        note
      );


      router.refresh();
    } catch (
      error
    ) {
      alert(
        error instanceof Error
          ? error.message
          : "保存审核结果失败"
      );
    } finally {
      setLoadingId(
        null
      );
    }
  }


  if (
    documents.length ===
    0
  ) {
    return (
      <div className="rounded-xl border border-dashed p-5 text-sm text-gray-500">
        客户目前尚未上传办理资料。
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {documents.map(
        document => {
          const loading =
            loadingId ===
            document.id;


          const currentClassification =
            classifications[
              document.id
            ] ??
            document.documentType;


          const isUnclassified =
            document.documentType ===
            "unclassified";


          return (
            <div
              key={
                document.id
              }
              className="rounded-xl border p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {document.originalFilename ??
                      "客户办理资料"}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    分类：
                    <strong className="ml-1">
                      {
                        getDocumentTypeLabel(
                          document.documentType
                        )
                      }
                    </strong>
                  </p>

                  <p className="mt-1 text-sm">
                    状态：
                    <strong className="ml-1">
                      {
                        getStatusLabel(
                          document.status
                        )
                      }
                    </strong>
                  </p>
                </div>


                {document.status !==
                  "content_deleted" && (
                  <button
                    type="button"
                    disabled={
                      loading
                    }
                    onClick={
                      () =>
                        handleOpen(
                          document.id
                        )
                    }
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    查看文件
                  </button>
                )}
              </div>


              {document.status ===
                "uploaded" && (
                <>
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <label className="text-sm font-medium">
                      资料分类
                    </label>

                    <select
                      value={
                        currentClassification
                      }
                      disabled={
                        loading
                      }
                      onChange={
                        event =>
                          setClassifications(
                            current => ({
                              ...current,

                              [
                                document.id
                              ]:
                                event.target
                                  .value,
                            })
                          )
                      }
                      className="mt-2 w-full rounded-lg border bg-white p-3"
                    >
                      <option value="unclassified">
                        请选择资料分类
                      </option>

                      <optgroup label="个人资料">
                        {PERSONAL_ORDER_DOCUMENT_TYPES.map(
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
                      </optgroup>

                      <optgroup label="公司资料">
                        {COMPANY_ORDER_DOCUMENT_TYPES.map(
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
                      </optgroup>

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


                    <button
                      type="button"
                      disabled={
                        loading ||
                        currentClassification ===
                          "unclassified" ||
                        currentClassification ===
                          document.documentType
                      }
                      onClick={
                        () =>
                          handleClassify(
                            document.id
                          )
                      }
                      className="mt-3 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      保存分类
                    </button>
                  </div>


                  <textarea
                    rows={
                      3
                    }
                    value={
                      rejectNotes[
                        document.id
                      ] ??
                      ""
                    }
                    onChange={
                      event =>
                        setRejectNotes(
                          current => ({
                            ...current,

                            [
                              document.id
                            ]:
                              event.target
                                .value,
                          })
                        )
                    }
                    placeholder="如资料不符合要求，请填写重新提交原因"
                    className="mt-4 w-full rounded-lg border p-3 text-sm"
                  />


                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={
                        loading ||
                        isUnclassified
                      }
                      onClick={
                        () =>
                          handleApprove(
                            document.id,
                            document.documentType
                          )
                      }
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      通过
                    </button>


                    <button
                      type="button"
                      disabled={
                        loading
                      }
                      onClick={
                        () =>
                          handleReject(
                            document.id
                          )
                      }
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      要求重新提交
                    </button>
                  </div>


                  {isUnclassified && (
                    <p className="mt-3 text-sm text-amber-700">
                      请先查看文件并完成分类，
                      然后才能标记为通过。
                    </p>
                  )}
                </>
              )}


              {document.status ===
                "rejected" &&
                document.reviewNote && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-800">
                      重新提交原因
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      {
                        document.reviewNote
                      }
                    </p>
                  </div>
                )}
            </div>
          );
        }
      )}
    </div>
  );
}