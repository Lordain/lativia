import type {
    DataCleanupStatus,
  } from "@/types/order";
  
  
  interface AdminDataCleanupStatusProps {
    status:
      DataCleanupStatus;
  
    purposeEndedAt:
      string | null;
  
    cleanupDueAt:
      string | null;
  
    cleanedAt:
      string | null;
  
    lastError:
      string | null;
  }
  
  
  function formatDateTime(
    value:
      string | null
  ) {
    if (!value) {
      return "—";
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
  
        second:
          "2-digit",
      }
    ).format(
      new Date(value)
    );
  }
  
  
  function getStatusLabel(
    status:
      DataCleanupStatus
  ) {
    switch (
      status
    ) {
      case "not_scheduled":
        return "尚未进入清理周期";
  
      case "scheduled":
        return "已安排";
  
      case "processing":
        return "清理中";
  
      case "completed":
        return "已完成";
  
      case "failed":
        return "清理失败";
    }
  }
  
  
  export function AdminDataCleanupStatus({
    status,
    purposeEndedAt,
    cleanupDueAt,
    cleanedAt,
    lastError,
  }: AdminDataCleanupStatusProps) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">
            临时资料生命周期
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            服务处理中使用的临时业务资料清理状态。
          </p>
        </div>
  
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">
              状态
            </dt>
  
            <dd className="mt-1 font-medium text-slate-900">
              {getStatusLabel(
                status
              )}
            </dd>
          </div>
  
          <div>
            <dt className="text-slate-500">
              服务目的结束
            </dt>
  
            <dd className="mt-1 text-slate-900">
              {formatDateTime(
                purposeEndedAt
              )}
            </dd>
          </div>
  
          <div>
            <dt className="text-slate-500">
              预计清理
            </dt>
  
            <dd className="mt-1 text-slate-900">
              {formatDateTime(
                cleanupDueAt
              )}
            </dd>
          </div>
  
          <div>
            <dt className="text-slate-500">
              实际清理
            </dt>
  
            <dd className="mt-1 text-slate-900">
              {formatDateTime(
                cleanedAt
              )}
            </dd>
          </div>
        </dl>
  
        {status ===
          "failed" &&
          lastError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
              <div className="text-xs font-medium text-red-700">
                Cleanup Error
              </div>
  
              <div className="mt-1 break-words text-xs text-red-600">
                {lastError}
              </div>
            </div>
          )}
      </section>
    );
  }