begin;


/* =========================================================
 * Admin Login Attempt Rate Limit
 *
 * No raw username or IP address is stored.
 * Only SHA-256 hashes generated server-side are persisted.
 * ========================================================= */

create table if not exists
public.admin_login_attempts (
  id uuid
    primary key
    default gen_random_uuid(),

  identifier_hash text
    not null,

  source_hash text
    not null,

  created_at timestamptz
    not null
    default now(),

  constraint
    admin_login_attempts_identifier_hash_check
  check (
    char_length(identifier_hash) = 64
  ),

  constraint
    admin_login_attempts_source_hash_check
  check (
    char_length(source_hash) = 64
  )
);


/*
 * Username + source lookup.
 */
create index if not exists
admin_login_attempts_identifier_source_idx
on public.admin_login_attempts (
  identifier_hash,
  source_hash,
  created_at desc
);


/*
 * Source-only lookup.
 *
 * Used to limit password spraying across
 * multiple usernames from one source.
 */
create index if not exists
admin_login_attempts_source_idx
on public.admin_login_attempts (
  source_hash,
  created_at desc
);


alter table
public.admin_login_attempts
enable row level security;


revoke all
on table
public.admin_login_attempts
from public, anon, authenticated;


/* =========================================================
 * Consume Admin Login Attempt
 *
 * Return value:
 *
 * 0   = allowed
 * 900 = retry later
 *
 * Limits:
 *
 * Same username + source:
 * max 5 attempts / 15 minutes
 *
 * Same source:
 * max 20 attempts / 15 minutes
 * ========================================================= */

create or replace function
public.consume_admin_login_attempt(
  p_identifier_hash text,
  p_source_hash text
)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_count integer;
begin

  if
    p_identifier_hash is null
    or char_length(p_identifier_hash) <> 64
    or p_source_hash is null
    or char_length(p_source_hash) <> 64
  then
    raise exception
      'INVALID_ADMIN_LOGIN_RATE_LIMIT_INPUT';
  end if;


  /*
   * Serialize attempts for the same source.
   *
   * This prevents parallel requests from easily
   * bypassing the counters.
   */
  perform pg_advisory_xact_lock(
    hashtextextended(
      'admin-login-source:' ||
      p_source_hash,
      0
    )
  );


  /*
   * Attempts older than 24 hours have
   * no operational value.
   */
  delete from
    public.admin_login_attempts
  where
    source_hash = p_source_hash
    and created_at <
      now() - interval '24 hours';


  /*
   * Max 5 attempts for the same
   * username + source in 15 minutes.
   */
  select count(*)
  into v_count
  from public.admin_login_attempts
  where
    identifier_hash =
      p_identifier_hash
    and source_hash =
      p_source_hash
    and created_at >=
      now() - interval '15 minutes';


  if v_count >= 5 then
    return 900;
  end if;


  /*
   * Max 20 attempts from one source
   * across all usernames in 15 minutes.
   */
  select count(*)
  into v_count
  from public.admin_login_attempts
  where
    source_hash =
      p_source_hash
    and created_at >=
      now() - interval '15 minutes';


  if v_count >= 20 then
    return 900;
  end if;


  insert into
    public.admin_login_attempts (
      identifier_hash,
      source_hash
    )
  values (
    p_identifier_hash,
    p_source_hash
  );


  return 0;

end;
$function$;


/* =========================================================
 * Clear Successful Login Attempts
 * ========================================================= */

create or replace function
public.clear_admin_login_attempts(
  p_identifier_hash text,
  p_source_hash text
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
begin

  delete from
    public.admin_login_attempts
  where
    identifier_hash =
      p_identifier_hash
    and source_hash =
      p_source_hash;

end;
$function$;


/*
 * Nobody except service_role may execute
 * these functions.
 */

revoke execute on function
public.consume_admin_login_attempt(
  text,
  text
)
from public, anon, authenticated;


revoke execute on function
public.clear_admin_login_attempts(
  text,
  text
)
from public, anon, authenticated;


grant execute on function
public.consume_admin_login_attempt(
  text,
  text
)
to service_role;


grant execute on function
public.clear_admin_login_attempts(
  text,
  text
)
to service_role;


commit;