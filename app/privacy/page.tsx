import type {
    Metadata,
  } from "next";
  
  import PublicShell from "@/components/layout/PublicShell";
  import LegalPage from "@/components/legal/LegalPage";
  
  
  export const metadata:
    Metadata = {
      title:
        "隐私政策 | Lativia",
  
      description:
        "了解 Lativia 如何收集、使用、保存和保护办理服务所需的信息。",
    };
  
  
  export default function PrivacyPage() {
    return (
      <PublicShell>
        <LegalPage
          eyebrow="隐私与安全"
          title="隐私政策"
          description="本政策说明 Lativia 在提供办理协助、咨询、现场陪同及相关平台服务时，如何处理用户信息。"
          updatedAt="2026年8月22日"
          sections={[
            {
              id:
                "scope",
  
              title:
                "1. 适用范围",
  
              content: (
                <>
                  <p>
                    本隐私政策适用于您使用
                    Lativia 网站、账户、订单、
                    办理服务、咨询服务及相关功能时产生的信息处理。
                  </p>
                </>
              ),
            },
            {
              id:
                "collection",
  
              title:
                "2. 我们收集的信息",
  
              content: (
                <>
                  <p>
                    我们仅根据具体服务需要，
                    收集完成办理、确认资格、
                    创建订单、付款、提供支持或履行服务所必需的信息。
                  </p>
  
                  <p>
                    不同服务所需的信息不同，
                    实际要求以对应服务页面和订单流程为准。
                  </p>
                </>
              ),
            },
            {
              id:
                "sensitive",
  
              title:
                "3. 我们不会要求的敏感认证信息",
  
              content: (
                <>
                  <p>
                    请不要通过 Lativia
                    提交银行账户密码、平台登录密码、
                    一次性验证码（OTP）、
                    银行卡 CVV、安全 Token、
                    e.firma 私钥密码或其他用于直接控制账户的认证信息。
                  </p>
  
                  <p>
                    涉及账户登录、银行操作、
                    身份验证及依法必须本人完成的操作，
                    应由用户本人完成。
                  </p>
                </>
              ),
            },
            {
              id:
                "purpose",
  
              title:
                "4. 信息使用目的",
  
              content: (
                <>
                  <p>
                    用户信息可能用于创建和管理订单、
                    确认办理条件、提供服务、
                    处理付款状态、发送办理通知、
                    处理异常情况以及履行法律和合规义务。
                  </p>
                </>
              ),
            },
            {
              id:
                "retention",
  
              title:
                "5. 信息保存与删除",
  
              content: (
                <>
                  <p>
                    对仅用于临时办理目的的业务数据，
                    在服务仍需要使用时可以保留。
                    当相关数据不再需要、
                    订单完成或处理目的结束后，
                    将进入删除流程。
                  </p>
  
                  <p>
                    Lativia 对此类临时业务数据的默认目标是：
                    在处理目的结束后进入
                    48 小时删除倒计时。
                  </p>
  
                  <p>
                    付款记录、同意记录、
                    审计记录及依法需要保留的信息，
                    可能根据法律、财务、
                    安全或争议处理需要保存更长时间。
                  </p>
                </>
              ),
            },
            {
              id:
                "payment",
  
              title:
                "6. 付款信息",
  
              content: (
                <>
                  <p>
                    信用卡及其他支付信息通常由对应支付服务商处理。
                    Lativia 不以保存完整银行卡号、
                    CVV 等敏感支付凭证为服务目标。
                  </p>
                </>
              ),
            },
            {
              id:
                "sharing",
  
              title:
                "7. 信息共享",
  
              content: (
                <>
                  <p>
                    我们不会以出售用户个人信息为业务模式。
                    仅在完成服务、支付处理、
                    法律义务或用户授权所必要的范围内，
                    才可能与相关服务提供方处理必要信息。
                  </p>
                </>
              ),
            },
            {
              id:
                "security",
  
              title:
                "8. 信息安全",
  
              content: (
                <>
                  <p>
                    我们通过访问控制、
                    最小化数据使用和业务流程限制等方式，
                    降低未经授权访问和滥用风险。
                  </p>
  
                  <p>
                    用户也应保护自己的账户密码、
                    验证码及设备安全。
                  </p>
                </>
              ),
            },
            {
              id:
                "rights",
  
              title:
                "9. 用户请求",
  
              content: (
                <>
                  <p>
                    如果您需要了解、
                    更正或处理与账户及服务相关的信息，
                    可通过帮助中心公布的官方支持渠道联系我们。
                  </p>
                </>
              ),
            },
          ]}
        />
      </PublicShell>
    );
  }