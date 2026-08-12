import Link from "next/link";

import type {
  Service,
} from "@/types/service";

import ServiceActiveButton from "@/components/admin/ServiceActiveButton";

interface Props {
  service: Service;
}

export default function ServiceRow({
  service,
}: Props) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">
              {service.icon}
            </span>

            <h2 className="font-semibold">
              {service.title}
            </h2>

            <span
              className={`
                rounded-full
                px-2
                py-1
                text-xs
                font-medium
                ${
                  service.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }
              `}
            >
              {service.isActive
                ? "启用"
                : "停用"}
            </span>

            {service.popular && (
              <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
                热门
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {
              service.shortDescription
            }
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <span>
              Slug：
              {
                service.slug
              }
            </span>

            <span>
              分类：
              {
                service.category
              }
            </span>

            <span>
              价格：
              {
                service.price
              }
            </span>

            <span>
              办理：
              {
                service.duration
              }
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            href={`/admin/services/${service.id}`}
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
            编辑
          </Link>

          <ServiceActiveButton
            id={service.id}
            active={
              service.isActive
            }
          />
        </div>
      </div>
    </div>
  );
}