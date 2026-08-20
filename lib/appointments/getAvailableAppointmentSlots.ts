import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  getAppointmentAvailabilityRule,
} from "@/lib/appointments/getAppointmentAvailabilityRule";

import {
  getMexicoCityDateParts,
  mexicoCityLocalToUtc,
  addMinutes,
} from "@/lib/appointments/mexicoCityTime";

import type {
  AppointmentAvailabilityRule,
  AvailableAppointmentSlot,
} from "@/types/appointment";


interface ConfirmedAppointmentRow {
  starts_at:
    string;

  ends_at:
    string;
}


interface AvailabilityRow {
  start_at:
    string;

  end_at:
    string;

  is_available:
    boolean;
}


interface Result {
  rule:
    AppointmentAvailabilityRule | null;

  slots:
    AvailableAppointmentSlot[];
}


function pad2(
  value:
    number
) {
  return String(
    value
  ).padStart(
    2,
    "0"
  );
}


function timeToMinutes(
  value:
    string
) {
  const [
    hour,
    minute,
  ] =
    value
      .slice(
        0,
        5
      )
      .split(":")
      .map(Number);

  return (
    hour *
      60 +
    minute
  );
}


function minutesToTime(
  value:
    number
) {
  const hour =
    Math.floor(
      value /
      60
    );

  const minute =
    value %
    60;

  return `${pad2(
    hour
  )}:${pad2(
    minute
  )}`;
}


function overlaps(
  startsAt:
    Date,

  endsAt:
    Date,

  booking:
    ConfirmedAppointmentRow
) {
  const bookingStart =
    new Date(
      booking.starts_at
    );

  const bookingEnd =
    new Date(
      booking.ends_at
    );

  return (
    startsAt <
      bookingEnd &&
    endsAt >
      bookingStart
  );
}


export async function getAvailableAppointmentSlots():
  Promise<Result> {
  const rule =
    await getAppointmentAvailabilityRule();


  if (
    !rule ||
    !rule.isActive
  ) {
    return {
      rule,

      slots:
        [],
    };
  }


  const now =
    new Date();


  const minimumStart =
    new Date(
      now.getTime() +
        rule.minimumNoticeHours *
          60 *
          60 *
          1000
    );


  const bookingWindowEnd =
    new Date(
      now.getTime() +
        rule.bookingWindowDays *
          24 *
          60 *
          60 *
          1000
    );


  const admin =
    createAdminClient();


  /*
   * Read:
   *
   * 1. confirmed Order Appointments
   * 2. Admin availability whitelist
   */
  const [
    bookingResult,
    availabilityResult,
  ] =
    await Promise.all([
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
          bookingWindowEnd
            .toISOString()
        )
        .gt(
          "ends_at",
          now.toISOString()
        ),

      admin
        .from(
          "appointment_availability_slots"
        )
        .select(`
          start_at,
          end_at,
          is_available
        `)
        .gte(
          "start_at",
          now.toISOString()
        )
        .lt(
          "start_at",
          bookingWindowEnd
            .toISOString()
        ),
    ]);


  if (
    bookingResult.error
  ) {
    console.error(
      "getAvailableAppointmentSlots bookings error:",
      bookingResult.error
    );

    throw new Error(
      "读取预约日历失败"
    );
  }


  if (
    availabilityResult.error
  ) {
    console.error(
      "getAvailableAppointmentSlots availability error:",
      availabilityResult.error
    );

    throw new Error(
      "读取预约开放时间失败"
    );
  }


  const confirmedBookings =
    (
      bookingResult.data ??
      []
    ) as ConfirmedAppointmentRow[];


  const availabilityMap =
    new Map<
      string,
      AvailabilityRow
    >();


  for (
    const raw
    of availabilityResult.data ??
      []
  ) {
    const row =
      raw as AvailabilityRow;

    availabilityMap.set(
      new Date(
        row.start_at
      ).toISOString(),
      row
    );
  }


  const todayParts =
    getMexicoCityDateParts(
      now
    );


  const baseCalendarDate =
    Date.UTC(
      todayParts.year,
      todayParts.month -
        1,
      todayParts.day
    );


  const openMinutes =
    timeToMinutes(
      rule.openTime
    );


  const closeMinutes =
    timeToMinutes(
      rule.closeTime
    );


  const slots:
    AvailableAppointmentSlot[] =
    [];


  /*
   * Generate complete calendar.
   *
   * We DO NOT hide closed/booked slots anymore.
   * Customer sees:
   *
   * 可预约 / 已占用
   */
  for (
    let dayOffset = 0;
    dayOffset <
      rule.bookingWindowDays;
    dayOffset += 1
  ) {
    const calendarDate =
      new Date(
        baseCalendarDate +
          dayOffset *
            24 *
            60 *
            60 *
            1000
      );


    const year =
      calendarDate
        .getUTCFullYear();

    const month =
      calendarDate
        .getUTCMonth() +
      1;

    const day =
      calendarDate
        .getUTCDate();


    const jsWeekday =
      calendarDate
        .getUTCDay();

    const isoWeekday =
      jsWeekday ===
        0
        ? 7
        : jsWeekday;


    if (
      !rule.openWeekdays
        .includes(
          isoWeekday
        )
    ) {
      continue;
    }


    const dateValue =
      `${year}-${pad2(
        month
      )}-${pad2(
        day
      )}`;


    for (
      let startMinutes =
        openMinutes;

      startMinutes +
        rule.slotMinutes <=
        closeMinutes;

      startMinutes +=
        rule.slotMinutes
    ) {
      const timeValue =
        minutesToTime(
          startMinutes
        );


      const startsAt =
        mexicoCityLocalToUtc(
          dateValue,
          timeValue
        );


      const endsAt =
        addMinutes(
          startsAt,
          rule.slotMinutes
        );


      const startsAtIso =
        startsAt.toISOString();


      /*
       * Admin whitelist.
       *
       * Missing record = occupied.
       */
      const adminSlot =
        availabilityMap.get(
          startsAtIso
        );


      const adminOpened =
        Boolean(
          adminSlot
            ?.is_available
        );


      /*
       * Existing confirmed appointment.
       */
      const booked =
        confirmedBookings.some(
          booking =>
            overlaps(
              startsAt,
              endsAt,
              booking
            )
        );


      /*
       * Other booking rules.
       *
       * Customer still sees the slot,
       * but it is grey/disabled.
       */
      const enoughNotice =
        startsAt >=
        minimumStart;


      const insideWindow =
        startsAt <=
        bookingWindowEnd;


      const isAvailable =
        adminOpened &&
        enoughNotice &&
        insideWindow &&
        !booked;


      slots.push({
        id:
          startsAtIso,

        startsAt:
          startsAtIso,

        endsAt:
          endsAt.toISOString(),

        isAvailable,
      });
    }
  }


  return {
    rule,
    slots,
  };
}