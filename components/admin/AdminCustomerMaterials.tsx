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
      <div className="mt-8 border-t pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Customer Materials
          </p>
  
          <h2 className="mt-1 text-xl font-semibold">
            客户资料审核
          </h2>
  
          <p className="mt-2 text-sm leading-6 text-gray-500">
            检查客户提交的申请信息及办理资料。
            如发现问题，可要求客户修改信息或重新提交文件。
          </p>
        </div>
  
  
        {/* =====================================
            Structured Application Data
        ===================================== */}
  
        <div className="mt-6">
          <h3 className="font-semibold">
            申请信息
          </h3>
  
          <p className="mt-1 text-sm text-gray-500">
            检查客户提交的文字资料，并在需要时要求客户修正指定字段。
          </p>
  
  
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
            <div className="mt-4 rounded-lg border border-dashed p-4 text-sm text-gray-500">
              此服务没有可修正的订单申请字段。
            </div>
          )}
        </div>
  
  
        {/* =====================================
            Uploaded Documents
        ===================================== */}
  
        {requiresDocumentReview && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold">
              上传办理资料
            </h3>
  
            <p className="mt-1 text-sm leading-6 text-gray-500">
              检查客户为现场办理陪同（翻译）提交的文件资料。
              如资料不符合要求，可要求客户重新提交。
            </p>
  
  
            <div className="mt-4">
              <AdminDocumentReview
                documents={
                  documents
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  }