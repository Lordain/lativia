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
  
  
    /*
     * =========================================
     * Read all globally confirmed appointments
     * in the booking window.
     * =========================================
     */
  
    const admin =
      createAdminClient();
  
  
    const {
      data:
        bookingRows,
  
      error:
        bookingError,
    } =
      await admin
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
        );
  
  
    if (bookingError) {
      console.error(
        "getAvailableAppointmentSlots bookings error:",
        bookingError
      );
  
      throw new Error(
        "读取预约日历失败"
      );
    }
  
  
    const confirmedBookings =
      (
        bookingRows ??
        []
      ) as ConfirmedAppointmentRow[];
  
  
    /*
     * =========================================
     * Mexico City local date today
     * =========================================
     */
  
    const todayParts =
      getMexicoCityDateParts(
        now
      );
  
  
    /*
     * We use a UTC-only date cursor purely
     * for calendar arithmetic.
     *
     * It does NOT represent appointment time.
     */
  
    const baseCalendarDate =
      Date.UTC(
        todayParts.year,
        todayParts.month - 1,
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
     * =========================================
     * Generate next N local calendar days
     * =========================================
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
  
  
      /*
       * ISO weekday:
       *
       * Sunday JS = 0
       * Sunday ISO = 7
       */
  
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
  
  
      /*
       * =========================================
       * Generate all slots for this business day
       * =========================================
       */
  
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
  
  
        /*
         * Minimum notice.
         */
  
        if (
          startsAt <
          minimumStart
        ) {
          continue;
        }
  
  
        /*
         * Rolling 14-day limit.
         */
  
        if (
          startsAt >
          bookingWindowEnd
        ) {
          continue;
        }
  
  
        /*
         * Global occupied calendar check.
         */
  
        const occupied =
          confirmedBookings.some(
            booking =>
              overlaps(
                startsAt,
                endsAt,
                booking
              )
          );
  
  
        if (
          occupied
        ) {
          continue;
        }
  
  
        slots.push({
          /*
           * ISO start is enough as stable UI key.
           */
          id:
            startsAt
              .toISOString(),
  
          startsAt:
            startsAt
              .toISOString(),
  
          endsAt:
            endsAt
              .toISOString(),
        });
      }
    }
  
  
    return {
      rule,
      slots,
    };
  }