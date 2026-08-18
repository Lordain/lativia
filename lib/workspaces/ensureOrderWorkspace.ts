import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    CompletionMilestone,
  } from "@/types/service";
  
  
  interface OrderRow {
    id:
      string;
  
    user_id:
      string;
  
    service_id:
      string;
  
    payment_status:
      string;
  }
  
  
  interface ServiceRow {
    id:
      string;
  
    workspace_required:
      boolean;
  
    completion_milestones:
      CompletionMilestone[] | null;
  }
  
  
  interface WorkspaceRow {
    id:
      string;
  
    order_id:
      string;
  
    service_id:
      string;
  
    user_id:
      string;
  }
  
  
  /*
   * =========================================
   * ensureOrderWorkspace
   * =========================================
   *
   * 目的：
   *
   * 对已经付款、且 Service 要求 Workspace
   * 的订单建立 Order Workspace。
   *
   *
   * 重要原则：
   *
   * 1. Idempotent
   *    同一个订单重复调用不会重复建立 Workspace。
   *
   * 2. Service Milestones Snapshot
   *    建立 Workspace 时把 Service 当前的
   *    completion_milestones 保存到
   *    order_milestones。
   *
   * 3. 不在这里启动服务期限
   *    started_at / expires_at 仍然为空。
   *
   * 4. 非 Workspace 服务直接跳过。
   */
  
  export async function ensureOrderWorkspace(
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
     * 1. Read Order
     * =========================================
     */
  
    const {
      data:
        orderData,
  
      error:
        orderError,
    } =
      await admin
        .from(
          "orders"
        )
        .select(`
          id,
          user_id,
          service_id,
          payment_status
        `)
        .eq(
          "id",
          cleanOrderId
        )
        .maybeSingle();
  
  
    if (orderError) {
      console.error(
        "ensureOrderWorkspace order error:",
        orderError
      );
  
      throw new Error(
        "READ_ORDER_FAILED"
      );
    }
  
  
    if (!orderData) {
      throw new Error(
        "ORDER_NOT_FOUND"
      );
    }
  
  
    const order =
      orderData as
        OrderRow;
  
  
    /*
     * =========================================
     * 2. Only Paid Orders
     * =========================================
     */
  
    if (
      order.payment_status !==
      "paid"
    ) {
      return {
        created:
          false,
  
        skipped:
          true,
  
        reason:
          "ORDER_NOT_PAID",
  
        workspaceId:
          null as string | null,
      };
    }
  
  
    /*
     * =========================================
     * 3. Read Service Workspace Configuration
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
          id,
          workspace_required,
          completion_milestones
        `)
        .eq(
          "id",
          order.service_id
        )
        .maybeSingle();
  
  
    if (serviceError) {
      console.error(
        "ensureOrderWorkspace service error:",
        serviceError
      );
  
      throw new Error(
        "READ_SERVICE_FAILED"
      );
    }
  
  
    if (!serviceData) {
      throw new Error(
        "SERVICE_NOT_FOUND"
      );
    }
  
  
    const service =
      serviceData as
        ServiceRow;
  
  
    /*
     * =========================================
     * 4. Service Does Not Need Workspace
     * =========================================
     */
  
    if (
      !service.workspace_required
    ) {
      return {
        created:
          false,
  
        skipped:
          true,
  
        reason:
          "WORKSPACE_NOT_REQUIRED",
  
        workspaceId:
          null as string | null,
      };
    }
  
  
    /*
     * =========================================
     * 5. Check Existing Workspace
     * =========================================
     */
  
    const {
      data:
        existingWorkspace,
  
      error:
        existingError,
    } =
      await admin
        .from(
          "order_workspaces"
        )
        .select(`
          id,
          order_id,
          service_id,
          user_id
        `)
        .eq(
          "order_id",
          order.id
        )
        .maybeSingle();
  
  
    if (existingError) {
      console.error(
        "ensureOrderWorkspace existing workspace error:",
        existingError
      );
  
      throw new Error(
        "READ_WORKSPACE_FAILED"
      );
    }
  
  
    /*
     * =========================================
     * Existing Workspace
     *
     * 即使 Workspace 已存在，
     * 仍然继续执行 Milestone ensure。
     *
     * 这样如果第一次建立 Workspace 后
     * Milestone insert 中途失败，
     * 下一次调用仍可以补齐。
     * =========================================
     */
  
    let workspace:
      WorkspaceRow;
  
    let workspaceCreated =
      false;
  
  
    if (
      existingWorkspace
    ) {
      workspace =
        existingWorkspace as
          WorkspaceRow;
    } else {
      const {
        data:
          insertedWorkspace,
  
        error:
          workspaceError,
      } =
        await admin
          .from(
            "order_workspaces"
          )
          .insert({
            order_id:
              order.id,
  
            service_id:
              order.service_id,
  
            user_id:
              order.user_id,
  
            status:
              "active",
  
            started_at:
              null,
  
            expires_at:
              null,
  
            completed_at:
              null,
          })
          .select(`
            id,
            order_id,
            service_id,
            user_id
          `)
          .single();
  
  
      if (
        workspaceError ||
        !insertedWorkspace
      ) {
        /*
         * 极少数情况下可能两个请求同时创建。
         *
         * order_id 有 UNIQUE Constraint，
         * 所以重新读取即可。
         */
  
        const {
          data:
            raceWorkspace,
  
          error:
            raceError,
        } =
          await admin
            .from(
              "order_workspaces"
            )
            .select(`
              id,
              order_id,
              service_id,
              user_id
            `)
            .eq(
              "order_id",
              order.id
            )
            .maybeSingle();
  
  
        if (
          raceError ||
          !raceWorkspace
        ) {
          console.error(
            "ensureOrderWorkspace insert error:",
            workspaceError
          );
  
          throw new Error(
            "CREATE_WORKSPACE_FAILED"
          );
        }
  
  
        workspace =
          raceWorkspace as
            WorkspaceRow;
      } else {
        workspace =
          insertedWorkspace as
            WorkspaceRow;
  
        workspaceCreated =
          true;
      }
    }
  
  
    /*
     * =========================================
     * 6. Snapshot Completion Milestones
     * =========================================
     */
  
    const milestones =
      Array.isArray(
        service.completion_milestones
      )
        ? service
            .completion_milestones
        : [];
  
  
    if (
      milestones.length >
      0
    ) {
      const milestoneRows =
        milestones
          .filter(
            milestone =>
              Boolean(
                milestone.key
                  ?.trim()
              )
          )
          .map(
            milestone => ({
              workspace_id:
                workspace.id,
  
              order_id:
                order.id,
  
              milestone_key:
                milestone.key
                  .trim(),
  
              label:
                milestone.label
                  .trim(),
  
              required:
                milestone.required !==
                false,
  
              status:
                "pending",
            })
          );
  
  
      if (
        milestoneRows.length >
        0
      ) {
        const {
          error:
            milestoneError,
        } =
          await admin
            .from(
              "order_milestones"
            )
            .upsert(
              milestoneRows,
              {
                onConflict:
                  "workspace_id,milestone_key",
  
                /*
                 * Snapshot 一旦存在，
                 * 不允许 Service 后续修改
                 * 覆盖旧订单内容。
                 */
                ignoreDuplicates:
                  true,
              }
            );
  
  
        if (
          milestoneError
        ) {
          console.error(
            "ensureOrderWorkspace milestone error:",
            milestoneError
          );
  
          throw new Error(
            "CREATE_ORDER_MILESTONES_FAILED"
          );
        }
      }
    }
  
  
    /*
     * =========================================
     * 7. Done
     * =========================================
     */
  
    return {
      created:
        workspaceCreated,
  
      skipped:
        false,
  
      reason:
        null,
  
      workspaceId:
        workspace.id,
    };
  }