import type {
    Metadata,
  } from "next";

  import PublicShell from "@/components/layout/PublicShell";
  import LegalPage from "@/components/legal/LegalPage";


  export const metadata:
    Metadata = {
      title:
        "退款政策 | Lativia",
    };


  export default function RefundPolicyPage() {
    return (
      <PublicShell>
        <LegalPage
          eyebrow="服务规则"
          title="退款政策"
          description="本政策说明服务无法继续办理、服务已完成及第三方费用等情况下的基本处理原则。"
          updatedAt="2026年8月25日"
          sections={[
            {
              id: "general",
              title: "1. 基本原则",
              content: (
                <p>
                  退款资格会根据订单状态、
                  已完成的服务内容、无法继续办理的原因及适用规则综合判断。
                </p>
              ),
            },
            {
              id: "completed",
              title: "2. 已完成服务",
              content: (
                <p>
                  已经成功完成并交付的服务，
                  通常不再符合退款条件。
                </p>
              ),
            },
            {
              id: "unable",
              title: "3. 无法继续办理",
              content: (
                <p>
                  如果服务因实际条件、
                  资料要求、政府流程变化或其他原因无法继续，
                  平台可以根据具体情况进入人工退款审核。
                </p>
              ),
            },
            {
              id: "third-party",
              title: "4. 政府及第三方费用",
              content: (
                <p>
                  已经实际支付给政府机关、
                  支付渠道或其他第三方的费用，
                  一般不属于可退还的平台服务费用。
                </p>
              ),
            },

            {
              id: "invoice",
              title: "5. 发票与退款",
              content: (
                <>
                  <p>
                    已退款订单不支持开具墨西哥电子发票（CFDI）。
                  </p>

                  <p>
                    已经开具墨西哥电子发票（CFDI）的订单，
                    不支持退款。
                  </p>
                </>
              ),
            },

            {
              id: "review",
              title: "6. 人工审核",
              content: (
                <p>
                  对资格存在争议、
                  客户在自检后仍被发现缺少关键办理条件，
                  或存在其他特殊情形时，
                  Lativia 可进行人工复核并根据实际情况作出处理决定。
                </p>
              ),
            },
            {
              id: "consultation",
              title: "7. 咨询类服务",
              content: (
                <>
                  <p>
                    咨询、指导、流程说明及操作协助类服务，
                    包括但不限于 Cetesdirecto 开户与操作咨询，
                    原则上不提供退款。
                  </p>

                  <p>
                    此类服务的费用对应平台提供的咨询时间、
                    流程说明、资料整理、操作指导及人工支持。
                    一旦相关服务已经开始提供，
                    或咨询内容已经向客户交付，
                    通常不再接受退款申请。
                  </p>

                  <p>
                    如因特殊情况导致服务实际上无法继续提供，
                    或订单存在重复付款、错误收费、
                    关键办理条件争议等异常情况，
                    Lativia 可根据具体情况进行人工复核，
                    并保留是否批准退款的最终决定权。
                  </p>

                  <p>
                    已经成功完成并交付的咨询类服务，
                    不支持退款。
                  </p>
                </>
              ),
            },
            {
                id: "process",
                title: "8. 退款流程与到账时间",
                content: (
                  <>
                    <p>
                      符合退款审核条件时，
                      流程可能包括资格判断、人工复核、
                      记录处理原因和状态、
                      通过原支付渠道发起退款，
                      以及向客户发送处理结果。
                    </p>

                    <p>
                      Lativia 完成退款审核并向原支付渠道发起退款后，
                      实际退款到账时间还会受到第三方支付平台、
                      发卡机构、银行及相关金融机构处理时间的影响。
                    </p>

                    <p>
                      因此，平台确认“退款已发起”或“退款已处理”
                      并不代表款项会立即显示在客户的银行卡、
                      银行账户或支付账户中。
                      实际到账时间以相关支付平台和银行的最终处理进度为准。
                    </p>
                  </>
                ),
              },
          ]}
        />
      </PublicShell>
    );
  }