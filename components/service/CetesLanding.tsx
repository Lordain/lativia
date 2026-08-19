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


export default function CetesLanding({
  service,
  prices,
  rates,
}: Props) {
  const sourceDate =
    rates[0]
      ?.sourceDate ??
    null;


  const activePrices =
    prices.filter(
      price =>
        price.active
    );


  const primaryPrice =
    activePrices[0] ??
    null;


  const displayAmount =
    primaryPrice
      ? new Intl.NumberFormat(
          "es-MX",
          {
            style:
              "currency",

            currency:
              primaryPrice.currency,

            minimumFractionDigits:
              0,

            maximumFractionDigits:
              0,
          }
        ).format(
          Number(
            primaryPrice.amount
          )
        )
      : service.price;


  return (
    <main>
      {/* =====================================
          Hero
      ===================================== */}

      <section className="border-b bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-5xl">
            <div className="mb-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              Cetesdirecto 中文操作咨询
            </div>


            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 md:whitespace-nowrap md:text-5xl lg:text-6xl">
              墨西哥国债开户与操作咨询
            </h1>


            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
              用中文了解 CETES、BONOS、BONDDIA，
              并指导您完成 Cetesdirecto 开户、账户升级、
              首次入金与首次出金测试。
              账户、资金及投资决定始终由您本人管理。
            </p>


            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="text-3xl font-bold text-gray-950">
                {displayAmount}
              </div>

              <div className="text-sm text-gray-500">
                一次性中文线上咨询服务
              </div>
            </div>


            <div className="mt-8 max-w-4xl rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
              <p className="font-semibold text-amber-900">
                ⚠ 重要安全说明
              </p>

              <p className="mt-2 text-sm leading-7 text-amber-800">
                本服务仅提供操作流程咨询与中文指导，
                不提供投资建议，不推荐具体投资产品、
                期限、金额或买卖时点。
              </p>

              <p className="mt-3 font-semibold leading-7 text-amber-950">
                不代客户登录或操作账户，
                也不接触、接收或保管客户资金、
                账户密码、银行密码、验证码、
                OTP、Token、CVV 或其他安全凭证。
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================
          Current Rates
      ===================================== */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              BANXICO OFFICIAL DATA
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              最新 CETES 参考收益率
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              以下为 Banco de México
              公布的政府证券拍卖参考数据。
              所显示的是年化收益率参考值，
              不代表未来收益，也不构成收益保证。
            </p>
          </div>


          {rates.length >
          0 ? (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {rates.map(
                  item => (
                    <div
                      key={
                        item.id
                      }
                      className="rounded-2xl border bg-gray-50 p-5"
                    >
                      <p className="text-sm font-medium text-gray-500">
                        CETES
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {
                          item.termDays
                        } 天
                      </p>

                      <p className="mt-4 text-4xl font-bold tracking-tight text-gray-950">
                        {
                          item.rate.toFixed(
                            2
                          )
                        }
                        %
                      </p>

                      <p className="mt-2 text-xs text-gray-500">
                        年化参考收益率
                      </p>
                    </div>
                  )
                )}
              </div>


              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-5 text-gray-500">
                <span>
                  来源：
                  {
                    rates[0]
                      ?.sourceName
                  }
                </span>

                {sourceDate && (
                  <span>
                    数据日期：
                    {
                      formatDate(
                        sourceDate
                      )
                    }
                  </span>
                )}

                <span>
                  实际购买条件与最终成交收益率可能不同。
                </span>
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-medium text-amber-900">
                当前参考收益率暂时无法读取
              </p>

              <p className="mt-1 text-sm text-amber-800">
                收益率展示不会影响咨询服务本身。
                请以 Banco de México
                或 Cetesdirecto 最新官方信息为准。
              </p>
            </div>
          )}
        </div>
      </section>


      {/* =====================================
          CETES
      ===================================== */}

      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-700">
                CETES
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                CETES 是什么？
              </h2>

              <p className="mt-5 leading-7 text-gray-600">
                CETES 全称 Certificados
                de la Tesorería de la
                Federación，是墨西哥联邦政府发行的
                短期政府证券。
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                CETES 通常以低于面值的价格购买，
                到期按照面值兑付。
                投资者取得的差额构成其收益。
              </p>
            </div>


            <div className="rounded-2xl border bg-white p-6">
              <h3 className="text-xl font-semibold">
                常见期限
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  "28 天",
                  "91 天",
                  "182 天",
                  "364 天",
                ].map(
                  item => (
                    <div
                      key={
                        item
                      }
                      className="rounded-xl bg-gray-50 p-4 text-center font-medium"
                    >
                      {
                        item
                      }
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================
          CETESDIRECTO PRODUCTS
      ===================================== */}

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-blue-700">
              CETESDIRECTO PRODUCTS
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Cetesdirecto 不只有 CETES
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Cetesdirecto 可用于持有不同类型的
              墨西哥政府债务工具。
              本咨询服务帮助您理解这些产品的基本区别、
              收益方式与平台操作逻辑，
              但不会根据您的情况推荐具体产品。
            </p>
          </div>


          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* CETES */}

            <div className="rounded-2xl border p-6">
              <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                短期政府证券
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                CETES
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                墨西哥联邦政府发行的短期政府证券，
                通常以折价方式购买，
                到期按面值兑付。
              </p>

              <p className="mt-4 text-sm font-medium text-gray-900">
                常见期限：28、91、182、364 天
              </p>
            </div>


            {/* BONOS */}

            <div className="rounded-2xl border p-6">
              <div className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                中长期政府债券
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                BONOS
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                墨西哥联邦政府发行的中长期固定利率债券，
                与短期 CETES 相比，
                通常具有更长的期限。
              </p>

              <p className="mt-4 text-sm font-medium text-gray-900">
                用于了解中长期政府债券的基本运作方式
              </p>
            </div>


            {/* BONDDIA */}

            <div className="rounded-2xl border p-6">
              <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                每日流动性基金
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                BONDDIA
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                BONDDIA 并不是一张长期国债，
                而是主要投资政府债务工具的
                每日流动性基金。
              </p>

              <p className="mt-4 text-sm font-medium text-gray-900">
                主要特点：较高的日常资金流动性
              </p>
            </div>
          </div>


          <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
            以上内容仅用于帮助理解产品类型和平台操作，
            不构成对 CETES、BONOS、BONDDIA
            或任何投资产品的推荐。
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
              指导您完成开户、账户设置以及基本资金进出流程。
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
                同时说明哪些政府证券需要等待
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
                购买流程与拍卖机制说明
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                帮助您理解政府证券购买指令、
                一级市场拍卖（Subasta）
                以及 Cetesdirecto
                执行购买指令的基本逻辑。
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
              政府证券并不代表没有风险。
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
                "市场利率变化可能影响政府证券的市场价格，以及提前出售时可能取得的价格。",
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