import type {
    ReconciliationIssueType,
  } from "@/types/paymentReconciliation";
  
  interface Props {
    type: ReconciliationIssueType;
  }
  
  const labels:
    Record<
      ReconciliationIssueType,
      string
    > = {
    missing_transaction:
      "缺少交易纪录",
  
    payment_status_mismatch:
      "付款状态不一致",
  
    amount_mismatch:
      "金额不一致",
  
    currency_mismatch:
      "币种不一致",
  };
  
  export default function ReconciliationBadge({
    type,
  }: Props) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
        {labels[type]}
      </span>
    );
  }