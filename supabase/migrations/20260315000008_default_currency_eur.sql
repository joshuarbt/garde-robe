-- Default profile currency: EUR (was USD)
alter table public.profiles
  alter column currency_code set default 'EUR';

update public.profiles
  set currency_code = 'EUR'
  where currency_code = 'USD';
