"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";


export async function cancelAdminOrderAppointment(
  appointmentId:
    string
) {
  await requireAdmin();


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
      "无法确认管理员身份"
    );
  }


  const cleanAppointmentId =
    appointmentId.trim();


  if (
    !cleanAppointmentId
  ) {
    throw new Error(
      "缺少 Appointment ID"
    );
  }


  const admin =
    createAdminClient();


  const {
    data:
      appointment,

    error:
      readError,
  } =
    await admin
      .from(
        "order_appointments"
      )
      .select(`
        id,
        order_id,
        workspace_id,
        status,
        starts_at,
        ends_at
      `)
      .eq(
        "id",
        cleanAppointmentId
      )
      .maybeSingle();


  if (
    readError ||
    !appointment
  ) {
    throw new Error(
      "找不到预约记录"
    );
  }


  if (
    appointment.status ===
    "cancelled"
  ) {
    return {
      success:
        true,

      alreadyCancelled:
        true,
    };
  }


  if (
    appointment.status !==
    "confirmed"
  ) {
    throw new Error(
      "当前预约状态不能取消"
    );
  }


  const now =
    new Date()
      .toISOString();


  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "order_appointments"
      )
      .update({
        status:
          "cancelled",

        cancelled_at:
          now,

        cancelled_by:
          user.id,

        meeting_status:
          "cancelled",

        updated_at:
          now,
      })
      .eq(
        "id",
        appointment.id
      )
      .eq(
        "status",
        "confirmed"
      );


  if (
    updateError
  ) {
    console.error(
      "cancelAdminOrderAppointment error:",
      updateError
    );

    throw new Error(
      "取消预约失败"
    );
  }


  /*
   * Calendar architecture:
   *
   * There is nothing to reopen.
   *
   * Once this appointment is no longer
   * confirmed, its time automatically becomes
   * available in the dynamic calendar again.
   */


  try {
    await createOrderNotification({
      orderId:
        appointment.order_id,

      type:
        "workspace_message",

      title:
        "咨询预约已取消",

      message:
        "原咨询预约已经取消，请进入订单服务空间重新选择可预约时间。",

      idempotencyKey:
        `appointment_cancelled:${appointment.id}`,

      metadata: {
        appointmentId:
          appointment.id,

        workspaceId:
          appointment.workspace_id,

        startsAt:
          appointment.starts_at,

        endsAt:
          appointment.ends_at,

        source:
          "appointment_calendar_cancelled",
      },
    });

  } catch (
    error
  ) {
    console.error(
      "cancelAdminOrderAppointment notification error:",
      {
        appointmentId:
          appointment.id,

        error,
      }
    );
  }


  revalidatePath(
    `/admin/orders/${appointment.order_id}`
  );

  revalidatePath(
    `/account/orders/${appointment.order_id}`
  );

  revalidatePath(
    "/admin/appointments/availability"
  );


  return {
    success:
      true,

    alreadyCancelled:
      false,
  };
}