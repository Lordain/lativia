import Link from "next/link";
import type { Service } from "@/data/services";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <Link
  href={`/services/${service.slug}`}
  className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:border-blue-500 cursor-pointer"
>
  <div className="shrink-0 text-2xl">
    {service.icon}
  </div>

  <div className="min-w-0 flex-1">
    <h3 className="font-bold">
      {service.title}
    </h3>

    <p className="text-gray-500">
      {service.shortDescription}
    </p>
  </div>

  <span className="shrink-0 text-gray-400">
    &gt;
  </span>
</Link>
  );
}
