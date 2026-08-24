import type {
    ReactNode,
  } from "react";
  
  
  interface Props {
    title: string;
  
    description?: string;
  
    actions?: ReactNode;
  
    children: ReactNode;
  
    className?: string;
  }
  
  
  export default function AdminSectionCard({
    title,
    description,
    actions,
    children,
    className = "",
  }: Props) {
    return (
      <section
        className={`
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          ${className}
        `}
      >
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">
              {title}
            </h2>
  
            {description && (
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>
  
          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </div>
  
        <div className="p-5 sm:p-6">
          {children}
        </div>
      </section>
    );
  }