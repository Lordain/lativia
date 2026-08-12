export const BUSINESS_TIME_ZONE =
  "America/Mexico_City";

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function getZonedDateParts(
  date: Date,
  timeZone: string
): DateParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }
    );

  const parts =
    formatter.formatToParts(
      date
    );

  const values =
    Object.fromEntries(
      parts
        .filter(
          (part) =>
            part.type !==
            "literal"
        )
        .map((part) => [
          part.type,
          part.value,
        ])
    );

  return {
    year:
      Number(values.year),

    month:
      Number(values.month),

    day:
      Number(values.day),

    hour:
      Number(values.hour),

    minute:
      Number(values.minute),

    second:
      Number(values.second),
  };
}

function getTimeZoneOffset(
  date: Date,
  timeZone: string
) {
  const parts =
    getZonedDateParts(
      date,
      timeZone
    );

  const asUTC =
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );

  return (
    asUTC -
    date.getTime()
  );
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
) {
  const initialUtc =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      second
    );

  const initialDate =
    new Date(initialUtc);

  const offset =
    getTimeZoneOffset(
      initialDate,
      timeZone
    );

  return new Date(
    initialUtc -
      offset
  );
}

export function getBusinessDayRange(
  now = new Date()
) {
  const local =
    getZonedDateParts(
      now,
      BUSINESS_TIME_ZONE
    );

  const start =
    zonedDateTimeToUtc(
      local.year,
      local.month,
      local.day,
      0,
      0,
      0,
      BUSINESS_TIME_ZONE
    );

  const tomorrowReference =
    new Date(
      Date.UTC(
        local.year,
        local.month - 1,
        local.day + 1,
        12,
        0,
        0
      )
    );

  const tomorrow =
    getZonedDateParts(
      tomorrowReference,
      BUSINESS_TIME_ZONE
    );

  const end =
    zonedDateTimeToUtc(
      tomorrow.year,
      tomorrow.month,
      tomorrow.day,
      0,
      0,
      0,
      BUSINESS_TIME_ZONE
    );

  return {
    start,
    end,
  };
}