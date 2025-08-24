-- Add new columns to the users table
ALTER TABLE users
ADD COLUMN points INTEGER DEFAULT 0,
ADD COLUMN badge TEXT DEFAULT 'Newbie',
ADD COLUMN xp INTEGER DEFAULT 0,
ADD COLUMN health INTEGER DEFAULT 10;

-- Rename the existing column full_name to name
ALTER TABLE users
RENAME COLUMN full_name TO name;

-- Ensure email column is unique
ALTER TABLE users
ADD CONSTRAINT unique_email UNIQUE (email);