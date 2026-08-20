import type {
    DataCleanupStatus,
  } from "@/types/order";
  
  
  interface CustomerDataRetentionStatusProps {
    status:
      DataCleanupStatus;
  
    cleanupDueAt:
      string | null;
  
    cleanedAt:
      string | null;
  }
  
  
  function formatDateTime(
    value:
      string | null
  ) {
    if (!value) {
      return null;
    }
  
  
    return new Intl.DateTimeFormat(
      "zh-CN",
      {
        timeZone:
          "America/Mexico_City",
  
        year:
          "numeric",
  
        month:
          "2-digit",
  
        day:
          "2-digit",
  
        hour:
          "2-digit",
  
        minute:
          "2-digit",
      }
    ).format(
      new Date(value)
    );
  }
  
  
  export function CustomerDataRetentionStatus({
    status,
    cleanupDueAt,
    cleanedAt,
  }: CustomerDataRetentionStatusProps) {
  
    const cleanupDue =
      formatDateTime(
        cleanupDueAt
      );
  
  
    const cleaned =
      formatDateTime(
        cleanedAt
      );
  
  
    let title =
      "办理资料保护";
  
  
    let description =
      "办理本服务所需的临时业务资料仅在服务处理期间按需保留。";
  
  
    if (
      status ===
        "scheduled" ||
      status ===
        "processing"
    ) {
      description =
        cleanupDue
          ? `本次服务已经结束，办理过程中使用的临时业务资料预计将在 ${cleanupDue} 后进入自动清理。`
          : "本次服务已经结束，办理过程中使用的临时业务资料将按资料保留规则自动清理.";
    }
  
  
    if (
      status ===
      "completed"
    ) {
      description =
        cleaned
          ? `本次办理所需的临时业务资料已于 ${cleaned} 完成清理。`
          : "本次办理所需的临时业务资料已经完成清理。";
    }
  
  
    if (
      status ===
      "failed"
    ) {
      /*
       * Customer should not see
       * internal failure details.
       */
      description =
        "本次服务的临时业务资料正在进行系统清理处理。";
    }
  
  
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            ✓
          </div>
  
          <div>
            <h2 className="font-semibold text-slate-900">
              {title}
            </h2>
  
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {description}
            </p>
  
            <p className="mt-2 text-xs leading-5 text-slate-500">
              订单、付款、服务状态及必要的交易与审计记录不属于此临时资料清理范围。
            </p>
          </div>
        </div>
      </section>
    );
  }