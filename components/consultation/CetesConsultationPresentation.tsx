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
  type CetesPresentationSection,
  type CetesPresentationSlide,
} from "@/lib/consultation/cetesPresentation";


interface Props {
  orderId:
    string;
}


const SECTION_CONFIG: Array<{
  key:
    CetesPresentationSection;

  label:
    string;

  shortLabel:
    string;
}> = [
  {
    key:
      "intro",

    label:
      "开场",

    shortLabel:
      "开场",
  },

  {
    key:
      "products",

    label:
      "产品理解",

    shortLabel:
      "产品",
  },

  {
    key:
      "risk",

    label:
      "风险",

    shortLabel:
      "风险",
  },

  {
    key:
      "account",

    label:
      "账户体系",

    shortLabel:
      "账户",
  },

  {
    key:
      "operation",

    label:
      "实际操作",

    shortLabel:
      "实操",
  },

  {
    key:
      "tax",

    label:
      "税务",

    shortLabel:
      "税务",
  },

  {
    key:
      "closing",

    label:
      "完成",

    shortLabel:
      "完成",
  },
];


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


function getSlideLayout(
  slide:
    CetesPresentationSlide
):
  | "cover"
  | "security"
  | "standard"
  | "risk"
  | "process"
  | "account"
  | "closing" {
  if (
    slide.id ===
    "consultation-goal"
  ) {
    return "cover";
  }


  if (
    slide.id ===
    "service-boundary"
  ) {
    return "security";
  }


  if (
    slide.section ===
    "risk"
  ) {
    return "risk";
  }


  if (
    slide.id ===
      "account-levels" ||
    slide.id ===
      "efirma"
  ) {
    return "account";
  }


  if (
    [
      "auction",
      "auction-allocation",
      "opening",
      "clabe",
      "deposit",
      "purchase",
      "withdrawal",
    ].includes(
      slide.id
    )
  ) {
    return "process";
  }


  if (
    slide.section ===
    "closing"
  ) {
    return "closing";
  }


  return "standard";
}


function SectionBadge({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
        {
          slide.eyebrow
        }
      </span>

      <span className="text-sm font-medium tabular-nums text-slate-500">
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
  );
}


function SlideNote({
  note,
}: {
  note:
    string | null;
}) {
  if (!note) {
    return null;
  }


  return (
    <div className="mt-7 rounded-2xl border border-amber-400/20 bg-amber-400/[0.07] p-4 text-sm leading-6 text-amber-100">
      <span className="mr-2 font-semibold">
        注意
      </span>

      {
        note
      }
    </div>
  );
}


function StandardSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <SectionBadge
          slide={
            slide
          }
        />

        <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {
            slide.title
          }
        </h1>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300 md:text-xl">
          {
            slide.summary
          }
        </p>

        <SlideNote
          note={
            slide.note
          }
        />
      </div>


      <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          KEY POINTS
        </p>

        <div className="mt-6 space-y-4">
          {slide.bullets.map(
            (
              bullet,
              index
            ) => (
              <div
                key={
                  bullet
                }
                className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-black/10 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-xs font-bold text-blue-300">
                  {
                    index +
                    1
                  }
                </div>

                <p className="pt-1 text-sm leading-6 text-slate-200 md:text-base">
                  {
                    bullet
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}


function CoverSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="mx-auto max-w-6xl text-center">
      <div className="flex justify-center">
        <SectionBadge
          slide={
            slide
          }
        />
      </div>

      <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
        {
          slide.title
        }
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
        {
          slide.summary
        }
      </p>


      <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slide.bullets.map(
          (
            bullet,
            index
          ) => (
            <div
              key={
                bullet
              }
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left"
            >
              <div className="text-xs font-bold tabular-nums text-blue-400">
                {
                  String(
                    index +
                      1
                  ).padStart(
                    2,
                    "0"
                  )
                }
              </div>

              <p className="mt-3 text-sm font-medium leading-6 text-slate-100">
                {
                  bullet
                }
              </p>
            </div>
          )
        )}
      </div>


      <SlideNote
        note={
          slide.note
        }
      />
    </div>
  );
}


function SecuritySlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div>
      <div className="max-w-4xl">
        <SectionBadge
          slide={
            slide
          }
        />

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {
            slide.title
          }
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          {
            slide.summary
          }
        </p>
      </div>


      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {slide.bullets.map(
          (
            bullet,
            index
          ) => (
            <div
              key={
                bullet
              }
              className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10 text-lg font-bold text-red-300">
                ×
              </div>

              <p className="mt-4 text-sm font-medium leading-6 text-slate-100 md:text-base">
                {
                  bullet
                }
              </p>

              <p className="mt-3 text-xs text-slate-500">
                安全边界{" "}
                {
                  index +
                  1
                }
              </p>
            </div>
          )
        )}
      </div>


      <SlideNote
        note={
          slide.note
        }
      />
    </div>
  );
}


function RiskSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div>
      <div className="max-w-4xl">
        <SectionBadge
          slide={
            slide
          }
        />

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {
            slide.title
          }
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          {
            slide.summary
          }
        </p>
      </div>


      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slide.bullets.map(
          (
            bullet,
            index
          ) => (
            <div
              key={
                bullet
              }
              className="relative overflow-hidden rounded-2xl border border-amber-400/15 bg-amber-400/[0.055] p-5"
            >
              <div className="absolute right-4 top-3 text-5xl font-bold text-white/[0.03]">
                {
                  index +
                  1
                }
              </div>

              <div className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
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
              </div>

              <p className="mt-4 pr-6 text-base font-medium leading-7 text-slate-100">
                {
                  bullet
                }
              </p>
            </div>
          )
        )}
      </div>


      <SlideNote
        note={
          slide.note
        }
      />
    </div>
  );
}


function ProcessSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
      <div>
        <SectionBadge
          slide={
            slide
          }
        />

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {
            slide.title
          }
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          {
            slide.summary
          }
        </p>

        <SlideNote
          note={
            slide.note
          }
        />
      </div>


      <div className="relative">
        <div className="absolute bottom-8 left-[21px] top-8 w-px bg-blue-500/20" />

        <div className="space-y-4">
          {slide.bullets.map(
            (
              bullet,
              index
            ) => (
              <div
                key={
                  bullet
                }
                className="relative flex gap-5"
              >
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-slate-950 text-sm font-bold text-blue-300">
                  {
                    index +
                    1
                  }
                </div>

                <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
                  <p className="text-base font-medium leading-7 text-slate-100">
                    {
                      bullet
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}


function AccountSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div>
      <div className="max-w-5xl">
        <SectionBadge
          slide={
            slide
          }
        />

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {
            slide.title
          }
        </h1>

        <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
          {
            slide.summary
          }
        </p>
      </div>


      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {slide.bullets.map(
          (
            bullet,
            index
          ) => (
            <div
              key={
                bullet
              }
              className={`
                rounded-3xl
                border
                p-6
                ${
                  index ===
                  0
                    ? "border-blue-400/25 bg-blue-500/[0.08]"
                    : "border-white/10 bg-white/[0.04]"
                }
              `}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                  ACCOUNT{" "}
                  {
                    String(
                      index +
                        1
                    ).padStart(
                      2,
                      "0"
                    )
                  }
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-slate-300">
                  {
                    index +
                    1
                  }
                </div>
              </div>

              <p className="mt-6 text-lg font-semibold leading-8 text-white">
                {
                  bullet
                }
              </p>
            </div>
          )
        )}
      </div>


      <SlideNote
        note={
          slide.note
        }
      />
    </div>
  );
}


function ClosingSlide({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  return (
    <div className="mx-auto max-w-6xl text-center">
      <div className="flex justify-center">
        <SectionBadge
          slide={
            slide
          }
        />
      </div>

      <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-bold leading-tight text-white md:text-6xl">
        {
          slide.title
        }
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
        {
          slide.summary
        }
      </p>


      <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
        {slide.bullets.map(
          (
            bullet,
            index
          ) => (
            <div
              key={
                bullet
              }
              className="flex items-center gap-4 rounded-2xl border border-green-400/15 bg-green-400/[0.055] p-5 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-400/10 font-bold text-green-300">
                ✓
              </div>

              <p className="text-sm font-medium leading-6 text-slate-100">
                {
                  bullet
                }
              </p>

              <span className="ml-auto text-xs tabular-nums text-slate-600">
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
          )
        )}
      </div>


      <SlideNote
        note={
          slide.note
        }
      />
    </div>
  );
}


function SlideRenderer({
  slide,
}: {
  slide:
    CetesPresentationSlide;
}) {
  const layout =
    getSlideLayout(
      slide
    );


  switch (
    layout
  ) {
    case "cover":
      return (
        <CoverSlide
          slide={
            slide
          }
        />
      );


    case "security":
      return (
        <SecuritySlide
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


    case "process":
      return (
        <ProcessSlide
          slide={
            slide
          }
        />
      );


    case "account":
      return (
        <AccountSlide
          slide={
            slide
          }
        />
      );


    case "closing":
      return (
        <ClosingSlide
          slide={
            slide
          }
        />
      );


    default:
      return (
        <StandardSlide
          slide={
            slide
          }
        />
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


  const [
    showContents,
    setShowContents,
  ] =
    useState(
      false
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
              24,
          },
          (
            _,
            index
          ) =>
            index
        ),
      []
    );


  const currentSection =
    slide
      ?.section ??
    "intro";


  function goPrevious() {
    setCurrentIndex(
      current =>
        Math.max(
          0,
          current - 1
        )
    );

    setShowContents(
      false
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

    setShowContents(
      false
    );
  }


  function goToSlide(
    index:
      number
  ) {
    setCurrentIndex(
      index
    );

    setShowContents(
      false
    );
  }


  function goToSection(
    section:
      CetesPresentationSection
  ) {
    const index =
      cetesPresentationSlides.findIndex(
        item =>
          item.section ===
          section
      );


    if (
      index >=
      0
    ) {
      goToSlide(
        index
      );
    }
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


        if (
          event.key ===
          "Escape"
        ) {
          setShowContents(
            false
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
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-950
        text-white
        selection:bg-transparent
      "
      onContextMenu={
        event =>
          event.preventDefault()
      }
    >
      {/* =====================================
          Dynamic Watermark
      ===================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden opacity-[0.045]"
      >
        <div className="absolute -inset-[25%] grid rotate-[-28deg] grid-cols-3 gap-x-20 gap-y-24">
          {watermarkItems.map(
            item => (
              <div
                key={
                  item
                }
                className="whitespace-nowrap text-center text-[11px] font-bold uppercase tracking-[0.28em] text-white"
              >
                <div>
                  {
                    brandConfig
                      .shortName
                  }
                </div>

                <div className="mt-1">
                  {
                    brandConfig
                      .presentation
                      .watermarkLabel
                  }
                </div>

                <div className="mt-1">
                  ORDER{" "}
                  {
                    orderLabel
                  }
                </div>
              </div>
            )
          )}
        </div>
      </div>


      {/* =====================================
          Header
      ===================================== */}

      <header className="relative z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 md:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {
                brandConfig.name
              }
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Cetesdirecto 中文咨询 ·{" "}
              {
                brandConfig
                  .presentation
                  .confidentialityLabel
              }
            </p>
          </div>


          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={
                () =>
                  setShowContents(
                    current =>
                      !current
                  )
              }
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              目录
            </button>

            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm tabular-nums text-slate-300">
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
        </div>


        {/* =====================================
            Quick Section Navigation
        ===================================== */}

        <div className="overflow-x-auto border-t border-white/[0.06]">
          <div className="flex min-w-max items-center gap-1 px-5 py-2 md:px-8">
            {SECTION_CONFIG.map(
              section => {
                const active =
                  section.key ===
                  currentSection;


                return (
                  <button
                    key={
                      section.key
                    }
                    type="button"
                    onClick={
                      () =>
                        goToSection(
                          section.key
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
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <span className="hidden sm:inline">
                      {
                        section.label
                      }
                    </span>

                    <span className="sm:hidden">
                      {
                        section.shortLabel
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </header>


      {/* =====================================
          Contents Drawer
      ===================================== */}

      {showContents && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          onClick={
            () =>
              setShowContents(
                false
              )
          }
        >
          <aside
            className="h-full w-full max-w-md overflow-y-auto border-r border-white/10 bg-slate-950 p-5 shadow-2xl"
            onClick={
              event =>
                event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  PRESENTATION
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  咨询课件目录
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  () =>
                    setShowContents(
                      false
                    )
                }
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
              >
                关闭
              </button>
            </div>


            <div className="mt-6 space-y-2">
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
                          goToSlide(
                            index
                          )
                      }
                      className={`
                        flex
                        w-full
                        items-start
                        gap-3
                        rounded-xl
                        border
                        p-3
                        text-left
                        transition
                        ${
                          active
                            ? "border-blue-500/60 bg-blue-500/10"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                        }
                      `}
                    >
                      <span
                        className={`
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-xs
                          font-bold
                          ${
                            active
                              ? "bg-blue-500 text-white"
                              : "bg-white/5 text-slate-400"
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
                      </span>

                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {
                            item.eyebrow
                          }
                        </span>

                        <span className="mt-1 block text-sm font-medium text-slate-100">
                          {
                            item.shortTitle
                          }
                        </span>
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </aside>
        </div>
      )}


      {/* =====================================
          Slide Area
      ===================================== */}

      <main className="relative z-20 mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center px-5 py-9 md:px-8 md:py-12">
        <section className="w-full">
          <SlideRenderer
            slide={
              slide
            }
          />
        </section>
      </main>


      {/* =====================================
          Footer Navigation
      ===================================== */}

      <footer className="relative z-30 flex min-h-16 items-center justify-between gap-3 border-t border-white/10 bg-slate-950/95 px-5 backdrop-blur md:px-8">
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


        <div className="hidden items-center gap-3 text-center md:flex">
          <div>
            <p className="text-xs text-slate-500">
              {
                brandConfig
                  .presentation
                  .footerText
              }
            </p>

            <p className="mt-1 text-xs font-medium text-slate-600">
              Order{" "}
              {
                orderLabel
              }
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
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
        >
          下一页 →
        </button>
      </footer>


      {/* =====================================
          Print Protection
      ===================================== */}

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