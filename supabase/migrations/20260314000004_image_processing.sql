-- Image processing columns for optional background removal

alter table public.items
  add column processed_image_path text,
  add column remove_background boolean not null default false,
  add column image_processing_status text not null default 'none'
    check (image_processing_status in ('none', 'pending', 'processing', 'completed', 'failed')),
  add column image_processing_error text,
  add column image_processing_attempts smallint not null default 0,
  add column image_processing_updated_at timestamptz;
