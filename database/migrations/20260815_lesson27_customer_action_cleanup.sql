/*
 * ============================================================
 * Lesson 27
 * Customer Data Correction Workflow
 *
 * Migration date:
 * 2026-08-15
 *
 * Includes:
 * 1. Add customer correction notification types
 * 2. Rename high-level order waiting status
 *    waiting_documents -> waiting_customer
 * 3. Update transition_fulfillment_status()
 * ============================================================
 */


/*
 * ============================================================
 * 1. Notification Type Constraint
 * ============================================================
 */

alter table public.notifications
drop constraint if exists notifications_type_check;


alter table public.notifications
add constraint notifications_type_check
check (
  type = any (
    array[
      'payment_confirmed'::text,
      'fulfillment_started'::text,
      'customer_action_required'::text,
      'customer_correction_approved'::text,
      'customer_correction_rejected'::text,
      'service_completed'::text,
      'service_failed'::text,
      'refund_review_started'::text,
      'refund_approved'::text,
      'refund_rejected'::text,
      'refund_processing'::text,
      'refund_succeeded'::text
    ]
  )
);


/*
 * ============================================================
 * 2. Historical Order Status Migration
 * ============================================================
 */

update public.orders
set
  status = 'waiting_customer',
  updated_at = now()
where status = 'waiting_documents';


/*
 * ============================================================
 * 3. Fulfillment → Order Status Synchronization
 *
 * Replace legacy:
 *
 *   waiting_documents
 *
 * with:
 *
 *   waiting_customer
 *
 * inside the existing transition_fulfillment_status() RPC.
 *
 * This keeps the full existing RPC unchanged except for the
 * legacy order status value.
 * ============================================================
 */

do $$
declare
  v_function_def text;
begin
  select
    pg_get_functiondef(p.oid)
  into
    v_function_def
  from pg_proc p
  join pg_namespace n
    on n.oid = p.pronamespace
  where
    n.nspname = 'public'
    and p.proname =
      'transition_fulfillment_status';


  if v_function_def is null then
    raise exception
      'transition_fulfillment_status not found';
  end if;


  /*
   * Allow migration to be safely re-run.
   *
   * If the old value is already gone,
   * there is nothing more to change.
   */

  if position(
    '''waiting_documents'''
    in v_function_def
  ) > 0 then

    v_function_def :=
      replace(
        v_function_def,
        '''waiting_documents''',
        '''waiting_customer'''
      );


    execute
      v_function_def;

  end if;
end
$$;