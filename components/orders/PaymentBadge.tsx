import type { PaymentStatus } from "@/types/payment";

interface Props {
  status: PaymentStatus;
}

const labels: Record<PaymentStatus, string> = {
  unpaid: "待付款",
  paid: "已付款",
  failed: "付款失败",
  refunded: "已退款",
};

export default function PaymentBadge({
  status,
}: Props) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
      {labels[status]}
    </span>
  );
}