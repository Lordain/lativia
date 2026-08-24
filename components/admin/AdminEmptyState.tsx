import type {
    ReactNode,
  } from "react";
  
  
  interface Props {
    title: string;
  
    description?: string;
  
    action?: ReactNode;
  }
  
  
  export default function AdminEmptyState({
    title,
    description,
    action,
  }: Props) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 11l2 2 4-4" />
  
            <path d="M5 4h14v16H5z" />
          </svg>
        </div>
  
        <h2 className="mt-5 text-lg font-bold text-slate-950">
          {title}
        </h2>
  
        {description && (
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
  
        {action && (
          <div className="mt-6 flex justify-center">
            {action}
          </div>
        )}
      </div>
    );
  }