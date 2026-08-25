import type {
    Metadata,
  } from "next";

  import PublicShell from "@/components/layout/PublicShell";
  import LegalPage from "@/components/legal/LegalPage";


  export const metadata:
    Metadata = {
      title:
        "服务条款 | Lativia",
    };


  export default function TermsPage() {
    return (
      <PublicShell>
        <LegalPage
          eyebrow="平台规则"
          title="服务条款"
          description="使用 Lativia 服务前，请了解平台角色、客户责任、政府办理结果以及付款和服务边界。"
          updatedAt="2026年8月25日"
          sections={[
            {
              id: "platform",
              title: "1. 平台角色",
              content: (
                <p>
                  Lativia 提供中文办理协助、
                  流程说明、咨询、预约协助及现场陪同等服务。
                  除非服务页面明确说明，
                  Lativia 不是相关政府机构。
                </p>
              ),
            },
            {
              id: "government",
              title: "2. 政府机关决定",
              content: (
                <p>
                  政府机关是否受理、
                  批准、签发或完成某项程序，
                  由对应机关依据其规则独立决定。
                </p>
              ),
            },
            {
              id: "customer",
              title: "3. 客户责任",
              content: (
                <p>
                  用户应确保提交的信息真实、
                  准确并及时完成需要本人处理的步骤。
                </p>
              ),
            },
            {
              id: "credentials",
              title: "4. 账户与认证安全",
              content: (
                <p>
                  用户不得向平台提交账户密码、
                  OTP、CVV、安全 Token、
                  e.firma 私钥密码等敏感认证凭证。
                </p>
              ),
            },
            {
              id: "payment",
              title: "5. 价格、付款与发票",
              content: (
                <>
                  <p>
                    服务价格以购买时服务页面和付款流程显示的正式价格为准。
                    政府或第三方费用是否包含，
                    以对应服务说明为准。
                  </p>

                  <p>
                    如客户有开票需求，
                    可在付款后通过 Lativia 帮助中心公布的官方客服渠道
                    申请开具墨西哥电子发票（CFDI）。
                    客户应按照适用的墨西哥税务要求，
                    提供真实、准确且完整的开票资料。
                  </p>

                  <p>
                    是否可以开具 CFDI、
                    发票内容、金额及税务处理方式，
                    以实际订单、实际付款情况及适用的墨西哥税务规定为准。
                    已退款订单不支持开具发票；
                    已经开具墨西哥电子发票（CFDI）的订单，
                    不支持退款。
                    Lativia 不提供中国大陆发票，
                    也不提供其他非墨西哥税制下的发票。
                  </p>
                </>
              ),
            },
            {
              id: "investment",
              title: "6. 墨西哥国债咨询",
              content: (
                <>
                  <p>
                    墨西哥国债相关服务提供开户、
                    入金、出金及平台操作流程的中文说明和咨询。
                  </p>

                  <p>
                    Lativia 不代替客户管理账户、
                    操作资金或作出投资决策，
                    也不提供买卖时点、
                    持仓比例或收益保证等投资建议。
                  </p>
                </>
              ),
            },
            {
              id: "refund",
              title: "7. 退款",
              content: (
                <>
                  <p>
                    退款资格、审核条件、处理方式及到账规则，
                    适用 Lativia 当时有效的《退款政策》。
                  </p>

                  <p>
                    咨询、指导、流程说明及操作协助类服务，
                    包括但不限于墨西哥国债及 Cetesdirecto 相关咨询，
                    原则上不提供退款。
                    如存在重复付款、错误收费、
                    关键办理条件争议或其他特殊异常情况，
                    Lativia 可根据具体情况进行人工复核。
                  </p>

                  <p>
                    已经成功完成并交付的服务，
                    不支持退款。
                  </p>
                </>
              ),
            },
            {
              id: "support",
              title: "8. 官方联系渠道",
              content: (
                <p>
                  Lativia 的官方客服邮箱和官方 WhatsApp
                  仅通过帮助中心统一公布。
                  请注意辨别非官方联系方式。
                </p>
              ),
            },
          ]}
        />
      </PublicShell>
    );
  }