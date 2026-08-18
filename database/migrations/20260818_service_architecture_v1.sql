/*
 * ============================================================
 * Service Architecture v1
 *
 * Lesson 29
 * Date: 2026-08-18
 *
 * Purpose:
 * - Service business type
 * - Launch priority
 * - Operational status
 * - Eligibility checks
 * - Consultation/workspace support
 * - Time/milestone completion
 * - Result classification
 * - Result delivery / retention
 * ============================================================
 */


/*
 * ============================================================
 * 1. Service Classification
 * ============================================================
 */

alter table public.services
add column if not exists service_type text
not null
default 'online_query';

alter table public.services
drop constraint if exists services_service_type_check;

alter table public.services
add constraint services_service_type_check
check (
  service_type in (
    'online_query',
    'accompaniment',
    'agency',
    'consultation'
  )
);


/*
 * ============================================================
 * 2. Launch Priority
 * ============================================================
 */

alter table public.services
add column if not exists launch_priority text
not null
default 'second';

alter table public.services
drop constraint if exists services_launch_priority_check;

alter table public.services
add constraint services_launch_priority_check
check (
  launch_priority in (
    'first',
    'second'
  )
);


/*
 * ============================================================
 * 3. Operational Status
 *
 * is_active remains for backward compatibility.
 * ============================================================
 */

alter table public.services
add column if not exists service_status text
not null
default 'active';

alter table public.services
drop constraint if exists services_service_status_check;

alter table public.services
add constraint services_service_status_check
check (
  service_status in (
    'active',
    'paused',
    'hidden'
  )
);


/*
 * ============================================================
 * 4. Eligibility
 * ============================================================
 */

alter table public.services
add column if not exists eligibility_mode text
not null
default 'none';

alter table public.services
drop constraint if exists services_eligibility_mode_check;

alter table public.services
add constraint services_eligibility_mode_check
check (
  eligibility_mode in (
    'none',
    'self_check',
    'admin_precheck'
  )
);

alter table public.services
add column if not exists eligibility_schema jsonb
not null
default '[]'::jsonb;


/*
 * ============================================================
 * 5. Customer Workspace
 * ============================================================
 */

alter table public.services
add column if not exists workspace_required boolean
not null
default false;


/*
 * ============================================================
 * 6. Service Access / Completion
 * ============================================================
 */

alter table public.services
add column if not exists access_duration_days integer;

alter table public.services
add column if not exists completion_mode text
not null
default 'manual';

alter table public.services
drop constraint if exists services_completion_mode_check;

alter table public.services
add constraint services_completion_mode_check
check (
  completion_mode in (
    'manual',
    'time_based',
    'milestone_based',
    'time_or_milestone'
  )
);

alter table public.services
drop constraint if exists services_access_duration_days_check;

alter table public.services
add constraint services_access_duration_days_check
check (
  access_duration_days is null
  or access_duration_days > 0
);


/*
 * ============================================================
 * 7. Service Milestones
 *
 * Example for Cetes consultation:
 *
 * account_opened
 * first_deposit_completed
 * first_withdrawal_completed
 * ============================================================
 */

alter table public.services
add column if not exists completion_milestones jsonb
not null
default '[]'::jsonb;


/*
 * ============================================================
 * 8. Result Classification
 * ============================================================
 */

alter table public.services
add column if not exists result_is_official boolean
not null
default false;


/*
 * ============================================================
 * 9. Result Delivery
 * ============================================================
 */

alter table public.services
add column if not exists result_delivery_mode text
not null
default 'none';

alter table public.services
drop constraint if exists services_result_delivery_mode_check;

alter table public.services
add constraint services_result_delivery_mode_check
check (
  result_delivery_mode in (
    'none',
    'email',
    'workspace',
    'email_and_workspace'
  )
);

alter table public.services
add column if not exists result_retention_hours integer;

alter table public.services
drop constraint if exists services_result_retention_hours_check;

alter table public.services
add constraint services_result_retention_hours_check
check (
  result_retention_hours is null
  or result_retention_hours > 0
);


/*
 * ============================================================
 * 10. Data Integrity
 * ============================================================
 */

alter table public.services
drop constraint if exists services_eligibility_schema_array_check;

alter table public.services
add constraint services_eligibility_schema_array_check
check (
  jsonb_typeof(eligibility_schema) = 'array'
);


alter table public.services
drop constraint if exists services_completion_milestones_array_check;

alter table public.services
add constraint services_completion_milestones_array_check
check (
  jsonb_typeof(completion_milestones) = 'array'
);