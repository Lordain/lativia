-- =========================================================
-- Cetesdirecto Consultation
-- Price update: MXN 2,000
--
-- Existing service_prices rows are updated because
-- (service_id, currency, payment_method) is unique.
--
-- Historical orders keep their original orders.amount.
-- =========================================================

update public.service_prices
set
  amount = 2000,
  active = true
where
  service_id =
    '73f2eae1-e9cd-499a-be87-86f8174a9857'
  and currency = 'MXN'
  and (
    (
      payment_method = 'local_payment'
      and payment_provider = 'mercado_pago'
    )
    or
    (
      payment_method = 'card'
      and payment_provider = 'stripe'
    )
  );