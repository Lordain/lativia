-- =========================================================
-- Appointment Calendar v1
--
-- Replace per-workspace manual slots with:
--
-- 1. Global availability rules
-- 2. Dynamic 14-day calendar
-- 3. Global appointment collision protection
-- 4. Atomic customer booking
-- =========================================================


-- =========================================================
-- 1. Global Availability Rules
-- =========================================================

create table if not exists
public.appointment_availability_rules (
  id uuid primary key
    default gen_random_uuid(),

  rule_key text not null
    unique,

  timezone text not null
    default 'America/Mexico_City',

  /*
   * ISO weekday:
   *
   * Monday = 1
   * ...
   * Sunday = 7
   */
  open_weekdays integer[] not null
    default array[1, 2, 3, 4, 5, 6],

  open_time time not null
    default '09:00',

  close_time time not null
    default '18:00',

  slot_minutes integer not null
    default 60,

  booking_window_days integer not null
    default 14,

  minimum_notice_hours integer not null
    default 12,

  is_active boolean not null
    default true,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint appointment_availability_slot_minutes_check
  check (
    slot_minutes between 15 and 240
  ),

  constraint appointment_availability_window_check
  check (
    booking_window_days between 1 and 90
  ),

  constraint appointment_availability_notice_check
  check (
    minimum_notice_hours between 0 and 168
  ),

  constraint appointment_availability_time_check
  check (
    close_time > open_time
  )
);


insert into
public.appointment_availability_rules (
  rule_key,
  timezone,
  open_weekdays,
  open_time,
  close_time,
  slot_minutes,
  booking_window_days,
  minimum_notice_hours,
  is_active
)
values (
  'default',
  'America/Mexico_City',
  array[1, 2, 3, 4, 5, 6],
  '09:00',
  '18:00',
  60,
  14,
  12,
  true
)
on conflict (
  rule_key
)
do nothing;


-- =========================================================
-- 2. Appointment owns its actual time
--
-- Old design:
-- appointment -> workspace_appointment_slots
--
-- New design:
-- appointment itself stores starts_at / ends_at.
--
-- slot_id becomes optional for backward compatibility
-- with existing test appointments.
-- =========================================================

alter table
public.order_appointments
add column if not exists
starts_at timestamptz;


alter table
public.order_appointments
add column if not exists
ends_at timestamptz;


alter table
public.order_appointments
alter column slot_id
drop not null;


-- =========================================================
-- 3. Backfill existing appointments
-- =========================================================

update
public.order_appointments appointment
set
  starts_at =
    slot.starts_at,

  ends_at =
    slot.ends_at

from
public.workspace_appointment_slots slot

where
  appointment.slot_id =
    slot.id

  and (
    appointment.starts_at is null
    or
    appointment.ends_at is null
  );


-- =========================================================
-- 4. Appointment Time Constraint
-- =========================================================

alter table
public.order_appointments
drop constraint if exists
order_appointments_time_check;


alter table
public.order_appointments
add constraint
order_appointments_time_check
check (
  (
    starts_at is null
    and
    ends_at is null
  )
  or
  (
    starts_at is not null
    and
    ends_at is not null
    and
    ends_at > starts_at
  )
);


-- =========================================================
-- 5. Global Collision Protection
--
-- This prevents:
--
-- Customer A: 10:00 - 11:00
-- Customer B: 10:00 - 11:00
--
-- It also protects against overlapping periods.
-- =========================================================

do $$
begin

  if not exists (
    select
      1

    from
      pg_constraint

    where
      conname =
        'order_appointments_no_confirmed_overlap'
  ) then

    alter table
    public.order_appointments

    add constraint
    order_appointments_no_confirmed_overlap

    exclude using gist (
      tstzrange(
        starts_at,
        ends_at,
        '[)'
      )
      with &&
    )

    where (
      status = 'confirmed'
      and
      starts_at is not null
      and
      ends_at is not null
    );

  end if;

end;
$$;


create index if not exists
order_appointments_calendar_idx
on public.order_appointments (
  starts_at,
  ends_at
)
where
  status = 'confirmed';


-- =========================================================
-- 6. Atomic Calendar Booking
-- =========================================================

create or replace function
public.book_workspace_appointment_time(
  p_workspace_id uuid,
  p_starts_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;

  v_workspace
    public.order_workspaces%rowtype;

  v_rule
    public.appointment_availability_rules%rowtype;

  v_local_start timestamp;

  v_local_end timestamp;

  v_ends_at timestamptz;

  v_minutes_from_open integer;

  v_appointment_id uuid;
begin

  -- =========================================
  -- Authentication
  -- =========================================

  v_user_id :=
    auth.uid();


  if v_user_id is null then
    raise exception
      'AUTH_REQUIRED';
  end if;


  -- =========================================
  -- Workspace
  -- =========================================

  select
    *

  into
    v_workspace

  from
    public.order_workspaces

  where
    id =
      p_workspace_id;


  if not found then
    raise exception
      'WORKSPACE_NOT_FOUND';
  end if;


  if
    v_workspace.user_id <>
    v_user_id
  then
    raise exception
      'FORBIDDEN';
  end if;


  if
    v_workspace.status <>
    'active'
  then
    raise exception
      'WORKSPACE_NOT_ACTIVE';
  end if;


  -- =========================================
  -- Availability Rule
  -- =========================================

  select
    *

  into
    v_rule

  from
    public.appointment_availability_rules

  where
    rule_key =
      'default'

    and
    is_active =
      true

  limit 1;


  if not found then
    raise exception
      'APPOINTMENT_RULE_NOT_FOUND';
  end if;


  -- =========================================
  -- Booking Window
  -- =========================================

  if
    p_starts_at <
    (
      now() +
      make_interval(
        hours =>
          v_rule.minimum_notice_hours
      )
    )
  then
    raise exception
      'MINIMUM_NOTICE_REQUIRED';
  end if;


  if
    p_starts_at >
    (
      now() +
      make_interval(
        days =>
          v_rule.booking_window_days
      )
    )
  then
    raise exception
      'OUTSIDE_BOOKING_WINDOW';
  end if;


  -- =========================================
  -- Local Mexico City Time
  -- =========================================

  v_local_start :=
    p_starts_at
    at time zone
      v_rule.timezone;


  v_local_end :=
    v_local_start +
    make_interval(
      mins =>
        v_rule.slot_minutes
    );


  v_ends_at :=
    p_starts_at +
    make_interval(
      mins =>
        v_rule.slot_minutes
    );


  -- =========================================
  -- Weekday Validation
  -- =========================================

  if not (
    extract(
      isodow
      from
        v_local_start
    )::integer =
    any(
      v_rule.open_weekdays
    )
  ) then
    raise exception
      'DAY_NOT_AVAILABLE';
  end if;


  -- =========================================
  -- Business Hours
  -- =========================================

  if
    v_local_start::time <
    v_rule.open_time
  then
    raise exception
      'OUTSIDE_BUSINESS_HOURS';
  end if;


  if
    v_local_end::time >
    v_rule.close_time
  then
    raise exception
      'OUTSIDE_BUSINESS_HOURS';
  end if;


  if
    v_local_end::date <>
    v_local_start::date
  then
    raise exception
      'OUTSIDE_BUSINESS_HOURS';
  end if;


  -- =========================================
  -- Slot Alignment
  --
  -- With 60-minute slots:
  --
  -- 09:00 ✅
  -- 10:00 ✅
  -- 10:30 ❌
  -- =========================================

  v_minutes_from_open :=
    floor(
      extract(
        epoch
        from (
          v_local_start::time -
          v_rule.open_time
        )
      ) /
      60
    )::integer;


  if
    v_minutes_from_open <
    0
  then
    raise exception
      'INVALID_SLOT_TIME';
  end if;


  if
    mod(
      v_minutes_from_open,
      v_rule.slot_minutes
    ) <>
    0
  then
    raise exception
      'INVALID_SLOT_TIME';
  end if;


  -- =========================================
  -- One Appointment Per Workspace
  -- =========================================

  if exists (
    select
      1

    from
      public.order_appointments

    where
      workspace_id =
        v_workspace.id

      and
      status =
        'confirmed'
  ) then
    raise exception
      'APPOINTMENT_ALREADY_EXISTS';
  end if;


  -- =========================================
  -- Create Appointment
  --
  -- Global overlap constraint protects
  -- concurrent bookings.
  -- =========================================

  begin

    insert into
    public.order_appointments (
      workspace_id,
      order_id,
      slot_id,
      customer_user_id,
      status,
      starts_at,
      ends_at,
      meeting_status,
      consultation_type
    )
    values (
      v_workspace.id,
      v_workspace.order_id,
      null,
      v_user_id,
      'confirmed',
      p_starts_at,
      v_ends_at,
      'pending',
      null
    )
    returning
      id
    into
      v_appointment_id;


  exception

    when exclusion_violation then

      raise exception
        'SLOT_NOT_AVAILABLE';

  end;


  return
    v_appointment_id;

end;
$$;


-- Security-definer functions should not remain
-- executable by PUBLIC.

revoke all
on function
public.book_workspace_appointment_time(
  uuid,
  timestamptz
)
from public;


grant execute
on function
public.book_workspace_appointment_time(
  uuid,
  timestamptz
)
to authenticated;