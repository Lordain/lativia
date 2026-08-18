import {
    APPOINTMENT_CLOSE_HOUR,
    APPOINTMENT_OPEN_HOUR,
    APPOINTMENT_OPEN_WEEKDAYS,
    APPOINTMENT_TIME_ZONE,
  } from "@/lib/appointments/businessHours";
  
  
  /*
   * =========================================================
   * getMexicoCityDateParts
   * =========================================================
   */
  
  export function getMexicoCityDateParts(
    date:
      Date
  ) {
    const formatter =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            APPOINTMENT_TIME_ZONE,
  
          year:
            "numeric",
  
          month:
            "2-digit",
  
          day:
            "2-digit",
  
          weekday:
            "short",
  
          hour:
            "2-digit",
  
          minute:
            "2-digit",
  
          hourCycle:
            "h23",
        }
      );
  
  
    const parts =
      formatter.formatToParts(
        date
      );
  
  
    const get =
      (
        type:
          Intl.DateTimeFormatPartTypes
      ) =>
        parts.find(
          part =>
            part.type ===
            type
        )?.value ??
        "";
  
  
    return {
      year:
        Number(
          get(
            "year"
          )
        ),
  
      month:
        Number(
          get(
            "month"
          )
        ),
  
      day:
        Number(
          get(
            "day"
          )
        ),
  
      weekday:
        get(
          "weekday"
        ),
  
      hour:
        Number(
          get(
            "hour"
          )
        ),
  
      minute:
        Number(
          get(
            "minute"
          )
        ),
    };
  }
  
  
  /*
   * =========================================================
   * getMexicoCityWeekdayNumber
   *
   * Sunday = 0
   * Monday = 1
   * ...
   * Saturday = 6
   * =========================================================
   */
  
  export function getMexicoCityWeekdayNumber(
    date:
      Date
  ) {
    const weekday =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            APPOINTMENT_TIME_ZONE,
  
          weekday:
            "short",
        }
      ).format(
        date
      );
  
  
    const map:
      Record<string, number> = {
        Sun:
          0,
  
        Mon:
          1,
  
        Tue:
          2,
  
        Wed:
          3,
  
        Thu:
          4,
  
        Fri:
          5,
  
        Sat:
          6,
      };
  
  
    return (
      map[
        weekday
      ] ??
      -1
    );
  }
  
  
  /*
   * =========================================================
   * isWithinAppointmentBusinessHours
   * =========================================================
   *
   * Rules:
   *
   * Monday-Saturday
   * 09:00-18:00
   *
   * End time may equal exactly 18:00.
   *
   * Example:
   *
   * 17:30-18:00
   * → valid
   *
   * 18:00-18:30
   * → invalid
   *
   * Sunday
   * → invalid
   * =========================================================
   */
  
  export function isWithinAppointmentBusinessHours(
    startsAt:
      Date,
  
    endsAt:
      Date
  ) {
    if (
      !Number.isFinite(
        startsAt.getTime()
      ) ||
      !Number.isFinite(
        endsAt.getTime()
      )
    ) {
      return false;
    }
  
  
    if (
      endsAt <=
      startsAt
    ) {
      return false;
    }
  
  
    const startWeekday =
      getMexicoCityWeekdayNumber(
        startsAt
      );
  
  
    const endWeekday =
      getMexicoCityWeekdayNumber(
        endsAt
      );
  
  
    if (
      !APPOINTMENT_OPEN_WEEKDAYS.includes(
        startWeekday as
          1 | 2 | 3 | 4 | 5 | 6
      )
    ) {
      return false;
    }
  
  
    /*
     * Appointment may not cross midnight.
     */
  
    if (
      startWeekday !==
      endWeekday
    ) {
      return false;
    }
  
  
    const start =
      getMexicoCityDateParts(
        startsAt
      );
  
  
    const end =
      getMexicoCityDateParts(
        endsAt
      );
  
  
    /*
     * Same Mexico City calendar date.
     */
  
    if (
      start.year !==
        end.year ||
      start.month !==
        end.month ||
      start.day !==
        end.day
    ) {
      return false;
    }
  
  
    const startMinutes =
      start.hour *
        60 +
      start.minute;
  
  
    const endMinutes =
      end.hour *
        60 +
      end.minute;
  
  
    const openingMinutes =
      APPOINTMENT_OPEN_HOUR *
      60;
  
  
    const closingMinutes =
      APPOINTMENT_CLOSE_HOUR *
      60;
  
  
    if (
      startMinutes <
      openingMinutes
    ) {
      return false;
    }
  
  
    if (
      startMinutes >=
      closingMinutes
    ) {
      return false;
    }
  
  
    if (
      endMinutes >
      closingMinutes
    ) {
      return false;
    }
  
  
    return true;
  }
  
  
  /*
   * =========================================================
   * formatAppointmentDateTime
   * =========================================================
   *
   * Customer/Admin-facing display:
   *
   * 2026年8月18日 周二 09:00
   * =========================================================
   */
  
  export function formatAppointmentDateTime(
    value:
      string | Date
  ) {
    const date =
      value instanceof Date
        ? value
        : new Date(
            value
          );
  
  
    return new Intl.DateTimeFormat(
      "zh-CN",
      {
        timeZone:
          APPOINTMENT_TIME_ZONE,
  
        year:
          "numeric",
  
        month:
          "long",
  
        day:
          "numeric",
  
        weekday:
          "short",
  
        hour:
          "2-digit",
  
        minute:
          "2-digit",
  
        hourCycle:
          "h23",
      }
    ).format(
      date
    );
  }

/*
 * =========================================================
 * mexicoCityLocalToUtc
 * =========================================================
 *
 * Input:
 * 2026-08-20
 * 10:30
 *
 * Meaning:
 * America/Mexico_City 2026-08-20 10:30
 *
 * Output:
 * UTC Date
 * =========================================================
 */

export function mexicoCityLocalToUtc(
    dateValue: string,
    timeValue: string
  ) {
    const dateMatch =
      /^(\d{4})-(\d{2})-(\d{2})$/.exec(
        dateValue
      );
  
    const timeMatch =
      /^(\d{2}):(\d{2})$/.exec(
        timeValue
      );
  
    if (
      !dateMatch ||
      !timeMatch
    ) {
      throw new Error(
        "预约日期或时间格式无效"
      );
    }
  
  
    const year =
      Number(dateMatch[1]);
  
    const month =
      Number(dateMatch[2]);
  
    const day =
      Number(dateMatch[3]);
  
    const hour =
      Number(timeMatch[1]);
  
    const minute =
      Number(timeMatch[2]);
  
  
    if (
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new Error(
        "预约时间格式无效"
      );
    }
  
  
    /*
     * Start with the requested wall-clock time
     * interpreted as UTC.
     */
    let utcMillis =
      Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
      );
  
  
    /*
     * Iteratively correct it according to
     * America/Mexico_City.
     */
    for (
      let attempt = 0;
      attempt < 3;
      attempt += 1
    ) {
      const current =
        new Date(
          utcMillis
        );
  
      const parts =
        getMexicoCityDateParts(
          current
        );
  
  
      const representedAsUtc =
        Date.UTC(
          parts.year,
          parts.month - 1,
          parts.day,
          parts.hour,
          parts.minute,
          0,
          0
        );
  
  
      const requestedAsUtc =
        Date.UTC(
          year,
          month - 1,
          day,
          hour,
          minute,
          0,
          0
        );
  
  
      const difference =
        requestedAsUtc -
        representedAsUtc;
  
  
      if (
        difference === 0
      ) {
        break;
      }
  
  
      utcMillis +=
        difference;
    }
  
  
    const result =
      new Date(
        utcMillis
      );
  
  
    const finalParts =
      getMexicoCityDateParts(
        result
      );
  
  
    if (
      finalParts.year !== year ||
      finalParts.month !== month ||
      finalParts.day !== day ||
      finalParts.hour !== hour ||
      finalParts.minute !== minute
    ) {
      throw new Error(
        "无法转换墨西哥城预约时间"
      );
    }
  
  
    return result;
  }
  
  
  /*
   * =========================================================
   * addMinutes
   * =========================================================
   */
  
  export function addMinutes(
    date: Date,
    minutes: number
  ) {
    return new Date(
      date.getTime() +
        minutes *
          60 *
          1000
    );
  }