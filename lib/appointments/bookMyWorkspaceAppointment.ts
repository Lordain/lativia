"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";


export async function bookMyWorkspaceAppointment(
  workspaceId:
    string,

  startsAt:
    string
) {
  const cleanWorkspaceId =
    workspaceId.trim();


  const cleanStartsAt =
    startsAt.trim();


  if (
    !cleanWorkspaceId ||
    !cleanStartsAt
  ) {
    throw new Error(
      "缺少预约信息"
    );
  }


  const parsedStartsAt =
    new Date(
      cleanStartsAt
    );


  if (
    !Number.isFinite(
      parsedStartsAt.getTime()
    )
  ) {
    throw new Error(
      "预约时间无效"
    );
  }


  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth
      .getUser();


  if (
    userError ||
    !user
  ) {
    throw new Error(
      "请先登录"
    );
  }


  /*
   * =========================================
   * Workspace / Order
   * =========================================
   */

  const {
    data:
      workspace,

    error:
      workspaceError,
  } =
    await supabase
      .from(
        "order_workspaces"
      )
      .select(`
        id,
        order_id,
        user_id,
        status
      `)
      .eq(
        "id",
        cleanWorkspaceId
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (
    workspaceError ||
    !workspace
  ) {
    console.error(
      "bookMyWorkspaceAppointment workspace error:",
      workspaceError
    );

    throw new Error(
      "找不到当前服务空间"
    );
  }


  if (
    workspace.status !==
    "active"
  ) {
    throw new Error(
      "当前服务空间已经无法预约"
    );
  }


  /*
   * =========================================
   * Atomic Calendar Booking
   * =========================================
   */

  const {
    data:
      appointmentId,

    error:
      bookingError,
  } =
    await supabase.rpc(
      "book_workspace_appointment_time",
      {
        p_workspace_id:
          cleanWorkspaceId,

        p_starts_at:
          parsedStartsAt
            .toISOString(),
      }
    );


  if (
    bookingError
  ) {
    /*
     * IMPORTANT:
     *
     * Keep the complete Supabase/Postgres error
     * visible in the development console so we
     * can diagnose database constraints.
     */

    console.error(
      "book_workspace_appointment_time RPC error:",
      {
        code:
          bookingError.code,

        message:
          bookingError.message,

        details:
          bookingError.details,

        hint:
          bookingError.hint,

        workspaceId:
          cleanWorkspaceId,

        startsAt:
          parsedStartsAt
            .toISOString(),
      }
    );


    const message =
      bookingError.message ??
      "";


    if (
      message.includes(
        "SLOT_NOT_AVAILABLE"
      )
    ) {
      throw new Error(
        "这个时间刚刚已经被其他客户预约，请选择其他时间"
      );
    }


    if (
      message.includes(
        "APPOINTMENT_ALREADY_EXISTS"
      )
    ) {
      throw new Error(
        "当前订单已经有一个有效预约"
      );
    }


    if (
      message.includes(
        "MINIMUM_NOTICE_REQUIRED"
      )
    ) {
      throw new Error(
        "该时间距离现在太近，请选择其他预约时间"
      );
    }


    if (
      message.includes(
        "OUTSIDE_BOOKING_WINDOW"
      )
    ) {
      throw new Error(
        "请选择未来两周内的预约时间"
      );
    }


    if (
      message.includes(
        "DAY_NOT_AVAILABLE"
      ) ||
      message.includes(
        "OUTSIDE_BUSINESS_HOURS"
      ) ||
      message.includes(
        "INVALID_SLOT_TIME"
      )
    ) {
      throw new Error(
        "该时间不在可预约服务时间内"
      );
    }


    if (
      message.includes(
        "WORKSPACE_NOT_ACTIVE"
      )
    ) {
      throw new Error(
        "当前服务空间已经无法预约"
      );
    }


    if (
      message.includes(
        "duplicate key"
      ) ||
      bookingError.code ===
        "23505"
    ) {
      throw new Error(
        "当前预约记录发生冲突，请刷新页面后重新选择时间"
      );
    }


    if (
      bookingError.code ===
        "23P01"
    ) {
      throw new Error(
        "这个时间已经被其他客户预约，请选择其他时间"
      );
    }


    /*
     * Development-friendly message.
     *
     * 先让我们看到真正的数据库原因。
     * 稳定后再恢复成统一用户文案。
     */

    throw new Error(
      `预约失败：${bookingError.message}`
    );
  }


  if (
    !appointmentId
  ) {
    throw new Error(
      "预约失败：系统没有返回预约记录"
    );
  }


  /*
   * =========================================
   * Notification
   * =========================================
   */

  try {
    await createOrderNotification({
      orderId:
        workspace.order_id,

      type:
        "workspace_message",

      title:
        "咨询时间预约成功",

      message:
        "您的咨询时间已经预约成功，请进入订单服务空间查看预约详情。",

      idempotencyKey:
        `appointment_confirmed:${appointmentId}`,

      metadata: {
        appointmentId,

        workspaceId:
          cleanWorkspaceId,

        startsAt:
          parsedStartsAt
            .toISOString(),

        source:
          "appointment_calendar",
      },
    });

  } catch (
    error
  ) {
    /*
     * Notification failure must not turn a
     * successful booking into a failed booking.
     */

    console.error(
      "appointment booking notification error:",
      {
        appointmentId,

        error,
      }
    );
  }


  /*
   * =========================================
   * Refresh
   * =========================================
   */

  revalidatePath(
    `/account/orders/${workspace.order_id}`
  );

  revalidatePath(
    `/admin/orders/${workspace.order_id}`
  );


  return {
    success:
      true,

    appointmentId:
      String(
        appointmentId
      ),
  };
}