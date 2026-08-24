import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  getAdminOperationsQueue,
} from "@/lib/admin/getAdminOperationsQueue";

import OperationsQueueSummary from "@/components/admin/OperationsQueueSummary";

import OperationsQueueList from "@/components/admin/OperationsQueueList";

import AdminPageHeader from "@/components/admin/AdminPageHeader";


export default async function AdminOperationsPage() {
  await requireAdmin();


  const operationsQueue =
    await getAdminOperationsQueue();


  return (
    <div>
      <AdminPageHeader
        title="运营待办"
        description="集中处理自动流程无法继续、需要人工判断、等待客户、服务失败、退款审核及支付系统异常。"
      />

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