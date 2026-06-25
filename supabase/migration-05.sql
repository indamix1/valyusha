-- migration-05: add category to tours (e.g. 'cruise' for круизных туристов)
ALTER TABLE tours ADD COLUMN IF NOT EXISTS category text;
