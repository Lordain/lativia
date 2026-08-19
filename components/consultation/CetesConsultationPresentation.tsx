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
        className="
          pointer-events-none
          fixed
          inset-0
          z-10
          overflow-hidden
          opacity-[0.045]
        "
      >
        <div
          className="
            absolute
            -inset-[25%]
            grid
            rotate-[-28deg]
            grid-cols-3
            gap-x-20
            gap-y-24
          "
        >
          {watermarkItems.map(
            item => (
              <div
                key={
                  item
                }
                className="
                  whitespace-nowrap
                  text-center
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.28em]
                  text-white
                "
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
          Top Bar
      ===================================== */}

      <header
        className="
          relative
          z-30
          flex
          min-h-16
          items-center
          justify-between
          gap-4
          border-b
          border-white/10
          bg-slate-950/90
          px-5
          backdrop-blur
          md:px-8
        "
      >
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
            className="
              rounded-lg
              border
              border-white/15
              bg-white/5
              px-3
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-white/10
            "
          >
            目录
          </button>

          <div
            className="
              rounded-lg
              border
              border-white/10
              bg-white/5
              px-3
              py-2
              text-sm
              tabular-nums
              text-slate-300
            "
          >
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
      </header>


      {/* =====================================
          Contents Drawer
      ===================================== */}

      {showContents && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/65
            backdrop-blur-sm
          "
          onClick={
            () =>
              setShowContents(
                false
              )
          }
        >
          <aside
            className="
              h-full
              w-full
              max-w-md
              overflow-y-auto
              border-r
              border-white/10
              bg-slate-950
              p-5
              shadow-2xl
            "
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
          Slide
      ===================================== */}

      <main
        className="
          relative
          z-20
          mx-auto
          flex
          min-h-[calc(100vh-8rem)]
          max-w-7xl
          items-center
          px-5
          py-10
          md:px-8
          md:py-14
        "
      >
        <section className="w-full">
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[1.15fr_0.85fr]
              lg:items-center
            "
          >
            {/* Main */}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-blue-400/30
                    bg-blue-400/10
                    px-3
                    py-1
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-blue-300
                  "
                >
                  {
                    slide.eyebrow
                  }
                </span>

                <span className="text-sm text-slate-500">
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


              <h1
                className="
                  mt-6
                  max-w-5xl
                  text-4xl
                  font-bold
                  leading-tight
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                {
                  slide.title
                }
              </h1>


              <p
                className="
                  mt-6
                  max-w-4xl
                  text-lg
                  leading-8
                  text-slate-300
                  md:text-xl
                "
              >
                {
                  slide.summary
                }
              </p>


              {slide.note && (
                <div
                  className="
                    mt-8
                    max-w-4xl
                    rounded-2xl
                    border
                    border-amber-400/20
                    bg-amber-400/[0.07]
                    p-4
                    text-sm
                    leading-6
                    text-amber-100
                  "
                >
                  {
                    slide.note
                  }
                </div>
              )}
            </div>


            {/* Bullet Card */}

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/[0.045]
                p-6
                shadow-2xl
                backdrop-blur
                md:p-8
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                "
              >
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
                      className="
                        flex
                        items-start
                        gap-4
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-black/10
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-blue-500/15
                          text-xs
                          font-bold
                          text-blue-300
                        "
                      >
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
        </section>
      </main>


      {/* =====================================
          Bottom Navigation
      ===================================== */}

      <footer
        className="
          relative
          z-30
          flex
          min-h-16
          items-center
          justify-between
          gap-3
          border-t
          border-white/10
          bg-slate-950/90
          px-5
          backdrop-blur
          md:px-8
        "
      >
        <button
          type="button"
          onClick={
            goPrevious
          }
          disabled={
            currentIndex ===
            0
          }
          className="
            rounded-lg
            border
            border-white/15
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-white/10
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
        >
          ← 上一页
        </button>


        <div className="hidden text-center md:block">
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
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-500
            disabled:cursor-not-allowed
            disabled:opacity-30
          "
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