import type { OrderStatus } from "@/types/order";

export function getStatusText(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "等待处理";

    case "processing":
      return "办理中";

      case "waiting_customer":
        return "等待客户处理";

    case "completed":
      return "已完成";

    case "cancelled":
      return "已取消";
  }
}