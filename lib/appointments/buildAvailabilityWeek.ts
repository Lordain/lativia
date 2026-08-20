import {
    APPOINTMENT_END_HOUR,
    APPOINTMENT_START_HOUR,
    APPOINTMENT_TIMEZONE_OFFSET,
    APPOINTMENT_WEEKDAY_LABELS,
  } from "@/lib/appointments/availabilityConfig";
  
  import type {
    AppointmentAvailabilitySlot,
    AppointmentAvailabilityWeek,
  } from "@/types/appointmentAvailability";
  
  
  function pad(
    value: number
  ) {
    return String(
      value
    ).padStart(
      2,
      "0"
    );
  }
  
  
  function toDateKey(
    date: Date
  ) {
    return [
      date.getUTCFullYear(),
      pad(
        date.getUTCMonth() +
          1
      ),
      pad(
        date.getUTCDate()
      ),
    ].join("-");
  }
  
  
  function addDays(
    date: Date,
    days: number
  ) {
    const result =
      new Date(
        date.getTime()
      );
  
    result.setUTCDate(
      result.getUTCDate() +
        days
    );
  
    return result;
  }
  
  
  function localSlotIso(
    dateKey: string,
    hour: number
  ) {
    return `${dateKey}T${pad(
      hour
    )}:00:00${APPOINTMENT_TIMEZONE_OFFSET}`;
  }
  
  
  export function getMondayDateKey(
    referenceDateKey?: string
  ) {
    const reference =
      referenceDateKey
        ? new Date(
            `${referenceDateKey}T12:00:00Z`
          )
        : new Date();
  
    /*
     * We only care about the calendar date.
     * Using noon prevents accidental date crossing.
     */
    const normalized =
      new Date(
        Date.UTC(
          reference.getUTCFullYear(),
          reference.getUTCMonth(),
          reference.getUTCDate(),
          12
        )
      );
  
    const weekday =
      normalized.getUTCDay();
  
    const daysSinceMonday =
      weekday === 0
        ? 6
        : weekday - 1;
  
    normalized.setUTCDate(
      normalized.getUTCDate() -
        daysSinceMonday
    );
  
    return toDateKey(
      normalized
    );
  }
  
  
  export function shiftWeek(
    weekStart: string,
    direction:
      | -1
      | 1
  ) {
    const date =
      new Date(
        `${weekStart}T12:00:00Z`
      );
  
    return toDateKey(
      addDays(
        date,
        direction * 7
      )
    );
  }
  
  
  export function buildAvailabilityWeek(
    weekStart: string,
    existingSlots:
      AppointmentAvailabilitySlot[]
  ): AppointmentAvailabilityWeek {
    const monday =
      new Date(
        `${weekStart}T12:00:00Z`
      );
  
    const existingMap =
      new Map<
        string,
        AppointmentAvailabilitySlot
      >();
  
    for (
      const slot
      of existingSlots
    ) {
      existingMap.set(
        slot.startAt,
        slot
      );
    }
  
    const days = [];
  
    /*
     * Admin UI = Monday through Saturday.
     * Sunday remains closed and is not shown.
     */
    for (
      let dayOffset = 0;
      dayOffset < 6;
      dayOffset += 1
    ) {
      const date =
        addDays(
          monday,
          dayOffset
        );
  
      const dateKey =
        toDateKey(
          date
        );
  
      const weekday =
        date.getUTCDay();
  
      const slots:
        AppointmentAvailabilitySlot[] =
        [];
  
      for (
        let hour =
          APPOINTMENT_START_HOUR;
        hour <
        APPOINTMENT_END_HOUR;
        hour += 1
      ) {
        const localStart =
          localSlotIso(
            dateKey,
            hour
          );
  
        const localEnd =
          localSlotIso(
            dateKey,
            hour + 1
          );
  
        const startAt =
          new Date(
            localStart
          ).toISOString();
  
        const endAt =
          new Date(
            localEnd
          ).toISOString();
  
        const existing =
          existingMap.get(
            startAt
          );
  
          const isBooked =
          existing?.isBooked ??
          false;
        
        slots.push({
          id:
            existing?.id ??
            null,
        
          startAt,
        
          endAt,
        
          /*
           * A confirmed appointment always wins.
           */
          isAvailable:
            isBooked
              ? false
              : existing?.isAvailable ??
                false,
        
          isBooked,
        });
      }
  
      days.push({
        date:
          dateKey,
  
        weekdayLabel:
          APPOINTMENT_WEEKDAY_LABELS[
            weekday
          ],
  
        dateLabel:
          `${pad(
            date.getUTCMonth() +
              1
          )}/${pad(
            date.getUTCDate()
          )}`,
  
        slots,
      });
    }
  
    return {
      weekStart,
  
      weekEnd:
        toDateKey(
          addDays(
            monday,
            5
          )
        ),
  
      days,
    };
  }