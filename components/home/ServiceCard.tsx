import { ReactNode } from "react";
import Link from "next/link";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  href,
}: ServiceCardProps) {
  return (
    <Link href={href} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md transition-transform duration-200 hover:scale-105">
      <div className="shrink-0 text-2xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold">{title}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
      <span className="shrink-0 text-gray-400">&gt;</span>
    </Link>
  );
}
