import type {
    OrderResult,
  } from "@/types/result";
  
  
  interface Props {
    results:
      OrderResult[];
  }
  
  
  function formatDateTime(
    value:
      string | null
  ) {
    if (!value) {
      return "—";
    }
  
  
    return new Date(
      value
    ).toLocaleString();
  }
  
  
  export default function CustomerOrderResult({
    results,
  }: Props) {
    const deliveredResult =
      results.find(
        item =>
          item.status ===
          "delivered"
      ) ??
      null;
  
  
    if (!deliveredResult) {
      return (
        <div>
          <h3 className="text-lg font-semibold">
            服务结果
          </h3>
  
          <div className="mt-3 rounded-xl border border-dashed p-4">
            <p className="text-sm text-gray-500">
              当前尚未交付最终服务结果。
            </p>
          </div>
        </div>
      );
    }
  
  
    return (
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              {
                deliveredResult
                  .resultIsOfficial
                  ? "官方结果"
                  : "服务完成记录"
              }
            </p>
  
            <h3 className="mt-1 text-xl font-semibold">
              {
                deliveredResult.title
              }
            </h3>
          </div>
  
  
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            已交付
          </span>
        </div>
  
  
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
            {
              deliveredResult.summary
            }
          </p>
  
  
          <p className="mt-4 text-xs text-gray-500">
            交付时间：
            {
              formatDateTime(
                deliveredResult
                  .deliveredAt
              )
            }
          </p>
        </div>
  
  
        {!deliveredResult
          .resultIsOfficial && (
          <p className="mt-3 text-xs leading-5 text-gray-500">
            此内容为平台服务完成与交付记录，
            不代表政府或官方机构签发的官方文件。
          </p>
        )}
      </div>
    );
  }