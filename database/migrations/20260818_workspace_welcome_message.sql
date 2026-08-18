-- =========================================================
-- Lesson 31-E7
-- Workspace Automatic Welcome Message
-- =========================================================


-- =========================================================
-- 1. Service-level welcome message template
-- =========================================================

alter table public.services
add column if not exists
workspace_welcome_message text;


comment on column
public.services.workspace_welcome_message
is
'Admin-defined automatic first message shown in the order workspace after payment.';


-- =========================================================
-- 2. Message kind
--
-- message = normal admin/customer/system message
-- welcome = automatic service welcome message
-- =========================================================

alter table public.workspace_messages
add column if not exists
message_kind text not null
default 'message';


alter table public.workspace_messages
drop constraint if exists
workspace_messages_message_kind_check;


alter table public.workspace_messages
add constraint
workspace_messages_message_kind_check
check (
  message_kind in (
    'message',
    'welcome'
  )
);


-- =========================================================
-- 3. Only one welcome message per Workspace
--
-- This is the DB-level idempotency guarantee.
-- Stripe / Mercado Pago / Repair retries cannot create
-- duplicate welcome messages.
-- =========================================================

create unique index if not exists
workspace_messages_one_welcome_per_workspace_idx
on public.workspace_messages (
  workspace_id
)
where message_kind = 'welcome';


-- =========================================================
-- 4. Cetes initial welcome message
-- =========================================================

update public.services
set
  workspace_welcome_message =
'您好，我们已经收到您的 Cetesdirecto 中文操作咨询订单。

开始服务前，请确认您已经准备好：
• 有效的墨西哥居留身份
• RFC
• 本人名下墨西哥银行账户
• 本人银行 CLABE

请勿通过平台发送银行密码、短信验证码、OTP、Token、CVV 或 Cetesdirecto 登录密码。

下一步请在下方「预约咨询」选择适合您的咨询时间。

如果您已经进行到某一步，也可以直接在「服务沟通」告诉我们当前进度和遇到的问题。'
where slug =
  'cetesdirecto-consultation';