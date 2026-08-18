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
      {/* =====================================
          Header
      ===================================== */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            服务管理
          </h1>

          <p className="mt-2 text-gray-500">
            管理服务内容、受理状态和付款方式。
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            <span>
              共{" "}
              <strong className="text-gray-800">
                {
                  services.length
                }
              </strong>{" "}
              项
            </span>

            <span>
              正常受理{" "}
              <strong className="text-green-700">
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
              <strong className="text-gray-700">
                {
                  hiddenCount
                }
              </strong>
            </span>
          </div>
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

      {/* =====================================
          Service List
      ===================================== */}

      {services.length ===
      0 ? (
        <div className="mt-8 rounded-xl border bg-white p-8 text-center text-gray-500">
          暂无服务。
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