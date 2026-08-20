import {
  createAdminClient,
} from "@/lib/supabase/admin";

import type {
  CompletionMilestone,
} from "@/types/service";

import {
  safeEnsureWorkspaceWelcomeMessage,
} from "@/lib/workspaces/safeEnsureWorkspaceWelcomeMessage";


interface OrderServiceOptionSnapshot {
  workspaceRequired?:
    boolean;
}


interface OrderRow {
  id:
    string;

  user_id:
    string;

  service_id:
    string;

  payment_status:
    string;

  service_option_id:
    string | null;

  service_option_snapshot:
    OrderServiceOptionSnapshot | null;
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
 *
 * 5. Workspace 建立或恢复后，
 *    确保该 Service 的 Automatic Welcome Message
 *    已经发送。
 *
 * 6. Welcome Message 由 Service 自己配置：
 *
 *    services.workspace_welcome_message
 *
 *    因此不同 Service 可以拥有不同欢迎消息。
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
        payment_status,
        service_option_id,
        service_option_snapshot
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
   *
   * Welcome Message 本身由
   * ensureWorkspaceWelcomeMessage()
   * 根据 service_id 再读取。
   *
   * 这里仍然只负责 Workspace + Milestones。
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
 * 4. Resolve Workspace Requirement
 * =========================================
 *
 * 新订单如绑定 Service Option：
 * 优先使用 Order 创建时保存的
 * service_option_snapshot.workspaceRequired。
 *
 * 这样后续即使 Admin 修改 Service Option，
 * 已购买订单的服务范围也不会改变。
 *
 * 没有 Service Option 的旧订单：
 * 继续使用 services.workspace_required。
 */

const optionSnapshot =
  order
    .service_option_snapshot;


const hasServiceOption =
  Boolean(
    order.service_option_id
  );

  if (
    hasServiceOption &&
    !optionSnapshot
  ) {
    console.error(
      "ensureOrderWorkspace missing service option snapshot:",
      {
        orderId:
          order.id,
  
        serviceOptionId:
          order.service_option_id,
      }
    );
  
    return {
      created:
        false,
  
      skipped:
        true,
  
      reason:
        "SERVICE_OPTION_SNAPSHOT_MISSING",
  
      workspaceId:
        null as string | null,
    };
  }


const workspaceRequired =
  hasServiceOption
    ? optionSnapshot
        ?.workspaceRequired ===
      true
    : service
        .workspace_required;


/*
 * =========================================
 * 5. Workspace Not Required
 * =========================================
 */

if (
  !workspaceRequired
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
   * 6. Check Existing Workspace
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
   * 7. Existing or Create Workspace
   * =========================================
   *
   * 不论：
   *
   * - Workspace 原本已经存在
   * - 本次成功新建
   * - 两个并发请求发生 race
   *
   * 最后都会统一取得 workspace。
   *
   * 后面的 Milestone / Welcome Message
   * 因此只需要使用 workspace.id。
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
       * 极少数情况下：
       *
       * Request A / Request B
       * 同时发现 Workspace 不存在。
       *
       * A 先 INSERT 成功。
       * B 因 order_id UNIQUE 失败。
       *
       * B 此时重新读取即可。
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
   * 8. Ensure Completion Milestones Snapshot
   * =========================================
   *
   * 即使 Workspace 已存在，
   * 仍然执行 Milestone ensure。
   *
   * 如果第一次建立 Workspace 后
   * Milestone INSERT 中途失败，
   * 下一次 Webhook / Repair 调用
   * 可以自动补齐。
   *
   * ignoreDuplicates = true
   *
   * 确保：
   *
   * 已经建立的旧订单 Snapshot
   * 不会因为 Service 后续修改 Milestone
   * 而被覆盖。
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
   * 9. Ensure Service Welcome Message
   * =========================================
   *
   * 这里只调用一次。
   *
   * safeEnsureWorkspaceWelcomeMessage()
   * 会：
   *
   * workspace.service_id
   * ↓
   * services.workspace_welcome_message
   * ↓
   * 对应 Service 自己的 Welcome Template
   * ↓
   * workspace_messages
   *
   *
   * 因此：
   *
   * Cetes Workspace
   * → Cetes Welcome Message
   *
   * RFC Workspace
   * → RFC Welcome Message
   *
   * e.firma Workspace
   * → e.firma Welcome Message
   *
   *
   * 如果没有配置模板：
   * → 什么都不发送。
   *
   * 如果已经发送：
   * → 什么都不重复发送。
   */

  await safeEnsureWorkspaceWelcomeMessage(
    workspace.id
  );


  /*
   * =========================================
   * 10. Done
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