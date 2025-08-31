ALTER TABLE users
ADD COLUMN user_type VARCHAR(50) DEFAULT 'user' NOT NULL
CHECK (user_type IN ('user', 'admin'));
