/*
 * ============================================================
 * Admin Login Identities
 *
 * Purpose:
 *
 * Provide a dedicated username-based login identity for
 * administrative users without changing customer authentication.
 *
 * Passwords are NOT stored here.
 * Password verification remains managed by Supabase Auth.
 * ============================================================
 */

create table if not exists
public.admin_login_identities (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  username text not null,

  created_at timestamptz
    not null default now(),

  updated_at timestamptz
    not null default now(),

  constraint admin_login_identities_username_format
    check (
      username = lower(username)
      and username ~ '^[a-z0-9][a-z0-9._-]{3,31}$'
    )
);

create unique index if not exists
admin_login_identities_username_unique
on public.admin_login_identities (
  lower(username)
);

alter table
public.admin_login_identities
enable row level security;

/*
 * No customer-facing RLS policies are intentionally created.
 *
 * Access is performed only through the server-side
 * Supabase service-role client.
 */