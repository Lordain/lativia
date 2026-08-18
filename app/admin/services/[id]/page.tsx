import {
  notFound,
} from "next/navigation";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getServiceById,
} from "@/lib/services/getServiceById";

import {
  getAdminServicePrices,
} from "@/lib/services/getAdminServicePrices";

import {
  toServiceFormData,
} from "@/lib/services/toServiceFormData";

import EditServiceContainer from "@/components/admin/EditServiceContainer";

import ServicePaymentOptions from "@/components/admin/ServicePaymentOptions";

import {
  getServiceWorkspaceWelcomeMessage,
} from "@/lib/services/getServiceWorkspaceWelcomeMessage";

import ServiceWorkspaceWelcomeEditor from "@/components/admin/ServiceWorkspaceWelcomeEditor";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({
  params,
}: Props) {
  await requireAdmin();

  const {
    id,
  } =
    await params;

    const [
      service,
      prices,
      workspaceWelcomeMessage,
    ] =
      await Promise.all([
        getServiceById(
          id
        ),
    
        getAdminServicePrices(
          id
        ),
    
        getServiceWorkspaceWelcomeMessage(
          id
        ),
      ]);

  if (!service) {
    notFound();
  }

  const initialData =
    toServiceFormData(
      service
    );

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">
          编辑服务
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Service ID：
          {service.id}
        </p>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <EditServiceContainer
          id={
            service.id
          }
          initialData={
            initialData
          }
        />
      </div>

      <ServiceWorkspaceWelcomeEditor
          serviceId={
            service.id
          }

          initialMessage={
            workspaceWelcomeMessage
          }

          workspaceRequired={
            service.workspaceRequired
          }
        />

      <div className="mt-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            付款方式
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            配置客户实际可以选择的付款方式、币种和收费金额。
            实际订单金额以这里启用的付款方案为准。
          </p>
        </div>

        <ServicePaymentOptions
          serviceId={
            service.id
          }
          prices={
            prices
          }
        />
      </div>
    </div>
  );
}