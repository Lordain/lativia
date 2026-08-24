import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getAdminServices,
} from "@/lib/services/getAdminServices";

import ServiceRow from "@/components/admin/ServiceRow";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import AdminEmptyState from "@/components/admin/AdminEmptyState";


export default async function AdminServicesPage() {
  await requireAdmin();


  const services =
    await getAdminServices();


  const activeCount =
    services.filter(
      service =>
        service
          .serviceStatus ===
        "active"
    ).length;


  const pausedCount =
    services.filter(
      service =>
        service
          .serviceStatus ===
        "paused"
    ).length;


  const hiddenCount =
    services.filter(
      service =>
        service
          .serviceStatus ===
        "hidden"
    ).length;


  return (
    <div>
      <AdminPageHeader
        title="服务管理"
        description="管理服务内容、受理状态和计费方式。"
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            新增服务
          </Link>
        }
      >
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
          <span>
            共{" "}
            <strong className="text-slate-900">
              {
                services.length
              }
            </strong>{" "}
            项
          </span>

          <span>
            正常受理{" "}
            <strong className="text-emerald-700">
              {
                activeCount
              }
            </strong>
          </span>

          <span>
            暂停{" "}
            <strong className="text-amber-700">
              {
                pausedCount
              }
            </strong>
          </span>

          <span>
            隐藏{" "}
            <strong className="text-slate-700">
              {
                hiddenCount
              }
            </strong>
          </span>
        </div>
      </AdminPageHeader>

      {services.length ===
      0 ? (
        <div className="mt-8">
          <AdminEmptyState
            title="暂无服务"
            description="创建第一个服务后，会显示在这里。"
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {services.map(
            service => (
              <ServiceRow
                key={
                  service.id
                }
                service={
                  service
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}