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

import AdminMilestoneControl from "@/components/admin/AdminMilestoneControl";

import type {
  OrderDocument,
} from "@/types/orderDocument";

import AdminCustomerMaterials from "@/components/admin/AdminCustomerMaterials";

import AdminWorkspaceChat from "@/components/admin/AdminWorkspaceChat";

import AdminWorkspaceAppointment from "@/components/admin/AdminWorkspaceAppointment";


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


function getStatusClass(
  status:
    OrderWorkspaceData["workspace"]["status"]
) {
  switch (
    status
  ) {
    case "active":
      return "bg-blue-50 text-blue-700";

    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "expired":
      return "bg-amber-50 text-amber-700";

    case "cancelled":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}


function MetaItem({
  label,
  value,
  emphasis = false,
}: {
  label:
    string;

  value:
    React.ReactNode;

  emphasis?:
    boolean;
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        p-4
        ${
          emphasis
            ? "border-blue-100 bg-blue-50/60"
            : "border-slate-200 bg-slate-50/70"
        }
      `}
    >
      <p
        className={`
          text-xs
          font-medium
          ${
            emphasis
              ? "text-blue-600"
              : "text-slate-500"
          }
        `}
      >
        {label}
      </p>

      <div
        className={`
          mt-1.5
          break-words
          text-sm
          font-semibold
          ${
            emphasis
              ? "text-blue-950"
              : "text-slate-900"
          }
        `}
      >
        {value}
      </div>
    </div>
  );
}


function WorkspaceSubsection({
  title,
  description,
  children,
}: {
  title:
    string;

  description?:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 px-5 py-6 sm:px-6">
      <div>
        <h3 className="text-base font-bold text-slate-950">
          {title}
        </h3>

        {description && (
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            客户服务空间
          </h2>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
            集中管理客户可见的服务进度、资料处理、
            服务沟通、预约与线上会议。
            Fulfillment 内部备注不会显示给客户。
          </p>
        </div>

        <span
          className={`
            inline-flex
            w-fit
            rounded-full
            px-3
            py-1.5
            text-xs
            font-semibold
            ${getStatusClass(
              workspace.status
            )}
          `}
        >
          {
            getStatusLabel(
              workspace.status
            )
          }
        </span>
      </div>

      <div className="grid gap-3 border-t border-slate-200 bg-slate-50/40 px-5 py-5 sm:grid-cols-2 sm:px-6 xl:grid-cols-4">
        <MetaItem
          label="Workspace ID"
          value={
            <span className="font-mono text-xs">
              {
                workspace.id
              }
            </span>
          }
        />

        <MetaItem
          label="开始时间"
          value={
            workspace.startedAt
              ? formatDateTime(
                  workspace.startedAt
                )
              : "尚未开始"
          }
        />

        <MetaItem
          label="服务截止"
          value={
            workspace.expiresAt
              ? formatDateTime(
                  workspace.expiresAt
                )
              : "尚未计算"
          }
        />

        <MetaItem
          label="剩余时间"
          emphasis
          value={
            remainingDays ===
            null
              ? "—"
              : remainingDays ===
                  0
                ? "已到期"
                : `${remainingDays} 天`
          }
        />
      </div>

      <WorkspaceSubsection
        title="服务进度"
        description="客户可以看到这些办理节点，完成状态由平台确认。"
      >
        {milestones.length ===
        0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            此订单没有 Milestone。
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                已完成{" "}
                <strong className="text-slate-900">
                  {
                    completedCount
                  }
                </strong>
                {" / "}
                {
                  milestones.length
                }
              </p>

              <div className="h-2 w-36 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width:
                      `${(
                        completedCount /
                        milestones.length
                      ) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
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
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
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
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
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
                          <p className="font-semibold text-slate-900">
                            {
                              milestone.label
                            }
                          </p>

                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {
                              milestone.milestoneKey
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="text-left sm:text-right">
                          <p
                            className={`
                              text-sm
                              font-semibold
                              ${
                                completed
                                  ? "text-emerald-700"
                                  : "text-slate-500"
                              }
                            `}
                          >
                            {
                              completed
                                ? "已完成"
                                : "待完成"
                            }
                          </p>

                          {completed &&
                            milestone.completedAt && (
                            <p className="mt-1 text-xs text-slate-400">
                              {
                                formatDateTime(
                                  milestone.completedAt
                                )
                              }
                            </p>
                          )}
                        </div>

                        <AdminMilestoneControl
                          milestoneId={
                            milestone.id
                          }
                          orderId={
                            orderId
                          }
                          label={
                            milestone.label
                          }
                          completed={
                            completed
                          }
                          disabled={
                            workspace.status !==
                            "active"
                          }
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </WorkspaceSubsection>

      <WorkspaceSubsection
        title="客户资料与待办"
        description="处理资料预审、客户补充资料及资料修正流程。"
      >
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
      </WorkspaceSubsection>

      <WorkspaceSubsection
        title="客户沟通"
        description="这里的消息会显示在客户服务空间中。"
      >
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
      </WorkspaceSubsection>

      {showAppointment && (
        <WorkspaceSubsection
          title="预约与线上会议"
          description="管理客户预约时间及在线咨询会议资料。"
        >
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
        </WorkspaceSubsection>
      )}
    </section>
  );
}