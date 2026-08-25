/*
 * ============================================================
 * Workspace Completion Synchronization
 *
 * Migration date:
 * 2026-08-25
 *
 * Purpose:
 *
 * Keep order_workspaces synchronized with the terminal
 * completed state of fulfillments.
 *
 * When a fulfillment becomes completed:
 *
 *   fulfillments.status
 *     -> completed
 *
 *   orders.status
 *     -> completed
 *
 *   order_workspaces.status
 *     -> completed
 *
 * This trigger runs inside the same PostgreSQL transaction
 * as the fulfillment update.
 *
 * Also repairs historical completed fulfillments whose
 * workspace is still active.
 * ============================================================
 */


/*
 * ============================================================
 * 1. Trigger Function
 * ============================================================
 */

create or replace function
public.sync_order_workspace_completion_from_fulfillment()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin

  /*
   * Only close an active workspace.
   *
   * Do not overwrite another terminal workspace state
   * such as cancelled or expired.
   */

  update public.order_workspaces
  set
    status =
      'completed',

    completed_at =
      coalesce(
        completed_at,
        new.completed_at,
        now()
      ),

    updated_at =
      now()

  where
    order_id =
      new.order_id

    and status =
      'active';


  return new;

end;
$function$;


/*
 * ============================================================
 * 2. Trigger
 * ============================================================
 */

drop trigger if exists
trg_sync_order_workspace_completion_from_fulfillment
on public.fulfillments;


create trigger
trg_sync_order_workspace_completion_from_fulfillment

after update of status
on public.fulfillments

for each row

when (
  new.status = 'completed'
  and old.status is distinct from new.status
)

execute function
public.sync_order_workspace_completion_from_fulfillment();


/*
 * ============================================================
 * 3. Historical Repair
 *
 * Repair existing completed fulfillments whose workspace
 * remained active before this trigger existed.
 * ============================================================
 */

update public.order_workspaces
set
  status =
    'completed',

  completed_at =
    coalesce(
      order_workspaces.completed_at,
      fulfillments.completed_at,
      now()
    ),

  updated_at =
    now()

from public.fulfillments

where
  fulfillments.order_id =
    order_workspaces.order_id

  and fulfillments.status =
    'completed'

  and order_workspaces.status =
    'active';