-- =========================================================
-- Lesson 31
-- Order Workspace v1
-- =========================================================


-- =========================================================
-- 1. Order Workspace
--
-- 每个需要 Workspace 的订单最多一笔。
-- Workspace 是订单级运行状态，不是 Service Template。
-- =========================================================

create table if not exists public.order_workspaces (
  id uuid primary key default gen_random_uuid(),

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  service_id uuid not null
    references public.services(id),

  user_id uuid not null
    references auth.users(id),

  status text not null
    default 'active',

  started_at timestamptz,

  expires_at timestamptz,

  completed_at timestamptz,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint order_workspaces_order_unique
    unique (order_id),

  constraint order_workspaces_status_check
    check (
      status in (
        'active',
        'completed',
        'expired',
        'cancelled'
      )
    )
);


-- =========================================================
-- 2. Order Milestones
--
-- 建立 Workspace 时，从 services.completion_milestones
-- Snapshot 出来。
--
-- Service 后续即使修改 Milestones，
-- 已购买订单不会被改变。
-- =========================================================

create table if not exists public.order_milestones (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.order_workspaces(id)
    on delete cascade,

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  milestone_key text not null,

  label text not null,

  required boolean not null
    default true,

  status text not null
    default 'pending',

  completed_at timestamptz,

  completed_by uuid
    references auth.users(id),

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint order_milestones_workspace_key_unique
    unique (
      workspace_id,
      milestone_key
    ),

  constraint order_milestones_status_check
    check (
      status in (
        'pending',
        'completed'
      )
    )
);


-- =========================================================
-- 3. Workspace Messages
--
-- 客户可见沟通。
--
-- 注意：
-- 这和 fulfillment_activity 的内部备注不同。
--
-- fulfillment_activity:
--     Audit / Internal Operations
--
-- workspace_messages:
--     Customer-visible communication
-- =========================================================

create table if not exists public.workspace_messages (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null
    references public.order_workspaces(id)
    on delete cascade,

  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  sender_type text not null,

  sender_user_id uuid not null
    references auth.users(id),

  message text not null,

  created_at timestamptz not null
    default now(),

  constraint workspace_messages_sender_type_check
    check (
      sender_type in (
        'admin',
        'customer'
      )
    ),

  constraint workspace_messages_message_length_check
    check (
      char_length(message) >= 1
      and char_length(message) <= 10000
    )
);


-- =========================================================
-- Indexes
-- =========================================================

create index if not exists
  order_workspaces_user_id_idx
on public.order_workspaces (
  user_id
);


create index if not exists
  order_workspaces_service_id_idx
on public.order_workspaces (
  service_id
);


create index if not exists
  order_milestones_order_id_idx
on public.order_milestones (
  order_id
);


create index if not exists
  workspace_messages_workspace_created_idx
on public.workspace_messages (
  workspace_id,
  created_at
);


-- =========================================================
-- RLS
-- =========================================================

alter table public.order_workspaces
enable row level security;

alter table public.order_milestones
enable row level security;

alter table public.workspace_messages
enable row level security;


-- =========================================================
-- Customer Workspace Read
-- =========================================================

drop policy if exists
  "Customers can read own workspace"
on public.order_workspaces;

create policy
  "Customers can read own workspace"
on public.order_workspaces
for select
using (
  auth.uid() = user_id
);


-- =========================================================
-- Customer Milestone Read
--
-- 客户只能看自己的订单 Milestone。
-- 客户不能直接修改 milestone 状态。
-- =========================================================

drop policy if exists
  "Customers can read own milestones"
on public.order_milestones;

create policy
  "Customers can read own milestones"
on public.order_milestones
for select
using (
  exists (
    select 1
    from public.order_workspaces workspace
    where
      workspace.id =
        order_milestones.workspace_id
      and workspace.user_id =
        auth.uid()
  )
);


-- =========================================================
-- Customer Message Read
-- =========================================================

drop policy if exists
  "Customers can read own workspace messages"
on public.workspace_messages;

create policy
  "Customers can read own workspace messages"
on public.workspace_messages
for select
using (
  exists (
    select 1
    from public.order_workspaces workspace
    where
      workspace.id =
        workspace_messages.workspace_id
      and workspace.user_id =
        auth.uid()
  )
);


-- =========================================================
-- Customer Message Insert
--
-- 客户只能：
-- 1. 给自己的 Workspace 发消息
-- 2. sender_type 必须是 customer
-- 3. sender_user_id 必须是自己
-- =========================================================

drop policy if exists
  "Customers can send own workspace messages"
on public.workspace_messages;

create policy
  "Customers can send own workspace messages"
on public.workspace_messages
for insert
with check (
  sender_type =
    'customer'

  and sender_user_id =
    auth.uid()

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
);


-- =========================================================
-- Comments
-- =========================================================

comment on table public.order_workspaces is
'Order-level secure service workspace created for services that require a workspace.';

comment on table public.order_milestones is
'Order-level snapshot and progress of service completion milestones.';

comment on table public.workspace_messages is
'Customer-visible text communication inside the secure order workspace. Internal admin notes remain in fulfillment_activity.';