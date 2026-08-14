import {
  notFound,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getAdminOrder,
} from "@/lib/orders/getAdminOrder";

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

import StatusBadge from "@/components/orders/StatusBadge";

import OrderPaymentInfo from "@/components/admin/OrderPaymentInfo";

import AdminFulfillmentControl from "@/components/admin/AdminFulfillmentControl";

import AddFulfillmentNoteForm from "@/components/admin/AddFulfillmentNoteForm";

import AdminOrderTimeline from "@/components/admin/AdminOrderTimeline";

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

import {
  getAdminRefund,
} from "@/lib/refunds/getAdminRefund";

import AdminRefundReview from "@/components/admin/AdminRefundReview";

import AdminRefundExecution from "@/components/admin/AdminRefundExecution";


interface Props {
  params: Promise<{
    id: string;
  }>;
}


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
   * 并行读取，减少页面等待时间。
   * =====================================
   */

  const [
    auditLogs,
    fulfillmentData,
    refundData,
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
    ]);


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
    ) as FormFieldSchema[];


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
                    (
                      item
                    ) =>
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
          Refund Management

          只有真正建立 Refund Case
          才显示退款审核区。
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

          全部按时间统一展示。
      ===================================== */}

      <AdminOrderTimeline
        items={
          timeline
        }
      />
    </div>
  );
}