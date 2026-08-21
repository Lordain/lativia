import {
  notFound,
} from "next/navigation";

import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getAdminOrder,
} from "@/lib/orders/getAdminOrder";

import AdminOrderResult from "@/components/admin/AdminOrderResult";

import {
  getAdminOrderDocuments,
} from "@/lib/documents/getAdminOrderDocuments";

import {
  getPaymentAuditLogs,
} from "@/lib/payments/getPaymentAuditLogs";

import {
  getAdminFulfillment,
} from "@/lib/fulfillments/getAdminFulfillment";

import {
  buildAdminOrderTimeline,
} from "@/lib/orders/buildAdminOrderTimeline";

import {
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";

import {
  getAdminRefund,
} from "@/lib/refunds/getAdminRefund";

import {
  getAdminCustomerActionRequest,
} from "@/lib/customerActions/getAdminCustomerActionRequest";

import {
  getAdminCustomerActionSubmission,
} from "@/lib/customerActions/getAdminCustomerActionSubmission";

import {
  getAdminOrderWorkspace,
} from "@/lib/workspaces/getAdminOrderWorkspace";

import {
  AdminDataCleanupStatus,
} from "@/components/admin/AdminDataCleanupStatus";

import {
  getAdminOrderAppointment,
} from "@/lib/appointments/getAdminOrderAppointment";

import StatusBadge from "@/components/orders/StatusBadge";

import OrderPaymentInfo from "@/components/admin/OrderPaymentInfo";

import AdminFulfillmentControl from "@/components/admin/AdminFulfillmentControl";

import AddFulfillmentNoteForm from "@/components/admin/AddFulfillmentNoteForm";

import AdminOrderTimeline from "@/components/admin/AdminOrderTimeline";

import AdminRefundReview from "@/components/admin/AdminRefundReview";

import AdminRefundExecution from "@/components/admin/AdminRefundExecution";

import AdminCustomerActionRequest from "@/components/admin/AdminCustomerActionRequest";

import AdminCustomerActionReview from "@/components/admin/AdminCustomerActionReview";

import AdminOrderWorkspace from "@/components/admin/AdminOrderWorkspace";

import type {
  OrderStatus,
} from "@/types/order";

import type {
  FormFieldSchema,
} from "@/types/form";

import type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

import type {
  OrderAppointmentData,
} from "@/types/appointment";


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


export default async function AdminOrderDetailPage({
  params,
}: Props) {
  /*
   * =====================================
   * Admin Authorization
   * =====================================
   */

  await requireAdmin();


  const {
    id,
  } =
    await params;


  /*
   * =====================================
   * Order
   * =====================================
   */

  const order =
    await getAdminOrder(
      id
    );


  if (!order) {
    notFound();
  }


  /*
   * =====================================
   * Additional Admin Data
   *
   * Payment Audit / Fulfillment / Refund
   * Customer Action / Workspace
   *
   * 并行读取，减少页面等待时间。
   * =====================================
   */

  const [
    auditLogs,
    fulfillmentData,
    refundData,
    customerActionRequest,
    workspaceData,
    orderDocuments,
  ] =
    await Promise.all([
      getPaymentAuditLogs(
        order.id
      ),

      getAdminFulfillment(
        order.id
      ),

      getAdminRefund(
        order.id
      ),

      getAdminCustomerActionRequest(
        order.id
      ),

      getAdminOrderWorkspace(
        order.id
      ),
      
      getAdminOrderDocuments(
        order.id
      ),
    ]);


  /*
   * =====================================
   * Customer Action Submission
   * =====================================
   */

  const customerActionSubmission =
    customerActionRequest
      ? await getAdminCustomerActionSubmission(
          customerActionRequest.id
        )
      : null;


  /*
   * =====================================
   * Appointment / Meeting
   *
   * Appointment belongs to Workspace.
   * =====================================
   */

  const showAppointment =
    order.services?.slug ===
    "cetesdirecto-consultation";

  const appointmentData =
    workspaceData &&
    showAppointment
      ? await getAdminOrderAppointment(
          workspaceData.workspace.id
        )
      : EMPTY_APPOINTMENT_DATA;


  /*
   * =====================================
   * Service-specific Consultation Type
   * =====================================
   *
   * Current Phase 1:
   *
   * Cetes consultation gets its own
   * structured consultation type.
   *
   * Future services may add:
   *
   * rfc_initial_consultation
   * efirma_initial_consultation
   * etc.
   * =====================================
   */

  const defaultConsultationType =
    order.services
      ?.slug ===
      "cetesdirecto-consultation"
      ? "cetes_initial_consultation"
      : null;


  /*
   * =====================================
   * Dynamic Application Form
   * =====================================
   */

  const formSchema =
    (
      order.services
        ?.form_schema ??
      []
    ) as
      FormFieldSchema[];


  /*
   * =====================================
   * Unified Operations Timeline
   *
   * 底层数据仍分别保存在：
   *
   * payment_transactions
   * payment_audit_logs
   * fulfillment_activity
   *
   * Admin 页面统一转换为一个 Timeline。
   * =====================================
   */

  const timeline =
    buildAdminOrderTimeline({
      transactions:
        order
          .payment_transactions ??
        [],

      auditLogs,

      fulfillmentActivity:
        fulfillmentData
          .activity,
    });

    /*
   * =========================================
   * Service Option Snapshot
   * =========================================
   */

    const serviceOptionSnapshot =
    order
      .service_option_snapshot as
        | {
            title?:
              string;
  
            optionKey?:
              string;
  
            serviceMode?:
              "appointment_only" |
              "appointment_plus_onsite";
  
            onsiteAvailable?:
              boolean;
  
            requiresDocumentReview?:
              boolean;
  
            workspaceRequired?:
              boolean;
  
            allowedRegions?:
              string[];
          }
        | null;


  const requiresDocumentReview =
    serviceOptionSnapshot
      ?.requiresDocumentReview ===
    true;


  return (
    <div>
      {/* =====================================
          Header
      ===================================== */}

      <div>
        <h1 className="text-3xl font-bold">
          {order.services
            ?.title ??
            "订单详情"}
        </h1>

        <div className="mt-4">
          <StatusBadge
            status={
              order.status as
                OrderStatus
            }
          />
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          订单状态用于显示客户层面的整体办理进度。
          实际业务办理流程由 Fulfillment Operations
          统一管理并自动同步。
        </p>
      </div>

      {serviceOptionSnapshot && (
  <section className="mt-6 rounded-xl border bg-white p-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Service Option
      </p>

      <h2 className="mt-1 text-xl font-semibold">
        服务方案
      </h2>
    </div>

    <div className="mt-5 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-400">
          客户购买方案
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {serviceOptionSnapshot.title ??
            "未记录"}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-400">
          服务模式
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {serviceOptionSnapshot.serviceMode ===
          "appointment_plus_onsite"
            ? "预约 + 现场办理陪同（翻译）"
            : serviceOptionSnapshot.serviceMode ===
                "appointment_only"
              ? "预约协助"
              : "未记录"}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-400">
          现场陪同
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {serviceOptionSnapshot.onsiteAvailable
            ? "包含"
            : "不包含"}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-400">
          资料预审
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {serviceOptionSnapshot.requiresDocumentReview
            ? "需要"
            : "不需要"}
        </p>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-400">
          Workspace
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {serviceOptionSnapshot.workspaceRequired
            ? "需要"
            : "不需要"}
        </p>
      </div>
    </div>
  </section>
)}


      {/* =====================================
          Customer Information
      ===================================== */}

      <section className="mt-8 rounded-xl border bg-white p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Customer
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            客户信息
          </h2>
        </div>

        <div className="mt-5 grid gap-4 text-sm text-gray-600 md:grid-cols-2">
          <div>
            <p className="text-xs text-gray-400">
              客户
            </p>

            <p className="mt-1 font-medium text-gray-700">
              {order.profiles
                ?.name ??
                "未知用户"}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-400">
              电话
            </p>

            <p className="mt-1 font-medium text-gray-700">
              {order.profiles
                ?.phone ??
                "未填写"}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-400">
              提交时间
            </p>

            <p className="mt-1 font-medium text-gray-700">
              {formatBusinessDateTime(
                order.created_at
              )}
            </p>
          </div>


          <div>
            <p className="text-xs text-gray-400">
              订单 ID
            </p>

            <p className="mt-1 break-all font-medium text-gray-700">
              {order.id}
            </p>
          </div>
        </div>
      </section>


      {/* =====================================
          Application Data
      ===================================== */}

      <section className="mt-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Application
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            申请资料
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            以下资料由客户在提交本次服务申请时提供，
            仅用于当前业务办理。
          </p>
        </div>


        {Object.keys(
          order.form_data ??
            {}
        ).length ===
        0 ? (
          <div className="mt-4 rounded-xl border bg-white p-6 text-sm text-gray-500">
            暂无申请资料。
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
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
                    className="rounded-xl border bg-white p-4"
                  >
                    <p className="text-sm text-gray-500">
                      {field
                        ?.label ??
                        key}
                    </p>

                    <p className="mt-1 whitespace-pre-wrap font-medium text-gray-800">
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
          Data Retention / Privacy
      ===================================== */}

        <div className="mt-8">
                <AdminDataCleanupStatus
                  status={
                    order.data_cleanup_status
                  }

                  purposeEndedAt={
                    order.data_purpose_ended_at
                  }

                  cleanupDueAt={
                    order.data_cleanup_due_at
                  }

                  cleanedAt={
                    order.data_cleaned_at
                  }

                  lastError={
                    order.data_cleanup_last_error
                  }
                />
              </div>



      {/* =====================================
          Payment Summary

          这里只显示当前付款状态摘要。

          Payment Transaction / Audit 的历史记录
          已统一进入下方 Order Timeline。
      ===================================== */}

      <OrderPaymentInfo
        paymentStatus={
          order.payment_status as
            PaymentStatus
        }

        amount={
          order.amount
        }

        currency={
          order.currency
        }

        paymentMethod={
          order.payment_method as
            | PaymentMethod
            | null
        }

        paymentProvider={
          order.payment_provider as
            | PaymentProvider
            | null
        }

        paidAt={
          order.paid_at
        }
      />


      {/* =====================================
          Order Workspace

          只有 workspace_required 服务付款后
          建立了 Workspace 才显示。

          Appointment / Online Meeting
          现在也统一位于 Workspace 内。
      ===================================== */}

      {workspaceData && (
        <AdminOrderWorkspace
          data={
            workspaceData
          }

          orderId={
            order.id
          }

          fulfillmentId={
            fulfillmentData
              .fulfillment
              ?.id ??
            null
          }

          fulfillmentStatus={
            fulfillmentData
              .fulfillment
              ?.status ??
            null
          }

          formSchema={
            formSchema
          }

          formData={
            (
              order.form_data ??
              {}
            ) as Record<
              string,
              string
            >
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
            orderDocuments
          }

          appointmentData={
            appointmentData
          }

          showAppointment={
            showAppointment
          }

          defaultConsultationType={
            defaultConsultationType
          }
        />
      )}

      {/* =====================================
    Cetes Consultation Presentation

    Admin-only internal presentation.
===================================== */}

{order.services?.slug ===
  "cetesdirecto-consultation" &&
  order.payment_status ===
    "paid" && (
    <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            INTERNAL CONSULTATION
          </div>

          <h2 className="mt-3 text-xl font-semibold text-blue-950">
            Cetesdirecto 咨询课件
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800">
            管理员内部咨询演示工具。
            在线会议过程中可通过屏幕共享向客户讲解，
            客户账户本身不会获得课件访问权限。
          </p>

          <p className="mt-2 text-xs leading-5 text-blue-700">
            课件包含订单专属动态浮水印，
            不提供客户下载入口。
          </p>
        </div>

        <Link
          href={`/admin/orders/${order.id}/consultation`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-blue-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-blue-700
          "
        >
          打开咨询课件 ↗
        </Link>
      </div>
    </section>
  )}


      {/* =====================================
          Fulfillment Operations

          业务办理的唯一 Admin 状态操作入口。

          Admin 不再直接修改 orders.status。
      ===================================== */}

      <AdminFulfillmentControl
        fulfillment={
          fulfillmentData
            .fulfillment
        }

        paymentStatus={
          order.payment_status
        }
      />

      {/* =====================================
          Result Delivery
          服务结果交付

          放在 Fulfillment Operations 之后。
      ===================================== */}

      {workspaceData && (
        <div className="mt-8 rounded-xl border bg-white p-6">
          <AdminOrderResult
            orderId={
              order.id
            }

            results={
              workspaceData.results
            }
          />
        </div>
      )}


      {/* =====================================
          Customer Action Fallback

          有 Workspace：
          已显示在 AdminOrderWorkspace 内。

          无 Workspace：
          继续保留原来的独立 Customer Action，
          避免非 Workspace 服务失去补件能力。
      ===================================== */}

      {!workspaceData && (
        <>
          <AdminCustomerActionRequest
            orderId={
              order.id
            }

            fulfillmentId={
              fulfillmentData
                .fulfillment
                ?.id ??
              null
            }

            fulfillmentStatus={
              fulfillmentData
                .fulfillment
                ?.status ??
              null
            }

            formSchema={
              formSchema
            }

            formData={
              (
                order.form_data ??
                  {}
              ) as Record<
                string,
                string
              >
            }

            activeRequest={
              customerActionRequest
            }
          />


          {customerActionRequest && (
            <AdminCustomerActionReview
              request={
                customerActionRequest
              }

              submission={
                customerActionSubmission
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
            />
          )}
        </>
      )}


      {/* =====================================
          Refund Management
      ===================================== */}

      {refundData.refund && (
        <AdminRefundReview
          refund={
            refundData.refund
          }

          activity={
            refundData.activity
          }
        />
      )}


      {refundData.refund && (
        <AdminRefundExecution
          refund={
            refundData.refund
          }
        />
      )}


      {/* =====================================
          Internal Note

          新备注统一进入 fulfillment_activity。

          不再写入 legacy order_activity。
      ===================================== */}

      {fulfillmentData
        .fulfillment && (
        <AddFulfillmentNoteForm
          fulfillmentId={
            fulfillmentData
              .fulfillment
              .id
          }
        />
      )}


      {/* =====================================
          Unified Order Timeline

          Payment
          Payment Audit
          Fulfillment
          Human Review
          Internal Notes
          Failure
          Refund Review
          Completion
      ===================================== */}

      <AdminOrderTimeline
        items={
          timeline
        }
      />
    </div>
  );
}