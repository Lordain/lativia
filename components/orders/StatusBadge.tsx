import type { OrderStatus } from "@/types/order";
import { getStatusColor } from "@/lib/orders/statusColor";
import { getStatusText } from "@/lib/orders/statusText";

interface Props {
  status: OrderStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      title={status}
        className={`
            inline-flex
            rounded-full
            px-3
            py-1
            text-sm
            font-medium
            ${getStatusColor(status)}
      `}
    >
      {getStatusText(status)}
    </span>
  );
}