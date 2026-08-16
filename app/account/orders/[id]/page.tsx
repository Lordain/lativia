import {
  notFound,
} from "next/navigation";

import {
  getMyOrder,
} from "@/lib/orders/getMyOrder";

import {
  getMyCustomerActionRequest,
} from "@/lib/customerActions/getMyCustomerActionRequest";

import StatusBadge from "@/components/orders/StatusBadge";

import CustomerActionCorrectionForm from "@/components/orders/CustomerActionCorrectionForm";

import type {
  OrderStatus,
} from "@/types/order";

import type {
  FormFieldSchema,
} from "@/types/form";

import {
  getMyLatestRejectedSubmission,
} from "@/lib/customerActions/getMyLatestRejectedSubmission";

interface Props {
  params:
    Promise<{
      id: string;
    }>;
}


export default async function OrderDetailPage({
  params,
}: Props) {
  const {
    id,
  } =
    await params;


  const [
    order,
    customerActionRequest,
  ] =
    await Promise.all([
      getMyOrder(
        id
      ),

      getMyCustomerActionRequest(
        id
      ),
    ]);
  
    const latestRejectedSubmission =
    customerActionRequest
      ? await getMyLatestRejectedSubmission(
          customerActionRequest.id
        )
      : null;


  if (!order) {
    notFound();
  }


  const formSchema =
    (
      order.services
        ?.form_schema ??
      []
    ) as
      FormFieldSchema[];


  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold">
        {order.services
          ?.title ??
          "申请详情"}
      </h1>


      <div className="mt-4">
        <StatusBadge
          status={
            order.status as
              OrderStatus
          }
        />
      </div>


      <p className="mt-4 text-sm text-gray-500">
        申请时间：
        {new Date(
          order.created_at
        ).toLocaleString()}
      </p>


      {/* =====================================
          Customer Action
      ===================================== */}

    {customerActionRequest && (
      <CustomerActionCorrectionForm
        request={
          customerActionRequest
        }
        currentFormData={
          (
            order.form_data ??
            {}
          ) as
            Record<
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
          Application Data
      ===================================== */}

      <section className="mt-8">
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