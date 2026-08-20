export const APPOINTMENT_TIMEZONE =
  "America/Mexico_City";

export const APPOINTMENT_TIMEZONE_OFFSET =
  "-06:00";

export const APPOINTMENT_SLOT_DURATION_MINUTES =
  60;

export const APPOINTMENT_START_HOUR =
  9;

export const APPOINTMENT_END_HOUR =
  18;

/*
 * 周一～周六。
 *
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
 */
export const APPOINTMENT_WORKING_WEEKDAYS =
  [
    1,
    2,
    3,
    4,
    5,
    6,
  ] as const;

export const APPOINTMENT_WEEKDAY_LABELS: Record<
  number,
  string
> = {
  0: "周日",
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
};