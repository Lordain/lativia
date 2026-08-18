alter table public.orders
add column if not exists eligibility_acknowledgements jsonb
not null
default '[]'::jsonb;

alter table public.orders
add column if not exists eligibility_confirmed_at timestamptz;

alter table public.orders
drop constraint if exists orders_eligibility_acknowledgements_array_check;

alter table public.orders
add constraint orders_eligibility_acknowledgements_array_check
check (
  jsonb_typeof(eligibility_acknowledgements) = 'array'
);

comment on column public.orders.eligibility_acknowledgements is
'Snapshot of service eligibility requirements confirmed by the customer when creating the order. Generated server-side from the service eligibility schema.';

comment on column public.orders.eligibility_confirmed_at is
'Time when the customer eligibility confirmation was accepted during order creation.';