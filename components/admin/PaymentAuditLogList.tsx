interface AuditLog {
    id: string;
  
    action: string;
  
    provider:
      | string
      | null;
  
    result: string;
  
    message:
      | string
      | null;
  
    metadata:
      | Record<string, unknown>
      | null;
  
    created_at: string;
  }
  
  interface Props {
    logs: AuditLog[];
  }
  
  function getActionLabel(
    action: string
  ) {
    switch (action) {
      case "reverify":
        return "重新验证";
  
      case "repair":
        return "安全修复";
  
      default:
        return action;
    }
  }
  
  function getResultLabel(
    result: string
  ) {
    switch (result) {
      case "success":
        return "成功";
  
      case "blocked":
        return "已阻止";
  
      case "failed":
        return "失败";
  
      default:
        return result;
    }
  }
  
  function getResultClassName(
    result: string
  ) {
    switch (result) {
      case "success":
        return "bg-green-100 text-green-700";
  
      case "blocked":
        return "bg-yellow-100 text-yellow-700";
  
      case "failed":
        return "bg-red-100 text-red-700";
  
      default:
        return "bg-gray-100 text-gray-700";
    }
  }
  
  export default function PaymentAuditLogList({
    logs,
  }: Props) {
    if (logs.length === 0) {
      return (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            支付审计记录
          </h2>
  
          <p className="mt-4 text-sm text-gray-500">
            当前没有支付审计记录。
          </p>
        </section>
      );
    }
  
    return (
      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          支付审计记录
        </h2>
  
        <div className="mt-4 space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {getActionLabel(
                      log.action
                    )}
                  </p>
  
                  {log.provider && (
                    <p className="mt-1 text-sm text-gray-500">
                      支付平台：
                      {log.provider}
                    </p>
                  )}
                </div>
  
                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-sm
                    font-medium
                    ${getResultClassName(
                      log.result
                    )}
                  `}
                >
                  {getResultLabel(
                    log.result
                  )}
                </span>
              </div>
  
              {log.message && (
                <p className="mt-4 text-sm">
                  {log.message}
                </p>
              )}
  
              <p className="mt-4 text-sm text-gray-500">
                操作时间：
                {new Date(
                  log.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }