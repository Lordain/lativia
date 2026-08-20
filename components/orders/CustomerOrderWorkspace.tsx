import type {
  OrderWorkspaceData,
} from "@/types/workspace";

import type {
  CustomerActionRequest,
} from "@/types/customerAction";

import type {
  OrderAppointmentData,
} from "@/types/appointment";

import CustomerActionCorrectionForm from "@/components/orders/CustomerActionCorrectionForm";

import CustomerWorkspaceChat from "@/components/orders/CustomerWorkspaceChat";

import CustomerWorkspaceAppointment from "@/components/orders/CustomerWorkspaceAppointment";

import CustomerOrderResult from "@/components/orders/CustomerOrderResult";

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
   */

  appointmentData:
    OrderAppointmentData;

}


function formatDateTime(
  value:
    string | null
) {
  if (!value) {
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
  if (!expiresAt) {
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
    OrderWorkspaceData["workspace"]["status"]
) {
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
            当前服务进度
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            您可以在这里查看服务期限、办理进度、
            需要您处理的事项、服务沟通、
            咨询预约以及线上会议。
          </p>
        </div>

        <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          {
            getWorkspaceStatusLabel(
              workspace.status
            )
          }
        </span>
      </div>


      {/* =====================================
          Service Duration
      ===================================== */}

      <div className="mt-6">
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
          Milestones
      ===================================== */}

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
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


        {milestones.length ===
        0 ? (
          <div className="mt-3 rounded-xl border border-dashed p-4 text-sm text-gray-500">
            此服务没有设置阶段性办理节点。
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
            Service Result
        ===================================== */}

        <div className="mt-8 border-t pt-6">
          <CustomerOrderResult
            results={
              results
            }
          />
        </div>


      {/* =====================================
          Customer Action
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
          Workspace Chat
      ===================================== */}

      <div className="mt-8 border-t pt-6">
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
          Appointment + Online Meeting
      ===================================== */}

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
    </section>
  );
}