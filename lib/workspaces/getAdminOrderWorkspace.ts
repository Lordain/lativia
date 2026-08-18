import {
    requireAdmin,
  } from "@/lib/auth/requireAdmin";
  
  import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    OrderWorkspace,
    OrderMilestone,
    WorkspaceMessage,
    OrderWorkspaceData,
  } from "@/types/workspace";
  
  
  interface WorkspaceRow {
    id:
      string;
  
    order_id:
      string;
  
    service_id:
      string;
  
    user_id:
      string;
  
    status:
      OrderWorkspace["status"];
  
    started_at:
      string | null;
  
    expires_at:
      string | null;
  
    completed_at:
      string | null;
  
    created_at:
      string;
  
    updated_at:
      string;
  }
  
  
  interface MilestoneRow {
    id:
      string;
  
    workspace_id:
      string;
  
    order_id:
      string;
  
    milestone_key:
      string;
  
    label:
      string;
  
    required:
      boolean;
  
    status:
      OrderMilestone["status"];
  
    completed_at:
      string | null;
  
    completed_by:
      string | null;
  
    created_at:
      string;
  
    updated_at:
      string;
  }
  
  
  interface MessageRow {
    id:
      string;
  
    workspace_id:
      string;
  
    order_id:
      string;
  
    sender_type:
      WorkspaceMessage["senderType"];
  
    sender_user_id:
      string | null;
  
    message:
      string;

    message_kind:
      WorkspaceMessage["messageKind"];
  
    created_at:
      string;
  
    edited_at:
      string | null;
  
    deleted_at:
      string | null;
  
    deleted_by:
      string | null;
  }
  
  
  function mapWorkspace(
    row:
      WorkspaceRow
  ): OrderWorkspace {
    return {
      id:
        row.id,
  
      orderId:
        row.order_id,
  
      serviceId:
        row.service_id,
  
      userId:
        row.user_id,
  
      status:
        row.status,
  
      startedAt:
        row.started_at,
  
      expiresAt:
        row.expires_at,
  
      completedAt:
        row.completed_at,
  
      createdAt:
        row.created_at,
  
      updatedAt:
        row.updated_at,
    };
  }
  
  
  function mapMilestone(
    row:
      MilestoneRow
  ): OrderMilestone {
    return {
      id:
        row.id,
  
      workspaceId:
        row.workspace_id,
  
      orderId:
        row.order_id,
  
      milestoneKey:
        row.milestone_key,
  
      label:
        row.label,
  
      required:
        row.required,
  
      status:
        row.status,
  
      completedAt:
        row.completed_at,
  
      completedBy:
        row.completed_by,
  
      createdAt:
        row.created_at,
  
      updatedAt:
        row.updated_at,
    };
  }
  
  
  function mapMessage(
    row:
      MessageRow
  ): WorkspaceMessage {
    return {
      id:
        row.id,
  
      workspaceId:
        row.workspace_id,
  
      orderId:
        row.order_id,
  
      senderType:
        row.sender_type,
  
      senderUserId:
        row.sender_user_id,
  
      message:
        row.message,

      messageKind:
        row.message_kind,
  
      createdAt:
        row.created_at,
  
      editedAt:
        row.edited_at,
  
      deletedAt:
        row.deleted_at,
  
      deletedBy:
        row.deleted_by,
    };
  }
  
  
  export async function getAdminOrderWorkspace(
    orderId:
      string
  ): Promise<
    OrderWorkspaceData | null
  > {
    await requireAdmin();
  
  
    const cleanOrderId =
      orderId.trim();
  
  
    if (!cleanOrderId) {
      return null;
    }
  
  
    const admin =
      createAdminClient();
  
  
    /*
     * =========================================
     * Workspace
     * =========================================
     */
  
    const {
      data:
        workspaceData,
  
      error:
        workspaceError,
    } =
      await admin
        .from(
          "order_workspaces"
        )
        .select(`
          id,
          order_id,
          service_id,
          user_id,
          status,
          started_at,
          expires_at,
          completed_at,
          created_at,
          updated_at
        `)
        .eq(
          "order_id",
          cleanOrderId
        )
        .maybeSingle();
  
  
    if (workspaceError) {
      console.error(
        "getAdminOrderWorkspace workspace error:",
        workspaceError
      );
  
      throw new Error(
        "读取订单服务空间失败"
      );
    }
  
  
    if (!workspaceData) {
      return null;
    }
  
  
    const workspace =
      mapWorkspace(
        workspaceData as
          WorkspaceRow
      );
  
  
    /*
     * =========================================
     * Milestones
     * =========================================
     */
  
    const {
      data:
        milestoneData,
  
      error:
        milestoneError,
    } =
      await admin
        .from(
          "order_milestones"
        )
        .select(`
          id,
          workspace_id,
          order_id,
          milestone_key,
          label,
          required,
          status,
          completed_at,
          completed_by,
          created_at,
          updated_at
        `)
        .eq(
          "workspace_id",
          workspace.id
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          }
        );
  
  
    if (milestoneError) {
      console.error(
        "getAdminOrderWorkspace milestone error:",
        milestoneError
      );
  
      throw new Error(
        "读取订单服务进度失败"
      );
    }
  
  
    /*
     * =========================================
     * Messages
     * =========================================
     */
  
    const {
      data:
        messageData,
  
      error:
        messageError,
    } =
      await admin
        .from(
          "workspace_messages"
        )
        .select(`
          id,
          workspace_id,
          order_id,
          sender_type,
          sender_user_id,
          message,
          message_kind,
          created_at,
          edited_at,
          deleted_at,
          deleted_by
        `)
        .eq(
          "workspace_id",
          workspace.id
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          }
        );
  
  
    if (messageError) {
      console.error(
        "getAdminOrderWorkspace message error:",
        messageError
      );
  
      throw new Error(
        "读取订单服务消息失败"
      );
    }
  
  
    return {
      workspace,
  
      milestones:
        (
          milestoneData ??
          []
        ).map(
          row =>
            mapMilestone(
              row as
                MilestoneRow
            )
        ),
  
      messages:
        (
          messageData ??
          []
        ).map(
          row =>
            mapMessage(
              row as
                MessageRow
            )
        ),
    };
  }