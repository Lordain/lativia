import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    getAdminOperationsQueue,
  } from "@/lib/admin/getAdminOperationsQueue";
  
  import OperationsQueueSummary from "@/components/admin/OperationsQueueSummary";
  import OperationsQueueList from "@/components/admin/OperationsQueueList";
  
  export default async function AdminOperationsPage() {
    await requireAdmin();
  
    const operationsQueue =
      await getAdminOperationsQueue();
  
    return (
      <div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Operations Center
          </p>
  
          <h1 className="mt-1 text-3xl font-bold">
            运营待办
          </h1>
  
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
            集中处理自动流程无法继续、
            需要人工判断、等待客户、
            服务失败、退款审核及支付系统异常。
          </p>
        </div>
  
        <OperationsQueueSummary
          counts={
            operationsQueue.counts
          }
        />
  
        <OperationsQueueList
          items={
            operationsQueue.items
          }
        />
      </div>
    );
  }