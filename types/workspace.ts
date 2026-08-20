import type {
  OrderResult,
} from "@/types/result";

export type OrderWorkspaceStatus =
  | "active"
  | "completed"
  | "expired"
  | "cancelled";


export type OrderMilestoneStatus =
  | "pending"
  | "completed";


  export type WorkspaceMessageSenderType =
  | "admin"
  | "customer"
  | "system";

  export type WorkspaceMessageKind =
  | "message"
  | "welcome";

/*
 * =========================================
 * Order Workspace
 * =========================================
 */

export interface OrderWorkspace {
  id:
    string;

  orderId:
    string;

  serviceId:
    string;

  userId:
    string;

  status:
    OrderWorkspaceStatus;

  startedAt:
    string | null;

  expiresAt:
    string | null;

  completedAt:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
}


/*
 * =========================================
 * Order Milestone
 * =========================================
 */

export interface OrderMilestone {
  id:
    string;

  workspaceId:
    string;

  orderId:
    string;

  milestoneKey:
    string;

  label:
    string;

  required:
    boolean;

  status:
    OrderMilestoneStatus;

  completedAt:
    string | null;

  completedBy:
    string | null;

  createdAt:
    string;

  updatedAt:
    string;
}


/*
 * =========================================
 * Workspace Message
 * =========================================
 */

export interface WorkspaceMessage {
  id:
    string;

  workspaceId:
    string;

  orderId:
    string;

  senderType:
    WorkspaceMessageSenderType;

  senderUserId:
    string | null;

  message:
    string;

  createdAt:
    string;

  editedAt:
    string | null;

  deletedAt:
    string | null;

  deletedBy:
    string | null;

  messageKind:
    WorkspaceMessageKind;
}

export interface WorkspaceMessageRevision {
  id:
    string;

  messageId:
    string;

  workspaceId:
    string;

  orderId:
    string;

  editedBy:
    string;

  editorType:
    "admin" | "customer";

  previousMessage:
    string;

  newMessage:
    string;

  createdAt:
    string;
}


/*
 * =========================================
 * Workspace Aggregate
 *
 * 客户订单页面以后一次读取这一组资料。
 * =========================================
 */

export interface OrderWorkspaceData {
  workspace:
    OrderWorkspace;

  milestones:
    OrderMilestone[];

  messages:
    WorkspaceMessage[];

  results:
    OrderResult[];
}