-- =========================================================
-- Workspace Message Hardening + Privacy Cleanup
-- =========================================================


-- =========================================================
-- 1. workspace_messages
--
-- Customer reads through authenticated + RLS.
-- All writes are performed by validated Server Actions
-- through service_role.
-- =========================================================

alter table public.workspace_messages
enable row level security;


revoke all
on table public.workspace_messages
from anon;

revoke all
on table public.workspace_messages
from authenticated;

grant select
on table public.workspace_messages
to authenticated;


drop policy if exists
"Customers can read own workspace messages"
on public.workspace_messages;

create policy
"Customers can read own workspace messages"
on public.workspace_messages
for select
to authenticated
using (
  exists (
    select 1
    from public.order_workspaces workspace
    where
      workspace.id =
        workspace_messages.workspace_id

      and workspace.order_id =
        workspace_messages.order_id

      and workspace.user_id =
        auth.uid()
  )
);


drop policy if exists
"Customers can send own workspace messages"
on public.workspace_messages;

drop policy if exists
"Customers can update own workspace messages"
on public.workspace_messages;



-- =========================================================
-- 2. workspace_message_revisions
--
-- Revision rows contain complete historical message text.
-- They are server-only and never customer-readable.
-- =========================================================

alter table public.workspace_message_revisions
enable row level security;


revoke all
on table public.workspace_message_revisions
from anon;

revoke all
on table public.workspace_message_revisions
from authenticated;



-- =========================================================
-- 3. Privacy cleanup RPC
--
-- Production source-of-truth function is now tracked
-- in migrations.
--
-- Revisions contain duplicated free-form message content
-- and are deleted once the order reaches its cleanup due time.
--
-- Current workspace message rows remain as audit skeletons,
-- but customer/admin free-form text is replaced.
-- =========================================================

create or replace function
public.cleanup_order_temporary_data(
  p_order_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $function$
declare
  v_status text;
  v_due_at timestamptz;
  v_storage_pending boolean;
begin

  /*
   * =========================================
   * Lock order
   * =========================================
   */

  select
    data_cleanup_status,
    data_cleanup_due_at
  into
    v_status,
    v_due_at
  from public.orders
  where id = p_order_id
  for update;


  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;


  if v_status = 'completed' then
    return;
  end if;


  if v_due_at is null then
    raise exception 'DATA_CLEANUP_NOT_SCHEDULED';
  end if;


  if now() < v_due_at then
    raise exception 'DATA_CLEANUP_NOT_DUE';
  end if;


  /*
   * =========================================
   * Storage guard
   * =========================================
   */

  select exists(
    select 1
    from public.order_documents
    where
      order_id = p_order_id

      and storage_path
        is not null

      and status <>
        'content_deleted'
  )
  into
    v_storage_pending;


  if v_storage_pending then

    update public.orders
    set
      data_cleanup_status =
        'scheduled',

      data_cleanup_last_error =
        'STORAGE_CONTENT_PENDING',

      updated_at =
        now()
    where id = p_order_id;


    return;
  end if;


  /*
   * =========================================
   * Processing
   * =========================================
   */

  update public.orders
  set
    data_cleanup_status =
      'processing',

    data_cleanup_last_error =
      null,

    updated_at =
      now()
  where id = p_order_id;


  /*
   * =========================================
   * 1. Main order business data
   * =========================================
   */

  update public.orders
  set
    form_data =
      '{}'::jsonb,

    admin_note =
      null,

    updated_at =
      now()
  where id = p_order_id;


  /*
   * =========================================
   * 2. Customer correction submissions
   * =========================================
   */

  update public.customer_action_submissions
  set
    submitted_data =
      '{}'::jsonb,

    review_reason =
      null
  where order_id =
    p_order_id;


  /*
   * =========================================
   * 3. Customer action requests
   * =========================================
   */

  update public.customer_action_requests car
  set
    message =
      null,

    requested_fields =
      coalesce(
        (
          select
            jsonb_object_agg(
              field.key,

              jsonb_build_object(
                'label',

                coalesce(
                  field.value ->> 'label',
                  field.key
                )
              )
            )

          from jsonb_each(
            coalesce(
              car.requested_fields,
              '{}'::jsonb
            )
          ) as field
        ),

        '{}'::jsonb
      )

  where car.order_id =
    p_order_id;


  /*
   * =========================================
   * 4. Workspace message revisions
   *
   * Revision rows duplicate historical
   * customer/admin free-form message content.
   * They are no longer needed after cleanup.
   * =========================================
   */

  delete
  from public.workspace_message_revisions
  where order_id =
    p_order_id;


  /*
   * =========================================
   * 5. Workspace free-form messages
   * =========================================
   */

  update public.workspace_messages
  set
    message =
      '[服务完成后已按资料保留规则清理]'
  where
    order_id =
      p_order_id

    and message_kind =
      'message';


  /*
   * =========================================
   * 6. Fulfillment activity free text
   * =========================================
   */

  update public.fulfillment_activity
  set
    message =
      '[服务完成后已按资料保留规则清理]',

    metadata =
      coalesce(
        metadata,
        '{}'::jsonb
      ) - 'reason'

  where order_id =
    p_order_id;


  /*
   * =========================================
   * 7. Cleanup completed
   * =========================================
   */

  update public.orders
  set
    data_cleanup_status =
      'completed',

    data_cleaned_at =
      now(),

    data_cleanup_last_error =
      null,

    updated_at =
      now()
  where id = p_order_id;


exception
  when others then

    update public.orders
    set
      data_cleanup_status =
        'failed',

      data_cleanup_last_error =
        'CLEANUP_RPC_FAILED',

      updated_at =
        now()
    where id = p_order_id;


    raise;

end;
$function$;


revoke all
on function public.cleanup_order_temporary_data(uuid)
from public;

revoke all
on function public.cleanup_order_temporary_data(uuid)
from anon;

revoke all
on function public.cleanup_order_temporary_data(uuid)
from authenticated;

grant execute
on function public.cleanup_order_temporary_data(uuid)
to service_role;