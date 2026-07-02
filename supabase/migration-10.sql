-- migration-10.sql — дозволити авторизованому адміну завантажувати/змінювати фото у Storage.
-- Причина: публічний бакет "media" дає лише читання. Без цих політик завантаження
-- фото з адмінки падає з помилкою:
--   new row violates row-level security policy for table "objects"
-- Запусти у Supabase SQL Editor.

-- безпечний повторний запуск
drop policy if exists "media public read"  on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

-- читання фото — публічно (видно всім на сайті)
create policy "media public read"
  on storage.objects for select
  using ( bucket_id = 'media' );

-- завантаження нових фото — лише авторизований (адмін)
create policy "media admin insert"
  on storage.objects for insert to authenticated
  with check ( bucket_id = 'media' );

-- заміна фото — лише авторизований
create policy "media admin update"
  on storage.objects for update to authenticated
  using ( bucket_id = 'media' )
  with check ( bucket_id = 'media' );

-- видалення фото — лише авторизований
create policy "media admin delete"
  on storage.objects for delete to authenticated
  using ( bucket_id = 'media' );
