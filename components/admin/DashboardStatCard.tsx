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
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-blue-500" />

        <p className="text-sm font-semibold text-slate-600">
          {label}
        </p>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      {description && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </>
  );


  if (href) {
    return (
      <Link
        href={
          href
        }
        className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
      >
        {content}

        <p className="mt-4 text-xs font-semibold text-blue-600 opacity-0 transition group-hover:opacity-100">
          查看详情 →
        </p>
      </Link>
    );
  }


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {content}
    </div>
  );
}