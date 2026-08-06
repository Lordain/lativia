interface Props {
    label: string;
    children: React.ReactNode;
    error?: string;
  }
  
  export default function FormField({
    label,
    children,
    error,
  }: Props) {
    return (
      <div>
        <label className="mb-2 block font-medium">
          {label}
        </label>
  
        {children}
  
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }