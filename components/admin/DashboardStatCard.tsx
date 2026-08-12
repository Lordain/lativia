interface Props {
    label: string;
    value: number;
    description?: string;
  }
  
  export default function DashboardStatCard({
    label,
    value,
    description,
  }: Props) {
    return (
      <div className="rounded-xl border bg-white p-6">
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
      </div>
    );
  }