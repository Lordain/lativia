"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  brandConfig,
} from "@/lib/brand/brandConfig";

import {
  cetesPresentationSlides,
  type CetesPresentationSlide,
  type PresentationIcon,
} from "@/lib/consultation/cetesPresentation";


interface Props {
  orderId:
    string;
}


function getOrderLabel(
  orderId:
    string
) {
  return orderId
    .replaceAll(
      "-",
      ""
    )
    .slice(
      0,
      8
    )
    .toUpperCase();
}

function BrandLogo({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {brandConfig.logoUrl ? (
        <img
          src={brandConfig.logoUrl}
          alt={brandConfig.name}
          className={
            compact
              ? "h-8 w-auto object-contain"
              : "h-10 w-auto object-contain"
          }
        />
      ) : (
        <div
          className={`
            flex
            shrink-0
            items-center
            justify-center
            rounded-xl
            border
            border-white/15
            bg-white/[0.06]
            font-bold
            tracking-tight
            text-white
            ${
              compact
                ? "h-8 w-8 text-xs"
                : "h-10 w-10 text-sm"
            }
          `}
        >
          MH
        </div>
      )}

      <div>
        <p
          className={
            compact
              ? "text-xs font-bold tracking-[0.12em] text-white"
              : "text-sm font-bold tracking-[0.1em] text-white"
          }
        >
          {brandConfig.shortName}
        </p>

        {!compact && (
          <p className="mt-0.5 text-xs text-slate-500">
            {brandConfig.name}
          </p>
        )}
      </div>
    </div>
  );
}

function Icon({
  name,
  className = "h-6 w-6",
}: {
  name:
    PresentationIcon;

  className?:
    string;
}) {
  const common = {
    fill: "none",
    stroke:
      "currentColor",
    strokeWidth:
      1.8,
    strokeLinecap:
      "round" as const,
    strokeLinejoin:
      "round" as const,
  };


  switch (
    name
  ) {
    case "user":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <circle
            cx="12"
            cy="8"
            r="4"
          />

          <path d="M4 21c1.4-4.2 4-6 8-6s6.6 1.8 8 6" />
        </svg>
      );


    case "key":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <circle
            cx="8"
            cy="15"
            r="4"
          />

          <path d="m11 12 8-8" />

          <path d="m15 8 2 2" />

          <path d="m17 6 2 2" />
        </svg>
      );


    case "bank":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M3 9h18" />

          <path d="m4 9 8-5 8 5" />

          <path d="M5 9v8" />

          <path d="M9 9v8" />

          <path d="M15 9v8" />

          <path d="M19 9v8" />

          <path d="M3 20h18" />
        </svg>
      );


    case "document":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M6 3h9l3 3v15H6z" />

          <path d="M15 3v4h4" />

          <path d="M9 12h6" />

          <path d="M9 16h6" />
        </svg>
      );


    case "location":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />

          <circle
            cx="12"
            cy="10"
            r="2"
          />
        </svg>
      );


    case "shield":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M12 3 5 6v5c0 5 2.8 8.2 7 10 4.2-1.8 7-5 7-10V6z" />

          <path d="m9 12 2 2 4-4" />
        </svg>
      );


    case "lock":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
          />

          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );


    case "auction":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="m14 5 5 5" />

          <path d="m8 11 5 5" />

          <path d="m15 4-8 8" />

          <path d="m20 9-8 8" />

          <path d="M4 20h10" />
        </svg>
      );


    case "deposit":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M12 3v12" />

          <path d="m8 11 4 4 4-4" />

          <path d="M5 20h14" />
        </svg>
      );


    case "withdraw":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M12 20V8" />

          <path d="m8 12 4-4 4 4" />

          <path d="M5 4h14" />
        </svg>
      );


    case "tax":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />

          <path d="M9 8h6" />

          <path d="M9 12h6" />

          <path d="M9 16h3" />
        </svg>
      );


    case "warning":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M12 4 3 20h18z" />

          <path d="M12 9v5" />

          <path d="M12 17h.01" />
        </svg>
      );


    case "chart":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M4 19V5" />

          <path d="M4 19h16" />

          <path d="m7 15 4-4 3 2 5-6" />
        </svg>
      );


    case "check":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
          />

          <path d="m8 12 3 3 5-6" />
        </svg>
      );


    case "clock":
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
          />

          <path d="M12 7v5l3 2" />
        </svg>
      );


    default:
      return (
        <svg
          viewBox="0 0 24 24"
          className={
            className
          }
          {...common}
        >
          <path d="M6 4h12v16H6z" />

          <path d="M9 8h6" />

          <path d="M9 12h6" />

          <path d="M9 16h4" />
        </svg>
      );
  }
}


function SlideHeader({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-300">
          {
            slide.eyebrow
          }
        </span>

        <span className="text-sm tabular-nums text-slate-500">
          {
            String(
              slide.number
            ).padStart(
              2,
              "0"
            )
          }
        </span>
      </div>

      <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
        {
          slide.title
        }
      </h1>

      <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300 md:text-lg">
        {
          slide.summary
        }
      </p>
    </div>
  );
}


function SourceLine({
  source,
}: {
  source?:
    string | null;
}) {
  if (!source) {
    return null;
  }


  return (
    <p className="mt-6 text-xs leading-5 text-slate-500">
      {
        source
      }
    </p>
  );
}


function CardGrid({
  slide,
  hero = false,
}: {
  slide:
    CetesPresentationSlide;

  hero?:
    boolean;
}) {
  if (
    !slide.cards?.length
  ) {
    return null;
  }


  return (
    <div
      className={`
        mt-9
        grid
        gap-4
        ${
          hero
            ? "md:grid-cols-2 xl:grid-cols-3"
            : "md:grid-cols-2 xl:grid-cols-3"
        }
      `}
    >
      {slide.cards.map(
        card => (
          <div
            key={
              card.title
            }
            className={`
              rounded-2xl
              border
              p-5
              ${
                card.emphasis
                  ? "border-white/20 bg-white/[0.08]"
                  : "border-white/10 bg-white/[0.035]"
              }
            `}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200">
              <Icon
                name={
                  card.icon
                }
              />
            </div>

            <h3
              className={`
                mt-5
                font-semibold
                text-white
                ${
                  hero
                    ? "text-xl leading-7"
                    : "text-lg leading-7"
                }
              `}
            >
              {
                card.title
              }
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {
                card.description
              }
            </p>
          </div>
        )
      )}
    </div>
  );
}


function ComparisonSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[980px] w-full border-collapse text-left">
          <thead className="bg-white/[0.06]">
            <tr>
              {[
                "产品",
                "是什么",
                "当前收益举例（年利率）",
                "购买方式",
                "主要用途",
              ].map(
                title => (
                  <th
                    key={
                      title
                    }
                    className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-slate-200"
                  >
                    {
                      title
                    }
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {slide.comparisonRows?.map(
              row => (
                <tr
                  key={
                    row.product
                  }
                  className="border-b border-white/[0.07] last:border-b-0"
                >
                  <td className="px-5 py-5 align-top">
                    <div className="text-lg font-bold text-white">
                      {
                        row.product
                      }
                    </div>
                  </td>

                  <td className="max-w-[220px] px-5 py-5 text-sm leading-6 text-slate-300">
                    {
                      row.type
                    }
                  </td>

                  <td className="px-5 py-5 align-top">
                    <div className="whitespace-nowrap text-xl font-bold text-white">
                      {
                        row.yieldExample
                      }
                    </div>
                  </td>

                  <td className="max-w-[260px] px-5 py-5 text-sm leading-6 text-slate-300">
                    {
                      row.purchase
                    }
                  </td>

                  <td className="max-w-[220px] px-5 py-5 text-sm leading-6 text-slate-300">
                    {
                      row.purpose
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}


function LevelsSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[920px] w-full border-collapse text-left">
          <thead className="bg-white/[0.06]">
            <tr>
              {[
                "账户等级",
                "验证方式",
                "资金操作规模",
                "墨西哥比索示例",
                "适合情况",
              ].map(
                title => (
                  <th
                    key={
                      title
                    }
                    className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-slate-200"
                  >
                    {
                      title
                    }
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {slide.levelRows?.map(
              row => (
                <tr
                  key={
                    row.level
                  }
                  className="border-b border-white/[0.07] last:border-b-0"
                >
                  <td className="px-5 py-5 align-top">
                    <p className="font-bold text-white">
                      {
                        row.level
                      }
                    </p>
                  </td>

                  <td className="px-5 py-5 text-sm leading-6 text-slate-300">
                    {
                      row.verification
                    }
                  </td>

                  <td className="px-5 py-5 text-sm font-semibold leading-6 text-slate-100">
                    {
                      row.fundingLimit
                    }
                  </td>

                  <td className="px-5 py-5">
                    <p className="font-mono text-sm leading-6 text-slate-200">
                      {
                        row.mxnExample
                      }
                    </p>
                  </td>

                  <td className="px-5 py-5 text-sm leading-6 text-slate-300">
                    {
                      row.useCase
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <CardGrid
        slide={
          slide
        }
      />

      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}


function TaxSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      {slide.formula && (
        <div className="mt-9 rounded-3xl border border-white/15 bg-white/[0.055] p-7">
          <p className="text-sm font-semibold text-slate-400">
            {
              slide
                .formula
                .title
            }
          </p>

          <p className="mt-4 font-mono text-xl font-bold leading-8 text-white md:text-2xl">
            {
              slide
                .formula
                .expression
            }
          </p>

          <div className="mt-6 rounded-xl bg-black/20 p-4">
            <p className="font-mono text-sm leading-6 text-slate-200 md:text-base">
              {
                slide
                  .formula
                  .example
              }
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-400">
            {
              slide
                .formula
                .footnote
            }
          </p>
        </div>
      )}

      <CardGrid
        slide={
          slide
        }
      />

      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}


function AuctionSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            简单流程
          </p>

          <div className="mt-5 space-y-3">
            {slide.steps?.map(
              (
                step,
                index
              ) => (
                <div
                  key={
                    step.title
                  }
                  className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-black/10 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200">
                    <Icon
                      name={
                        step.icon
                      }
                      className="h-5 w-5"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {
                        step.title
                      }
                    </p>

                    <p className="mt-1 text-sm leading-5 text-slate-400">
                      {
                        step.description
                      }
                    </p>
                  </div>

                  {index <
                    (slide.steps?.length ??
                      0) -
                      1 && (
                    <span className="ml-auto text-slate-600">
                      ↓
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        </div>


        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            需知
          </p>

          <div className="mt-5 space-y-3">
            {slide.knowBefore?.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item
                  }
                  className="flex gap-3 rounded-xl border border-white/[0.07] p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs font-bold text-slate-300">
                    {
                      index +
                      1
                    }
                  </span>

                  <p className="text-sm leading-6 text-slate-300">
                    {
                      item
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}


function ProcessSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {slide.steps?.map(
          (
            step,
            index
          ) => (
            <div
              key={
                step.title
              }
              className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200">
                  <Icon
                    name={
                      step.icon
                    }
                  />
                </div>

                <span className="text-xs font-bold tabular-nums text-slate-600">
                  {
                    String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )
                  }
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                {
                  step.title
                }
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {
                  step.description
                }
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}


function RiskSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slide.risks?.map(
          (
            risk,
            index
          ) => (
            <div
              key={
                risk.title
              }
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-center justify-between">
              <Icon
                name={
                  risk.icon
                }
                className="h-6 w-6 text-slate-300"
              />

                <span className="text-xs font-bold text-slate-600">
                  RISK{" "}
                  {
                    String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )
                  }
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                {
                  risk.title
                }
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {
                  risk.description
                }
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}


function ScreenshotSlide({
  slide,
}: {
  slide: CetesPresentationSlide;
}) {
  const [
    selected,
    setSelected,
  ] = useState(0);

  const screenshot =
    slide.screenshots?.[
      selected
    ];

  const isAppScreenshot =
    screenshot?.src.includes(
      "/app-"
    ) ?? false;

  useEffect(
    () => {
      setSelected(0);
    },
    [slide.id]
  );

  return (
    <>
      <SlideHeader
        slide={slide}
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_420px]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {slide.screenshots?.map(
              (
                item,
                index
              ) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() =>
                    setSelected(index)
                  }
                  className={`
                    rounded-lg
                    border
                    px-3
                    py-2
                    text-xs
                    font-medium
                    transition
                    ${
                      selected === index
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/10 text-slate-400 hover:bg-white/5"
                    }
                  `}
                >
                  {item.label} · {item.title}
                </button>
              )
            )}
          </div>

          {screenshot && (
            <div
              className={`mt-4 flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ${
                isAppScreenshot
                  ? "min-h-[660px] p-4"
                  : "min-h-[560px] p-3"
              }`}
            >
              <img
                src={screenshot.src}
                alt={screenshot.title}
                className={
                  isAppScreenshot
                    ? "block max-h-[780px] w-auto max-w-full rounded-xl object-contain"
                    : "block max-h-[760px] w-full max-w-full rounded-xl object-contain"
                }
              />
            </div>
          )}
        </div>

        <div>
          {screenshot && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-500">
                {screenshot.label}
              </p>

              <h3 className="mt-3 text-xl font-bold text-white">
                {screenshot.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {screenshot.description}
              </p>

              {screenshot.highlights &&
                screenshot.highlights.length >
                  0 && (
                  <div className="mt-5 space-y-2">
                    {screenshot.highlights.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 rounded-lg border border-white/[0.07] bg-black/10 px-3 py-2.5"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 text-[11px] font-bold text-slate-300">
                            {index + 1}
                          </span>

                          <p className="text-xs leading-5 text-slate-300">
                            {item}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>
          )}

          <div className="mt-4 space-y-3">
            {slide.screenshotPoints?.map(
              point => (
                <div
                  key={point.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200">
                      <Icon
                        name={point.icon}
                        className="h-5 w-5"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold text-white">
                        {point.title}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <SourceLine
        source={slide.source}
      />
    </>
  );
}

function StatusSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />

      <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {slide.statusItems?.map(
          (
            item,
            index
          ) => (
            <div
              key={
                item.title
              }
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-200">
                  <Icon
                    name={
                      item.icon
                    }
                  />
                </div>

                <span className="text-xs font-bold tabular-nums text-slate-600">
                  {
                    String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )
                  }
                </span>
              </div>

              <h3 className="mt-5 text-lg font-semibold leading-7 text-white">
                {
                  item.title
                }
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {
                  item.description
                }
              </p>
            </div>
          )
        )}
      </div>

      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}

function YieldExplainerSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <>
      <SlideHeader
        slide={
          slide
        }
      />


      {/* =====================================
          Timeline
      ===================================== */}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {slide.yieldTimeline?.map(
          (
            item,
            index
          ) => (
            <div
              key={
                item.title
              }
              className="relative rounded-2xl border border-white/10 bg-white/[0.035] p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.15em] text-slate-500">
                  STEP{" "}
                  {
                    index +
                    1
                  }
                </span>

                {index <
                  (slide.yieldTimeline?.length ??
                    0) -
                    1 && (
                  <span className="hidden text-xl text-slate-600 md:block">
                    →
                  </span>
                )}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-white">
                {
                  item.title
                }
              </h3>

              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {
                  item.value
                }
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {
                  item.description
                }
              </p>
            </div>
          )
        )}
      </div>


      {/* =====================================
          Formula
      ===================================== */}

      {slide.yieldFormula && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {
              slide
                .yieldFormula
                .title
            }
          </p>

          <p className="mt-4 font-mono text-xl font-bold text-white md:text-2xl">
            {
              slide
                .yieldFormula
                .expression
            }
          </p>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {
              slide
                .yieldFormula
                .example
            }
          </p>
        </div>
      )}


      {/* =====================================
          CETES vs BONDDIA
      ===================================== */}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-[800px] w-full border-collapse text-left">
          <thead className="bg-white/[0.06]">
            <tr>
              <th className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-slate-300">
                对比
              </th>

              <th className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-white">
                CETES
              </th>

              <th className="border-b border-white/10 px-5 py-4 text-sm font-semibold text-white">
                BONDDIA
              </th>
            </tr>
          </thead>

          <tbody>
            {slide.yieldDifferenceRows?.map(
              row => (
                <tr
                  key={
                    row.label
                  }
                  className="border-b border-white/[0.07] last:border-b-0"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                    {
                      row.label
                    }
                  </td>

                  <td className="px-5 py-4 text-sm leading-6 text-slate-400">
                    {
                      row.cetes
                    }
                  </td>

                  <td className="px-5 py-4 text-sm leading-6 text-slate-400">
                    {
                      row.bonddia
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>


      {/* =====================================
          Key Takeaways
      ===================================== */}

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {slide.cards?.map(
          card => (
            <div
              key={
                card.title
              }
              className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-200">
                <Icon
                  name={
                    card.icon
                  }
                  className="h-5 w-5"
                />
              </div>

              <div>
                <h4 className="font-semibold text-white">
                  {
                    card.title
                  }
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {
                    card.description
                  }
                </p>
              </div>
            </div>
          )
        )}
      </div>


      <SourceLine
        source={
          slide.source
        }
      />
    </>
  );
}


function SlideRenderer({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  switch (
    slide.layout
  ) {

    case "yield-explainer":
  return (
    <YieldExplainerSlide
      slide={
        slide
      }
    />
  );

    

    case "status":
      return (
        <StatusSlide
          slide={
            slide
          }
        />
      );

    case "comparison":
      return (
        <ComparisonSlide
          slide={
            slide
          }
        />
      );


    case "levels":
      return (
        <LevelsSlide
          slide={
            slide
          }
        />
      );


    case "tax":
      return (
        <TaxSlide
          slide={
            slide
          }
        />
      );


    case "auction":
      return (
        <AuctionSlide
          slide={
            slide
          }
        />
      );


    case "process":
      return (
        <ProcessSlide
          slide={
            slide
          }
        />
      );


    case "risk":
      return (
        <RiskSlide
          slide={
            slide
          }
        />
      );


    case "screenshots":
      return (
        <ScreenshotSlide
          slide={
            slide
          }
        />
      );


    case "hero":
      return (
        <>
          <SlideHeader
            slide={
              slide
            }
          />

          <CardGrid
            slide={
              slide
            }
            hero
          />
        </>
      );


    default:
      return (
        <>
          <SlideHeader
            slide={
              slide
            }
          />

          <CardGrid
            slide={
              slide
            }
          />

          <SourceLine
            source={
              slide.source
            }
          />
        </>
      );
  }
}


export default function CetesConsultationPresentation({
  orderId,
}: Props) {
  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(
      0
    );


  const slide =
    cetesPresentationSlides[
      currentIndex
    ];


  const orderLabel =
    useMemo(
      () =>
        getOrderLabel(
          orderId
        ),
      [
        orderId,
      ]
    );


  const watermarkItems =
    useMemo(
      () =>
        Array.from(
          {
            length:
              20,
          },
          (
            _,
            index
          ) =>
            index
        ),
      []
    );


  function goPrevious() {
    setCurrentIndex(
      current =>
        Math.max(
          0,
          current - 1
        )
    );
  }


  function goNext() {
    setCurrentIndex(
      current =>
        Math.min(
          cetesPresentationSlides.length -
            1,
          current + 1
        )
    );
  }


  useEffect(
    () => {
      function handleKeyDown(
        event:
          KeyboardEvent
      ) {
        if (
          event.key ===
            "ArrowRight" ||
          event.key ===
            "PageDown"
        ) {
          event.preventDefault();

          setCurrentIndex(
            current =>
              Math.min(
                cetesPresentationSlides.length -
                  1,
                current + 1
              )
          );
        }


        if (
          event.key ===
            "ArrowLeft" ||
          event.key ===
            "PageUp"
        ) {
          event.preventDefault();

          setCurrentIndex(
            current =>
              Math.max(
                0,
                current - 1
              )
          );
        }


        if (
          event.key ===
          "Home"
        ) {
          event.preventDefault();

          setCurrentIndex(
            0
          );
        }


        if (
          event.key ===
          "End"
        ) {
          event.preventDefault();

          setCurrentIndex(
            cetesPresentationSlides.length -
              1
          );
        }
      }


      window.addEventListener(
        "keydown",
        handleKeyDown
      );


      return () =>
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );
    },
    []
  );


  if (!slide) {
    return null;
  }


  return (
    <div
      className="relative min-h-screen overflow-hidden bg-slate-950 text-white selection:bg-transparent"
      onContextMenu={
        event =>
          event.preventDefault()
      }
    >
      {/* Watermark */}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-10 overflow-hidden opacity-[0.035]"
        >
          <div className="absolute -inset-[25%] grid rotate-[-28deg] grid-cols-3 gap-x-24 gap-y-28">
            {watermarkItems.map(
              item => (
                <div
                  key={item}
                  className="whitespace-nowrap text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white"
                >
                  <div>
                    {brandConfig.shortName}
                  </div>

                  <div className="mt-1">
                    {
                      brandConfig
                        .presentation
                        .watermarkLabel
                    }
                  </div>

                  <div className="mt-1">
                    ORDER {orderLabel}
                  </div>
                </div>
              )
            )}
          </div>
        </div>


        {/* Central brand watermark */}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center"
        >
          <div className="rotate-[-12deg] opacity-[0.025]">
            {brandConfig.logoUrl ? (
              <img
                src={brandConfig.logoUrl}
                alt=""
                className="max-h-[360px] max-w-[520px] object-contain"
              />
            ) : (
              <div className="text-center text-white">
                <div className="text-[120px] font-black leading-none tracking-[-0.07em]">
                  MH
                </div>

                <div className="mt-6 text-4xl font-black tracking-[0.25em]">
                  {brandConfig.shortName}
                </div>

                <div className="mt-4 text-xl font-semibold tracking-[0.18em]">
                  {
                    brandConfig
                      .presentation
                      .watermarkLabel
                  }
                </div>

                <div className="mt-3 font-mono text-lg tracking-[0.16em]">
                  ORDER {orderLabel}
                </div>
              </div>
            )}
          </div>
        </div>


      {/* Header */}

      <header className="relative z-30 border-b border-white/10 bg-slate-950/95">
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-5">
            <BrandLogo />

            <div className="hidden border-l border-white/10 pl-5 sm:block">
              <p className="text-xs font-semibold text-slate-300">
                Cetesdirecto 中文咨询
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {
                  brandConfig
                    .presentation
                    .confidentialityLabel
                }
                {" · "}
                Order {orderLabel}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm tabular-nums text-slate-300">
            {
              currentIndex +
              1
            }
            {" / "}
            {
              cetesPresentationSlides.length
            }
          </div>
        </div>


        <div className="overflow-x-auto border-t border-white/[0.06]">
          <div className="flex min-w-max items-center gap-1 px-5 py-2 md:px-8">
            {cetesPresentationSlides.map(
              (
                item,
                index
              ) => {
                const active =
                  index ===
                  currentIndex;


                return (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    onClick={
                      () =>
                        setCurrentIndex(
                          index
                        )
                    }
                    className={`
                      rounded-lg
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      transition
                      ${
                        active
                          ? "bg-white text-slate-950"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    {
                      String(
                        index +
                          1
                      ).padStart(
                        2,
                        "0"
                      )
                    }
                    {" "}
                    {
                      item.shortTitle
                    }
                  </button>
                );
              }
            )}
          </div>
        </div>
      </header>


      {/* Slide */}

      <main className="relative z-20 mx-auto min-h-[calc(100vh-9rem)] max-w-[1500px] px-5 py-9 md:px-8 md:py-11">
        <SlideRenderer
          slide={
            slide
          }
        />
      </main>


      {/* Footer */}

      <footer className="relative z-30 flex min-h-16 items-center justify-between gap-3 border-t border-white/10 bg-slate-950/95 px-5 md:px-8">
        <button
          type="button"
          onClick={
            goPrevious
          }
          disabled={
            currentIndex ===
            0
          }
          className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← 上一页
        </button>

        <div className="hidden items-center gap-5 md:flex">
          <BrandLogo compact />

          <div className="border-l border-white/10 pl-5">
            <p className="text-xs text-slate-500">
              {
                brandConfig
                  .presentation
                  .footerText
              }
            </p>

            <p className="mt-1 text-xs text-slate-600">
              {
                brandConfig
                  .presentation
                  .confidentialityLabel
              }
              {" · "}
              Order {orderLabel}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={
            goNext
          }
          disabled={
            currentIndex ===
            cetesPresentationSlides.length -
              1
          }
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          下一页 →
        </button>
      </footer>


      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          body::before {
            content: "Internal consultation material — printing disabled.";
            visibility: visible !important;
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}