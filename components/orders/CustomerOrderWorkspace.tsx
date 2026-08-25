import type {
  OrderWorkspaceData,
} from "@/types/workspace";

import type {
  CustomerActionRequest,
} from "@/types/customerAction";

import type {
  OrderAppointmentData,
} from "@/types/appointment";

import type {
  OrderDocument,
} from "@/types/orderDocument";

import CustomerActionCorrectionForm from "@/components/orders/CustomerActionCorrectionForm";

import CustomerWorkspaceChat from "@/components/orders/CustomerWorkspaceChat";

import CustomerWorkspaceAppointment from "@/components/orders/CustomerWorkspaceAppointment";

import CustomerOrderResult from "@/components/orders/CustomerOrderResult";

import {
  COMPANY_ORDER_DOCUMENT_TYPES,
  PERSONAL_ORDER_DOCUMENT_TYPES,
  getOrderDocumentTypeLabel,
} from "@/lib/documents/orderDocumentTypes";

interface Props {
  data:
    OrderWorkspaceData;

  customerActionRequest:
    CustomerActionRequest | null;

  currentFormData:
    Record<
      string,
      string
    >;

  latestRejectReason:
    string | null;

  /*
   * Appointment / Online Meeting
   *
   * 目前仅 Cetes 使用。
   */
  appointmentData:
    OrderAppointmentData;

  showAppointment:
    boolean;

  /*
   * Processing Documents
   */
  requiresDocumentReview?:
    boolean;

  documents?:
    OrderDocument[];

  documentProfile:
    "personal" |
    "company";
}


function formatDateTime(
  value:
    string | null
) {
  if (
    !value
  ) {
    return null;
  }


  return new Date(
    value
  ).toLocaleString();
}


function getRemainingDays(
  expiresAt:
    string | null
) {
  if (
    !expiresAt
  ) {
    return null;
  }


  const now =
    Date.now();


  const expires =
    new Date(
      expiresAt
    ).getTime();


  const remaining =
    expires -
    now;


  if (
    remaining <=
    0
  ) {
    return 0;
  }


  return Math.ceil(
    remaining /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
}


function getWorkspaceStatusLabel(
  status:
    OrderWorkspaceData["workspace"]["status"],
  startedAt:
    string | null
) {
  if (
    status ===
      "active" &&
    !startedAt
  ) {
    return "待开始";
  }


  switch (
    status
  ) {
    case "active":
      return "服务进行中";

    case "completed":
      return "服务已完成";

    case "expired":
      return "服务期限已结束";

    case "cancelled":
      return "服务已取消";

    default:
      return status;
  }
}


export default function CustomerOrderWorkspace({
  data,
  customerActionRequest,
  currentFormData,
  latestRejectReason,
  appointmentData,
  showAppointment,
  requiresDocumentReview = false,
  documents = [],
  documentProfile,
}: Props) {
  const {
    workspace,
    milestones,
    messages,
    results,
  } =
    data;


  const remainingDays =
    getRemainingDays(
      workspace.expiresAt
    );


  const completedCount =
    milestones.filter(
      milestone =>
        milestone.status ===
        "completed"
    ).length;


  /*
   * =========================================
   * Processing Document Progress
   * =========================================
   */

  const activeDocuments =
    documents.filter(
      document =>
        document.status !==
        "content_deleted"
    );


    const hasDocuments =
    activeDocuments.length >
    0;
  
  
  const hasRejectedDocuments =
    activeDocuments.some(
      document =>
        document.status ===
        "rejected"
    );
  
  
  const hasPendingDocuments =
    activeDocuments.some(
      document =>
        document.status ===
        "uploaded"
    );
  
  
  const requiredDocumentTypes =
    documentProfile ===
      "company"
      ? COMPANY_ORDER_DOCUMENT_TYPES
      : PERSONAL_ORDER_DOCUMENT_TYPES;
  
  
  const approvedDocumentTypes =
    new Set(
      activeDocuments
        .filter(
          document =>
            document.status ===
            "approved"
        )
        .map(
          document =>
            document.documentType
        )
    );
  
  
  const missingRequiredDocumentTypes =
    requiredDocumentTypes.filter(
      item =>
        !approvedDocumentTypes.has(
          item.value
        )
    );
  
  
  const allRequiredDocumentsApproved =
    requiresDocumentReview &&
    missingRequiredDocumentTypes.length ===
      0;
  
  
  const documentProgressMessage =
    !requiresDocumentReview
      ? null
      : !hasDocuments
        ? "等待您上传办理资料"
        : hasRejectedDocuments
          ? "需要重新提交办理资料"
          : hasPendingDocuments
            ? "办理资料检查中"
            : allRequiredDocumentsApproved
              ? "办理资料检查已完成"
              : "需要补充办理资料";


  return (
    <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
      {/* =====================================
          Header
      ===================================== */}

      <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            服务空间
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            服务办理
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            您可以在这里与服务人员沟通、
            查看办理进度和需要您处理的事项。
          </p>
        </div>

        <span
          className={`
            inline-flex
            w-fit
            rounded-full
            px-3
            py-1
            text-sm
            font-medium
            ${
              workspace.status ===
              "completed"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-blue-50 text-blue-700"
            }
          `}
        >
          {
            getWorkspaceStatusLabel(
              workspace.status,
              workspace.startedAt
            )
          }
        </span>
      </div>


      {/* =====================================
          3. Workspace Chat
          服务沟通
      ===================================== */}

      <div className="mt-6">
        <CustomerWorkspaceChat
          workspaceId={
            workspace.id
          }

          workspaceStatus={
            workspace.status
          }

          messages={
            messages
          }
        />
      </div>


      {/* =====================================
          4. Service Progress
          服务进度
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">
            服务进度
          </h3>

          {milestones.length >
            0 && (
            <p className="text-sm text-gray-500">
              {
                completedCount
              }
              /
              {
                milestones.length
              }
            </p>
          )}
        </div>


        {documentProgressMessage && (
  <div
    className={`mt-4 rounded-xl border p-4 ${
      hasRejectedDocuments
        ? "border-amber-200 bg-amber-50"
        : "border-blue-100 bg-blue-50"
    }`}
  >
    <p
      className={`font-medium ${
        hasRejectedDocuments
          ? "text-amber-900"
          : "text-blue-900"
      }`}
    >
      {
        documentProgressMessage
      }
    </p>


    {!hasDocuments && (
      <p className="mt-2 text-sm leading-6 text-blue-800">
        请先上传本次现场办理所需资料，
        工作人员将在办理前进行检查。
      </p>
    )}


    {hasRejectedDocuments && (
      <p className="mt-2 text-sm leading-6 text-amber-800">
        部分资料未通过检查，
        请查看上方“办理资料”并重新提交对应文件。
      </p>
    )}


    {hasPendingDocuments &&
      !hasRejectedDocuments && (
        <p className="mt-2 text-sm leading-6 text-blue-800">
          您已提交办理资料，
          工作人员正在进行检查。
        </p>
      )}


    {documentProgressMessage ===
      "需要补充办理资料" && (
        <div className="mt-3 text-sm leading-6 text-blue-800">
          <p>
            根据目前已通过的资料，还缺少：
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5">
            {missingRequiredDocumentTypes.map(
              item => (
                <li
                  key={
                    item.value
                  }
                >
                  {
                    getOrderDocumentTypeLabel(
                      item.value
                    )
                  }
                </li>
              )
            )}
          </ul>

          <p className="mt-3">
            请在上方“办理资料”继续上传缺少的文件，
            工作人员检查通过后会自动更新这里的状态。
          </p>
        </div>
      )}
  </div>
)}


        {milestones.length ===
        0 ? (
          <div className="mt-4 rounded-xl border border-dashed p-4 text-sm text-gray-500">
            此服务目前没有设置阶段性办理节点。
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {milestones.map(
              milestone => {
                const completed =
                  milestone.status ===
                  "completed";


                return (
                  <div
                    key={
                      milestone.id
                    }
                    className="flex items-start gap-4 rounded-xl border p-4"
                  >
                    <div
                      className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-sm
                        font-bold
                        ${
                          completed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {
                        completed
                          ? "✓"
                          : "○"
                      }
                    </div>


                    <div>
                      <p className="font-medium">
                        {
                          milestone.label
                        }
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          completed
                            ? milestone.completedAt
                              ? `完成时间：${formatDateTime(
                                  milestone.completedAt
                                )}`
                              : "已完成"
                            : "等待完成"
                        }
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>


      {/* =====================================
          5. Customer Action
          需要您处理
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold">
          需要您处理
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          如果服务人员需要您确认或修正申请资料，
          会显示在这里。
        </p>


        {!customerActionRequest ? (
          <div className="mt-4 rounded-xl border border-dashed p-4 text-sm text-gray-500">
            当前没有需要您处理的事项。
          </div>
        ) : (
          <CustomerActionCorrectionForm
            request={
              customerActionRequest
            }

            currentFormData={
              currentFormData
            }

            latestRejectReason={
              latestRejectReason
            }
          />
        )}
      </div>


      {/* =====================================
          6. Service Duration
          服务期限
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold">
          服务期限
        </h3>

        {!workspace.startedAt ? (
          <div className="mt-3 rounded-xl bg-gray-50 p-4">
            <p className="font-medium text-gray-900">
              服务尚未正式开始
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              付款已经确认。
              服务期限将在平台开始实际办理后计算。
            </p>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                开始时间
              </p>

              <p className="mt-1 font-medium">
                {
                  formatDateTime(
                    workspace.startedAt
                  )
                }
              </p>
            </div>


            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                服务截止
              </p>

              <p className="mt-1 font-medium">
                {
                  workspace.expiresAt
                    ? formatDateTime(
                        workspace.expiresAt
                      )
                    : "无固定期限"
                }
              </p>
            </div>


            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                剩余时间
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-950">
                {
                  remainingDays ===
                    null
                    ? "—"
                    : remainingDays ===
                        0
                      ? "已到期"
                      : `${remainingDays} 天`
                }
              </p>
            </div>
          </div>
        )}
      </div>


      {/* =====================================
          7. Service Result
          服务结果
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <CustomerOrderResult
          results={
            results
          }
        />
      </div>


      {/* =====================================
          Cetes Appointment
          仅 Cetes 咨询服务显示
      ===================================== */}

      {showAppointment && (
        <div className="mt-8 border-t pt-6">
          <CustomerWorkspaceAppointment
            workspaceId={
              workspace.id
            }

            data={
              appointmentData
            }
          />
        </div>
      )}
    </section>
  );
}