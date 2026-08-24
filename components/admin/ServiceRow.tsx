import Link from "next/link";

import type {
  Service,
} from "@/types/service";

interface Props {
  service: Service;
}

function getServiceStatusConfig(
  status: Service["serviceStatus"]
) {
  switch (status) {
    case "active":
      return {
        label: "正常受理",
        className:
          "bg-green-50 text-green-700",
      };

    case "paused":
      return {
        label: "暂停受理",
        className:
          "bg-amber-50 text-amber-700",
      };

    case "hidden":
      return {
        label: "前台隐藏",
        className:
          "bg-gray-100 text-gray-500",
      };

    default:
      return {
        label: "未知状态",
        className:
          "bg-gray-100 text-gray-500",
      };
  }
}

export default function ServiceRow({
  service,
}: Props) {
  const status =
    getServiceStatusConfig(
      service.serviceStatus
    );


  return (
    <Link
      href={`/admin/services/${service.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-xl">
          {
            service.icon
          }
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-slate-950">
              {
                service.title
              }
            </h2>

            <span
              className={`
                rounded-full
                px-2.5
                py-1
                text-xs
                font-semibold
                ${status.className}
              `}
            >
              {
                status.label
              }
            </span>

            {service.popular && (
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">
                热门
              </span>
            )}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {
              service.shortDescription
            }
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
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

        <span className="mt-3 shrink-0 text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
          →
        </span>
      </div>
    </Link>
  );
}