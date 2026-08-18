"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createOrderNotification,
} from "@/lib/notifications/createOrderNotification";

import type {
  MeetingProvider,
} from "@/types/appointment";


interface Input {
  appointmentId:
    string;

  meetingProvider:
    MeetingProvider | "";

  meetingUrl:
    string;

  meetingTitle:
    string;

  meetingNotes:
    string;

  consultationType?:
    string;
}


function validateMeetingUrl(
  value:
    string
) {
  try {
    const url =
      new URL(
        value
      );


    return (
      url.protocol ===
        "https:" ||
      url.protocol ===
        "http:"
    );

  } catch {
    return false;
  }
}


export async function updateAdminAppointmentMeeting(
  input:
    Input
) {
  /*
   * =========================================
   * Admin Authorization
   * =========================================
   */

  await requireAdmin();


  const appointmentId =
    input.appointmentId
      .trim();

  const meetingProvider =
    input.meetingProvider;

  const meetingUrl =
    input.meetingUrl
      .trim();

  const meetingTitle =
    input.meetingTitle
      .trim();

  const meetingNotes =
    input.meetingNotes
      .trim();

  const consultationType =
    input.consultationType
      ?.trim() ||
    null;


  if (
    !appointmentId
  ) {
    throw new Error(
      "缺少 Appointment ID"
    );
  }


  /*
   * 如果设置会议 URL，
   * provider 也必须设置。
   */

  if (
    meetingUrl &&
    !meetingProvider
  ) {
    throw new Error(
      "请选择线上会议工具"
    );
  }


  if (
    meetingUrl &&
    !validateMeetingUrl(
      meetingUrl
    )
  ) {
    throw new Error(
      "请输入有效的线上会议链接"
    );
  }


  if (
    meetingUrl.length >
    2000
  ) {
    throw new Error(
      "会议链接过长"
    );
  }


  if (
    meetingTitle.length >
    200
  ) {
    throw new Error(
      "会议主题不能超过 200 字"
    );
  }


  if (
    meetingNotes.length >
    2000
  ) {
    throw new Error(
      "会议说明不能超过 2000 字"
    );
  }


  const admin =
    createAdminClient();


  /*
   * =========================================
   * Read Appointment
   * =========================================
   */

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
        meeting_status,
        meeting_url
      `)
      .eq(
        "id",
        appointmentId
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
    appointment.status !==
    "confirmed"
  ) {
    throw new Error(
      "只有有效预约可以设置线上会议"
    );
  }


  const wasReady =
    appointment.meeting_status ===
      "ready" &&
    Boolean(
      appointment.meeting_url
    );


  const meetingStatus =
    meetingUrl
      ? "ready"
      : "pending";


  /*
   * =========================================
   * Update Meeting
   * =========================================
   */

  const {
    error:
      updateError,
  } =
    await admin
      .from(
        "order_appointments"
      )
      .update({
        meeting_provider:
          meetingProvider ||
          null,

        meeting_url:
          meetingUrl ||
          null,

        meeting_title:
          meetingTitle ||
          null,

        meeting_notes:
          meetingNotes ||
          null,

        meeting_status:
          meetingStatus,

        consultation_type:
          consultationType,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        appointment.id
      );


  if (
    updateError
  ) {
    console.error(
      "updateAdminAppointmentMeeting error:",
      updateError
    );

    throw new Error(
      "保存线上会议信息失败"
    );
  }


  /*
   * =========================================
   * Notify Customer
   * =========================================
   *
   * 第一次从 pending → ready 时发送。
   *
   * 会议链接本身不放进 Notification，
   * 客户必须进入订单查看。
   */

  if (
    meetingUrl &&
    !wasReady
  ) {
    try {
      await createOrderNotification({
        orderId:
          appointment.order_id,

        type:
          "workspace_message",

        title:
          "线上会议已经准备好",

        message:
          "您的咨询会议入口已经准备好，请进入订单服务空间查看预约和线上会议详情。",

        idempotencyKey:
          `appointment_meeting_ready:${appointment.id}`,

        metadata: {
          appointmentId:
            appointment.id,

          workspaceId:
            appointment.workspace_id,

          source:
            "appointment_meeting_ready",
        },
      });

    } catch (
      error
    ) {
      console.error(
        "updateAdminAppointmentMeeting notification error:",
        {
          appointmentId:
            appointment.id,

          error,
        }
      );
    }
  }


  revalidatePath(
    `/admin/orders/${appointment.order_id}`
  );

  revalidatePath(
    `/account/orders/${appointment.order_id}`
  );


  return {
    success:
      true,

    meetingStatus,
  };
}