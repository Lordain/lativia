import {
  requireAdmin,
} from "@/lib/auth/requireAdmin";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  getAppointmentAvailabilityRule,
} from "@/lib/appointments/getAppointmentAvailabilityRule";

import type {
  MeetingProvider,
  MeetingStatus,
  OrderAppointment,
  OrderAppointmentData,
} from "@/types/appointment";


interface AppointmentRow {
  id:
    string;

  workspace_id:
    string;

  order_id:
    string;

  customer_user_id:
    string;

  status:
    OrderAppointment["status"];

  starts_at:
    string;

  ends_at:
    string;

  booked_at:
    string;

  cancelled_at:
    string | null;

  cancelled_by:
    string | null;

  meeting_provider:
    MeetingProvider | null;

  meeting_url:
    string | null;

  meeting_title:
    string | null;

  meeting_notes:
    string | null;

  meeting_status:
    MeetingStatus;

  consultation_type:
    string | null;

  created_at:
    string;

  updated_at:
    string;
}


function mapAppointment(
  row:
    AppointmentRow
): OrderAppointment {
  return {
    id:
      row.id,

    workspaceId:
      row.workspace_id,

    orderId:
      row.order_id,

    customerUserId:
      row.customer_user_id,

    status:
      row.status,

    startsAt:
      row.starts_at,

    endsAt:
      row.ends_at,

    bookedAt:
      row.booked_at,

    cancelledAt:
      row.cancelled_at,

    cancelledBy:
      row.cancelled_by,

    meetingProvider:
      row.meeting_provider,

    meetingUrl:
      row.meeting_url,

    meetingTitle:
      row.meeting_title,

    meetingNotes:
      row.meeting_notes,

    meetingStatus:
      row.meeting_status,

    consultationType:
      row.consultation_type,

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  };
}


export async function getAdminOrderAppointment(
  workspaceId:
    string
): Promise<OrderAppointmentData> {
  await requireAdmin();


  const admin =
    createAdminClient();


  const [
    appointmentResult,
    rule,
  ] =
    await Promise.all([
      admin
        .from(
          "order_appointments"
        )
        .select(`
          id,
          workspace_id,
          order_id,
          customer_user_id,
          status,
          starts_at,
          ends_at,
          booked_at,
          cancelled_at,
          cancelled_by,
          meeting_provider,
          meeting_url,
          meeting_title,
          meeting_notes,
          meeting_status,
          consultation_type,
          created_at,
          updated_at
        `)
        .eq(
          "workspace_id",
          workspaceId
        )
        .eq(
          "status",
          "confirmed"
        )
        .maybeSingle(),

      getAppointmentAvailabilityRule(),
    ]);


  if (
    appointmentResult.error
  ) {
    console.error(
      "getAdminOrderAppointment error:",
      appointmentResult.error
    );

    throw new Error(
      "读取预约记录失败"
    );
  }


  return {
    appointment:
      appointmentResult.data
        ? mapAppointment(
            appointmentResult.data as
              AppointmentRow
          )
        : null,

    slots:
      [],

    rule,
  };
}