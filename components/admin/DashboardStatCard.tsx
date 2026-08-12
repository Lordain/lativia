import Link from "next/link";

interface Props {
  label: string;
  value: number;
  description?: string;
  href?: string;
}

export default function DashboardStatCard({
  label,
  value,
  description,
  href,
}: Props) {
  const content = (
    <>
      <p className="text-sm font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-sm text-gray-500">
          {description}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="
          block
          rounded-xl
          border
          bg-white
          p-6
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      {content}
    </div>
  );
}