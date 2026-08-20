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


interface Input {
  startAt:
    string;

  endAt:
    string;

  isAvailable:
    boolean;
}


export async function setAppointmentSlotAvailability(
  input:
    Input
) {
  const user =
    await requireAdmin();

  const startAt =
    new Date(
      input.startAt
    );

  const endAt =
    new Date(
      input.endAt
    );


  if (
    Number.isNaN(
      startAt.getTime()
    ) ||
    Number.isNaN(
      endAt.getTime()
    )
  ) {
    throw new Error(
      "预约时间格式无效"
    );
  }


  if (
    endAt.getTime() -
      startAt.getTime() !==
    60 *
      60 *
      1000
  ) {
    throw new Error(
      "预约时段必须为 60 分钟"
    );
  }


  if (
    startAt.getUTCMinutes() !==
      0 ||
    startAt.getUTCSeconds() !==
      0 ||
    startAt.getUTCMilliseconds() !==
      0
  ) {
    throw new Error(
      "预约时段必须整点开始"
    );
  }


  const admin =
    createAdminClient();


  /*
   * =========================================
   * Confirmed appointment protection
   * =========================================
   *
   * Admin must never override a real booking.
   */
  const {
    data:
      conflictingAppointments,

    error:
      conflictError,
  } =
    await admin
      .from(
        "order_appointments"
      )
      .select(`
        id
      `)
      .eq(
        "status",
        "confirmed"
      )
      .lt(
        "starts_at",
        endAt.toISOString()
      )
      .gt(
        "ends_at",
        startAt.toISOString()
      )
      .limit(
        1
      );


  if (
    conflictError
  ) {
    console.error(
      "setAppointmentSlotAvailability conflict error:",
      conflictError
    );

    throw new Error(
      "检查预约占用状态失败"
    );
  }


  if (
    conflictingAppointments &&
    conflictingAppointments.length >
      0
  ) {
    throw new Error(
      "该时段已有订单预约，目前无法修改"
    );
  }


  const {
    error,
  } =
    await admin
      .from(
        "appointment_availability_slots"
      )
      .upsert(
        {
          start_at:
            startAt.toISOString(),

          end_at:
            endAt.toISOString(),

          is_available:
            input.isAvailable,

          created_by:
            user.id,

          updated_by:
            user.id,
        },
        {
          onConflict:
            "start_at",
        }
      );


  if (error) {
    console.error(
      "setAppointmentSlotAvailability error:",
      error
    );

    throw new Error(
      "更新预约时段失败"
    );
  }


  revalidatePath(
    "/admin/appointments/availability"
  );


  return {
    success:
      true,
  };
}