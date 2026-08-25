import type {
    Metadata,
  } from "next";

  import Link from "next/link";

  import PublicShell from "@/components/layout/PublicShell";

  import {
    SUPPORT_EMAIL,
    SUPPORT_WHATSAPP,
    hasSupportEmail,
    hasSupportWhatsApp,
  } from "@/lib/support/contact";


  export const metadata:
    Metadata = {
      title:
        "帮助中心 | Lativia",

        description:
        "Lativia 帮助中心：查看服务选择、办理流程、订单、付款、退款、墨西哥发票、账户及墨西哥国债咨询常见问题。",
    };


  interface HelpTopic {
    title:
      string;

    description:
      string;

    href:
      string;

      icon:
      "service" |
      "order" |
      "payment" |
      "refund" |
      "account" |
      "bond" |
      "invoice";
  }


  interface FaqItem {
    question:
      string;

    answer:
      string;
  }


  const helpTopics:
    HelpTopic[] = [
      {
        title:
          "服务与办理",

        description:
          "了解如何选择服务、查看办理要求，以及不同服务方案之间的区别。",

        href:
          "#services",

        icon:
          "service",
      },
      {
        title:
          "订单与进度",

        description:
          "查看订单状态、办理进度，以及需要您补充或确认的信息。",

        href:
          "#orders",

        icon:
          "order",
      },
      {
        title:
          "付款问题",

        description:
          "了解付款方式、付款确认，以及付款过程中常见的问题。",

        href:
          "#payment",

        icon:
          "payment",
      },
      {
        title:
          "退款与规则",

        description:
          "了解服务退款、第三方费用及人工审核等基本规则。",

        href:
          "#refund",

        icon:
          "refund",
      },
      {
        title:
          "账户与安全",

        description:
          "登录、订单查看、通知及账户资料相关说明。",

        href:
          "#account",

        icon:
          "account",
      },
      {
        title:
          "墨西哥国债咨询",

        description:
          "了解国债咨询的服务范围、账户安全和客户自行操作边界。",

        href:
          "#bond",

        icon:
          "bond",
      },
      {
        title:
          "墨西哥发票",

        description:
          "需要为 Lativia 服务申请墨西哥 CFDI？查看开票说明并联系官方 WhatsApp 客服。",

        href:
          "#invoice",

        icon:
          "invoice",
      },
    ];


  const serviceFaq:
    FaqItem[] = [
      {
        question:
          "如何找到适合自己的服务？",

        answer:
          "您可以先进入办事服务页面，根据服务名称、办理事项和服务说明选择对应项目。每个服务页面都会说明服务内容、办理时间、需要准备的信息以及可选择的服务方案。",
      },
      {
        question:
          "预约协助和现场办理陪同有什么区别？",

        answer:
          "预约协助主要帮助您理解办理要求、确认流程并完成相关预约准备；现场办理陪同则在对应服务支持的地区提供现场陪同及必要的沟通协助。具体范围以各服务页面列出的方案说明为准。",
      },
      {
        question:
          "购买服务后是否代表政府机构一定会批准？",

        answer:
          "不是。Lativia 提供的是办理协助、流程说明、咨询或现场陪同服务。最终是否受理、批准、签发或完成，由对应政府机关或第三方机构根据其规则决定。",
      },
      {
        question:
          "哪些步骤必须由本人完成？",

        answer:
          "涉及身份确认、政府机关要求本人到场、账户登录、银行操作、电子签名、验证码或其他依法必须本人完成的步骤，需要由客户本人操作。服务页面会根据具体业务说明相应要求。",
      },
    ];


  const orderFaq:
    FaqItem[] = [
      {
        question:
          "付款后在哪里查看订单？",

        answer:
          "登录 Lativia 后，可以进入“我的订单”查看订单状态、付款情况、办理进度以及需要您处理的事项。",
      },
      {
        question:
          "如果平台要求我补充或修正资料怎么办？",

        answer:
          "请按照订单页面中的提示补充或修正对应信息。提交后，平台会根据当前办理流程继续审核和推进。",
      },
      {
        question:
          "订单为什么会显示等待客户？",

        answer:
          "通常表示当前办理流程需要您确认、补充或修正某项信息。完成页面要求的操作后，订单会继续进入后续处理流程。",
      },
      {
        question:
          "办理完成后在哪里查看结果？",

        answer:
          "根据具体服务类型，办理结果会在订单流程中显示；如果政府机关或第三方机构实际签发了正式结果，也会按照对应服务的交付方式提供。",
      },
    ];


  const paymentFaq:
    FaqItem[] = [
      {
        question:
          "为什么同一项服务会有不同价格？",

        answer:
          "部分服务提供不同办理方案，例如仅预约协助，或预约加现场办理陪同。不同方案的服务范围不同，因此价格也会不同。请以服务页面当前显示的正式价格为准。",
      },
      {
        question:
          "付款后订单没有立即更新怎么办？",

        answer:
          "部分支付渠道的付款确认可能需要短暂处理时间。您可以先刷新订单页面。如果付款状态长时间没有更新，可通过帮助中心后续提供的人工支持入口进行处理。",
      },
      {
        question:
          "政府费用或第三方费用包含在服务费里吗？",

        answer:
          "不一定。政府规费、签证费、税费、交通费或其他第三方费用是否包含，会根据具体服务说明确定。未明确包含的费用通常需要客户另外支付。",
      },
    ];


  const refundFaq:
    FaqItem[] = [
      {
        question:
          "什么情况下可以申请退款？",

        answer:
          "退款资格取决于服务当前的办理状态、无法继续办理的原因、已完成的工作以及相关费用性质。符合条件的情况会进入人工审核。",
      },
      {
        question:
          "服务已经完成还能退款吗？",

        answer:
          "已经成功完成并交付的服务不支持退款。咨询类服务原则上不提供退款；特殊异常或争议情况可根据适用的退款政策进入人工复核。",
      },
      {
        question:
          "政府费用或第三方费用可以退款吗？",

        answer:
          "已经实际支付给政府机关、支付渠道或其他第三方的费用，通常不属于 Lativia 可退还的服务费用范围。",
      },
      {
        question:
          "如果因为资料条件不符无法继续办理怎么办？",

        answer:
          "平台会根据实际办理情况、已完成的服务内容以及具体原因进行人工审核，并按照适用的退款规则处理。",
      },
    ];


  const accountFaq:
    FaqItem[] = [
      {
        question:
          "一定要登录才能购买服务吗？",

        answer:
          "部分服务流程会要求登录，以便保存订单、付款状态、办理进度和后续需要您处理的信息。",
      },
      {
        question:
          "在哪里查看平台通知？",

        answer:
          "登录后可以通过账户中的通知页面查看付款确认、办理状态变化、需要补充信息及服务完成等通知。",
      },
      {
        question:
          "Lativia 会要求提供账户密码或验证码吗？",

        answer:
          "不会。请不要向平台提交银行密码、账户密码、一次性验证码（OTP）、银行卡 CVV、安全 Token 或 e.firma 私钥密码等敏感认证信息。",
      },
    ];


  const bondFaq:
    FaqItem[] = [
      {
        question:
          "墨西哥国债咨询包含投资建议吗？",

        answer:
          "不包含。该服务主要提供平台开户、入金、出金及相关操作流程的中文说明和咨询，不提供买入、卖出、持有比例、收益预测或其他投资决策建议。",
      },
      {
        question:
          "Lativia 会登录或操作我的 Cetesdirecto 账户吗？",

        answer:
          "不会。账户登录、密码、身份验证、银行账户绑定、资金划转以及投资操作均由客户本人完成。",
      },
      {
        question:
          "平台会替我保管资金吗？",

        answer:
          "不会。Lativia 不接收、代管、控制或转移客户用于投资的资金。",
      },
      {
        question:
          "页面展示的收益率是否代表未来收益？",

        answer:
          "不是。页面展示的公开参考收益率仅用于帮助理解相关产品，实际收益可能变化，也不构成收益保证或投资建议。",
      },
    ];


  function TopicIcon({
    type,
  }: {
    type:
      HelpTopic["icon"];
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
      type ===
      "order"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M6 3h12v18H6z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    }


    if (
      type ===
      "payment"
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

          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
      );
    }


    if (
      type ===
      "refund"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M4 7v5h5" />
          <path d="M5.5 11a7 7 0 1 0 2-5" />
          <path d="M12 8v8" />
          <path d="M15 10.5c0-1-1.3-1.5-3-1.5s-3 .5-3 1.5S10.3 12 12 12s3 .5 3 1.5-1.3 1.5-3 1.5-3-.5-3-1.5" />
        </svg>
      );
    }


    if (
      type ===
      "account"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <circle
            cx="12"
            cy="8"
            r="3"
          />

          <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
        </svg>
      );
    }


    if (
      type ===
      "bond"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M4 18V9" />
          <path d="M9 18V5" />
          <path d="M14 18v-7" />
          <path d="M19 18V3" />
          <path d="M3 21h18" />
        </svg>
      );
    }

    if (
      type ===
      "invoice"
    ) {
      return (
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          {...common}
        >
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 11h6" />
          <path d="M9 15h6" />
          <path d="M9 19h4" />
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


  function FaqSection({
    id,
    eyebrow,
    title,
    description,
    items,
  }: {
    id:
      string;

    eyebrow:
      string;

    title:
      string;

    description:
      string;

    items:
      FaqItem[];
  }) {
    return (
      <section
        id={
          id
        }
        className="scroll-mt-24 border-t border-slate-200 py-10 first:border-t-0"
      >
        <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div>
            <p className="text-sm font-bold text-blue-700">
              {
                eyebrow
              }
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
              {
                title
              }
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {
                description
              }
            </p>
          </div>


          <div className="space-y-3">
            {items.map(
              item => (
                <details
                  key={
                    item.question
                  }
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 font-bold text-slate-950 sm:px-6">
                    <span>
                      {
                        item.question
                      }
                    </span>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-normal text-slate-500 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="border-t border-slate-100 px-5 py-4 text-sm leading-7 text-slate-600 sm:px-6">
                    {
                      item.answer
                    }
                  </div>
                </details>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  function SupportChannels() {
    const whatsappHref =
      hasSupportWhatsApp
        ? `https://wa.me/${SUPPORT_WHATSAPP}`
        : null;


    return (
      <div className="space-y-3">
        {hasSupportEmail && (
          <a
            href={
              `mailto:${SUPPORT_EMAIL}`
            }
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200"
          >
            <div>
              <p className="font-bold text-slate-950">
                官方客服邮箱
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {
                  SUPPORT_EMAIL
                }
              </p>
            </div>

            <span className="text-blue-700">
              →
            </span>
          </a>
        )}


        {whatsappHref && (
          <a
            href={
              whatsappHref
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200"
          >
            <div>
              <p className="font-bold text-slate-950">
                官方 WhatsApp
              </p>

              <p className="mt-1 text-xs text-slate-500">
                通过 Lativia 官方客服账号联系我们
              </p>
            </div>

            <span className="text-blue-700">
              →
            </span>
          </a>
        )}


        {!hasSupportEmail &&
          !hasSupportWhatsApp && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
              <p className="font-bold text-slate-950">
                人工客服即将开放
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                正式客服邮箱与 WhatsApp
                将统一在本帮助中心公布。
              </p>
            </div>
          )}
      </div>
    );
  }

  export default function HelpPage() {
    return (
      <PublicShell>
        <main className="bg-slate-50">
          {/* ===============================
              HERO
          =============================== */}

          <section className="relative overflow-hidden border-b border-slate-200 bg-[#071426] text-white">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            </div>


            <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 md:py-18 lg:px-8">
              <p className="text-sm font-bold text-cyan-300">
                Lativia 帮助中心
              </p>

              <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                需要帮助？
                <br className="hidden sm:block" />
                从这里找到答案。
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                查看服务选择、办理流程、订单、
                付款、退款和账户相关说明。
                如果您已经购买服务，
                也可以从订单页面查看当前办理进度。
              </p>


              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-300 px-5 font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  浏览办理服务
                </Link>

                <Link
                  href="/account/orders"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 font-bold text-white transition hover:bg-white/10"
                >
                  查看我的订单
                </Link>
              </div>
            </div>
          </section>


          {/* ===============================
              TOPICS
          =============================== */}

          <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div>
              <p className="text-sm font-bold text-blue-700">
                帮助主题
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                您想了解什么？
              </h2>
            </div>


            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {helpTopics.map(
                topic => (
                  <a
                    key={
                      topic.title
                    }
                    href={
                      topic.href
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/60"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      <TopicIcon
                        type={
                          topic.icon
                        }
                      />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-950">
                      {
                        topic.title
                      }
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {
                        topic.description
                      }
                    </p>

                    <p className="mt-4 text-sm font-bold text-blue-700">
                      查看说明
                      <span className="ml-2 inline-block transition group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </a>
                )
              )}
            </div>
          </section>


          {/* ===============================
              FAQ
          =============================== */}

          <section className="border-y border-slate-200 bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <FaqSection
                id="services"
                eyebrow="服务与办理"
                title="选择与开始服务"
                description="了解不同服务方案、办理要求以及平台可以提供的协助范围。"
                items={
                  serviceFaq
                }
              />

              <FaqSection
                id="orders"
                eyebrow="订单与进度"
                title="订单办理流程"
                description="了解付款后的订单状态、资料确认与后续办理步骤。"
                items={
                  orderFaq
                }
              />

              <FaqSection
                id="payment"
                eyebrow="付款"
                title="付款与费用"
                description="了解服务价格、付款方式和其他可能产生的费用。"
                items={
                  paymentFaq
                }
              />

<section
  id="invoice"
  className="scroll-mt-24 border-t border-slate-200 py-10"
>
  <div className="grid gap-7 lg:grid-cols-[260px_minmax(0,1fr)]">
    <div>
      <p className="text-sm font-bold text-blue-700">
        墨西哥发票
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        申请墨西哥 CFDI
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        如果您需要为已购买的 Lativia 服务开具墨西哥发票，
        可以通过官方 WhatsApp 联系客服处理。
      </p>
    </div>

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-bold text-slate-950">
        如何申请发票？
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        Lativia 可根据实际付款情况及适用的墨西哥税务要求，
        为符合条件的服务开具墨西哥电子发票（CFDI）。
        申请时请准备订单信息以及正确的墨西哥开票资料。
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        已退款订单不支持开具发票。
        已经开具墨西哥电子发票（CFDI）的订单，
        不支持退款。
      </p>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        Lativia 不提供中国大陆发票，
        也不提供其他非墨西哥税制下的发票。
      </p>

      {hasSupportWhatsApp ? (
        <a
          href={
            `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
              "您好，我需要为 Lativia 订单申请开具墨西哥发票（CFDI）。"
            )}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          联系 WhatsApp 申请发票
        </a>
      ) : (
        <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          官方 WhatsApp 暂未开放，请稍后通过帮助中心查看最新联系方式。
        </p>
      )}

      <p className="mt-4 text-xs leading-6 text-slate-500">
        是否可以开具 CFDI、
        发票内容及税务信息，
        以实际订单和适用税务规定为准。
      </p>
    </div>
  </div>
</section>

              <FaqSection
                id="refund"
                eyebrow="退款"
                title="退款与异常情况"
                description="了解服务无法继续办理时的处理原则以及退款审核方式。"
                items={
                  refundFaq
                }
              />

              <FaqSection
                id="account"
                eyebrow="账户与安全"
                title="保护您的账户"
                description="了解登录、通知和敏感账户资料的安全边界。"
                items={
                  accountFaq
                }
              />

              <FaqSection
                id="bond"
                eyebrow="墨西哥国债咨询"
                title="国债咨询服务边界"
                description="了解 Lativia 在账户、资金和投资决策方面不会代替客户进行的操作。"
                items={
                  bondFaq
                }
              />
            </div>
          </section>


          {/* ===============================
              SUPPORT ENTRY
          =============================== */}

          <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="grid lg:grid-cols-[1fr_0.8fr]">
                <div className="p-6 sm:p-8">
                  <p className="text-sm font-bold text-blue-700">
                    仍然需要帮助？
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                    根据您的情况选择下一步
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    如果您已经购买服务，
                    建议优先通过订单页面查看当前状态和需要处理的事项。
                    如果您还没有购买服务，
                    可以先查看对应服务页面了解办理范围和价格。
                  </p>
                </div>


                <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
                  <div className="space-y-3">
                    <Link
                      href="/account/orders"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-950 transition hover:border-blue-200"
                    >
                      <span>
                        我已经有订单
                      </span>

                      <span className="text-blue-700">
                        →
                      </span>
                    </Link>

                    <Link
                      href="/services"
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-950 transition hover:border-blue-200"
                    >
                      <span>
                        我还没有购买服务
                      </span>

                      <span className="text-blue-700">
                        →
                      </span>
                    </Link>
                  </div>

                  <div className="my-5 border-t border-slate-200" />

                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    人工支持
                    </p>

                    <SupportChannels />


                  <p className="mt-5 text-xs leading-6 text-slate-500">
                    我们不会在各个服务页面分别放置
                    WhatsApp 或其他私人联系方式。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PublicShell>
    );
  }