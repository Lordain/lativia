import {
  notFound,
} from "next/navigation";

import Link from "next/link";

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

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminSectionCard from "@/components/admin/AdminSectionCard";


interface Props {
  params:
    Promise<{
      id:
        string;
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
    <div>
      <AdminPageHeader
        title="编辑服务"
        description="管理服务基本资料、办理规则、客户服务空间及实际付款方案。"
        actions={
          <Link
            href="/admin/services"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-950"
          >
            ← 返回服务管理
          </Link>
        }
      />

      <div className="mt-7 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-slate-500">
            Service ID
          </p>

          <p className="break-all font-mono text-xs text-slate-700">
            {
              service.id
            }
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <EditServiceContainer
          id={
            service.id
          }
          initialData={
            initialData
          }
        />

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

        <AdminSectionCard
          title="付款方式"
          description="配置客户实际可以选择的付款方式、币种和收费金额。实际订单金额以启用的付款方案为准。"
        >
          <div className="[&>section]:mt-0 [&>section]:rounded-none [&>section]:border-0 [&>section]:bg-transparent [&>section]:p-0 [&>section]:shadow-none">
            <ServicePaymentOptions
              serviceId={
                service.id
              }
              prices={
                prices
              }
            />
          </div>
        </AdminSectionCard>
      </div>
    </div>
  );
}
