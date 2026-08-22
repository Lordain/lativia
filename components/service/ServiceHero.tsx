interface PriceSummaryItem {
    label:
      string;
  
    price:
      string;
  }
  
  
  interface Props {
    slug:
      string;
  
    title:
      string;
  
    description:
      string;
  
    category:
      string;
  
    duration:
      string;
  
    priceSummary:
      PriceSummaryItem[];
  
    basePrice:
      string | null;
  
    isPaused:
      boolean;
  }
  
  
  function getDisplayTitle(
    title:
      string
  ) {
    return title.replaceAll(
      "公司",
      "企业"
    );
  }
  
  
  function getCategoryLabel(
    category:
      string
  ) {
    const normalized =
      category
        .trim()
        .toLowerCase();
  
  
    const labels:
      Record<
        string,
        string
      > = {
        sat:
          "SAT 税务服务",
  
        tax:
          "税务服务",
  
        identity:
          "身份服务",
  
        immigration:
          "移民服务",
  
        consultation:
          "专业咨询",
  
        business:
          "企业服务",
      };
  
  
    return (
      labels[
        normalized
      ] ??
      category ??
      "办理服务"
    );
  }
  
  
  function ServiceIcon({
    slug,
  }: {
    slug:
      string;
  }) {
    const common = {
      fill:
        "none",
  
      stroke:
        "currentColor",
  
      strokeWidth:
        1.8,
  
      strokeLinecap:
        "round" as const,
  
      strokeLinejoin:
        "round" as const,
    };
  
  
    if (
      slug.includes(
        "curp"
      )
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
          />
  
          <circle
            cx="8"
            cy="11"
            r="2"
          />
  
          <path d="M5.5 16c.7-1.8 1.6-2.5 2.5-2.5s1.8.7 2.5 2.5" />
  
          <path d="M13 10h5" />
          <path d="M13 14h5" />
        </svg>
      );
    }
  
  
    if (
      slug.includes(
        "efirma"
      )
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="m4 18 3.5-.8L18 6.7 14.3 3 3.8 13.5 3 17z" />
  
          <path d="m12.8 4.5 3.7 3.7" />
  
          <path d="M10 20h10" />
        </svg>
      );
    }
  
  
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        {...common}
      >
        <path d="M6 3h9l3 3v15H6z" />
  
        <path d="M15 3v4h4" />
  
        <path d="M9 11h6" />
  
        <path d="M9 15h4" />
      </svg>
    );
  }
  
  
  export default function ServiceHero({
    slug,
    title,
    description,
    category,
    duration,
    priceSummary,
    basePrice,
    isPaused,
  }: Props) {
    const hasOptions =
      priceSummary.length >
      0;
  

      const optionCount =
      priceSummary.length;
    
    const hasMultipleOptions =
      optionCount > 1;
    
    const bottomGridClass =
      hasMultipleOptions
        ? "grid overflow-hidden border-t border-slate-200 md:grid-cols-3"
        : "grid overflow-hidden border-t border-slate-200 md:grid-cols-2";
  
    return (
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <ServiceIcon
                slug={
                  slug
                }
              />
            </div>
  
            <span className="text-sm font-bold text-blue-700">
              {getCategoryLabel(
                category
              )}
            </span>
  
            {isPaused && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                暂停受理
              </span>
            )}
          </div>
  
  
          <h1 className="mt-6 max-w-3xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {getDisplayTitle(
              title
            )}
          </h1>
  
  
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            {
              description
            }
          </p>
        </div>
  
  
        <div className={bottomGridClass}>
        {hasOptions ? (
            priceSummary.map(
            (
                item,
                index
            ) => (
                <div
                key={
                    item.label
                }
                className="border-b border-slate-200 bg-white px-6 py-4 md:border-b-0 md:border-r last:border-r-0"
                >
                <p className="text-xs font-medium text-slate-500">
                    {priceSummary.length > 1
                    ? `方案${index === 0 ? "一" : "二"}：${item.label}`
                    : "服务费用"}
                </p>

                <p className="mt-1 text-lg font-bold text-slate-950">
                    {
                    item.price
                    }
                </p>
                </div>
            )
            )
        ) : (
            <div className="border-b border-slate-200 bg-white px-6 py-4 md:border-b-0 md:border-r">
            <p className="text-xs font-medium text-slate-500">
                服务费用
            </p>

            <p className="mt-1 text-lg font-bold text-slate-950">
                {
                basePrice ??
                "价格待更新"
                }
            </p>
            </div>
        )}


        <div className="bg-white px-6 py-4">
            <p className="text-xs font-medium text-slate-500">
            办理时间
            </p>

            <p className="mt-1 text-sm font-bold leading-6 text-slate-950">
            {
                duration
            }
            </p>
        </div>
        </div>
      </section>
    );
  }