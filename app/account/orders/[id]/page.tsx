import {
  notFound,
} from "next/navigation";

import {
  getMyOrder,
} from "@/lib/orders/getMyOrder";

import {
  getMyCustomerActionRequest,
} from "@/lib/customerActions/getMyCustomerActionRequest";

import {
  getMyLatestRejectedSubmission,
} from "@/lib/customerActions/getMyLatestRejectedSubmission";

import {
  getMyOrderWorkspace,
} from "@/lib/workspaces/getMyOrderWorkspace";

import {
  getMyOrderAppointment,
} from "@/lib/appointments/getMyOrderAppointment";

import StatusBadge from "@/components/orders/StatusBadge";

import CustomerActionCorrectionForm from "@/components/orders/CustomerActionCorrectionForm";

import CustomerOrderWorkspace from "@/components/orders/CustomerOrderWorkspace";

import {
  CustomerDataRetentionStatus,
} from "@/components/orders/CustomerDataRetentionStatus";

import type {
  OrderStatus,
} from "@/types/order";

import type {
  FormFieldSchema,
} from "@/types/form";

import type {
  OrderAppointmentData,
} from "@/types/appointment";

import {
  getMyOrderDocuments,
} from "@/lib/documents/getMyOrderDocuments";

import CustomerOrderDocuments from "@/components/orders/CustomerOrderDocuments";

interface Props {
  params:
    Promise<{
      id:
        string;
    }>;
}


const EMPTY_APPOINTMENT_DATA:
  OrderAppointmentData = {
    appointment:
      null,

    slots:
      [],

    rule:
      null,
  };


export default async function OrderDetailPage({
  params,
}: Props) {
  const {
    id,
  } =
    await params;


  /*
   * =========================================
   * Core Order Data
   * =========================================
   */

  const [
    order,
    customerActionRequest,
    workspaceData,
    orderDocuments,
  ] =
    await Promise.all([
      getMyOrder(
        id
      ),
  
      getMyCustomerActionRequest(
        id
      ),
  
      getMyOrderWorkspace(
        id
      ),
  
      getMyOrderDocuments(
        id
      ),
    ]);


  if (!order) {
    notFound();
  }


  /*
   * =========================================
   * Customer Action
   * =========================================
   */

  const latestRejectedSubmission =
    customerActionRequest
      ? await getMyLatestRejectedSubmission(
          customerActionRequest.id
        )
      : null;


  /*
   * =========================================
   * Appointment
   *
   * Appointment belongs to Workspace,
   * so we read it only after Workspace
   * has been resolved.
   * =========================================
   */

  const appointmentData =
    workspaceData
      ? await getMyOrderAppointment(
          workspaceData.workspace.id
        )
      : EMPTY_APPOINTMENT_DATA;


  /*
   * =========================================
   * Application Schema
   * =========================================
   */

  const formSchema =
    (
      order.services
        ?.form_schema ??
      []
    ) as
      FormFieldSchema[];

    const serviceOptionSnapshot =
      order
        .service_option_snapshot as
          | {
              requiresDocumentReview?:
                boolean;
            }
          | null;
    
    
    const requiresDocumentReview =
      serviceOptionSnapshot
        ?.requiresDocumentReview ===
      true;

      const serviceSlug =
      order.services?.slug ??
      "";
    
    
    const documentProfile:
      "personal" |
      "company" =
      serviceSlug.startsWith(
        "company-"
      )
        ? "company"
        : "personal";
    
    
    const canUploadDocuments =
      requiresDocumentReview &&
      order.payment_status ===
        "paid";

  return (
    <main className="mx-auto max-w-5xl p-6 md:p-8">
      {/* =====================================
          Header
      ===================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              订单服务
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              {order.services
                ?.title ??
                "申请详情"}
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              申请时间：
              {new Date(
                order.created_at
              ).toLocaleString()}
            </p>
          </div>

          <StatusBadge
            status={
              order.status as
                OrderStatus
            }
          />
        </div>
      </div>


      {/* =====================================
          Workspace
      ===================================== */}

      {workspaceData && (
        <CustomerOrderWorkspace
          data={
            workspaceData
          }

          customerActionRequest={
            customerActionRequest
          }

          currentFormData={
            (
              order.form_data ??
              {}
            ) as Record<
              string,
              string
            >
          }

          latestRejectReason={
            latestRejectedSubmission
              ?.reviewReason ??
            null
          }

          appointmentData={
            appointmentData
          }
        />
      )}


      {/* =====================================
          Customer Action Fallback

          Workspace 服务：
          Customer Action 已显示在 Workspace。

          非 Workspace 服务：
          保留原来的资料修正 UI。
      ===================================== */}

      {!workspaceData &&
        customerActionRequest && (
          <CustomerActionCorrectionForm
            request={
              customerActionRequest
            }

            currentFormData={
              (
                order.form_data ??
                {}
              ) as Record<
                string,
                string
              >
            }

            latestRejectReason={
              latestRejectedSubmission
                ?.reviewReason ??
              null
            }
          />
        )}

            {/* =====================================
                Data Retention
            ===================================== */}

           <div className="mt-8">
           {requiresDocumentReview && (
              canUploadDocuments ? (
                <CustomerOrderDocuments
                  orderId={
                    order.id
                  }
                  documents={
                    orderDocuments
                  }
                  documentProfile={
                    documentProfile
                  }
                />
              ) : (
                <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h2 className="font-semibold text-amber-900">
                    办理资料检查
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-amber-800">
                    完成付款后即可上传办理资料，由工作人员在现场办理前提前检查。
                  </p>
                </section>
              )
            )}
              <CustomerDataRetentionStatus
                status={
                  order.data_cleanup_status
                }

                cleanupDueAt={
                  order.data_cleanup_due_at
                }

                cleanedAt={
                  order.data_cleaned_at
                }
              />
            </div>




      {/* =====================================
          Application Data
      ===================================== */}

      <section className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          申请资料
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          以下为您提交本次服务申请时提供的资料。
        </p>


        {Object.keys(
          order.form_data ??
          {}
        ).length ===
        0 ? (
          <div className="mt-4 rounded-lg border p-4 text-sm text-gray-500">
            暂无申请资料。
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {Object.entries(
              order.form_data ??
              {}
            ).map(
              ([
                key,
                value,
              ]) => {
                const field =
                  formSchema.find(
                    item =>
                      item.name ===
                      key
                  );


                return (
                  <div
                    key={
                      key
                    }
                    className="rounded-lg border p-4"
                  >
                    <p className="text-sm text-gray-500">
                      {field
                        ?.label ??
                        key}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap">
                      {value ===
                        null ||
                      value ===
                        undefined ||
                      String(
                        value
                      ).trim() ===
                        ""
                        ? "未填写"
                        : String(
                            value
                          )}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}