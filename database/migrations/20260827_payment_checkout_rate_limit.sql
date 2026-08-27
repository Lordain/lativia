begin;


/* =========================================================
 * Payment Checkout Attempt Rate Limit
 * ========================================================= */

create table if not exists
public.payment_checkout_attempts (
  id uuid
    primary key
    default gen_random_uuid(),

  user_id uuid
    not null
    references public.profiles(id)
    on delete cascade,

  order_id uuid
    not null
    references public.orders(id)
    on delete cascade,

  provider text
    not null,

  created_at timestamptz
    not null
    default now(),

  constraint
    payment_checkout_attempts_provider_check
  check (
    provider in (
      'stripe',
      'mercado_pago'
    )
  )
);


/*
 * Query path:
 *
 * user
 * → order
 * → provider
 * → recent created_at
 */
drop index if exists
public.payment_checkout_attempts_user_order_created_idx;


create index if not exists
payment_checkout_attempts_lookup_idx
on public.payment_checkout_attempts (
  user_id,
  order_id,
  provider,
  created_at desc
);


alter table
public.payment_checkout_attempts
enable row level security;


revoke all
on table
public.payment_checkout_attempts
from public, anon, authenticated;


/* =========================================================
 * Atomic Checkout Rate Limit
 *
 * Return value:
 *
 * 0   = allowed
 * 60  = retry after 60 seconds
 * 600 = retry after 10 minutes
 *
 * Locking the order row serializes concurrent checkout
 * attempts for the same order.
 * ========================================================= */

create or replace function
public.consume_payment_checkout_attempt(
  p_user_id uuid,
  p_order_id uuid,
  p_provider text
)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_count integer;
begin

  if p_provider not in (
    'stripe',
    'mercado_pago'
  ) then
    raise exception
      'INVALID_PAYMENT_PROVIDER';
  end if;


  /*
   * Lock the order.
   *
   * Also verifies that the order belongs
   * to the supplied user.
   */
  perform 1
  from public.orders
  where
    id = p_order_id
    and user_id = p_user_id
  for update;


  if not found then
    raise exception
      'ORDER_NOT_FOUND';
  end if;


  /*
   * Older rate-limit entries have no operational value.
   * Keep only the most recent 24 hours.
   */
  delete from
    public.payment_checkout_attempts
  where
    user_id = p_user_id
    and order_id = p_order_id
    and provider = p_provider
    and created_at <
      now() - interval '24 hours';


  /*
   * Max 2 attempts in 60 seconds.
   */
  select count(*)
  into v_count
  from public.payment_checkout_attempts
  where
    user_id = p_user_id
    and order_id = p_order_id
    and provider = p_provider
    and created_at >=
      now() - interval '60 seconds';


  if v_count >= 2 then
    return 60;
  end if;


  /*
   * Max 5 attempts in 10 minutes.
   */
  select count(*)
  into v_count
  from public.payment_checkout_attempts
  where
    user_id = p_user_id
    and order_id = p_order_id
    and provider = p_provider
    and created_at >=
      now() - interval '10 minutes';


  if v_count >= 5 then
    return 600;
  end if;


  insert into
    public.payment_checkout_attempts (
      user_id,
      order_id,
      provider
    )
  values (
    p_user_id,
    p_order_id,
    p_provider
  );


  return 0;

end;
$function$;


revoke execute on function
public.consume_payment_checkout_attempt(
  uuid,
  uuid,
  text
)
from public, anon, authenticated;


grant execute on function
public.consume_payment_checkout_attempt(
  uuid,
  uuid,
  text
)
to service_role;


commit;