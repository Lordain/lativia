-- ============================================================
-- Lesson 31-F
-- Admin Controlled Appointment Availability
--
-- Business rules:
--
-- 1. Default = unavailable.
-- 2. Only slots explicitly opened by Admin are bookable.
-- 3. Customer UI may still display unavailable slots,
--    but they are disabled.
-- 4. UI exposes only two states:
--
--      available
--      occupied
--
-- 5. "occupied" can internally mean:
--      - Admin did not open the slot
--      - Admin explicitly closed the slot
--      - another appointment already occupies the slot
--      - slot violates booking rules
--
-- 6. Mexico City timezone is the business timezone.
-- ============================================================


-- ============================================================
-- 1. Appointment availability slots
-- ============================================================

create table if not exists public.appointment_availability_slots (
  id uuid
    primary key
    default gen_random_uuid(),

  start_at timestamptz
    not null,

  end_at timestamptz
    not null,

  is_available boolean
    not null
    default false,

  created_by uuid
    references auth.users(id)
    on delete set null,

  updated_by uuid
    references auth.users(id)
    on delete set null,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint appointment_availability_slots_valid_range
    check (
      end_at > start_at
    ),

  constraint appointment_availability_slots_exact_hour
    check (
      extract(minute from start_at) = 0
      and
      extract(second from start_at) = 0
      and
      extract(minute from end_at) = 0
      and
      extract(second from end_at) = 0
    ),

  constraint appointment_availability_slots_one_hour
    check (
      end_at =
      start_at + interval '1 hour'
    )
);


-- ============================================================
-- 2. One availability row per slot
-- ============================================================

create unique index if not exists
appointment_availability_slots_start_at_unique
on public.appointment_availability_slots (
  start_at
);


-- ============================================================
-- 3. Useful query index
-- ============================================================

create index if not exists
appointment_availability_slots_range_idx
on public.appointment_availability_slots (
  start_at,
  end_at
);


-- ============================================================
-- 4. updated_at trigger
-- ============================================================

create or replace function public.touch_appointment_availability_slot_updated_at()
returns trigger
language plpgsql
set search_path = public
as $function$
begin

  new.updated_at :=
    now();

  return new;

end;
$function$;


drop trigger if exists
appointment_availability_slots_touch_updated_at
on public.appointment_availability_slots;


create trigger
appointment_availability_slots_touch_updated_at

before update
on public.appointment_availability_slots

for each row

execute function
public.touch_appointment_availability_slot_updated_at();


-- ============================================================
-- 5. RLS
--
-- No direct browser access.
--
-- Admin mutations will go through server-side code /
-- service-role client.
--
-- Customer availability will later be exposed through
-- controlled server-side booking functions.
-- ============================================================

alter table
public.appointment_availability_slots
enable row level security;


-- ============================================================
-- 6. Explicitly remove broad policies if this migration
-- is re-run in a development environment.
-- ============================================================

drop policy if exists
"appointment_availability_slots_authenticated_select"
on public.appointment_availability_slots;

drop policy if exists
"appointment_availability_slots_authenticated_insert"
on public.appointment_availability_slots;

drop policy if exists
"appointment_availability_slots_authenticated_update"
on public.appointment_availability_slots;

drop policy if exists
"appointment_availability_slots_authenticated_delete"
on public.appointment_availability_slots;


-- ============================================================
-- 7. Comments
-- ============================================================

comment on table
public.appointment_availability_slots
is
'Admin-controlled one-hour consultation availability. Missing rows and is_available=false are not bookable.';


comment on column
public.appointment_availability_slots.is_available
is
'Admin intent only. true means Admin opened the slot. Final customer availability must also check booking rules and appointment conflicts.';


comment on column
public.appointment_availability_slots.start_at
is
'Stored as timestamptz. Business UI interprets and displays time in America/Mexico_City.';


-- ============================================================
-- End
-- ============================================================