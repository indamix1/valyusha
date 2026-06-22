-- migration-04: add seasons array to tours
ALTER TABLE tours ADD COLUMN IF NOT EXISTS seasons text[] DEFAULT '{}';
