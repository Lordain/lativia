interface Props {
    label: string;
  
    value:
      string |
      number;
  
    description?: string;
  
    tone?:
      | "blue"
      | "emerald"
      | "amber"
      | "red"
      | "violet"
      | "slate";
  }
  
  
  const toneClass = {
    blue:
      "border-blue-200 bg-blue-50/40",
  
    emerald:
      "border-emerald-100 bg-emerald-50/40",
  
    amber:
      "border-amber-100 bg-amber-50/40",
  
    red:
      "border-red-100 bg-red-50/40",
  
    violet:
      "border-violet-100 bg-violet-50/40",
  
    slate:
      "border-slate-200 bg-white",
  };
  
  
  const dotClass = {
    blue:
      "bg-blue-500",
  
    emerald:
      "bg-emerald-500",
  
    amber:
      "bg-amber-500",
  
    red:
      "bg-red-500",
  
    violet:
      "bg-violet-500",
  
    slate:
      "bg-slate-400",
  };
  
  
  export default function AdminMetricCard({
    label,
    value,
    description,
    tone = "slate",
  }: Props) {
    return (
      <div
        className={`
          rounded-2xl
          border
          p-5
          shadow-sm
          ${toneClass[tone]}
        `}
      >
        <div className="flex items-center gap-2">
          <span
            className={`
              h-2
              w-2
              rounded-full
              ${dotClass[tone]}
            `}
          />
  
          <p className="text-sm font-semibold text-slate-600">
            {label}
          </p>
        </div>
  
        <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
          {value}
        </p>
  
        {description && (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    );
  }