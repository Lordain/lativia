import type {
  Service,
} from "@/types/service";

import type {
  ServicePrice,
} from "@/types/servicePrice";

import ServiceHelpCard from "@/components/service/ServiceHelpCard";

import type {
  CetesReferenceRate,
} from "@/types/cetes";

import DynamicForm from "@/components/forms/DynamicForm";

import {
  getGovernmentBondRateSnapshot,
} from "@/lib/cetes/getGovernmentBondRateSnapshot";

import {
  CETES_CONSULTATION_ORIGINAL_AMOUNT,
} from "@/lib/cetes/cetesConsultationPricing";

interface Props {
  service:
    Service;

  prices:
    ServicePrice[];

  rates:
    CetesReferenceRate[];
}

function formatDate(
  value: string
) {
  const [
    year,
    month,
    day,
  ] =
    value.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${year}-${month}-${day}`;
}

export default async function CetesLanding({
  service,
  prices,
  rates,
}: Props) {
  const rateSnapshot =
  await getGovernmentBondRateSnapshot(
    rates
  );

const displayedRates =
  rateSnapshot.rates;

const rateSourceName =
  rateSnapshot.sourceName;

const rateSourceDate =
  rateSnapshot.sourceDate;


  const activePrices =
    prices.filter(
      price =>
        price.active
    );


  const primaryPrice =
    activePrices[0] ??
    null;


    const currentCurrency =
    primaryPrice?.currency ??
    "MXN";

  const currentAmount =
    primaryPrice
      ? Number(
          primaryPrice.amount
        )
      : 2000;

    const originalAmount =
      CETES_CONSULTATION_ORIGINAL_AMOUNT;

  const moneyFormatter =
    new Intl.NumberFormat(
      "es-MX",
      {
        style:
          "currency",

        currency:
          currentCurrency,

        minimumFractionDigits:
          0,

        maximumFractionDigits:
          0,
      }
    );

  const displayAmount =
    `${currentCurrency} ${moneyFormatter.format(
      currentAmount
    )}`;

  const originalDisplayAmount =
    `${currentCurrency} ${moneyFormatter.format(
      originalAmount
    )}`;

  const discountPercent =
    Math.round(
      (
        1 -
        currentAmount /
          originalAmount
      ) *
        100
    );

  const coursePreviews = [
    {
      id:
        "opening",

      number:
        "01",

      title:
        "Cetesdirecto 开户实操",

      description:
        "从账号创建、定位、身份资料到本人银行账户与合同签署。",

      image:
        "/consultation/cetes/previews/preview-opening.png",
    },

    {
      id:
        "efirma",

      number:
        "02",

      title:
        "e.firma 账户升级",

      description:
        "了解账户等级，以及使用本人 e.firma 完成线上升级的完整流程。",

      image:
        "/consultation/cetes/previews/preview-efirma.png",
    },

    {
      id:
        "purchase",

      number:
        "03",

      title:
        "墨西哥国债购买实操",

      description:
        "从 Invertir、选择期限、Subasta 到提交并确认购买指令。",

      image:
        "/consultation/cetes/previews/preview-purchase.png",
    },

    {
      id:
        "withdrawal",

      number:
        "04",

      title:
        "出金操作实操",

      description:
        "掌握首次出金测试，并理解从 Cetesdirecto 返回本人银行账户的资金闭环。",

      image:
        "/consultation/cetes/previews/preview-withdrawal.png",
    },
  ];


  return (
    <main>
      {/* =====================================
    Hero
===================================== */}

<section className="border-b bg-gradient-to-b from-blue-50 via-white to-white">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px]">
      {/* ===============================
          Hero Copy
      =============================== */}

      <div>
        <div className="mb-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          Cetesdirecto 中文操作咨询
        </div>

        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-4xl lg:text-5xl">
          墨西哥国债开户与操作咨询
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
          从认识墨西哥国债，到真正会操作
          Cetesdirecto。
          中文指导您完成开户、本人银行账户设置、
          首次入金、e.firma 账户升级、
          Subasta（拍卖）购买国债、
          首次出金以及账户记录检查。
        </p>


        {/* Selling Points */}

        <div className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            "端到端中文详细咨询课件",
            "国债页面 Web + App 实操",
            "开户 → 入金 → 出金全闭环",
          ].map(
            item => (
              <div
                key={
                  item
                }
                className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-gray-800 shadow-sm"
              >
                <span className="font-bold text-blue-600">
                  ✓
                </span>

                <span>
                  {
                    item
                  }
                </span>
              </div>
            )
          )}
        </div>

        {/* Security */}

        <div className="mt-6 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-950">
            账户和资金始终由您本人控制
          </p>

          <p className="mt-2 text-sm leading-7 text-amber-800">
            本服务只提供中文流程咨询与操作指导。
            不提供投资建议，
            不推荐具体产品、金额或买卖时点；
            不代客户登录账户，也不接触或保管客户资金、
            账户密码、银行密码、OTP、Token、CVV
            或 e.firma 私钥密码。
          </p>
        </div>
      </div>

      {/* ===============================
          Pricing
      =============================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-gray-200/50 md:p-6">
        <div className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
          当前优惠
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500">
            原价
          </p>

          <p className="mt-1 text-xl font-semibold text-gray-400 line-through decoration-2">
            {
              originalDisplayAmount
            }
          </p>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-600">
            当前优惠价
          </p>

          <div className="mt-1 flex flex-wrap items-end gap-3">
            <p className="text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">
              {
                displayAmount
              }
            </p>

            {discountPercent >
              0 && (
              <span className="mb-1 rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            一次性中文线上咨询服务
          </p>
        </div>

        <div className="my-5 border-t" />

        <div className="rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-500">
          实际付款金额以结账页面显示的
          MXN 金额为准。
        </div>

        <a
          href="#start-consultation"
          className="mt-5 flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          开始咨询
        </a>

        <a
        href="#cetes-overview"
        className="mt-4 flex items-center justify-between rounded-xl px-2 py-3 text-sm font-semibold text-blue-700 transition hover:text-blue-800"
      >
        <span>
          先了解完整服务内容
        </span>

        <span
          aria-hidden="true"
          className="text-lg"
        >
          ↓
        </span>
      </a>
      </div>
    </div>
  </div>
</section>


{/* =====================================
    Product Overview
===================================== */}

<section
  id="cetes-overview"
  className="bg-white"
>
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="max-w-3xl">
      <p className="text-sm font-bold text-blue-700">
        PRODUCT OVERVIEW
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        CETES、BONOS、BONDDIA 一页看懂
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        先分清三种产品是什么、主要用于什么。
        更详细的收益方式、购买流程、账户操作与风险，
        会在正式咨询中结合实际页面说明。
      </p>
    </div>

    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[180px_1fr_1fr] border-b bg-gray-100 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
        <div>
          产品
        </div>

        <div>
          是什么
        </div>

        <div>
          主要用途
        </div>
      </div>

      {[
        {
          product:
            "CETES",
          type:
            "墨西哥短期国债",
          use:
            "用于较短期限的国债投资",
        },
        {
          product:
            "BONOS",
          type:
            "墨西哥中长期固定利率国债",
          use:
            "用于中长期国债持有",
        },
        {
          product:
            "BONDDIA",
          type:
            "每日流动性的债务投资基金，不是单一国债",
          use:
            "用于流动资金、等待后续购买或提款",
        },
      ].map(
        item => (
          <div
            key={
              item.product
            }
            className="grid gap-4 border-b px-4 py-3.5 md:px-5 md:py-4 last:border-b-0 md:grid-cols-[180px_1fr_1fr] md:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 md:hidden">
                产品
              </p>

              <p className="mt-1 text-base font-bold md:text-lgtext-xl font-bold text-gray-950 md:mt-0">
                {
                  item.product
                }
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 md:hidden">
                是什么
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-700 md:mt-0">
                {
                  item.type
                }
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 md:hidden">
                主要用途
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-700 md:mt-0">
                {
                  item.use
                }
              </p>
            </div>
          </div>
        )
      )}
    </div>
  </div>
</section>

{/* =====================================
    Investment Comparison
===================================== */}

<section className="border-y border-slate-200 bg-slate-50">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="max-w-3xl">
      <p className="text-sm font-bold text-blue-700">
        INVESTMENT COMPARISON
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        国债与常见投资方式比较
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-500">
        用最核心的几个维度，快速看懂墨西哥国债与定存、基金、股票的一般特征差异。
      </p>
    </div>


    <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-500">
            <th className="sticky left-0 z-20 border-b border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-bold">
              投资方式
            </th>

            {[
              "风险",
              "收益潜力",
              "收益确定性",
              "价格波动",
              "流动性",
            ].map(
              item => (
                <th
                  key={
                    item
                  }
                  className="border-b border-slate-200 px-4 py-3 text-center text-xs font-bold text-blue-800"
                >
                  {
                    item
                  }
                </th>
              )
            )}
          </tr>
        </thead>


        <tbody>
          {[
            {
              name:
                "墨西哥国债",

              values: [
                "低",
                "中高",
                "高",
                "低",
                "中高",
              ],

              highlight:
                true,
            },

            {
              name:
                "银行定存",

              values: [
                "低",
                "低",
                "高",
                "低",
                "低",
              ],

              highlight:
                false,
            },

            {
              name:
                "基金",

              values: [
                "中",
                "中高",
                "中",
                "中",
                "高",
              ],

              highlight:
                false,
            },

            {
              name:
                "股票",

              values: [
                "高",
                "高",
                "低",
                "高",
                "高",
              ],

              highlight:
                false,
            },
          ].map(
            (
              row,
              rowIndex
            ) => (
              <tr
                key={
                  row.name
                }
                className={[
                  rowIndex <
                  3
                    ? "border-b border-slate-100"
                    : "",
                  row.highlight
                    ? "bg-blue-50/40"
                    : "",
                ].join(
                  " "
                )}
              >
                <th
                  scope="row"
                  className={[
                    "sticky left-0 z-10 px-4 py-4 text-left font-semibold",
                    row.highlight
                      ? "bg-blue-50 text-blue-800"
                      : "bg-white text-slate-800",
                  ].join(
                    " "
                  )}
                >
                  {
                    row.name
                  }
                </th>

                {row.values.map(
                  (
                    value,
                    index
                  ) => (
                    <td
                      key={`${row.name}-${index}`}
                      className={[
                        "px-4 py-4 text-center font-medium",
                        row.highlight
                          ? "font-bold text-blue-700"
                          : "text-slate-600",
                      ].join(
                        " "
                      )}
                    >
                      {
                        value
                      }
                    </td>
                  )
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>


    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
        <p className="text-xs font-medium text-blue-600">
          风险水平
        </p>

        <p className="mt-1 text-sm font-bold text-blue-950">
          较低
        </p>
      </div>


      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
        <p className="text-xs font-medium text-blue-600">
          收益特征
        </p>

        <p className="mt-1 text-sm font-bold text-blue-950">
          稳定性较强
        </p>
      </div>


      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
        <p className="text-xs font-medium text-blue-600">
          适合人群
        </p>

        <p className="mt-1 text-sm font-bold text-blue-950">
          偏稳健型用户
        </p>
      </div>
    </div>


    <p className="mt-4 text-xs leading-5 text-slate-400">
      * 以上为一般特征比较，不同产品、期限和市场环境下会有变化。
      墨西哥国债仍存在利率、流动性、税务及汇率等风险，
      不构成投资建议或收益保证。
    </p>
  </div>
</section>

{/* =====================================
    Current Rates
===================================== */}

<section className="bg-slate-50">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="max-w-4xl">
      <p className="text-sm font-bold text-blue-700">
        OFFICIAL REFERENCE DATA
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        最新参考年化收益率
        <span className="mt-2 block text-base font-medium text-gray-500 md:inline md:ml-3">
          （供参考，以官方实际利率为主）
        </span>
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        展示 Cetesdirecto 最新公开参考收益率。
        实际利率、期限和成交条件以官方当时信息为准。
      </p>
    </div>

    {displayedRates.length >
    0 ? (
      <>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedRates.map(
            item => (
              <div
                key={
                  item.id
                }
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-950">
                    {item.product ===
                    "CETES"
                      ? "短期国债"
                      : item.product ===
                          "BONOS"
                        ? "长期国债"
                        : "流动性基金"}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.product} · {item.term}
                  </p>
                </div>

                  {item.product ===
                    "BONDDIA" && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      每日流动
                    </span>
                  )}
                </div>

                <p className="mt-4 text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                  {
                    item.rate.toFixed(
                      2
                    )
                  }
                  %
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  官方参考收益率
                  {item.product ===
                    "BONDDIA"
                    ? " · 税前"
                    : ""}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-gray-500">
          <span>
            来源：
            {
              rateSourceName
            }
          </span>

          {rateSourceDate && (
            <span>
              官方数据日期：
              {
                formatDate(
                  rateSourceDate
                )
              }
            </span>
          )}

          <span>
            页面数据最多缓存约 1 小时，以减少对官方网站的重复请求。
          </span>
        </div>
      </>
    ) : (
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
        <p className="font-medium text-amber-900">
          当前官方参考收益率暂时无法读取
        </p>

        <p className="mt-1 text-sm leading-6 text-amber-800">
          收益率展示不会影响咨询服务本身。
          请以 Cetesdirecto 或 Banco de México
          当时公布的官方信息为准。
        </p>
      </div>
    )}
  </div>
</section>


{/* =====================================
    Consultation Value
===================================== */}

<section className="bg-white">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <div className="max-w-3xl">
      <p className="text-sm font-bold text-blue-700">
        CONSULTATION VALUE
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        不只是告诉您“去哪里点”
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base md:leading-7">
        整套咨询围绕实际 Cetesdirecto 使用流程设计，
        帮助您从理解产品到掌握账户和资金操作。
      </p>
    </div>

    <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          value:
            "端到端",

          title:
            "中文详细咨询课件",

          text:
            "从产品理解到开户与资金操作。",
        },

        {
          value:
            "7 大",

          title:
            "实操环节",

          text:
            "开户、入金、升级、购买、出金等。",
        },

        {
          value:
            "Web + App",

          title:
            "实际页面讲解",

          text:
            "结合 Cetesdirecto 实际页面。",
        },

        {
          value:
            service.accessDurationDays
              ? `${service.accessDurationDays} 天`
              : "持续",

          title:
            "后续问题跟进",

          text:
            "外部条件未完成可继续跟进。",
        },
      ].map(
        item => (
          <div
            key={
              item.title
            }
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-3xl font-bold tracking-tight text-blue-700">
              {
                item.value
              }
            </p>

            <h3 className="mt-3 text-lg font-semibold text-gray-950">
              {
                item.title
              }
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              {
                item.text
              }
            </p>
          </div>
        )
      )}
    </div>
  </div>
</section>

{/* =====================================
    Service Scope
===================================== */}

<section className="bg-gray-50">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="max-w-3xl">
      <p className="text-sm font-bold text-blue-700">
        CONSULTATION SERVICE
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        咨询服务包含什么？
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600 md:text-base md:leading-7">
        从了解产品到完成实际账户操作，
        中文指导您掌握开户、账户升级、国债购买、
        入金及出金的完整流程。
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        账户登录、身份验证、银行及资金操作始终由您本人完成。
      </p>
    </div>


    <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {/* =================================
          01 Products
      ================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
          01
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-950">
          产品与平台说明
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          理解 CETES、BONOS、BONDDIA
          的基本区别，以及 Cetesdirecto
          平台如何运作。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          包括产品期限、Subasta（拍卖）
          以及 BONDDIA 的主要用途。
        </p>
      </div>


      {/* =================================
          02 Account Opening
      ================================= */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          02
        </div>

        <div className="mt-4 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
          重点服务
        </div>

        <h3 className="mt-3 text-lg font-semibold text-gray-950">
          Cetesdirecto 开户指导
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          指导您理解开户条件、
          注册步骤及账户基本设置。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          包括 RFC、CURP、本人银行账户
          与 CLABE 在开户中的作用。
        </p>
      </div>


      {/* =================================
          03 Account Level / e.firma
      ================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
          03
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-950">
          账户等级与 e.firma
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          理解不同账户等级、资金额度，
          以及通过 e.firma 完成账户升级的流程。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          .cer、.key 及私钥密码始终由您本人保管和操作。
        </p>
      </div>


      {/* =================================
          04 Auction
      ================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-sm font-bold text-purple-700">
          04
        </div>

        <h3 className="mt-4 text-lg font-semibold text-slate-950">
          国债购买与拍卖操作
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          结合 Web 与 App，
          说明产品、期限、Subasta、
          金额及购买指令确认流程。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          只说明操作方式，
          不推荐产品、期限、金额或买入时点。
        </p>
      </div>


      {/* =================================
          05 Deposit
      ================================= */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          05
        </div>

        <div className="mt-4 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
          重点服务
        </div>

        <h3 className="mt-3 text-lg font-semibold text-gray-950">
          首次入金指导
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          指导您从本人墨西哥银行账户
          向 Cetesdirecto 转入资金，
          并检查到账状态。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          金额及所有银行操作均由您本人确认和执行。
        </p>
      </div>


      {/* =================================
          06 Withdrawal
      ================================= */}

      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          06
        </div>

        <div className="mt-4 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
          重点服务
        </div>

        <h3 className="mt-3 text-lg font-semibold text-gray-950">
          首次出金测试
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          指导您完成首次资金转回本人银行账户，
          确认掌握完整资金进出流程。
        </p>

        <p className="mt-3 text-xs leading-5 text-gray-500">
          实际金额及账户操作均由您本人完成。
        </p>
      </div>
    </div>


    {/* =====================================
        Follow-up Window
    ===================================== */}

    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            当天无法全部完成？
          </h3>

          <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-600">
            如因银行、身份验证、e.firma
            或 Cetesdirecto 系统状态导致部分环节无法当场完成，
            可在服务有效期内继续跟进。
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="text-xs text-slate-500">
            最长跟进
          </p>

          <p className="mt-0.5 text-sm font-bold text-slate-900">
            14 个日历日
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


{/* =====================================
    Course Preview
===================================== */}

<section className="border-b bg-gray-950 text-white">
  <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
    <div className="max-w-3xl">
      <p className="text-xs font-bold tracking-wide text-blue-300">
        CONSULTATION MATERIAL
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
        实际咨询课件预览
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
        咨询过程中会结合整理后的中文课件和
        Cetesdirecto 实际页面进行讲解。
        以下仅展示部分课件版式，正文内容已模糊处理。
      </p>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {coursePreviews.map(
        item => (
          <div
            key={
              item.id
            }
            className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
              <img
                src={
                  item.image
                }
                alt=""
                aria-hidden="true"
                draggable={
                  false
                }
                className="
                  h-full
                  w-full
                  scale-[1.03]
                  select-none
                  object-cover
                  blur-[5px]
                  opacity-65
                "
              />

              <div className="absolute inset-0 bg-slate-950/25" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm">
                  🔒 咨询课件预览
                </div>
              </div>

              <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-gray-200 backdrop-blur">
                {
                  item.number
                }
              </div>
            </div>

            <div className="p-3.5">
              <h3 className="text-sm font-bold text-white">
                {
                  item.title
                }
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-gray-400">
                {
                  item.description
                }
              </p>
            </div>
          </div>
        )
      )}
    </div>

    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs leading-5 text-gray-400">
      实际咨询由顾问在线结合课件进行讲解。
      页面预览仅用于展示课程结构和内容深度。
    </div>
  </div>
</section>

{/* =====================================
    Service Boundaries
===================================== */}

<section className="bg-slate-50">
  <div className="mx-auto max-w-6xl px-5 py-12">
    <div className="max-w-3xl">
      <p className="text-sm font-bold text-red-600">
        服务边界
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        我们不会替您做什么
      </h2>

      <p className="mt-4 leading-7 text-slate-600">
        以下事项始终由客户本人决定和操作。
        Lativia 只提供流程说明与咨询协助，
        不接管账户、资金或投资决定。
      </p>
    </div>


    <div className="mt-6 grid gap-3 md:grid-cols-2">
      {[
        "不推荐您购买 CETES、BONOS、BONDDIA 或其他具体产品",

        "不推荐投资期限、金额或买卖时点",

        "不提供个人资产配置或投资组合建议",

        "不代为登录或操作您的 Cetesdirecto 账户",

        "不接收、保管或转移您的投资资金",

        "不收集账户密码、银行密码、OTP、Token、CVV 等安全凭证",

        "不收集或保管 e.firma 私钥密码",

        "不替客户签署 Cetesdirecto 合同或执行资金操作",
      ].map(
        item => (
          <div
            key={
              item
            }
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </div>

            <p className="text-sm leading-6 text-slate-700">
              {
                item
              }
            </p>
          </div>
        )
      )}
    </div>


    <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <p className="text-sm leading-6 text-blue-900">
          账户登录、身份验证、银行绑定、
          入金、出金及投资操作，
          始终由客户本人完成。
        </p>
      </div>
    </div>
  </div>
</section>


{/* =====================================
    Risk
===================================== */}

<section className="bg-white">
  <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-amber-700">
        BEFORE YOU START
      </p>

      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
        购买前需要了解的风险
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-600 md:text-base">
        国债风险相对较低，但并不代表没有风险。
        决定购买前，请先了解以下主要因素。
      </p>
    </div>


    <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {[
        {
          title:
            "汇率风险",

          text:
            "MXN 汇率变化可能影响换算为人民币或其他货币后的实际收益。",
        },

        {
          title:
            "利率与价格风险",

          text:
            "市场利率变化可能影响债券价格，尤其是在到期前提前出售时。",
        },

        {
          title:
            "流动性风险",

          text:
            "提前取用资金时，价格、方式及到账时间可能与持有至到期不同。",
        },

        {
          title:
            "税务风险",

          text:
            "最终净收益会受到您的税务身份及当时适用税务规则影响。",
        },

        {
          title:
            "操作风险",

          text:
            "银行、CLABE、身份资料或 e.firma 设置问题可能影响资金及账户操作。",
        },

        {
          title:
            "规则变化",

          text:
            "Cetesdirecto、金融机构或相关政府规则与办理要求可能发生调整。",
        },
      ].map(
        item => (
          <div
            key={
              item.title
            }
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {
                    item.title
                  }
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  {
                    item.text
                  }
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </div>


    <p className="mt-4 text-xs leading-5 text-slate-400">
      风险程度会因产品、期限、持有方式、
      市场环境及个人情况而有所不同。
    </p>
  </div>
</section>


      {/* =====================================
          Purchase
      ===================================== */}

        <section
          id="start-consultation"
          className="border-t border-blue-100 bg-blue-50/60"
        >
        <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
          <div className="text-center">
            <p className="text-sm font-bold text-blue-700">
              开始办理
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              先确认您符合办理条件
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            无需提前提交 RFC、CLABE、e.firma 或任何密码。
            只需先确认您是否具备办理条件。
            </p>
          </div>


          <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm md:p-6">
            <DynamicForm
              serviceId={
                service.id
              }

              schema={
                service.formSchema
              }

              prices={
                prices
              }

              eligibilityMode={
                service
                  .eligibilityMode
              }

              eligibilitySchema={
                service
                  .eligibilitySchema
              }
            />
          </div>
          <ServiceHelpCard />
        </div>
      </section>
    </main>
  );
}
