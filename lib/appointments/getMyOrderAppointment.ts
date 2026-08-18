import {
  createClient,
} from "@/lib/supabase/server";

import {
  getAvailableAppointmentSlots,
} from "@/lib/appointments/getAvailableAppointmentSlots";

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


export async function getMyOrderAppointment(
  workspaceId:
    string
): Promise<OrderAppointmentData> {
  const supabase =
    await createClient();


  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth
      .getUser();


  if (
    userError ||
    !user
  ) {
    return {
      appointment:
        null,

      slots:
        [],

      rule:
        null,
    };
  }


  const {
    data:
      workspace,

    error:
      workspaceError,
  } =
    await supabase
      .from(
        "order_workspaces"
      )
      .select(`
        id,
        user_id
      `)
      .eq(
        "id",
        workspaceId
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();


  if (
    workspaceError ||
    !workspace
  ) {
    return {
      appointment:
        null,

      slots:
        [],

      rule:
        null,
    };
  }


  const {
    data:
      appointmentData,

    error:
      appointmentError,
  } =
    await supabase
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
        "customer_user_id",
        user.id
      )
      .eq(
        "status",
        "confirmed"
      )
      .maybeSingle();


  if (
    appointmentError
  ) {
    console.error(
      "getMyOrderAppointment appointment error:",
      appointmentError
    );

    throw new Error(
      "读取预约结果失败"
    );
  }


  const appointment =
    appointmentData
      ? mapAppointment(
          appointmentData as
            AppointmentRow
        )
      : null;


  if (
    appointment
  ) {
    const {
      rule,
    } =
      await getAvailableAppointmentSlots();


    return {
      appointment,

      slots:
        [],

      rule,
    };
  }


  const {
    rule,
    slots,
  } =
    await getAvailableAppointmentSlots();


  return {
    appointment:
      null,

    slots,

    rule,
  };
}