alter table public.services
alter column fulfillment_type
set default 'manual';


update public.services
set fulfillment_type = 'manual'
where fulfillment_type is null
   or fulfillment_type in (
     'automatic',
     'semi_automatic'
   );