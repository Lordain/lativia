-- ============================================================
-- Lesson 31-F3
-- Admin Availability + Order Appointment Integration
-- ============================================================


create or replace function
public.book_workspace_appointment_time(
  p_workspace_id uuid,
  p_starts_at timestamptz
)
returns uuid
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_user_id uuid;

  v_workspace
    public.order_workspaces%rowtype;

  v_order
    public.orders%rowtype;

  v_rule
    public.appointment_availability_rules%rowtype;

  v_availability
    public.appointment_availability_slots%rowtype;

  v_local_start timestamp;

  v_local_end timestamp;

  v_ends_at timestamptz;

  v_minutes_from_open integer;

  v_appointment_id uuid;

begin

  -- ========================================================
  -- 1. Authentication
  -- ========================================================

  v_user_id :=
    auth.uid();


  if v_user_id is null then
    raise exception
      'AUTH_REQUIRED';
  end if;


  -- ========================================================
  -- 2. Workspace
  -- ========================================================

  select *
  into v_workspace
  from public.order_workspaces
  where id =
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


  -- ========================================================
  -- 3. Order
  -- ========================================================

  select *
  into v_order
  from public.orders
  where id =
    v_workspace.order_id;


  if not found then
    raise exception
      'ORDER_NOT_FOUND';
  end if;


  if
    v_order.user_id <>
    v_user_id
  then
    raise exception
      'FORBIDDEN';
  end if;


  if
    v_order.payment_status <>
    'paid'
  then
    raise exception
      'ORDER_NOT_PAID';
  end if;


  if
    v_order.status =
    'cancelled'
  then
    raise exception
      'ORDER_NOT_ACTIVE';
  end if;


  -- ========================================================
  -- 4. Availability Rule
  -- ========================================================

  select *
  into v_rule
  from public.appointment_availability_rules
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


  -- ========================================================
  -- 5. Booking Window
  -- ========================================================

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


  -- ========================================================
  -- 6. Local Mexico City Time
  -- ========================================================

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


  -- ========================================================
  -- 7. Weekday
  -- ========================================================

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


  -- ========================================================
  -- 8. Business Hours
  -- ========================================================

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


  -- ========================================================
  -- 9. Slot Alignment
  -- ========================================================

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


  -- ========================================================
  -- 10. Admin Availability
  --
  -- IMPORTANT:
  -- Lock the Admin availability row.
  --
  -- Missing row = unavailable.
  -- false       = unavailable.
  -- true        = Admin explicitly opened.
  -- ========================================================

  select *
  into v_availability
  from public.appointment_availability_slots
  where
    start_at =
      p_starts_at
  for update;


  if not found then
    raise exception
      'SLOT_NOT_AVAILABLE';
  end if;


  if
    v_availability.is_available <>
    true
  then
    raise exception
      'SLOT_NOT_AVAILABLE';
  end if;


  if
    v_availability.end_at <>
    v_ends_at
  then
    raise exception
      'SLOT_NOT_AVAILABLE';
  end if;


  -- ========================================================
  -- 11. One confirmed Appointment per Workspace
  -- ========================================================

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


  -- ========================================================
  -- 12. Create Appointment
  --
  -- Existing exclusion constraint is the final
  -- protection against concurrent double booking.
  -- ========================================================

  begin

    insert into
    public.order_appointments (
      workspace_id,
      order_id,
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
$function$;


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


-- ============================================================
-- End
-- ============================================================