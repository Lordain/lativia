/*
 * =========================================================
 * Appointment Business Hours
 * =========================================================
 *
 * Phase 1 default business schedule:
 *
 * Timezone:
 * America/Mexico_City
 *
 * Monday - Saturday:
 * 09:00 - 18:00
 *
 * Sunday:
 * Closed
 *
 * Important:
 *
 * Database stores appointment timestamps as timestamptz.
 * Business rule validation must always use
 * America/Mexico_City local time.
 * =========================================================
 */


export const APPOINTMENT_TIME_ZONE =
  "America/Mexico_City";


export const APPOINTMENT_OPEN_HOUR =
  9;


export const APPOINTMENT_CLOSE_HOUR =
  18;


/*
 * JavaScript weekday:
 *
 * Sunday = 0
 * Monday = 1
 * ...
 * Saturday = 6
 */

export const APPOINTMENT_OPEN_WEEKDAYS =
  [
    1,
    2,
    3,
    4,
    5,
    6,
  ] as const;


export const CETES_DEFAULT_APPOINTMENT_MINUTES =
  30;