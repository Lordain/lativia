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
  OrderDocument,
} from "@/types/orderDocument";

import AdminCustomerActionRequest from "@/components/admin/AdminCustomerActionRequest";

import AdminCustomerActionReview from "@/components/admin/AdminCustomerActionReview";

import AdminDocumentReview from "@/components/admin/AdminDocumentReview";


interface Props {
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
}


export default function AdminCustomerMaterials({
  orderId,
  fulfillmentId,
  fulfillmentStatus,
  formSchema,
  formData,
  customerActionRequest,
  customerActionSubmission,
  requiresDocumentReview,
  documents,
}: Props) {
  return (
    <div className="space-y-6">
      <section>
        <div>
          <h4 className="font-bold text-slate-950">
            申请信息
          </h4>

          <p className="mt-1.5 text-sm leading-6 text-slate-500">
            检查客户提交的文字资料，
            并在需要时要求客户修正指定字段。
          </p>
        </div>

        {formSchema.length >
        0 ? (
          <div className="mt-4">
            <AdminCustomerActionRequest
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
                  formData
                }
              />
            )}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            此服务没有可修正的订单申请字段。
          </div>
        )}
      </section>

      {requiresDocumentReview && (
        <section className="border-t border-slate-200 pt-6">
          <div>
            <h4 className="font-bold text-slate-950">
              办理资料审核
            </h4>

            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              检查客户为办理流程提交的资料；
              如不符合要求，可通过现有审核流程要求重新处理。
            </p>
          </div>

          <div className="mt-4">
            <AdminDocumentReview
              documents={
                documents
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}