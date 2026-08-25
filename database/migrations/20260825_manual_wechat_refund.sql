/*
 * ============================================================
 * Manual WeChat Payment / Refund Support
 * ============================================================
 *
 * Rules:
 *
 * Manual WeChat payment:
 *   currency = CNY
 *   payment_method = wechat_pay
 *   payment_provider = null
 *
 * Manual refunds:
 *   no fake payment_transaction
 *   no fake provider
 *   no fake provider_payment_id
 *   no provider API call
 *
 * Admin must actually return the funds first,
 * then explicitly confirm completion.
 * ============================================================
 */


/*
 * ============================================================
 * 1. Refund provider may be null
 * ============================================================
 */

alter table public.refunds
  alter column provider
  drop not null;


/*
 * ============================================================
 * 2. Payment audit actions
 *
 * manual_confirm:
 *   Admin confirms a manual WeChat payment was received.
 *
 * manual_refund_succeeded:
 *   Admin confirms a manual WeChat refund was actually sent.
 * ============================================================
 */

alter table public.payment_audit_logs
  drop constraint if exists
    payment_audit_logs_action_check;

alter table public.payment_audit_logs
  add constraint
    payment_audit_logs_action_check
  check (
    action = any (
      array[
        'reverify'::text,
        'repair'::text,
        'manual_confirm'::text,
        'refund_succeeded'::text,
        'refund_failed'::text,
        'manual_refund_succeeded'::text
      ]
    )
  );


/*
 * ============================================================
 * 3. Create / ensure refund case
 * ============================================================
 */

create or replace function public.ensure_refund_case(
  p_fulfillment_id uuid,
  p_actor_type text default 'system'::text,
  p_actor_user_id uuid default null::uuid,
  p_allow_policy_override boolean default false
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_fulfillment public.fulfillments%rowtype;
  v_order public.orders%rowtype;
  v_transaction public.payment_transactions%rowtype;

  v_refund_id uuid;

  v_refund_allowed boolean;
  v_no_refund_after_completion boolean;

  v_is_manual_wechat boolean;
begin

  /*
   * 1. Validate actor
   */

  if p_actor_type not in (
    'system',
    'admin'
  ) then
    raise exception
      'INVALID_REFUND_ACTOR_TYPE';
  end if;


  /*
   * 2. Lock fulfillment
   */

  select *
  into v_fulfillment
  from public.fulfillments
  where id = p_fulfillment_id
  for update;

  if not found then
    raise exception
      'FULFILLMENT_NOT_FOUND';
  end if;


  /*
   * 3. Completed service can never refund
   */

  if
    v_fulfillment.status = 'completed'
    or v_fulfillment.completed_at is not null
  then
    raise exception
      'COMPLETED_SERVICE_CANNOT_BE_REFUNDED';
  end if;


  /*
   * 4. Must already be in refund review
   */

  if
    v_fulfillment.status <> 'refund_review'
    or v_fulfillment.refund_review_required <> true
  then
    raise exception
      'FULFILLMENT_NOT_IN_REFUND_REVIEW';
  end if;


  /*
   * 5. Service refund policy
   */

  select
    coalesce(
      s.refund_eligible_when_failed,
      false
    ),
    coalesce(
      s.no_refund_after_completion,
      true
    )
  into
    v_refund_allowed,
    v_no_refund_after_completion
  from public.services s
  where s.id =
    v_fulfillment.service_id;

  if not found then
    raise exception
      'SERVICE_NOT_FOUND';
  end if;

  if
    not v_refund_allowed
    and not (
      p_actor_type = 'admin'
      and p_allow_policy_override = true
    )
  then
    raise exception
      'SERVICE_NOT_ELIGIBLE_FOR_REFUND';
  end if;


  /*
   * 6. Lock order
   */

  select *
  into v_order
  from public.orders
  where id =
    v_fulfillment.order_id
  for update;

  if not found then
    raise exception
      'ORDER_NOT_FOUND';
  end if;


  if
    v_no_refund_after_completion
    and v_order.status = 'completed'
  then
    raise exception
      'COMPLETED_SERVICE_CANNOT_BE_REFUNDED';
  end if;


  if
    v_order.payment_status <> 'paid'
  then
    raise exception
      'ORDER_NOT_PAID';
  end if;


  if v_order.amount is null then
    raise exception
      'ORDER_AMOUNT_MISSING';
  end if;

  if v_order.currency is null then
    raise exception
      'ORDER_CURRENCY_MISSING';
  end if;


  /*
   * Strict manual WeChat predicate
   */

  v_is_manual_wechat :=
    upper(v_order.currency) = 'CNY'
    and v_order.payment_method = 'wechat_pay'
    and v_order.payment_provider is null;


  /*
   * 7. Automatic PSP payment requires
   *    a real paid payment transaction.
   *
   * Manual WeChat intentionally does not.
   */

  if not v_is_manual_wechat then

    select *
    into v_transaction
    from public.payment_transactions
    where
      order_id =
        v_order.id
      and status =
        'paid'
    order by
      created_at desc
    limit 1;

    if not found then
      raise exception
        'PAID_PAYMENT_TRANSACTION_NOT_FOUND';
    end if;


    /*
     * Financial consistency
     */

    if
      v_transaction.amount <>
        v_order.amount
    then
      raise exception
        'PAYMENT_AMOUNT_MISMATCH';
    end if;

    if
      upper(v_transaction.currency) <>
        upper(v_order.currency)
    then
      raise exception
        'PAYMENT_CURRENCY_MISMATCH';
    end if;

  end if;


  /*
   * 8. Existing case = idempotent
   */

  select id
  into v_refund_id
  from public.refunds
  where order_id =
    v_order.id;

  if found then
    return v_refund_id;
  end if;


  /*
   * 9. Create Refund Case
   */

  insert into public.refunds (
    order_id,
    fulfillment_id,
    payment_transaction_id,

    provider,
    provider_payment_id,

    amount,
    currency,

    status,
    reason,

    idempotency_key
  )
  values (
    v_order.id,
    v_fulfillment.id,

    case
      when v_is_manual_wechat
        then null
      else v_transaction.id
    end,

    case
      when v_is_manual_wechat
        then null
      else v_transaction.provider
    end,

    case
      when v_is_manual_wechat
        then null
      else v_transaction.provider_payment_id
    end,

    v_order.amount,
    upper(v_order.currency),

    'pending_review',

    coalesce(
      nullif(
        trim(
          v_fulfillment.failure_reason
        ),
        ''
      ),
      '服务无法完成，需要审核退款资格。'
    ),

    concat(
      'refund:',
      v_order.id::text
    )
  )
  returning id
  into v_refund_id;


  /*
   * 10. Audit
   */

  insert into public.refund_activity (
    refund_id,
    order_id,
    actor_type,
    actor_user_id,
    action,
    from_status,
    to_status,
    message,
    metadata
  )
  values (
    v_refund_id,
    v_order.id,
    p_actor_type,
    p_actor_user_id,
    'refund_case_created',
    null,
    'pending_review',
    '服务无法完成，已建立退款资格审核记录。',
    jsonb_build_object(
      'fulfillment_id',
      v_fulfillment.id,

      'payment_transaction_id',
      case
        when v_is_manual_wechat
          then null
        else v_transaction.id
      end,

      'provider',
      case
        when v_is_manual_wechat
          then null
        else v_transaction.provider
      end,

      'manual_wechat',
      v_is_manual_wechat,

      'amount',
      v_order.amount,

      'currency',
      upper(v_order.currency)
    )
  );

  return v_refund_id;

end;
$function$;


/*
 * ============================================================
 * 4. Complete manual WeChat refund
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function does NOT move money.
 *
 * Admin must first actually refund the customer through WeChat.
 * This RPC only records that the manual refund has already
 * been completed.
 * ============================================================
 */

create or replace function public.complete_manual_refund(
  p_refund_id uuid,
  p_admin_user_id uuid
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_refund public.refunds%rowtype;
  v_order public.orders%rowtype;
  v_fulfillment public.fulfillments%rowtype;
begin

  /*
   * 1. Lock refund
   */

  select *
  into v_refund
  from public.refunds
  where id = p_refund_id
  for update;

  if not found then
    raise exception
      'REFUND_NOT_FOUND';
  end if;


  /*
   * Idempotent success
   */

  if v_refund.status = 'succeeded' then
    return;
  end if;


  /*
   * Manual completion requires approved state.
   */

  if v_refund.status <> 'approved' then
    raise exception
      'MANUAL_REFUND_NOT_APPROVED';
  end if;


  /*
   * Refund itself must have no PSP data.
   */

  if
    v_refund.provider is not null
    or v_refund.payment_transaction_id is not null
    or v_refund.provider_payment_id is not null
  then
    raise exception
      'NOT_MANUAL_WECHAT_REFUND';
  end if;


  /*
   * 2. Lock order
   */

  select *
  into v_order
  from public.orders
  where id =
    v_refund.order_id
  for update;

  if not found then
    raise exception
      'ORDER_NOT_FOUND';
  end if;


  /*
   * Strict manual WeChat predicate
   */

  if
    upper(v_order.currency) <> 'CNY'
    or v_order.payment_method <> 'wechat_pay'
    or v_order.payment_provider is not null
  then
    raise exception
      'NOT_MANUAL_WECHAT_PAYMENT';
  end if;


  if v_order.payment_status <> 'paid' then
    raise exception
      'ORDER_NOT_PAID';
  end if;


  if
    v_order.amount is null
    or v_order.amount <> v_refund.amount
  then
    raise exception
      'REFUND_AMOUNT_MISMATCH';
  end if;


  if
    upper(v_order.currency) <>
      upper(v_refund.currency)
  then
    raise exception
      'REFUND_CURRENCY_MISMATCH';
  end if;


  if v_order.status = 'completed' then
    raise exception
      'COMPLETED_SERVICE_CANNOT_BE_REFUNDED';
  end if;


  /*
   * 3. Lock fulfillment
   */

  select *
  into v_fulfillment
  from public.fulfillments
  where id =
    v_refund.fulfillment_id
  for update;

  if not found then
    raise exception
      'FULFILLMENT_NOT_FOUND';
  end if;


  if
    v_fulfillment.status = 'completed'
    or v_fulfillment.completed_at is not null
  then
    raise exception
      'COMPLETED_SERVICE_CANNOT_BE_REFUNDED';
  end if;


  if
    v_fulfillment.status <> 'refund_review'
  then
    raise exception
      'FULFILLMENT_NOT_IN_REFUND_REVIEW';
  end if;


  /*
   * 4. Refund succeeded
   */

  update public.refunds
  set
    status =
      'succeeded',

    execution_started_at =
      coalesce(
        execution_started_at,
        now()
      ),

    refunded_at =
      now(),

    failed_at =
      null,

    failure_reason =
      null,

    updated_at =
      now()

  where id =
    p_refund_id;


  /*
   * 5. Order financial state
   */

  update public.orders
  set
    payment_status =
      'refunded',

    status =
      'cancelled',

    updated_at =
      now()

  where id =
    v_refund.order_id;


  /*
   * 6. Fulfillment final state
   */

  update public.fulfillments
  set
    status =
      'failed',

    current_step =
      'refund_succeeded',

    refund_review_required =
      false,

    human_review_required =
      false,

    human_review_reason =
      null,

    customer_action_required =
      false,

    customer_action_reason =
      null,

    updated_at =
      now()

  where id =
    v_refund.fulfillment_id;


  /*
   * 7. Refund activity
   */

  insert into public.refund_activity (
    refund_id,
    order_id,
    actor_type,
    actor_user_id,
    action,
    from_status,
    to_status,
    message,
    metadata
  )
  values (
    p_refund_id,
    v_refund.order_id,
    'admin',
    p_admin_user_id,
    'manual_refund_succeeded',
    'approved',
    'succeeded',
    '管理员已确认人民币微信人工退款实际完成。',
    jsonb_build_object(
      'manual_wechat',
      true,
      'amount',
      v_refund.amount,
      'currency',
      v_refund.currency
    )
  );


  /*
   * 8. Payment audit
   */

  insert into public.payment_audit_logs (
    order_id,
    admin_user_id,
    provider,
    action,
    result,
    message,
    metadata
  )
  values (
    v_refund.order_id,
    p_admin_user_id,
    null,
    'manual_refund_succeeded',
    'success',
    '管理员已确认人民币微信人工退款实际完成。',
    jsonb_build_object(
      'refund_id',
      p_refund_id,
      'manual_wechat',
      true,
      'amount',
      v_refund.amount,
      'currency',
      v_refund.currency
    )
  );

end;
$function$;

/*
 * ============================================================
 * 5. Ensure Fulfillment For Paid Order
 * ============================================================
 *
 * Used by manual payment flows that intentionally do not create
 * payment_transactions.
 *
 * This function:
 *
 * - requires the order to already be paid
 * - creates the fulfillment exactly once
 * - does NOT create payment_transactions
 * - does NOT change money/payment provider data
 * ============================================================
 */

create or replace function public.ensure_paid_order_fulfillment(
  p_order_id uuid
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_order public.orders%rowtype;

  v_service_id uuid;

  v_fulfillment_type text;

  v_human_review_required boolean;

  v_fulfillment_id uuid;
begin

  /*
   * 1. Lock Order
   */

  select *
  into v_order
  from public.orders
  where id =
    p_order_id
  for update;

  if not found then
    raise exception
      'ORDER_NOT_FOUND';
  end if;


  /*
   * Only paid orders may have their
   * post-payment Fulfillment ensured.
   */

  if
    v_order.payment_status <>
      'paid'
  then
    raise exception
      'ORDER_NOT_PAID';
  end if;


  if
    v_order.service_id is null
  then
    raise exception
      'ORDER_SERVICE_NOT_FOUND';
  end if;


  v_service_id :=
    v_order.service_id;


  /*
   * 2. Service Configuration
   */

  select
    coalesce(
      s.fulfillment_type,
      'semi_automatic'
    ),

    coalesce(
      s.human_review_required,
      true
    )

  into
    v_fulfillment_type,
    v_human_review_required

  from public.services s
  where s.id =
    v_service_id;


  if not found then
    raise exception
      'SERVICE_NOT_FOUND';
  end if;


  /*
   * 3. Existing Fulfillment
   *
   * Idempotent.
   */

  select id
  into v_fulfillment_id
  from public.fulfillments
  where order_id =
    p_order_id;

  if found then
    return v_fulfillment_id;
  end if;


  /*
   * 4. Create Fulfillment
   */

  insert into public.fulfillments (
    order_id,
    service_id,
    status,
    fulfillment_type,
    current_step,
    human_review_required,
    customer_action_required,
    refund_review_required
  )
  values (
    p_order_id,
    v_service_id,
    'queued',
    v_fulfillment_type,
    'payment_confirmed',
    v_human_review_required,
    false,
    false
  )
  on conflict (
    order_id
  )
  do nothing
  returning id
  into v_fulfillment_id;


  /*
   * Race-safe re-read.
   */

  if v_fulfillment_id is null then

    select id
    into v_fulfillment_id
    from public.fulfillments
    where order_id =
      p_order_id;

  end if;


  if v_fulfillment_id is null then
    raise exception
      'FULFILLMENT_ENSURE_FAILED';
  end if;


  /*
   * 5. Audit only when this call created it
   *
   * An insert into activity is safe because this block
   * only follows a successful local insert.
   */

  if not exists (
    select 1
    from public.fulfillment_activity
    where
      fulfillment_id =
        v_fulfillment_id
      and action =
        'fulfillment_created'
  ) then

    insert into public.fulfillment_activity (
      fulfillment_id,
      order_id,
      actor_type,
      actor_user_id,
      action,
      from_status,
      to_status,
      message,
      metadata
    )
    values (
      v_fulfillment_id,
      p_order_id,
      'system',
      null,
      'fulfillment_created',
      null,
      'queued',
      '付款已经确认，办理任务已自动建立。',
      jsonb_build_object(
        'payment_method',
        v_order.payment_method,
        'payment_provider',
        v_order.payment_provider,
        'manual_payment',
        v_order.payment_provider is null
      )
    );

  end if;


  return v_fulfillment_id;

end;
$function$;

/*
 * ============================================================
 * 6. Admin Update Order Milestone
 * ============================================================
 */

create or replace function public.set_order_milestone_status(
  p_milestone_id uuid,
  p_admin_user_id uuid,
  p_completed boolean
)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_milestone public.order_milestones%rowtype;
  v_workspace public.order_workspaces%rowtype;
begin

  select *
  into v_milestone
  from public.order_milestones
  where id =
    p_milestone_id
  for update;

  if not found then
    raise exception
      'MILESTONE_NOT_FOUND';
  end if;


  select *
  into v_workspace
  from public.order_workspaces
  where id =
    v_milestone.workspace_id
  for update;

  if not found then
    raise exception
      'WORKSPACE_NOT_FOUND';
  end if;


  if
    v_workspace.status <>
      'active'
  then
    raise exception
      'WORKSPACE_NOT_ACTIVE';
  end if;


  update public.order_milestones
  set
    status =
      case
        when p_completed
          then 'completed'
        else 'pending'
      end,

    completed_at =
      case
        when p_completed
          then coalesce(
            completed_at,
            now()
          )
        else null
      end,

    completed_by =
      case
        when p_completed
          then p_admin_user_id
        else null
      end,

    updated_at =
      now()

  where id =
    p_milestone_id;

end;
$function$;

/*
 * ============================================================
 * Admin Enter Refund Review
 * ============================================================
 *
 * Business rule:
 *
 * refund_eligible_when_failed = false
 * means "not automatically refundable".
 *
 * Admin may still explicitly open a refund review
 * for an exceptional / disputed case.
 *
 * Entering refund_review does NOT approve the refund.
 *
 * The resulting Refund Case remains:
 *
 *   pending_review
 *
 * and still requires separate Admin approval/rejection.
 * ============================================================
 */

create or replace function public.enter_admin_refund_review(
  p_fulfillment_id uuid,
  p_admin_user_id uuid,
  p_reason text
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_fulfillment public.fulfillments%rowtype;

  v_service_refund_allowed boolean;

  v_refund_id uuid;

  v_clean_reason text;
begin

  /*
   * 1. Validate Admin input
   */

  v_clean_reason :=
    nullif(
      trim(
        p_reason
      ),
      ''
    );


  if p_admin_user_id is null then
    raise exception
      'ADMIN_USER_REQUIRED';
  end if;


  if v_clean_reason is null then
    raise exception
      'REFUND_REVIEW_REASON_REQUIRED';
  end if;


  /*
   * 2. Lock Fulfillment
   */

  select *
  into v_fulfillment
  from public.fulfillments
  where id =
    p_fulfillment_id
  for update;


  if not found then
    raise exception
      'FULFILLMENT_NOT_FOUND';
  end if;


  /*
   * Completed is a permanent business terminal state.
   */

  if
    v_fulfillment.status = 'completed'
    or v_fulfillment.completed_at is not null
  then
    raise exception
      'COMPLETED_FULFILLMENT_IS_FINAL';
  end if;


  /*
   * Idempotency:
   *
   * Already in refund_review:
   * just ensure Refund Case exists.
   */

  if
    v_fulfillment.status = 'refund_review'
    and v_fulfillment.refund_review_required = true
  then

    return public.ensure_refund_case(
      p_fulfillment_id,
      'admin',
      p_admin_user_id,
      true
    );

  end if;


  /*
   * Current Admin UI enters refund review
   * after service has been marked failed.
   */

  if
    v_fulfillment.status <> 'failed'
  then
    raise exception
      'INVALID_REFUND_REVIEW_TRANSITION_FROM_%',
      v_fulfillment.status;
  end if;


  /*
   * 3. Read service policy
   *
   * false does NOT block Admin review.
   *
   * It only means this is an explicit
   * policy override rather than ordinary
   * automatic eligibility.
   */

  select
    coalesce(
      s.refund_eligible_when_failed,
      false
    )
  into
    v_service_refund_allowed
  from public.services s
  where s.id =
    v_fulfillment.service_id;


  if not found then
    raise exception
      'SERVICE_NOT_FOUND';
  end if;


  /*
   * 4. Enter refund_review
   */

  update public.fulfillments
  set
    status =
      'refund_review',

    current_step =
      'refund_review',

    refund_review_required =
      true,

    human_review_required =
      false,

    customer_action_required =
      false,

    updated_at =
      now()

  where id =
    p_fulfillment_id;


  /*
   * 5. Fulfillment Audit
   */

  insert into public.fulfillment_activity (
    fulfillment_id,
    order_id,
    actor_type,
    actor_user_id,
    action,
    from_status,
    to_status,
    message,
    metadata
  )
  values (
    v_fulfillment.id,
    v_fulfillment.order_id,
    'admin',
    p_admin_user_id,
    'status_changed',
    'failed',
    'refund_review',
    v_clean_reason,
    jsonb_build_object(
      'reason',
      v_clean_reason,

      'current_step',
      'refund_review',

      'refund_policy_default_eligible',
      v_service_refund_allowed,

      'admin_policy_override',
      not v_service_refund_allowed
    )
  );


  /*
   * 6. Create / ensure Refund Case
   *
   * Important:
   *
   * Refund Case = pending_review.
   *
   * This does NOT approve or execute money movement.
   */

  v_refund_id :=
    public.ensure_refund_case(
      p_fulfillment_id,
      'admin',
      p_admin_user_id,
      true
    );


  return v_refund_id;

end;
$function$;

/*
 * ============================================================
 * 7. RPC Permission Hardening
 * ============================================================
 *
 * These SECURITY DEFINER functions are internal server RPCs.
 *
 * Browser / authenticated customers must not be able to call
 * them directly and impersonate an Admin by supplying UUIDs.
 *
 * Application access is through trusted server actions using
 * the Supabase service role.
 * ============================================================
 */


/*
 * ensure_refund_case
 */

revoke all on function public.ensure_refund_case(
  uuid,
  text,
  uuid,
  boolean
)
from public;

revoke all on function public.ensure_refund_case(
  uuid,
  text,
  uuid,
  boolean
)
from anon;

revoke all on function public.ensure_refund_case(
  uuid,
  text,
  uuid,
  boolean
)
from authenticated;

grant execute on function public.ensure_refund_case(
  uuid,
  text,
  uuid,
  boolean
)
to service_role;


/*
 * complete_manual_refund
 */

revoke all on function public.complete_manual_refund(
  uuid,
  uuid
)
from public;

revoke all on function public.complete_manual_refund(
  uuid,
  uuid
)
from anon;

revoke all on function public.complete_manual_refund(
  uuid,
  uuid
)
from authenticated;

grant execute on function public.complete_manual_refund(
  uuid,
  uuid
)
to service_role;


/*
 * ensure_paid_order_fulfillment
 */

revoke all on function public.ensure_paid_order_fulfillment(
  uuid
)
from public;

revoke all on function public.ensure_paid_order_fulfillment(
  uuid
)
from anon;

revoke all on function public.ensure_paid_order_fulfillment(
  uuid
)
from authenticated;

grant execute on function public.ensure_paid_order_fulfillment(
  uuid
)
to service_role;


/*
 * set_order_milestone_status
 */

revoke all on function public.set_order_milestone_status(
  uuid,
  uuid,
  boolean
)
from public;

revoke all on function public.set_order_milestone_status(
  uuid,
  uuid,
  boolean
)
from anon;

revoke all on function public.set_order_milestone_status(
  uuid,
  uuid,
  boolean
)
from authenticated;

grant execute on function public.set_order_milestone_status(
  uuid,
  uuid,
  boolean
)
to service_role;


/*
 * enter_admin_refund_review
 */

revoke all on function public.enter_admin_refund_review(
  uuid,
  uuid,
  text
)
from public;

revoke all on function public.enter_admin_refund_review(
  uuid,
  uuid,
  text
)
from anon;

revoke all on function public.enter_admin_refund_review(
  uuid,
  uuid,
  text
)
from authenticated;

grant execute on function public.enter_admin_refund_review(
  uuid,
  uuid,
  text
)
to service_role;