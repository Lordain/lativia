import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  
  interface WorkspaceRow {
    id:
      string;
  
    order_id:
      string;
  
    service_id:
      string;
  
    status:
      string;
  
    started_at:
      string | null;
  
    expires_at:
      string | null;
  }
  
  
  interface ServiceRow {
    access_duration_days:
      number | null;
  }
  
  
  /*
   * =========================================
   * startOrderWorkspace
   * =========================================
   *
   * Workspace 创建 != Workspace 开始。
   *
   * Payment:
   * → 创建 Workspace
   *
   * Admin 真正开始办理：
   * → started_at
   * → expires_at
   *
   *
   * Idempotent:
   * 已经 started 的 Workspace
   * 不重新计算时间。
   */
  
  export async function startOrderWorkspace(
    orderId:
      string
  ) {
    const cleanOrderId =
      orderId.trim();
  
    if (!cleanOrderId) {
      throw new Error(
        "ORDER_ID_REQUIRED"
      );
    }
  
  
    const admin =
      createAdminClient();
  
  
    /*
     * =========================================
     * 1. Read Workspace
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
          status,
          started_at,
          expires_at
        `)
        .eq(
          "order_id",
          cleanOrderId
        )
        .maybeSingle();
  
  
    if (workspaceError) {
      console.error(
        "startOrderWorkspace workspace error:",
        workspaceError
      );
  
      throw new Error(
        "READ_WORKSPACE_FAILED"
      );
    }
  
  
    /*
     * Service 不需要 Workspace，
     * 或历史订单尚未建立 Workspace。
     *
     * 这里直接跳过。
     */
    if (!workspaceData) {
      return {
        started:
          false,
  
        skipped:
          true,
  
        reason:
          "WORKSPACE_NOT_FOUND",
      };
    }
  
  
    const workspace =
      workspaceData as
        WorkspaceRow;
  
  
    /*
     * =========================================
     * 2. Already Started
     * =========================================
     */
  
    if (
      workspace.started_at
    ) {
      return {
        started:
          false,
  
        skipped:
          true,
  
        reason:
          "ALREADY_STARTED",
  
        startedAt:
          workspace.started_at,
  
        expiresAt:
          workspace.expires_at,
      };
    }
  
  
    /*
     * =========================================
     * 3. Only Active Workspace Can Start
     * =========================================
     */
  
    if (
      workspace.status !==
      "active"
    ) {
      return {
        started:
          false,
  
        skipped:
          true,
  
        reason:
          "WORKSPACE_NOT_ACTIVE",
      };
    }
  
  
    /*
     * =========================================
     * 4. Read Service Duration
     * =========================================
     */
  
    const {
      data:
        serviceData,
  
      error:
        serviceError,
    } =
      await admin
        .from(
          "services"
        )
        .select(`
          access_duration_days
        `)
        .eq(
          "id",
          workspace.service_id
        )
        .maybeSingle();
  
  
    if (serviceError) {
      console.error(
        "startOrderWorkspace service error:",
        serviceError
      );
  
      throw new Error(
        "READ_SERVICE_FAILED"
      );
    }
  
  
    const service =
      serviceData as
        ServiceRow | null;
  
  
    const startedAt =
      new Date();
  
  
    let expiresAt:
      Date | null =
        null;
  
  
    if (
      service
        ?.access_duration_days &&
      service
        .access_duration_days >
        0
    ) {
      expiresAt =
        new Date(
          startedAt.getTime() +
            service
              .access_duration_days *
              24 *
              60 *
              60 *
              1000
        );
    }
  
  
    /*
     * =========================================
     * 5. Start Workspace
     *
     * started_at IS NULL
     * 防止并发请求重新启动期限。
     * =========================================
     */
  
    const {
      data:
        updatedWorkspace,
  
      error:
        updateError,
    } =
      await admin
        .from(
          "order_workspaces"
        )
        .update({
          started_at:
            startedAt.toISOString(),
  
          expires_at:
            expiresAt
              ?.toISOString() ??
            null,
  
          updated_at:
            startedAt.toISOString(),
        })
        .eq(
          "id",
          workspace.id
        )
        .is(
          "started_at",
          null
        )
        .select(`
          started_at,
          expires_at
        `)
        .maybeSingle();
  
  
    if (updateError) {
      console.error(
        "startOrderWorkspace update error:",
        updateError
      );
  
      throw new Error(
        "START_WORKSPACE_FAILED"
      );
    }
  
  
    /*
     * 另一个并发请求可能已经先启动。
     * 不把这种情况视为错误。
     */
    if (!updatedWorkspace) {
      return {
        started:
          false,
  
        skipped:
          true,
  
        reason:
          "ALREADY_STARTED",
      };
    }
  
  
    return {
      started:
        true,
  
      skipped:
        false,
  
      reason:
        null,
  
      startedAt:
        updatedWorkspace
          .started_at,
  
      expiresAt:
        updatedWorkspace
          .expires_at,
    };
  }