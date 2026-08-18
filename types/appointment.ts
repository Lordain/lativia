export type OrderAppointmentStatus =
  | "confirmed"
  | "cancelled";


export type MeetingProvider =
  | "zoom"
  | "google_meet"
  | "microsoft_teams"
  | "other";


export type MeetingStatus =
  | "pending"
  | "ready"
  | "completed"
  | "cancelled";


export interface AppointmentAvailabilityRule {
  id:
    string;

  ruleKey:
    string;

  timezone:
    string;

  openWeekdays:
    number[];

  openTime:
    string;

  closeTime:
    string;

  slotMinutes:
    number;

  bookingWindowDays:
    number;

  minimumNoticeHours:
    number;

  isActive:
    boolean;
}


export interface AvailableAppointmentSlot {
  id:
    string;

  startsAt:
    string;

  endsAt:
    string;
}


export interface OrderAppointment {
  id:
    string;

  workspaceId:
    string;

  orderId:
    string;

  customerUserId:
    string;

  status:
    OrderAppointmentStatus;

  startsAt:
    string;

  endsAt:
    string;

  bookedAt:
    string;

  cancelledAt:
    string | null;

  cancelledBy:
    string | null;


  /*
   * Online Meeting
   */

  meetingProvider:
    MeetingProvider | null;

  meetingUrl:
    string | null;

  meetingTitle:
    string | null;

  meetingNotes:
    string | null;

  meetingStatus:
    MeetingStatus;

  consultationType:
    string | null;


  createdAt:
    string;

  updatedAt:
    string;
}


export interface OrderAppointmentData {
  appointment:
    OrderAppointment | null;

  slots:
    AvailableAppointmentSlot[];

  rule:
    AppointmentAvailabilityRule | null;
}