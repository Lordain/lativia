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
  getOrderActivity,
} from "@/lib/orders/getOrderActivity";

import {
  getPaymentAuditLogs,
} from "@/lib/payments/getPaymentAuditLogs";

import {
  formatBusinessDateTime,
} from "@/lib/time/formatBusinessDateTime";

import StatusBadge from "@/components/orders/StatusBadge";

import OrderPaymentInfo from "@/components/admin/OrderPaymentInfo";

import PaymentTransactionList from "@/components/admin/PaymentTransactionList";

import PaymentAuditLogList from "@/components/admin/PaymentAuditLogList";

import OrderManagementForm from "@/components/admin/OrderManagementForm";

import AddOrderNoteForm from "@/components/admin/AddOrderNoteForm";

import OrderActivityTimeline from "@/components/admin/OrderActivityTimeline";

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
  } = await params;

  const order =
    await getAdminOrder(
      id
    );

  if (!order) {
    notFound();
  }

  const [
    auditLogs,
    activity,
  ] =
    await Promise.all([
      getPaymentAuditLogs(
        order.id
      ),

      getOrderActivity(
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
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          {order.services
            ?.title ??
            "订单详情"}
        </h1>

        <div className="mt-4">
          <StatusBadge
            status={
              order.status as OrderStatus
            }
          />
        </div>
      </div>

      {/* Customer */}

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

      {/* Application */}

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

      <OrderPaymentInfo
        paymentStatus={
          order.payment_status as PaymentStatus
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

      {/* Operations */}

      <OrderManagementForm
        orderId={
          order.id
        }
        initialStatus={
          order.status as OrderStatus
        }
      />

      <AddOrderNoteForm
        orderId={
          order.id
        }
      />

      <OrderActivityTimeline
        activity={
          activity
        }
      />
    </div>
  );
}