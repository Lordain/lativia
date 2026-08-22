import type {
  Service,
} from "@/types/service";

import type {
  ServicePrice,
} from "@/types/servicePrice";

import type {
  CetesReferenceRate,
} from "@/types/cetes";

import DynamicForm from "@/components/forms/DynamicForm";
import ContactButton from "@/components/service/ContactButton";

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
  <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_420px]">
      {/* ===============================
          Hero Copy
      =============================== */}

      <div>
        <div className="mb-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
          Cetesdirecto 中文操作咨询
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
          墨西哥国债开户与操作咨询
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          从认识墨西哥国债，到真正会操作
          Cetesdirecto。
          中文指导您完成开户、本人银行账户设置、
          首次入金、e.firma 账户升级、
          Subasta（拍卖）购买国债、
          首次出金以及账户记录检查。
        </p>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-500">
          账户、密码、e.firma、资金以及所有投资决定，
          始终由您本人控制和操作。
        </p>

        {/* Selling Points */}

        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
          {[
            "端到端中文详细咨询课件",
            "Cetesdirecto Web + App 实操",
            "开户 → 入金 → 出金完整资金闭环",
          ].map(
            item => (
              <div
                key={
                  item
                }
                className="flex items-start gap-2 rounded-xl border bg-white p-4 text-sm font-medium text-gray-800 shadow-sm"
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

        <div className="mt-8 max-w-4xl rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-950">
            账户和资金始终由您本人控制
          </p>

          <p className="mt-2 text-sm leading-7 text-amber-800">
            本服务只提供中文流程咨询与操作指导。
            不提供投资建议，
            不推荐具体产品、期限、金额或买卖时点；
            不代客户登录账户，也不接触或保管客户资金、
            账户密码、银行密码、OTP、Token、CVV
            或 e.firma 私钥密码。
          </p>
        </div>
      </div>

      {/* ===============================
          Pricing
      =============================== */}

      <div className="rounded-3xl border bg-white p-7 shadow-xl shadow-gray-200/60 md:p-8">
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
            <p className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
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

        <div className="my-7 border-t" />

        <div className="rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-500">
          实际付款金额以结账页面显示的
          MXN 金额为准。
        </div>

        <a
          href="#cetes-overview"
          className="mt-6 flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-5 py-5 transition hover:border-blue-300 hover:bg-blue-100"
        >
          <div>
            <p className="font-semibold text-blue-950">
              想要了解详情？
            </p>

            <p className="mt-1 text-sm text-blue-700">
              请阅读以下服务内容与操作说明
            </p>
          </div>

          <span
            aria-hidden="true"
            className="text-3xl leading-none text-blue-600"
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
  className="border-b bg-gray-50"
>
  <div className="mx-auto max-w-6xl px-6 py-16">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-blue-700">
        PRODUCT OVERVIEW
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        CETES、BONOS、BONDDIA 一页看懂
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        先分清三种产品是什么、主要用于什么。
        更详细的收益方式、购买流程、账户操作与风险，
        会在正式咨询中结合实际页面说明。
      </p>
    </div>

    <div className="mt-10 overflow-hidden rounded-2xl border bg-white">
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
            className="grid gap-4 border-b px-6 py-6 last:border-b-0 md:grid-cols-[180px_1fr_1fr] md:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 md:hidden">
                产品
              </p>

              <p className="mt-1 text-xl font-bold text-gray-950 md:mt-0">
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
    Current Rates
===================================== */}

<section className="border-b bg-white">
  <div className="mx-auto max-w-6xl px-6 py-16">
    <div className="max-w-4xl">
      <p className="text-sm font-semibold text-blue-700">
        OFFICIAL REFERENCE DATA
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        最新参考年化收益率
        <span className="mt-2 block text-base font-medium text-gray-500 md:inline md:ml-3">
          （供参考，以官方实际利率为主）
        </span>
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        页面优先从 Cetesdirecto 官方公开数据读取最新参考收益率。
        官方数据、开放期限和实际成交条件可能随时间变化，
        以下数据不代表未来收益，也不构成收益保证。
      </p>
    </div>

    {displayedRates.length >
    0 ? (
      <>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedRates.map(
            item => (
              <div
                key={
                  item.id
                }
                className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-950">
                    {item.product ===
                    "CETES"
                      ? "短期国债"
                      : item.product ===
                          "BONOS"
                        ? "长期国债"
                        : "流动性基金"}
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-500">
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

                <p className="mt-5 text-4xl font-bold tracking-tight text-gray-950">
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

<section className="border-b bg-white">
  <div className="mx-auto max-w-6xl px-6 py-16">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold text-blue-700">
        CONSULTATION VALUE
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        不只是告诉您“去哪里点”
      </h2>

      <p className="mt-4 leading-7 text-gray-600">
        整套咨询围绕实际 Cetesdirecto
        使用过程设计，
        从建立产品概念到完成真实账户和资金操作，
        帮助您最终能够自己继续使用平台。
      </p>
    </div>

    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          value:
            "端到端",

          title:
            "中文详细咨询课件",

          text:
            "从产品理解、开户到实际资金操作，按完整流程逐步讲解。",
        },

        {
          value:
            "7 大",

          title:
            "实操环节",

          text:
            "开户、入金、e.firma、购买、出金、账户记录及官方 App。",
        },

        {
          value:
            "Web + App",

          title:
            "真实操作页面",

          text:
            "结合 Cetesdirecto 实际页面进行中文讲解，而不是只提供文字说明。",
        },

        {
          value:
            service.accessDurationDays
              ? `${service.accessDurationDays} 天`
              : "持续",

          title:
            "后续问题跟进",

          text:
            "如因银行、身份验证或系统状态无法当场完成，可在服务期限内继续跟进。",
        },
      ].map(
        item => (
          <div
            key={
              item.title
            }
            className="rounded-2xl border bg-gray-50 p-6"
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
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">
              CONSULTATION SERVICE
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              咨询服务包含什么？
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              从了解 Cetesdirecto 到实际操作，
              我们会通过中文线上咨询，
              指导您理解产品与平台，并完成开户、账户设置、
              e.firma 升级流程说明、国债购买操作、
              首次入金、首次出金以及账户记录检查。
            </p>

            <p className="mt-3 leading-7 text-gray-600">
              所有账户登录、密码输入、e.firma、
              银行操作、资金操作及投资决定，
              始终由您本人完成。
            </p>
          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* =================================
                01 Products
            ================================= */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-700">
                01
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                产品与平台说明
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                帮助您理解 CETES、BONOS、BONDDIA
                的基本区别，以及 Cetesdirecto
                平台的基本运作方式。
              </p>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                同时说明哪些国债需要等待
                拍卖（Subasta），
                以及与 BONDDIA 等资金使用方式的区别。
              </p>
            </div>


            {/* =================================
                02 Account Opening
            ================================= */}

            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                02
              </div>

              <div className="mt-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                重点服务
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-950">
                Cetesdirecto 开户指导
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                指导您理解 Cetesdirecto
                开户条件、注册步骤以及
                账户基本设置流程。
              </p>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                包括 RFC、CURP、
                银行账户及 CLABE
                等相关信息在开户流程中的作用。
              </p>
            </div>


            {/* =================================
                03 Account Level / e.firma
            ================================= */}

            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                03
              </div>

              <div className="mt-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                重点服务
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-950">
                账户等级与 e.firma 升级指导
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                帮助您理解 Cetesdirecto
                不同账户等级与资金操作额度，
                以及通过 e.firma
                提升账户能力的基本流程。
              </p>

              <p className="mt-4 text-sm font-medium leading-6 text-blue-900">
                如果未来希望投入更高规模的资金，
                我们会说明相应的账户升级方式与注意事项。
              </p>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                e.firma 的 .cer、.key
                文件及私钥密码始终由客户本人保管和操作，
                平台不会收取或保存。
              </p>
            </div>

            {/* =================================
                04 Auction
            ================================= */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 font-bold text-purple-700">
                04
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                国债购买与拍卖操作
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
              通过真实 Web 与 App 页面，
                说明 Invertir、产品与期限选择、
                Subasta（拍卖）、金额、资金来源以及
                购买指令确认的完整操作流程。
              </p>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                我们说明购买流程和操作规则，
                但不会推荐具体产品、期限、
                金额或买入时点。
              </p>
            </div>


          {/* =================================
              05 Deposit
          ================================= */}

          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              05
            </div>

            <div className="mt-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
              重点服务
            </div>

            <h3 className="mt-3 text-lg font-semibold text-gray-950">
              首次入金指导
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              指导您了解如何从本人墨西哥银行账户
              向 Cetesdirecto 转入资金，
              并确认资金进入账户后的基本状态。
            </p>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              转账金额以及所有银行操作
              均由您本人决定和执行。
            </p>
          </div>


            {/* =================================
                06 Withdrawal
            ================================= */}

            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                06
              </div>

              <div className="mt-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                重点服务
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-950">
                首次出金测试
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                指导您完成首次出金测试，
                帮助确认您已经了解
                Cetesdirecto 的基本资金进出流程。
              </p>

              <p className="mt-4 text-xs leading-5 text-gray-500">
                实际出金金额和所有账户操作
                均由您本人完成。
              </p>
            </div>
          </div>


          {/* =====================================
              Consultation Flow
          ===================================== */}

          <div className="mt-10 overflow-hidden rounded-2xl border border-blue-200 bg-white">
            <div className="border-b border-blue-100 bg-blue-50 px-6 py-5">
              <p className="text-sm font-semibold text-blue-700">
                一次咨询，尽量完成完整闭环
              </p>

              <h3 className="mt-1 text-xl font-semibold text-blue-950">
                标准目标：第一次咨询完成主要操作
              </h3>
            </div>


            <div className="grid gap-0 md:grid-cols-3">
              <div className="border-b p-6 md:border-b-0 md:border-r">
                <div className="text-2xl font-bold text-blue-700">
                  ①
                </div>

                <p className="mt-3 font-semibold">
                  开户与账户设置
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  完成 Cetesdirecto
                  基础开户，并根据实际情况说明
                  账户等级及 e.firma 升级方式。
                </p>
              </div>


              <div className="border-b p-6 md:border-b-0 md:border-r">
                <div className="text-2xl font-bold text-blue-700">
                  ②
                </div>

                <p className="mt-3 font-semibold">
                  首次入金
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  由客户本人完成银行操作，
                  并确认资金正确进入
                  Cetesdirecto 账户。
                </p>
              </div>


              <div className="p-6">
                <div className="text-2xl font-bold text-blue-700">
                  ③
                </div>

                <p className="mt-3 font-semibold">
                  首次出金测试
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  完成一次基础出金测试，
                  确认您已经掌握基本资金进出流程。
                </p>
              </div>
            </div>
          </div>


          {/* =====================================
              Follow-up Window
          ===================================== */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold">
              如果当天无法全部完成怎么办？
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              本服务目标是在第一次线上咨询中
              尽可能完成主要操作流程。
              如果因为银行处理、身份验证、
              e.firma、Cetesdirecto 系统状态
              或其他外部条件无法当场完成，
              可在服务有效期内继续通过订单服务空间跟进。
            </p>


            {service.accessDurationDays && (
              <p className="mt-3 text-sm font-medium text-gray-900">
                最长跟进期限：
                {" "}
                {service.accessDurationDays}
                {" "}
                个日历日
              </p>
            )}


            {service.completionMilestones.length >
              0 && (
              <>
                <p className="mt-5 text-sm font-medium text-gray-900">
                  本次服务的主要完成目标：
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {service.completionMilestones.map(
                    milestone => (
                      <span
                        key={
                          milestone.key
                        }
                        className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700"
                      >
                        ✓{" "}
                        {
                          milestone.label
                        }
                      </span>
                    )
                  )}
                </div>
              </>
            )}


            <p className="mt-4 text-xs leading-5 text-gray-500">
              账户等级升级属于咨询与操作指导内容，
              是否需要升级以及是否能够当场完成，
              取决于客户实际账户状态、
              e.firma 状态及 Cetesdirecto
              当时适用的系统与官方要求。
            </p>

            <p className="mt-2 text-xs leading-5 text-gray-500">
              服务完成是指本次中文咨询与操作指导完成，
              不代表平台代您购买、出售
              或管理任何投资产品。
            </p>
          </div>
        </div>
      </section>


      {/* =====================================
    Course Preview
===================================== */}

<section className="border-b bg-gray-950 text-white">
  <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-blue-300">
        CONSULTATION MATERIAL
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        实际咨询课件预览
      </h2>

      <p className="mt-4 leading-7 text-gray-400">
        咨询过程中会结合整理后的中文课件和
        Cetesdirecto 实际页面进行讲解。
        以下仅展示部分课件版式，
        正文内容已模糊处理。
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {coursePreviews.map(
        item => (
          <div
            key={
              item.id
            }
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
          >
            {/* Screenshot */}

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
                <div className="rounded-full border border-white/20 bg-black/45 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                  🔒 咨询课件预览
                </div>
              </div>

              <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-semibold text-gray-200 backdrop-blur">
                {
                  item.number
                }
              </div>
            </div>

            {/* Description */}

            <div className="p-6">
              <h3 className="text-xl font-semibold">
                {
                  item.title
                }
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {
                  item.description
                }
              </p>
            </div>
          </div>
        )
      )}
    </div>

    <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm leading-6 text-gray-400">
      实际咨询由顾问在线结合课件进行讲解。
      页面预览仅用于展示课程结构和内容深度。
    </div>
  </div>
</section>

      {/* =====================================
          Service Boundaries
      ===================================== */}

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-sm font-semibold text-red-300">
            服务边界
          </div>

          <h2 className="mt-3 text-3xl font-bold text-red-300">
            我们不会替您做什么
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-gray-300">
            以下事项始终由客户本人决定和操作。
          </p>


          <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                  className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm leading-6 text-gray-200"
                >
                  <span className="mr-2 font-bold text-red-300">
                    ×
                  </span>

                  {
                    item
                  }
                </div>
              )
            )}
          </div>
        </div>
      </section>


      {/* =====================================
          Risk
      ===================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-amber-700">
              BEFORE YOU START
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              购买前需要了解的风险
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              国债并不代表没有风险。
              在决定是否使用 Cetesdirecto
              或购买任何产品之前，
              您应自行理解以下主要风险。
            </p>
          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              [
                "汇率风险",
                "如果您的资产或未来用途不是墨西哥比索，MXN 汇率变化可能显著影响换算后的实际收益。",
              ],

              [
                "利率与市场价格风险",
                "市场利率变化可能影响国债的市场价格，以及提前出售时可能取得的价格。",
              ],

              [
                "流动性风险",
                "提前需要资金时，可用方式、价格和到账时间可能与持有至到期不同。",
              ],

              [
                "税务风险",
                "税务处理取决于您的税务身份和当时适用规则，不应只根据名义收益率判断最终净收益。",
              ],

              [
                "操作风险",
                "银行账户、CLABE、身份资料、e.firma 或账户配置问题可能导致开户、入金、升级或出金受阻。",
              ],

              [
                "规则变化",
                "Cetesdirecto、金融机构、税务机关或政府相关规则与办理要求可能发生调整。",
              ],
            ].map(
              (
                [
                  title,
                  text,
                ]
              ) => (
                <div
                  key={
                    title
                  }
                  className="rounded-2xl border p-5"
                >
                  <h3 className="font-semibold">
                    {
                      title
                    }
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {
                      text
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>


      {/* =====================================
          Purchase
      ===================================== */}

      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="text-center">
            <p className="text-sm font-semibold text-blue-700">
              开始办理
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              先确认您符合办理条件
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              我们不会要求您在付款前提交 RFC
              号码、CLABE 号码、e.firma 文件
              或任何账户与银行密码。
              您只需要确认自己是否具备必要条件。
            </p>
          </div>


          <div className="mt-10 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
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


          <ContactButton
            serviceName={
              service.title
            }
          />
        </div>
      </section>
    </main>
  );
}
