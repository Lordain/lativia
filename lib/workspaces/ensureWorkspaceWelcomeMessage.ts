import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import {
    createOrderNotification,
  } from "@/lib/notifications/createOrderNotification";
  
  
  interface ServiceRow {
    id:
      string;
  
    workspace_welcome_message:
      string | null;
  }
  
  
  interface WorkspaceRow {
    id:
      string;
  
    order_id:
      string;
  
    service_id:
      string;
  
    status:
      string;
  }
  
  
  /*
   * =========================================================
   * ensureWorkspaceWelcomeMessage
   * =========================================================
   *
   * Purpose:
   *
   * After a paid order has a Workspace,
   * automatically create the Service-defined welcome message.
   *
   *
   * Important:
   *
   * 1. Welcome Message is a system message.
   *
   * 2. sender_user_id = null.
   *
   * 3. message_kind = welcome.
   *
   * 4. DB unique partial index guarantees:
   *
   *    one Workspace
   *    → max one welcome message.
   *
   * 5. Repeated webhook / repair calls are safe.
   *
   * 6. Notification is generic and never contains
   *    sensitive service message content.
   * =========================================================
   */
  
  export async function ensureWorkspaceWelcomeMessage(
    workspaceId:
      string
  ) {
    const cleanWorkspaceId =
      workspaceId.trim();
  
  
    if (!cleanWorkspaceId) {
      throw new Error(
        "缺少 Workspace ID"
      );
    }
  
  
    const admin =
      createAdminClient();
  
  
    /*
     * =====================================================
     * Workspace
     * =====================================================
     */
  
    const {
      data:
        workspace,
  
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
          status
        `)
        .eq(
          "id",
          cleanWorkspaceId
        )
        .maybeSingle();
  
  
    if (
      workspaceError ||
      !workspace
    ) {
      throw new Error(
        "找不到订单服务空间"
      );
    }
  
  
    const typedWorkspace =
      workspace as
        WorkspaceRow;
  
  
    /*
     * =====================================================
     * Service Welcome Template
     * =====================================================
     */
  
    const {
      data:
        service,
  
      error:
        serviceError,
    } =
      await admin
        .from(
          "services"
        )
        .select(`
          id,
          workspace_welcome_message
        `)
        .eq(
          "id",
          typedWorkspace
            .service_id
        )
        .maybeSingle();
  
  
    if (
      serviceError ||
      !service
    ) {
      throw new Error(
        "找不到 Workspace 对应服务"
      );
    }
  
  
    const typedService =
      service as
        ServiceRow;
  
  
    const welcomeMessage =
      typedService
        .workspace_welcome_message
        ?.trim() ??
      "";
  
  
    /*
     * Service without a Welcome Message:
     * nothing to do.
     */
  
    if (!welcomeMessage) {
      return {
        success:
          true,
  
        created:
          false,
  
        reason:
          "no_template" as const,
      };
    }
  
  
    /*
     * =====================================================
     * Existing Welcome Check
     *
     * This avoids unnecessary INSERT attempts.
     *
     * DB unique index remains the final concurrency guard.
     * =====================================================
     */
  
    const {
      data:
        existingMessage,
  
      error:
        existingError,
    } =
      await admin
        .from(
          "workspace_messages"
        )
        .select(`
          id
        `)
        .eq(
          "workspace_id",
          typedWorkspace.id
        )
        .eq(
          "message_kind",
          "welcome"
        )
        .maybeSingle();
  
  
    if (existingError) {
      console.error(
        "ensureWorkspaceWelcomeMessage existing check failed"
      );
  
      throw new Error(
        "检查 Workspace 欢迎消息失败"
      );
    }
  
  
    if (
      existingMessage
    ) {
      return {
        success:
          true,
  
        created:
          false,
  
        reason:
          "already_exists" as const,
  
        messageId:
          existingMessage.id,
      };
    }
  
  
    /*
     * =====================================================
     * Create Welcome Message
     * =====================================================
     */
  
    const {
      data:
        insertedMessage,
  
      error:
        insertError,
    } =
      await admin
        .from(
          "workspace_messages"
        )
        .insert({
          workspace_id:
            typedWorkspace.id,
  
          order_id:
            typedWorkspace.order_id,
  
          sender_type:
            "system",
  
          sender_user_id:
            null,
  
          message:
            welcomeMessage,
  
          message_kind:
            "welcome",
        })
        .select(`
          id
        `)
        .single();
  
  
    /*
     * A concurrent webhook may have inserted it
     * between our SELECT and INSERT.
     *
     * 23505 = unique violation.
     *
     * Treat that as success.
     */
  
    if (insertError) {
      if (
        insertError.code ===
        "23505"
      ) {
        return {
          success:
            true,
  
          created:
            false,
  
          reason:
            "concurrent_existing" as const,
        };
      }
  
  
      console.error(
        "ensureWorkspaceWelcomeMessage insert failed"
      );
  
      throw new Error(
        "建立 Workspace 欢迎消息失败"
      );
    }
  
  
    if (
      !insertedMessage
    ) {
      throw new Error(
        "建立 Workspace 欢迎消息失败"
      );
    }
  
  
    /*
     * =====================================================
     * Notification
     *
     * Do NOT copy the welcome content into Notification.
     *
     * Notification only acts as the doorbell.
     * Actual content stays in Workspace.
     * =====================================================
     */
  
    try {
      await createOrderNotification({
        orderId:
          typedWorkspace.order_id,
  
        type:
          "workspace_message",
  
        title:
          "您的服务空间已经准备好",
  
        message:
          "服务团队已发送本订单的办理说明，请进入订单服务空间查看下一步安排。",
  
        idempotencyKey:
          `workspace_welcome:${typedWorkspace.id}`,
  
        metadata: {
          workspaceId:
            typedWorkspace.id,
  
          workspaceMessageId:
            insertedMessage.id,
  
          source:
            "workspace_welcome",
        },
      });
    } catch {
      /*
       * Welcome Message is the primary operation.
       *
       * Notification failure must NOT make the welcome
       * message appear failed or create duplicate messages
       * during payment retry.
       */
  
      console.error(
        "ensureWorkspaceWelcomeMessage notification failed",
        {
          workspaceId:
            typedWorkspace.id,

          messageId:
            insertedMessage.id,
        }
      );
    }
  
  
    return {
      success:
        true,
  
      created:
        true,
  
      reason:
        "created" as const,
  
      messageId:
        insertedMessage.id,
    };
  }