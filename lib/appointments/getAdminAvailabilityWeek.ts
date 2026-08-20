import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  buildAvailabilityWeek,
  shiftWeek,
} from "@/lib/appointments/buildAvailabilityWeek";

import {
  mexicoCityLocalToUtc,
} from "@/lib/appointments/mexicoCityTime";

import type {
  AppointmentAvailabilitySlot,
  AppointmentAvailabilityWeek,
} from "@/types/appointmentAvailability";


interface SlotRow {
  id:
    string;

  start_at:
    string;

  end_at:
    string;

  is_available:
    boolean;
}


interface BookingRow {
  starts_at:
    string;

  ends_at:
    string;
}


export async function getAdminAvailabilityWeek(
  weekStart:
    string
): Promise<AppointmentAvailabilityWeek> {
  await requireAdmin();

  const admin =
    createAdminClient();

  /*
   * Use the existing Mexico City timezone helper
   * rather than hardcoding UTC offsets here.
   */
  const nextWeekStart =
    shiftWeek(
      weekStart,
      1
    );

  const rangeStart =
    mexicoCityLocalToUtc(
      weekStart,
      "00:00"
    );

  const rangeEnd =
    mexicoCityLocalToUtc(
      nextWeekStart,
      "00:00"
    );


  const [
    availabilityResult,
    bookingResult,
  ] =
    await Promise.all([
      admin
        .from(
          "appointment_availability_slots"
        )
        .select(`
          id,
          start_at,
          end_at,
          is_available
        `)
        .gte(
          "start_at",
          rangeStart.toISOString()
        )
        .lt(
          "start_at",
          rangeEnd.toISOString()
        )
        .order(
          "start_at",
          {
            ascending:
              true,
          }
        ),

      admin
        .from(
          "order_appointments"
        )
        .select(`
          starts_at,
          ends_at
        `)
        .eq(
          "status",
          "confirmed"
        )
        .not(
          "starts_at",
          "is",
          null
        )
        .not(
          "ends_at",
          "is",
          null
        )
        .lt(
          "starts_at",
          rangeEnd.toISOString()
        )
        .gt(
          "ends_at",
          rangeStart.toISOString()
        ),
    ]);


  if (
    availabilityResult.error
  ) {
    console.error(
      "getAdminAvailabilityWeek availability error:",
      availabilityResult.error
    );

    throw new Error(
      "读取预约时间表失败"
    );
  }


  if (
    bookingResult.error
  ) {
    console.error(
      "getAdminAvailabilityWeek booking error:",
      bookingResult.error
    );

    throw new Error(
      "读取订单预约占用状态失败"
    );
  }


  const slotMap =
    new Map<
      string,
      AppointmentAvailabilitySlot
    >();


  for (
    const raw
    of availabilityResult.data ??
      []
  ) {
    const row =
      raw as SlotRow;

    const startAt =
      new Date(
        row.start_at
      ).toISOString();

    slotMap.set(
      startAt,
      {
        id:
          row.id,

        startAt,

        endAt:
          new Date(
            row.end_at
          ).toISOString(),

        isAvailable:
          row.is_available,

        isBooked:
          false,
      }
    );
  }


  /*
   * Overlay confirmed Order Appointments.
   *
   * The underlying Admin intent stays unchanged.
   * We only mark the rendered calendar slot occupied.
   */
  for (
    const raw
    of bookingResult.data ??
      []
  ) {
    const booking =
      raw as BookingRow;

    const startAt =
      new Date(
        booking.starts_at
      ).toISOString();

    const endAt =
      new Date(
        booking.ends_at
      ).toISOString();

    const existing =
      slotMap.get(
        startAt
      );

    if (existing) {
      slotMap.set(
        startAt,
        {
          ...existing,

          isAvailable:
            false,

          isBooked:
            true,
        }
      );

      continue;
    }

    /*
     * Backward-compatible appointment:
     * even if this booking was created before
     * Admin Availability existed, Admin must still
     * see the time as occupied.
     */
    slotMap.set(
      startAt,
      {
        id:
          null,

        startAt,

        endAt,

        isAvailable:
          false,

        isBooked:
          true,
      }
    );
  }


  return buildAvailabilityWeek(
    weekStart,
    Array.from(
      slotMap.values()
    )
  );
}