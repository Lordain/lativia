-- =========================================================
-- Lesson 31-F
-- Workspace Appointment Scheduling v1
-- =========================================================


-- =========================================================
-- 1. Workspace Appointment Slots
--
-- Admin creates specific appointment options
-- for one Order Workspace.
-- =========================================================

create table if not exists
public.workspace_appointment_slots (
  id uuid primary key
    default gen_random_uuid(),

  workspace_id uuid not null
    references public.order_workspaces(id)
    on delete cascade,

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  starts_at timestamptz not null,

  ends_at timestamptz not null,

  status text not null
    default 'available',

  created_by uuid
    references auth.users(id),

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint workspace_appointment_slots_time_check
  check (
    ends_at > starts_at
  ),

  constraint workspace_appointment_slots_status_check
  check (
    status in (
      'available',
      'booked',
      'cancelled'
    )
  )
);


create index if not exists
workspace_appointment_slots_workspace_idx
on public.workspace_appointment_slots (
  workspace_id,
  starts_at
);


create index if not exists
workspace_appointment_slots_order_idx
on public.workspace_appointment_slots (
  order_id,
  starts_at
);


-- =========================================================
-- 2. Order Appointments
--
-- Represents the customer's confirmed appointment.
-- =========================================================

create table if not exists
public.order_appointments (
  id uuid primary key
    default gen_random_uuid(),

  workspace_id uuid not null
    references public.order_workspaces(id)
    on delete cascade,

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  slot_id uuid not null
    references public.workspace_appointment_slots(id)
    on delete restrict,

  customer_user_id uuid not null
    references auth.users(id),

  status text not null
    default 'confirmed',

  booked_at timestamptz not null
    default now(),

  cancelled_at timestamptz,

  cancelled_by uuid
    references auth.users(id),

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint order_appointments_status_check
  check (
    status in (
      'confirmed',
      'cancelled'
    )
  )
);


create index if not exists
order_appointments_workspace_idx
on public.order_appointments (
  workspace_id,
  created_at
);


-- =========================================================
-- 3. One Active Appointment Per Workspace
-- =========================================================

create unique index if not exists
order_appointments_one_confirmed_per_workspace_idx
on public.order_appointments (
  workspace_id
)
where status = 'confirmed';


-- =========================================================
-- 4. One Active Appointment Per Slot
-- =========================================================

create unique index if not exists
order_appointments_one_confirmed_per_slot_idx
on public.order_appointments (
  slot_id
)
where status = 'confirmed';


-- =========================================================
-- 5. Customer RLS
-- =========================================================

alter table
public.workspace_appointment_slots
enable row level security;


alter table
public.order_appointments
enable row level security;


drop policy if exists
"Customers can view own appointment slots"
on public.workspace_appointment_slots;


create policy
"Customers can view own appointment slots"
on public.workspace_appointment_slots
for select
using (
  exists (
    select 1
    from public.order_workspaces workspace
    where
      workspace.id =
        workspace_appointment_slots.workspace_id

      and workspace.user_id =
        auth.uid()
  )
);


drop policy if exists
"Customers can view own appointments"
on public.order_appointments;


create policy
"Customers can view own appointments"
on public.order_appointments
for select
using (
  customer_user_id =
    auth.uid()
);


-- =========================================================
-- 6. Atomic Customer Booking RPC
--
-- Customer does NOT directly insert Appointment rows.
--
-- This RPC:
--
-- 1. locks Slot
-- 2. checks ownership
-- 3. checks Workspace active
-- 4. checks Slot available
-- 5. checks no existing appointment
-- 6. marks Slot booked
-- 7. creates Appointment
--
-- All in one transaction.
-- =========================================================

create or replace function
public.book_workspace_appointment(
  p_slot_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;

  v_slot
    public.workspace_appointment_slots%rowtype;

  v_workspace
    public.order_workspaces%rowtype;

  v_appointment_id uuid;
begin

  v_user_id :=
    auth.uid();


  if v_user_id is null then
    raise exception
      'AUTH_REQUIRED';
  end if;


  /*
   * Lock the Slot.
   *
   * Concurrent requests attempting to book
   * the same Slot must wait here.
   */

  select *
  into v_slot
  from public.workspace_appointment_slots
  where id =
    p_slot_id
  for update;


  if not found then
    raise exception
      'SLOT_NOT_FOUND';
  end if;


  if v_slot.status <>
    'available'
  then
    raise exception
      'SLOT_NOT_AVAILABLE';
  end if;


  /*
   * Read Workspace.
   */

  select *
  into v_workspace
  from public.order_workspaces
  where id =
    v_slot.workspace_id;


  if not found then
    raise exception
      'WORKSPACE_NOT_FOUND';
  end if;


  /*
   * Customer must own Workspace.
   */

  if v_workspace.user_id <>
    v_user_id
  then
    raise exception
      'FORBIDDEN';
  end if;


  /*
   * Workspace must still be active.
   */

  if v_workspace.status <>
    'active'
  then
    raise exception
      'WORKSPACE_NOT_ACTIVE';
  end if;


  /*
   * One active appointment per Workspace.
   */

  if exists (
    select 1
    from public.order_appointments
    where
      workspace_id =
        v_workspace.id

      and status =
        'confirmed'
  ) then
    raise exception
      'APPOINTMENT_ALREADY_EXISTS';
  end if;


  /*
   * Mark Slot booked.
   */

  update public.workspace_appointment_slots
  set
    status =
      'booked',

    updated_at =
      now()

  where id =
    v_slot.id;


  /*
   * Create Appointment.
   */

  insert into public.order_appointments (
    workspace_id,
    order_id,
    slot_id,
    customer_user_id,
    status
  )
  values (
    v_workspace.id,
    v_slot.order_id,
    v_slot.id,
    v_user_id,
    'confirmed'
  )
  returning id
  into v_appointment_id;


  return
    v_appointment_id;
end;
$$;


grant execute
on function
public.book_workspace_appointment(uuid)
to authenticated;