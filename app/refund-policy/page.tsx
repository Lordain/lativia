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
          updatedAt="2026年8月22日"
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
              id: "review",
              title: "5. 人工审核",
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
              title: "6. 咨询类服务",
              content: (
                <p>
                  咨询类服务的退款资格会结合服务是否已经提供、
                  咨询内容是否已经交付以及争议原因进行判断。
                </p>
              ),
            },
            {
                id: "process",
                title: "7. 退款流程与到账时间",
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