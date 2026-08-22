import Link from "next/link";

import type {
    GovernmentBondRateSnapshot,
  } from "@/types/governmentBondRates";


  interface HeroProps {
    rateSnapshot:
      GovernmentBondRateSnapshot;
  }


function formatRate(
  value: number
) {
  return `${value.toFixed(
    2
  )}%`;
}


function formatSourceDate(
  value:
    | string
    | null
) {
  if (!value) {
    return null;
  }

  const date =
    new Date(
      `${value}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "zh-CN",
    {
      year:
        "numeric",
      month:
        "short",
      day:
        "numeric",
    }
  ).format(
    date
  );
}


export default function Hero({
    rateSnapshot,
  }: HeroProps) {
    const cetesOneYear =
    rateSnapshot.rates.find(
      item =>
        item.product ===
          "CETES" &&
        item.term ===
          "1 年"
    ) ?? null;

  const bonosThreeYears =
    rateSnapshot.rates.find(
      item =>
        item.product ===
          "BONOS" &&
        item.term ===
          "3 年"
    ) ?? null;

  const bonddiaDaily =
    rateSnapshot.rates.find(
      item =>
        item.product ===
          "BONDDIA" &&
        item.term ===
          "1 日"
    ) ?? null;

    const sourceName =
    rateSnapshot.sourceName;

    const sourceDate =
    formatSourceDate(
        rateSnapshot.sourceDate
    );


  return (
    <>
      {/* =====================================
          HERO
      ===================================== */}

      <section className="relative isolate overflow-hidden bg-[#06101f] text-white">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[110px]" />

          <div className="absolute right-[-100px] top-[5%] h-[460px] w-[460px] rounded-full bg-cyan-400/15 blur-[120px]" />

          <div className="absolute bottom-[-260px] left-[40%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[130px]" />

          <svg
            viewBox="0 0 1440 700"
            className="absolute inset-0 h-full w-full opacity-20"
            preserveAspectRatio="none"
          >
            <path
              d="M-40 590 C 220 410, 390 650, 690 430 S 1120 250, 1500 360"
              fill="none"
              stroke="rgba(103,232,249,0.28)"
              strokeWidth="1.5"
            />

            <path
              d="M-100 470 C 230 300, 390 480, 720 300 S 1160 130, 1510 210"
              fill="none"
              stroke="rgba(96,165,250,0.18)"
              strokeWidth="1"
            />
          </svg>
        </div>


        <div className="relative mx-auto grid min-h-[650px] w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 xl:py-24">
          {/* =====================================
              LEFT
          ===================================== */}

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-cyan-200 backdrop-blur sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />

              中文代办 · 咨询 · 现场陪同服务平台
            </div>


            <h1 className="mt-7 max-w-3xl text-[2.7rem] font-bold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl md:text-[3.6rem] lg:text-[4rem] xl:text-[4.5rem]">
              墨西哥的事，

              <span className="block bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                用中文更好办。
              </span>
            </h1>


            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                我们为中文用户提供代办协助、
                专业咨询与现场陪同服务。
                从墨西哥国债到各类办事流程，
                帮您看懂要求、理清步骤、顺利推进。
            </p>


            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/services"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-300 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200"
              >
                探索全部服务
              </Link>

              <Link
                href="/services/cetesdirecto-consultation"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                了解墨西哥国债咨询

                <span className="ml-2">
                  →
                </span>
              </Link>
            </div>


            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                <span>
                    <b className="mr-2 text-cyan-300">
                    ✓
                    </b>

                    全程中文服务
                </span>

                <span>
                    <b className="mr-2 text-cyan-300">
                    ✓
                    </b>

                    专人协助推进
                </span>

                <span>
                    <b className="mr-2 text-cyan-300">
                    ✓
                    </b>

                    进度清晰可查
                </span>
                </div>
          </div>


          {/* =====================================
              RIGHT
              MEXICO BOND PANEL
          ===================================== */}

          <div className="relative">
            <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.075] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
              {/* Header */}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                    核心服务
                  </p>

                  <h2 className="mt-3 text-2xl font-bold text-white">
                    墨西哥国债
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    最新参考年化收益率
                  </p>
                </div>


                <span className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-xs font-bold text-slate-300">
                  MXN
                </span>
              </div>


              {/* Product cards */}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {/* CETES */}

                <div className="flex min-h-[190px] flex-col items-center justify-between rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      短期国债
                    </p>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                      CETES
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      1 年
                    </p>
                  </div>


                  <div className="mt-6">
                    <p className="text-3xl font-bold tracking-tight text-cyan-200">
                      {cetesOneYear
                        ? formatRate(
                            cetesOneYear
                              .rate
                          )
                        : "—"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      官方年化收益率
                    </p>
                  </div>
                </div>


                {/* BONOS */}

                <div className="flex min-h-[190px] flex-col items-center justify-between rounded-2xl border border-white/[0.08] bg-black/10 p-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      长期国债
                    </p>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                      BONOS
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      3 年
                    </p>
                  </div>


                  <div className="mt-6">
                  <p className="text-3xl font-bold tracking-tight text-slate-200">
                    {bonosThreeYears
                        ? formatRate(
                            bonosThreeYears.rate
                        )
                        : "—"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        官方年化收益率
                    </p>
                  </div>
                </div>


                {/* BONDDIA */}

                <div className="flex min-h-[190px] flex-col items-center justify-between rounded-2xl border border-white/[0.08] bg-black/10 p-5 text-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      流动性基金
                    </p>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                      BONDDIA
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      每日参考
                    </p>
                  </div>


                  <div className="mt-6">
                  <p className="text-3xl font-bold tracking-tight text-slate-200">
                        {bonddiaDaily
                            ? formatRate(
                                bonddiaDaily.rate
                            )
                            : "—"}
                        </p>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        官方年化收益率
                    </p>
                  </div>
                </div>
              </div>


              {/* Data source */}

              <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="text-xs leading-5 text-slate-500">
                  <p>
                    数据来源：
                    {sourceName}
                  </p>

                  {sourceDate && (
                    <p className="mt-1">
                      数据日期：
                      {sourceDate}
                    </p>
                  )}
                </div>


                <Link
                  href="/services/cetesdirecto-consultation"
                  className="inline-flex min-h-10 items-center text-sm font-bold text-cyan-200 transition hover:text-cyan-100"
                >
                  查看咨询服务

                  <span className="ml-2">
                    →
                  </span>
                </Link>
              </div>


              <p className="mt-5 text-[11px] leading-5 text-slate-500">
                收益率仅为参考信息，
                会随市场及官方公布数据变化。
                我们不保证未来收益，
                也不提供投资建议。
                </p>
            </div>
          </div>
        </div>
      </section>


        {/* =====================================
            SECURITY SUMMARY
        ===================================== */}

        <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-5 lg:justify-between lg:gap-6">
            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center sm:w-[calc(50%-10px)] lg:w-[240px] xl:w-[260px]">
                <p className="text-sm font-bold text-slate-950">
                账户本人操作
                </p>

                <p className="mt-1.5 text-sm text-slate-500">
                不代登录客户账户
                </p>
            </div>


            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center sm:w-[calc(50%-10px)] lg:w-[240px] xl:w-[260px]">
                <p className="text-sm font-bold text-slate-950">
                资金本人掌控
                </p>

                <p className="mt-1.5 text-sm text-slate-500">
                不接收、不保管资金
                </p>
            </div>


            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center sm:w-[calc(50%-10px)] lg:w-[240px] xl:w-[260px]">
                <p className="text-sm font-bold text-slate-950">
                敏感凭证不收集
                </p>

                <p className="mt-1.5 text-sm text-slate-500">
                不索取密码、OTP、CVV
                </p>
            </div>


            <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-center sm:w-[calc(50%-10px)] lg:w-[240px] xl:w-[260px]">
                <p className="text-sm font-bold text-slate-950">
                投资决定本人做出
                </p>

                <p className="mt-1.5 text-sm text-slate-500">
                不代替客户做投资决定
                </p>
            </div>
            </div>
        </div>
        </section>


      {/* =====================================
          SECURITY BOUNDARY
      ===================================== */}

      <section className="bg-slate-50">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-8">
          {/* Left */}

          <div>
            <p className="text-sm font-bold text-blue-700">
              安全与服务边界
            </p>


            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              我们协助您完成流程，

              <span className="block">
                关键操作始终由您本人完成。
              </span>
            </h2>


            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                我们提供信息梳理、流程咨询、
                办理协助与现场陪同。
                涉及账户、身份验证、
                银行、资金和投资决定的关键操作，
                始终由客户本人负责。
                </p>


            <Link
              href="/services/cetesdirecto-consultation"
              className="mt-7 inline-flex min-h-11 items-center text-sm font-bold text-blue-700 transition hover:text-blue-800"
            >
              了解墨西哥国债服务边界

              <span className="ml-2">
                →
              </span>
            </Link>
          </div>


          {/* Right */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <p className="text-sm font-bold text-slate-950">
                您始终掌控这些关键操作
              </p>

              <p className="mt-1 text-sm text-slate-500">
                我们不会代替客户完成下列敏感操作。
                </p>
            </div>


            <div className="divide-y divide-slate-100">
              {[
                [
                  "账户登录与身份验证",
                  "由客户本人操作",
                  "✓",
                ],

                [
                  "银行账户操作",
                  "由客户本人操作",
                  "✓",
                ],

                [
                  "入金、出金与转账",
                  "由客户本人操作",
                  "✓",
                ],

                [
                  "投资金额、期限与产品决定",
                  "由客户本人决定",
                  "✓",
                ],

                [
                    "账户登录密码",
                    "我们不收集",
                    "—",
                  ],

                  [
                    "银行密码",
                    "我们不收集",
                    "—",
                  ],

                  [
                    "OTP / Token / CVV",
                    "我们不收集",
                    "—",
                  ],

                  [
                    "e.firma 私钥密码",
                    "我们不收集",
                    "—",
                  ],
              ].map(
                ([
                  label,
                  value,
                  icon,
                ]) => (
                  <div
                    key={
                      label
                    }
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {
                        label
                      }
                    </p>


                    <div className="flex items-center gap-2">
                      <span
                        className={
                          icon ===
                          "✓"
                            ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700"
                            : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500"
                        }
                      >
                        {
                          icon
                        }
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {
                          value
                        }
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
