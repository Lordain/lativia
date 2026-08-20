-- ============================================================
-- Lesson 31-F4
-- Appointment booking window = next 10 calendar days
-- ============================================================

update public.appointment_availability_rules
set
  booking_window_days = 10,
  updated_at = now()
where
  rule_key = 'default';


-- Verification
select
  rule_key,
  timezone,
  open_weekdays,
  open_time,
  close_time,
  slot_minutes,
  booking_window_days,
  minimum_notice_hours,
  is_active
from public.appointment_availability_rules
where rule_key = 'default';