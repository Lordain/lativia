import Link from "next/link";

import type {
  Service,
} from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  const isPaused =
    service.serviceStatus ===
    "paused";

  return (
    <Link
      href={`/services/${service.slug}`}
      className="
        flex
        items-center
        gap-4
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:border-blue-200
        hover:shadow-md
      "
    >
      <div className="shrink-0 text-2xl">
        {service.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold">
            {service.title}
          </h3>

          {isPaused && (
            <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
              暂停受理
            </span>
          )}

          {service.popular && (
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              热门
            </span>
          )}
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {
            service.shortDescription
          }
        </p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
          {service.price && (
            <span>
              {service.price}
            </span>
          )}

          {service.duration && (
            <span>
              {service.duration}
            </span>
          )}
        </div>
      </div>

      <span className="shrink-0 text-gray-400">
        &gt;
      </span>
    </Link>
  );
}