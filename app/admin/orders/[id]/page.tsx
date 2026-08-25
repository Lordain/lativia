import { notFound } from "next/navigation";

import Link from "next/link";

import { requireAdmin } from "@/lib/auth/requireAdmin";

import { getAdminOrder } from "@/lib/orders/getAdminOrder";

import { getAdminOrderDocuments } from "@/lib/documents/getAdminOrderDocuments";

import { getPaymentAuditLogs } from "@/lib/payments/getPaymentAuditLogs";

import { getAdminFulfillment } from "@/lib/fulfillments/getAdminFulfillment";

import { buildAdminOrderTimeline } from "@/lib/orders/buildAdminOrderTimeline";

import { formatBusinessDateTime } from "@/lib/time/formatBusinessDateTime";

import { getAdminRefund } from "@/lib/refunds/getAdminRefund";

import { getAdminCustomerActionRequest } from "@/lib/customerActions/getAdminCustomerActionRequest";

import { getAdminCustomerActionSubmission } from "@/lib/customerActions/getAdminCustomerActionSubmission";

import { getAdminOrderWorkspace } from "@/lib/workspaces/getAdminOrderWorkspace";

import { getAdminOrderAppointment } from "@/lib/appointments/getAdminOrderAppointment";

import { AdminDataCleanupStatus } from "@/components/admin/AdminDataCleanupStatus";

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

import AdminOrderResult from "@/components/admin/AdminOrderResult";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminSectionCard from "@/components/admin/AdminSectionCard";

import AdminEmptyState from "@/components/admin/AdminEmptyState";

import type { OrderStatus } from "@/types/order";

import type { FormFieldSchema } from "@/types/form";

import type {
  PaymentStatus,
  PaymentMethod,
  PaymentProvider,
} from "@/types/payment";

import type { OrderAppointmentData } from "@/types/appointment";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const EMPTY_APPOINTMENT_DATA: OrderAppointmentData = {
  appointment: null,

  slots: [],

  rule: null,
};

function InfoItem({
  label,
  value,
  mono = false,
}: {
  label: string;

  value: React.ReactNode;

  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>

      <div
        className={`
          mt-1.5
          break-words
          text-sm
          font-semibold
          text-slate-900
          ${mono ? "font-mono text-xs" : ""}
        `}
      >
        {value}
      </div>
    </div>
  );
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  const [
    auditLogs,
    fulfillmentData,
    refundData,
    customerActionRequest,
    workspaceData,
    orderDocuments,
  ] = await Promise.all([
    getPaymentAuditLogs(order.id),

    getAdminFulfillment(order.id),

    getAdminRefund(order.id),

    getAdminCustomerActionRequest(order.id),

    getAdminOrderWorkspace(order.id),

    getAdminOrderDocuments(order.id),
  ]);

  const customerActionSubmission = customerActionRequest
    ? await getAdminCustomerActionSubmission(customerActionRequest.id)
    : null;

  const showAppointment = order.services?.slug === "cetesdirecto-consultation";

  const appointmentData =
    workspaceData && showAppointment
      ? await getAdminOrderAppointment(workspaceData.workspace.id)
      : EMPTY_APPOINTMENT_DATA;

  const defaultConsultationType =
    order.services?.slug === "cetesdirecto-consultation"
      ? "cetes_initial_consultation"
      : null;

  const formSchema = (order.services?.form_schema ?? []) as FormFieldSchema[];

  const timeline = buildAdminOrderTimeline({
    transactions: order.payment_transactions ?? [],

    auditLogs,

    fulfillmentActivity: fulfillmentData.activity,
  });

  const serviceOptionSnapshot = order.service_option_snapshot as {
    title?: string;

    optionKey?: string;

    serviceMode?: "appointment_only" | "appointment_plus_onsite";

    onsiteAvailable?: boolean;

    requiresDocumentReview?: boolean;

    workspaceRequired?: boolean;

    allowedRegions?: string[];
  } | null;

  const requiresDocumentReview =
    serviceOptionSnapshot?.requiresDocumentReview === true;

  const applicationEntries = Object.entries(order.form_data ?? {});

  return (
    <div>
      <AdminPageHeader
        title={order.services?.title ?? "订单详情"}
        description="查看订单、付款、办理进度、客户资料与服务空间，并完成当前订单所需的后台操作。"
        actions={
          <>
            <StatusBadge status={order.status as OrderStatus} />

            <Link
              href="/admin/orders"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
            >
              ← 返回订单管理
            </Link>
          </>
        }
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoItem label="客户" value={order.profiles?.name ?? "未知用户"} />

        <InfoItem label="联系电话" value={order.profiles?.phone ?? "未填写"} />

        <InfoItem
          label="提交时间"
          value={formatBusinessDateTime(order.created_at)}
        />

        <InfoItem label="订单 ID" value={order.id} mono />
      </div>

      <div className="mt-8 space-y-8">
        <AdminSectionCard
          title="服务与办理"
          description="查看客户购买的服务方案，并管理当前 Fulfillment 办理状态。"
        >
          {serviceOptionSnapshot && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <InfoItem
                label="客户购买方案"
                value={serviceOptionSnapshot.title ?? "未记录"}
              />

              <InfoItem
                label="服务模式"
                value={
                  serviceOptionSnapshot.serviceMode ===
                  "appointment_plus_onsite"
                    ? "预约 + 现场办理陪同（翻译）"
                    : serviceOptionSnapshot.serviceMode === "appointment_only"
                      ? "预约协助"
                      : "未记录"
                }
              />

              <InfoItem
                label="现场陪同"
                value={
                  serviceOptionSnapshot.onsiteAvailable ? "包含" : "不包含"
                }
              />

              <InfoItem
                label="资料预审"
                value={
                  serviceOptionSnapshot.requiresDocumentReview
                    ? "需要"
                    : "不需要"
                }
              />

              <InfoItem
                label="客户服务空间"
                value={
                  serviceOptionSnapshot.workspaceRequired ? "需要" : "不需要"
                }
              />
            </div>
          )}

          <div
            className={`
              ${
                serviceOptionSnapshot
                  ? "mt-6 border-t border-slate-200 pt-6"
                  : ""
              }
              [&>section]:mt-0
              [&>section]:rounded-none
              [&>section]:border-0
              [&>section]:bg-transparent
              [&>section]:p-0
              [&>section]:shadow-none
            `}
          >
            <AdminFulfillmentControl
              fulfillment={fulfillmentData.fulfillment}
              paymentStatus={order.payment_status}
            />
          </div>
        </AdminSectionCard>

        <OrderPaymentInfo
          orderId={order.id}
          paymentStatus={order.payment_status as PaymentStatus}
          amount={order.amount}
          currency={order.currency}
          paymentMethod={order.payment_method as PaymentMethod | null}
          paymentProvider={order.payment_provider as PaymentProvider | null}
          paidAt={order.paid_at}
        />

        <AdminSectionCard
          title="申请资料"
          description="以下资料由客户提交本次服务申请时提供，仅用于当前业务办理。"
        >
          {applicationEntries.length === 0 ? (
            <AdminEmptyState
              title="暂无申请资料"
              description="此订单没有记录客户提交的申请字段。"
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {applicationEntries.map(([key, value]) => {
                const field = formSchema.find((item) => item.name === key);

                return (
                  <InfoItem
                    key={key}
                    label={field?.label ?? key}
                    value={
                      value === null ||
                      value === undefined ||
                      String(value).trim() === "" ? (
                        "未填写"
                      ) : (
                        <span className="whitespace-pre-wrap">
                          {String(value)}
                        </span>
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </AdminSectionCard>

        {workspaceData && (
          <AdminOrderWorkspace
            data={workspaceData}
            orderId={order.id}
            fulfillmentId={fulfillmentData.fulfillment?.id ?? null}
            fulfillmentStatus={fulfillmentData.fulfillment?.status ?? null}
            formSchema={formSchema}
            formData={(order.form_data ?? {}) as Record<string, string>}
            customerActionRequest={customerActionRequest}
            customerActionSubmission={customerActionSubmission}
            requiresDocumentReview={requiresDocumentReview}
            documents={orderDocuments}
            appointmentData={appointmentData}
            showAppointment={showAppointment}
            defaultConsultationType={defaultConsultationType}
          />
        )}

        {order.services?.slug === "cetesdirecto-consultation" &&
          order.payment_status === "paid" && (
            <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-blue-950">
                    Cetesdirecto 咨询课件
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-800">
                    管理员内部咨询演示工具。
                    在线会议过程中可通过屏幕共享向客户讲解，
                    客户账户本身不会获得课件访问权限。
                  </p>

                  <p className="mt-2 text-xs leading-5 text-blue-700">
                    课件包含订单专属动态浮水印， 不提供客户下载入口。
                  </p>
                </div>

                <Link
                  href={`/admin/orders/${order.id}/consultation`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  打开咨询课件 ↗
                </Link>
              </div>
            </section>
          )}

        {workspaceData && (
          <AdminSectionCard
            title="服务结果"
            description="管理本订单最终交付给客户的服务结果。"
          >
            <div className="[&>section]:mt-0 [&>section]:rounded-none [&>section]:border-0 [&>section]:bg-transparent [&>section]:p-0 [&>section]:shadow-none">
              <AdminOrderResult
                orderId={order.id}
                results={workspaceData.results}
              />
            </div>
          </AdminSectionCard>
        )}

        <AdminDataCleanupStatus
          status={order.data_cleanup_status}
          purposeEndedAt={order.data_purpose_ended_at}
          cleanupDueAt={order.data_cleanup_due_at}
          cleanedAt={order.data_cleaned_at}
          lastError={order.data_cleanup_last_error}
        />

        {!workspaceData && (
          <div className="space-y-8">
            <AdminCustomerActionRequest
              orderId={order.id}
              fulfillmentId={fulfillmentData.fulfillment?.id ?? null}
              fulfillmentStatus={fulfillmentData.fulfillment?.status ?? null}
              formSchema={formSchema}
              formData={(order.form_data ?? {}) as Record<string, string>}
              activeRequest={customerActionRequest}
            />

            {customerActionRequest && (
              <AdminCustomerActionReview
                request={customerActionRequest}
                submission={customerActionSubmission}
                currentFormData={
                  (order.form_data ?? {}) as Record<string, string>
                }
              />
            )}
          </div>
        )}

        {refundData.refund && (
          <AdminRefundReview
            refund={refundData.refund}
            activity={refundData.activity}
          />
        )}

        {refundData.refund && (
          <AdminRefundExecution refund={refundData.refund} />
        )}

        {fulfillmentData.fulfillment && (
          <AddFulfillmentNoteForm
            fulfillmentId={fulfillmentData.fulfillment.id}
          />
        )}

        <AdminOrderTimeline items={timeline} />
      </div>
    </div>
  );
}
