import {
    createAdminClient,
  } from "@/lib/supabase/admin";
  
  import type {
    AppointmentAvailabilityRule,
  } from "@/types/appointment";
  
  
  interface RuleRow {
    id:
      string;
  
    rule_key:
      string;
  
    timezone:
      string;
  
    open_weekdays:
      number[];
  
    open_time:
      string;
  
    close_time:
      string;
  
    slot_minutes:
      number;
  
    booking_window_days:
      number;
  
    minimum_notice_hours:
      number;
  
    is_active:
      boolean;
  }
  
  
  export async function getAppointmentAvailabilityRule():
    Promise<
      AppointmentAvailabilityRule |
      null
    > {
    const admin =
      createAdminClient();
  
  
    const {
      data,
      error,
    } =
      await admin
        .from(
          "appointment_availability_rules"
        )
        .select(`
          id,
          rule_key,
          timezone,
          open_weekdays,
          open_time,
          close_time,
          slot_minutes,
          booking_window_days,
          minimum_notice_hours,
          is_active
        `)
        .eq(
          "rule_key",
          "default"
        )
        .eq(
          "is_active",
          true
        )
        .maybeSingle();
  
  
    if (error) {
      console.error(
        "getAppointmentAvailabilityRule error:",
        error
      );
  
      throw new Error(
        "读取预约营业规则失败"
      );
    }
  
  
    if (!data) {
      return null;
    }
  
  
    const row =
      data as RuleRow;
  
  
    return {
      id:
        row.id,
  
      ruleKey:
        row.rule_key,
  
      timezone:
        row.timezone,
  
      openWeekdays:
        row.open_weekdays,
  
      openTime:
        row.open_time,
  
      closeTime:
        row.close_time,
  
      slotMinutes:
        row.slot_minutes,
  
      bookingWindowDays:
        row.booking_window_days,
  
      minimumNoticeHours:
        row.minimum_notice_hours,
  
      isActive:
        row.is_active,
    };
  }