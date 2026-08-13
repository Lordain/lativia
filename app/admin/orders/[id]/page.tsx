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
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";

import StatusBadge from "@/components/orders/StatusBadge";

import OrderPaymentInfo from "@/components/admin/OrderPaymentInfo";

import PaymentTransactionList from "@/components/admin/PaymentTransactionList";

import PaymentAuditLogList from "@/components/admin/PaymentAuditLogList";

import AdminFulfillmentControl from "@/components/admin/AdminFulfillmentControl";

import FulfillmentActivityTimeline from "@/components/admin/FulfillmentActivityTimeline";

import AddOrderNoteForm from "@/components/admin/AddOrderNoteForm";

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

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({
  params,
}: Props) {
  await requireAdmin();

  const {
    id,
  } =
    await params;

  const order =
    await getAdminOrder(
      id
    );

  if (!order) {
    notFound();
  }

  const [
    auditLogs,
    fulfillmentData,
  ] =
    await Promise.all([
      getPaymentAuditLogs(
        order.id
      ),
  
      getAdminFulfillment(
        order.id
      ),
    ]);

  const formSchema =
    (
      order.services
        ?.form_schema ??
      []
    ) as FormFieldSchema[];

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
          实际业务办理状态由下方 Fulfillment Operations
          统一管理并自动同步。
        </p>
      </div>

      {/* =====================================
          Customer
      ===================================== */}

      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          客户信息
        </h2>

        <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-2">
          <p>
            客户：
            {order.profiles
              ?.name ??
              "未知用户"}
          </p>

          <p>
            电话：
            {order.profiles
              ?.phone ??
              "未填写"}
          </p>

          <p>
            提交时间：
            {formatBusinessDateTime(
              order.created_at
            )}
          </p>

          <p className="break-all">
            订单 ID：
            {order.id}
          </p>
        </div>
      </section>

      {/* =====================================
          Application Data
      ===================================== */}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          申请资料
        </h2>

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
                    className="rounded-lg border bg-white p-4"
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
          Payment
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

      <PaymentTransactionList
        transactions={
          order.payment_transactions ??
          []
        }
      />

      <PaymentAuditLogList
        logs={
          auditLogs
        }
      />

      {/* =====================================
          Fulfillment Operations

          这是实际业务办理状态的唯一 Admin 操作入口。
          不再允许 Admin 直接修改 orders.status。
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

      {fulfillmentData
        .fulfillment && (
        <FulfillmentActivityTimeline
          activity={
            fulfillmentData
              .activity
          }
        />
      )}

      {/* =====================================
          Internal Notes

          暂时继续沿用旧 order_activity。
          Lesson 23.32 会迁移到 fulfillment_activity。
      ===================================== */}

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            内部备注
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            用于记录客户沟通、人工处理说明及其他内部信息。
            仅供管理员查看，不会显示给客户。
          </p>
        </div>

        <AddOrderNoteForm
          orderId={
            order.id
          }
        />
      </section>

    </div>
  );
}