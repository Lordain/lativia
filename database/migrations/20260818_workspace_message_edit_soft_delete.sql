-- =========================================================
-- Lesson 31
-- Workspace Message Edit + Soft Delete
-- =========================================================


-- =========================================================
-- 1. Upgrade workspace_messages
-- =========================================================

alter table public.workspace_messages
add column if not exists edited_at timestamptz;

alter table public.workspace_messages
add column if not exists deleted_at timestamptz;

alter table public.workspace_messages
add column if not exists deleted_by uuid
references auth.users(id);


-- =========================================================
-- 2. Allow future system messages
--
-- system:
-- automatic service welcome message
-- =========================================================

alter table public.workspace_messages
drop constraint if exists
workspace_messages_sender_type_check;

alter table public.workspace_messages
add constraint
workspace_messages_sender_type_check
check (
  sender_type in (
    'admin',
    'customer',
    'system'
  )
);


-- =========================================================
-- 3. sender_user_id
--
-- system messages do not have a real user.
-- =========================================================

alter table public.workspace_messages
alter column sender_user_id
drop not null;


alter table public.workspace_messages
drop constraint if exists
workspace_messages_sender_identity_check;

alter table public.workspace_messages
add constraint
workspace_messages_sender_identity_check
check (
  (
    sender_type = 'system'
    and sender_user_id is null
  )
  or
  (
    sender_type in (
      'admin',
      'customer'
    )
    and sender_user_id is not null
  )
);


-- =========================================================
-- 4. Message Revisions
-- =========================================================

create table if not exists
public.workspace_message_revisions (
  id uuid primary key
    default gen_random_uuid(),

  message_id uuid not null
    references public.workspace_messages(id)
    on delete cascade,

  workspace_id uuid not null
    references public.order_workspaces(id)
    on delete cascade,

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  edited_by uuid not null
    references auth.users(id),

  editor_type text not null,

  previous_message text not null,

  new_message text not null,

  created_at timestamptz not null
    default now(),

  constraint workspace_message_revisions_editor_type_check
  check (
    editor_type in (
      'admin',
      'customer'
    )
  )
);


create index if not exists
workspace_message_revisions_message_id_idx
on public.workspace_message_revisions (
  message_id,
  created_at
);


-- =========================================================
-- 5. Customer update policy
--
-- Customer can only update own active message.
--
-- Important:
-- RLS cannot safely enforce every field-change rule.
-- Actual edit/delete server actions will validate ownership
-- and allowed mutations before update.
-- =========================================================

drop policy if exists
"Customers can update own workspace messages"
on public.workspace_messages;

create policy
"Customers can update own workspace messages"
on public.workspace_messages
for update
using (
  sender_type = 'customer'
  and sender_user_id = auth.uid()
  and exists (
    select 1
    from public.order_workspaces workspace
    where
      workspace.id =
        workspace_messages.workspace_id
      and workspace.user_id =
        auth.uid()
      and workspace.status =
        'active'
  )
)
with check (
  sender_type = 'customer'
  and sender_user_id = auth.uid()
);


-- =========================================================
-- 6. Revision RLS
--
-- Customer does NOT need direct access to revisions.
-- Admin reads through service-role server code later if needed.
-- =========================================================

alter table public.workspace_message_revisions
enable row level security;


comment on table
public.workspace_message_revisions
is
'Immutable edit history for customer-visible workspace messages.';


comment on column
public.workspace_messages.deleted_at
is
'Soft-delete timestamp. Deleted workspace messages remain stored for service audit context.';


comment on column
public.workspace_messages.edited_at
is
'Timestamp of the latest message edit.';