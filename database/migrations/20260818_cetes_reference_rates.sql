create table if not exists public.cetes_reference_rates (
  id uuid primary key default gen_random_uuid(),

  term_days integer not null,

  rate numeric(8,4) not null,

  source_date date not null,

  source_name text not null
    default 'Banco de México',

  source_url text,

  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),

  constraint cetes_reference_rates_term_days_check
    check (
      term_days in (
        28,
        91,
        182,
        364
      )
    ),

  constraint cetes_reference_rates_rate_check
    check (
      rate >= 0
      and rate <= 100
    )
);

create unique index if not exists
  cetes_reference_rates_term_days_unique
on public.cetes_reference_rates (
  term_days
);

alter table public.cetes_reference_rates
enable row level security;

drop policy if exists
  "Public can read CETES reference rates"
on public.cetes_reference_rates;

create policy
  "Public can read CETES reference rates"
on public.cetes_reference_rates
for select
using (true);

insert into public.cetes_reference_rates (
  term_days,
  rate,
  source_date,
  source_name,
  source_url
)
values
  (
    28,
    6.15,
    '2026-08-18',
    'Banco de México',
    'https://www.banxico.org.mx/tipcamb/llenarTasasInteresAction.do?idioma=sp'
  ),
  (
    91,
    6.45,
    '2026-08-18',
    'Banco de México',
    'https://www.banxico.org.mx/tipcamb/llenarTasasInteresAction.do?idioma=sp'
  ),
  (
    182,
    6.76,
    '2026-08-18',
    'Banco de México',
    'https://www.banxico.org.mx/tipcamb/llenarTasasInteresAction.do?idioma=sp'
  ),
  (
    364,
    7.06,
    '2026-08-18',
    'Banco de México',
    'https://www.banxico.org.mx/tipcamb/llenarTasasInteresAction.do?idioma=sp'
  )
on conflict (
  term_days
)
do update set
  rate =
    excluded.rate,

  source_date =
    excluded.source_date,

  source_name =
    excluded.source_name,

  source_url =
    excluded.source_url,

  updated_at =
    now();