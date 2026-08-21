import type {
  OrderWorkspaceData,
} from "@/types/workspace";

import type {
  CustomerActionRequest,
  CustomerActionSubmission,
} from "@/types/customerAction";

import type {
  FormFieldSchema,
} from "@/types/form";

import type {
  FulfillmentStatus,
} from "@/types/fulfillment";

import type {
  OrderAppointmentData,
} from "@/types/appointment";

import AdminCustomerMaterials from "@/components/admin/AdminCustomerMaterials";

import AdminWorkspaceChat from "@/components/admin/AdminWorkspaceChat";

import AdminWorkspaceAppointment from "@/components/admin/AdminWorkspaceAppointment";

import type {
  OrderDocument,
} from "@/types/orderDocument";

interface Props {
  data:
    OrderWorkspaceData;

  orderId:
    string;

  fulfillmentId:
    string | null;

  fulfillmentStatus:
    FulfillmentStatus | null;

  formSchema:
    FormFieldSchema[];

  formData:
    Record<
      string,
      string
    >;

  customerActionRequest:
    CustomerActionRequest | null;

  customerActionSubmission:
    CustomerActionSubmission | null;

  requiresDocumentReview:
    boolean;
  
  documents:
    OrderDocument[];

  /*
   * Appointment / Meeting
   */

  appointmentData:
  OrderAppointmentData;

  showAppointment:
    boolean;

  defaultConsultationType?:
    string | null;
}


function formatDateTime(
  value:
    string | null
) {
  if (!value) {
    return "—";
  }


  return new Date(
    value
  ).toLocaleString();
}


function getRemainingDays(
  expiresAt:
    string | null
) {
  if (!expiresAt) {
    return null;
  }


  const difference =
    new Date(
      expiresAt
    ).getTime() -
    Date.now();


  if (
    difference <=
    0
  ) {
    return 0;
  }


  return Math.ceil(
    difference /
      (
        1000 *
        60 *
        60 *
        24
      )
  );
}


function getStatusLabel(
  status:
    OrderWorkspaceData["workspace"]["status"]
) {
  switch (
    status
  ) {
    case "active":
      return "进行中";

    case "completed":
      return "已完成";

    case "expired":
      return "已到期";

    case "cancelled":
      return "已取消";

    default:
      return status;
  }
}


export default function AdminOrderWorkspace({
  data,
  requiresDocumentReview,
  documents,
  orderId,
  fulfillmentId,
  fulfillmentStatus,
  formSchema,
  formData,
  customerActionRequest,
  customerActionSubmission,
  appointmentData,
  showAppointment,
  defaultConsultationType = null,
}: Props) {
  const {
    workspace,
    milestones,
    messages,
  } =
    data;


  const remainingDays =
    getRemainingDays(
      workspace.expiresAt
    );


  const completedCount =
    milestones.filter(
      item =>
        item.status ===
        "completed"
    ).length;


  return (
    <section className="mt-8 rounded-xl border bg-white p-6">
      {/* =====================================
          Header
      ===================================== */}

      <div className="flex flex-col gap-3 border-b pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            Order Workspace
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            客户服务空间
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            此区域集中管理客户可见的服务进度、
            客户待办、服务沟通、预约与线上会议。
            Fulfillment 内部备注不会显示给客户。
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
          {
            getStatusLabel(
              workspace.status
            )
          }
        </span>
      </div>


      {/* =====================================
          Workspace Meta
      ===================================== */}

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Workspace ID
          </p>

          <p className="mt-1 break-all text-sm font-medium">
            {
              workspace.id
            }
          </p>
        </div>


        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            开始时间
          </p>

          <p className="mt-1 text-sm font-medium">
            {
              workspace.startedAt
                ? formatDateTime(
                    workspace.startedAt
                  )
                : "尚未开始"
            }
          </p>
        </div>


        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            服务截止
          </p>

          <p className="mt-1 text-sm font-medium">
            {
              workspace.expiresAt
                ? formatDateTime(
                    workspace.expiresAt
                  )
                : "尚未计算"
            }
          </p>
        </div>


        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-xs text-purple-700">
            剩余时间
          </p>

          <p className="mt-1 text-lg font-semibold text-purple-950">
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


      {/* =====================================
          Milestones
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              服务 Milestones
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              客户可以查看这些办理节点，
              完成状态由平台确认。
            </p>
          </div>

          {milestones.length >
            0 && (
            <span className="text-sm text-gray-500">
              {
                completedCount
              }
              /
              {
                milestones.length
              }
            </span>
          )}
        </div>


        {milestones.length ===
        0 ? (
          <div className="mt-3 rounded-lg border border-dashed p-4 text-sm text-gray-500">
            此订单没有 Milestone。
          </div>
        ) : (
          <div className="mt-4 space-y-2">
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
                    className="flex items-center justify-between gap-4 rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
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
                      </span>

                      <div>
                        <p className="font-medium">
                          {
                            milestone.label
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Key：
                          {
                            milestone.milestoneKey
                          }
                        </p>
                      </div>
                    </div>


                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {
                          completed
                            ? "已完成"
                            : "待完成"
                        }
                      </p>

                      {completed &&
                        milestone.completedAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          {
                            formatDateTime(
                              milestone.completedAt
                            )
                          }
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* =====================================
          Customer Action
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            Customer Action
          </p>

          <h3 className="mt-1 text-lg font-semibold">
            客户待办 / 资料修正
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            如正式要求客户修改订单资料，
            请使用这里的资料修正流程。
            系统仍会发送原有的客户补件 Notification
            与 Email 通知。
          </p>
        </div>


        <AdminCustomerMaterials
          orderId={
            orderId
          }

          fulfillmentId={
            fulfillmentId
          }

          fulfillmentStatus={
            fulfillmentStatus
          }

          formSchema={
            formSchema
          }

          formData={
            formData
          }

          customerActionRequest={
            customerActionRequest
          }

          customerActionSubmission={
            customerActionSubmission
          }

          requiresDocumentReview={
            requiresDocumentReview
          }

          documents={
            documents
          }
        />
      </div>


      {/* =====================================
          Workspace Chat
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <AdminWorkspaceChat
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
          Appointment + Online Meeting
          仅 CETES 咨询服务显示
      ===================================== */}

      {showAppointment && (
        <div className="mt-8 border-t pt-6">
          <AdminWorkspaceAppointment
            workspaceId={
              workspace.id
            }

            orderId={
              orderId
            }

            data={
              appointmentData
            }

            defaultConsultationType={
              defaultConsultationType
            }
          />
        </div>
      )}
    </section>
  );
}