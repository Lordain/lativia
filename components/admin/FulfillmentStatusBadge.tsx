import type {
    FulfillmentStatus,
  } from "@/types/fulfillment";
  
  interface Props {
    status:
      FulfillmentStatus;
  }
  
  const config:
    Record<
      FulfillmentStatus,
      {
        label:
          string;
  
        className:
          string;
      }
    > = {
    queued: {
      label:
        "等待开始",
  
      className:
        "bg-gray-100 text-gray-700",
    },
  
    validating: {
      label:
        "资料检查中",
  
      className:
        "bg-blue-100 text-blue-700",
    },
  
    processing: {
      label:
        "办理中",
  
      className:
        "bg-indigo-100 text-indigo-700",
    },
  
    waiting_human: {
      label:
        "等待人工处理",
  
      className:
        "bg-amber-100 text-amber-800",
    },
  
    waiting_customer: {
      label:
        "等待客户补充",
  
      className:
        "bg-orange-100 text-orange-800",
    },
  
    manual_review: {
      label:
        "人工复核",
  
      className:
        "bg-purple-100 text-purple-700",
    },
  
    completed: {
      label:
        "已完成",
  
      className:
        "bg-green-100 text-green-700",
    },
  
    failed: {
      label:
        "无法完成",
  
      className:
        "bg-red-100 text-red-700",
    },
  
    refund_review: {
      label:
        "退款审核中",
  
      className:
        "bg-yellow-100 text-yellow-800",
    },
  };
  
  export default function FulfillmentStatusBadge({
    status,
  }: Props) {
    const item =
      config[
        status
      ];
  
    return (
      <span
        className={`
          inline-flex
          rounded-full
          px-3
          py-1
          text-sm
          font-medium
          ${item.className}
        `}
      >
        {item.label}
      </span>
    );
  }