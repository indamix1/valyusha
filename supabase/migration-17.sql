-- migration-17.sql — прибираємо український дефолт підпису під ціною туру.
-- Причина: tours.price_note мав default 'від, за особу', тож будь-який тур,
-- створений в адмінці, показував український текст навіть на російській версії.
-- Тепер підпис задає адмінка (RU + переклади uk/en у translations), а порожній
-- підпис просто не виводиться. Запусти у Supabase SQL Editor.

alter table tours alter column price_note drop default;

update tours
   set price_note = null
 where price_note in ('від, за особу', 'від, за особу ');
