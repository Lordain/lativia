-- =========================================================
-- Lesson 31-F
-- Appointment Meeting Support
-- =========================================================


alter table
public.order_appointments
add column if not exists
meeting_provider text;


alter table
public.order_appointments
add column if not exists
meeting_url text;


alter table
public.order_appointments
add column if not exists
meeting_title text;


alter table
public.order_appointments
add column if not exists
meeting_notes text;


alter table
public.order_appointments
drop constraint if exists
order_appointments_meeting_provider_check;


alter table
public.order_appointments
add constraint
order_appointments_meeting_provider_check
check (
  meeting_provider is null
  or
  meeting_provider in (
    'zoom',
    'google_meet',
    'microsoft_teams',
    'other'
  )
);


comment on column
public.order_appointments.meeting_provider
is
'Online meeting provider used for the consultation session.';


comment on column
public.order_appointments.meeting_url
is
'Customer-accessible online consultation meeting URL.';


comment on column
public.order_appointments.meeting_title
is
'Human-readable consultation session title.';


comment on column
public.order_appointments.meeting_notes
is
'Admin-managed meeting notes or joining instructions.';