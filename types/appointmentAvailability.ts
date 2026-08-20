export interface AppointmentAvailabilitySlot {
  id:
    string | null;

  startAt:
    string;

  endAt:
    string;

  /*
   * Admin intent.
   */
  isAvailable:
    boolean;

  /*
   * Internal Admin state.
   *
   * true means a confirmed Order Appointment
   * currently occupies this time.
   *
   * UI still displays only:
   *
   * 可预约 / 已占用
   */
  isBooked:
    boolean;
}


export interface AppointmentAvailabilityDay {
  date:
    string;

  weekdayLabel:
    string;

  dateLabel:
    string;

  slots:
    AppointmentAvailabilitySlot[];
}


export interface AppointmentAvailabilityWeek {
  weekStart:
    string;

  weekEnd:
    string;

  days:
    AppointmentAvailabilityDay[];
}