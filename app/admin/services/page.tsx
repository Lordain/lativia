import Link from "next/link";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getAdminServices,
} from "@/lib/services/getAdminServices";

import ServiceRow from "@/components/admin/ServiceRow";

export default async function AdminServicesPage() {
  await requireAdmin();

  const services =
    await getAdminServices();

  const activeCount =
    services.filter(
      (service) =>
        service.isActive
    ).length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            服务管理
          </h1>

          <p className="mt-2 text-gray-500">
            管理前台服务内容、展示状态与基本资料。
          </p>

          <p className="mt-2 text-sm text-gray-400">
            共{" "}
            {
              services.length
            }{" "}
            项服务 ·{" "}
            {
              activeCount
            }{" "}
            项启用
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          新增服务
        </Link>
      </div>

      {services.length ===
      0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center text-gray-500">
          暂无服务。
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {services.map(
            (service) => (
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