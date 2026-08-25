import {
  notFound,
} from "next/navigation";

import Link from "next/link";

import {
  getMyOrder,
} from "@/lib/orders/getMyOrder";

import PublicShell from "@/components/layout/PublicShell";

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


  if (
    !order
  ) {
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
   * 平台咨询预约目前仅用于 Cetes。
   *
   * RFC / e.firma 现场办理陪同不使用
   * 平台 Appointment，以免与 SAT 官方预约混淆。
   * 相关预约及现场安排通过 Workspace 沟通。
   * =========================================
   */

  const showAppointment =
    order.services?.slug ===
    "cetesdirecto-consultation";


  const appointmentData =
    workspaceData &&
    showAppointment
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


  /*
   * =========================================
   * Service Option Snapshot
   * =========================================
   */

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


  const eligibilityAcknowledgements =
    Array.isArray(
      order
        .eligibility_acknowledgements
    )
      ? (
          order
            .eligibility_acknowledgements as Array<{
              key?: unknown;
              label?: unknown;
            }>
        )
          .map(
            item => ({
              key:
                typeof item.key ===
                "string"
                  ? item.key
                  : "",

              label:
                typeof item.label ===
                "string"
                  ? item.label
                  : "",
            })
          )
          .filter(
            item =>
              item.key.length >
                0 &&
              item.label.length >
                0
          )
      : [];


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

    const canContinuePayment =
      order.payment_status ===
        "unpaid" ||
      order.payment_status ===
        "failed";

    const paymentActionLabel =
      order.payment_status ===
      "failed"
        ? "重新付款"
        : "继续付款";


      return (
        <PublicShell>
          <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
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

          {order.payment_status ===
              "unpaid" ? (
                <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
                  等待付款
                </span>
              ) : order.payment_status ===
              "failed" ? (
                <span className="inline-flex shrink-0 items-center rounded-full bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-700">
                  付款未完成
                </span>
              ) : (
                <StatusBadge
                  status={
                    order.status as
                      OrderStatus
                  }
                />
              )}
        </div>
      </div>

      {canContinuePayment && (
        <section className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-950">
                {order.payment_status ===
                "failed"
                  ? "付款尚未完成"
                  : "订单已建立，等待付款"}
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-800">
                完成付款后，我们才会开始处理您的服务申请。
              </p>

              {order.amount !==
                null && (
                <p className="mt-2 text-lg font-bold text-slate-950">
                  {order.currency ??
                    "MXN"}{" "}
                  {Number(
                    order.amount
                  ).toLocaleString(
                    "es-MX"
                  )}
                </p>
              )}
            </div>

            <Link
              href={`/account/orders/${order.id}/payment`}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              {
                paymentActionLabel
              }
            </Link>
          </div>
        </section>
      )}


      {/* =====================================
          1. Application Data
          申请资料
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
          serviceSlug ===
            "cetesdirecto-consultation" &&
          eligibilityAcknowledgements.length >
            0 ? (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-950">
                    已确认办理条件
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    以下为您提交订单时确认具备的办理条件。
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  已确认
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {eligibilityAcknowledgements.map(
                  item => (
                    <div
                      key={
                        item.key
                      }
                      className="flex items-start gap-3 rounded-lg border border-blue-100 bg-white px-4 py-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                        ✓
                      </span>

                      <span className="text-sm leading-5 text-slate-700">
                        {
                          item.label
                        }
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border p-4 text-sm text-gray-500">
              暂无申请资料。
            </div>
          )
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


      {/* =====================================
          2. Processing Documents
          办理资料
      ===================================== */}

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
              办理资料
            </h2>

            <p className="mt-2 text-sm leading-6 text-amber-800">
              完成付款后即可上传办理资料，
              由工作人员在现场办理前提前检查。
            </p>
          </section>
        )
      )}


      {/* =====================================
          3–7. Service Workspace

          内部顺序下一步统一为：
          服务沟通
          服务进度
          需要您处理
          服务期限
          服务结果

          Cetes 另外显示咨询预约。
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

          showAppointment={
            showAppointment
          }

          requiresDocumentReview={
            requiresDocumentReview
          }

          documents={
            orderDocuments
          }

          documentProfile={
            documentProfile
          }
        />
      )}


      {/* =====================================
          5. Customer Action Fallback

          只有没有 Workspace 的服务
          才在这里单独显示客户待办。

          Workspace 服务的客户待办
          会显示在 Workspace 内。
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
          8. Data Retention
          办理资料保护
      ===================================== */}

      <div className="mt-8">
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

      <div className="mb-6">
        <Link
          href="/account/orders"
          className="inline-flex min-h-10 items-center text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          ← 返回我的订单
        </Link>
        </div>
    </main>
  </PublicShell>
  );
}
