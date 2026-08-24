import type {
    ReactNode,
  } from "react";
  
  
  interface Props {
    eyebrow?: string;
  
    title: string;
  
    description?: string;
  
    actions?: ReactNode;
  
    children?: ReactNode;
  }
  
  
  export default function AdminPageHeader({
    eyebrow,
    title,
    description,
    actions,
    children,
  }: Props) {
    return (
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              {eyebrow}
            </p>
          )}
  
          <h1
            className={`
              text-3xl
              font-bold
              tracking-tight
              text-slate-950
              sm:text-[34px]
              ${eyebrow ? "mt-2" : ""}
            `}
          >
            {title}
          </h1>
  
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
  
          {children}
        </div>
  
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    );
  }