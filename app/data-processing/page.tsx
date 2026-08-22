import type {
    Metadata,
  } from "next";
  
  import PublicShell from "@/components/layout/PublicShell";
  import LegalPage from "@/components/legal/LegalPage";
  
  
  export const metadata:
    Metadata = {
      title:
        "数据处理说明 | Lativia",
  
      description:
        "了解 Lativia 在订单和办理流程中如何使用、保存及删除业务数据。",
    };
  
  
  export default function DataProcessingPage() {
    return (
      <PublicShell>
        <LegalPage
          eyebrow="隐私与安全"
          title="业务数据处理说明"
          description="本页面进一步说明订单办理过程中业务数据的用途、访问范围和生命周期。"
          updatedAt="2026年8月22日"
          sections={[
            {
              id: "principles",
              title: "1. 数据最小化原则",
              content: (
                <p>
                  每项服务只应处理完成该项业务合理所需的信息，
                  不应为了未来可能使用而无目的扩大收集范围。
                </p>
              ),
            },
            {
              id: "processing",
              title: "2. 办理期间",
              content: (
                <p>
                  当订单仍在处理中，
                  与该业务直接相关的信息可以在完成服务所必要的期间使用和保存。
                </p>
              ),
            },
            {
              id: "countdown",
              title: "3. 目的结束后的 48 小时删除机制",
              content: (
                <>
                  <p>
                    当信息不再用于当前服务、
                    订单完成或对应业务处理目的已经结束后，
                    临时业务数据进入删除倒计时。
                  </p>
  
                  <p>
                    默认目标为在目的结束后 48 小时内完成清理，
                    除非特定服务存在合理且明确的不同保存要求。
                  </p>
                </>
              ),
            },
            {
              id: "records",
              title: "4. 不同类型记录",
              content: (
                <>
                  <p>
                    临时业务数据与付款、
                    审计、同意、争议处理及法律记录并不相同。
                  </p>
  
                  <p>
                    后者可能因为财务、
                    法律、安全和平台审计需要而保存更长时间。
                  </p>
                </>
              ),
            },
            {
              id: "access",
              title: "5. 访问权限",
              content: (
                <p>
                  与具体订单相关的信息应仅向完成相应工作所必要的授权人员开放，
                  并按照其工作职责限制访问范围。
                </p>
              ),
            },
            {
              id: "credentials",
              title: "6. 禁止收集的认证信息",
              content: (
                <p>
                  平台不应要求用户提供账户密码、
                  OTP、CVV、安全 Token、
                  e.firma 私钥密码等可直接控制账户或身份认证的敏感凭证。
                </p>
              ),
            },
            {
              id: "completion",
              title: "7. 服务结果",
              content: (
                <p>
                  只有在政府机构或相关正式机构实际签发、
                  提供结果时，平台才会将其描述为官方文件或官方结果。
                </p>
              ),
            },
            {
              id: "support",
              title: "8. 数据相关问题",
              content: (
                <p>
                  与订单数据、删除或账户资料相关的问题，
                  请通过帮助中心公布的官方客服渠道联系 Lativia。
                </p>
              ),
            },
          ]}
        />
      </PublicShell>
    );
  }