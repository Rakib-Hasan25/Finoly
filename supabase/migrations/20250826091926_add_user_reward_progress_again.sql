ALTER TABLE rewards
RENAME COLUMN progress TO requirements;

ALTER TABLE user_rewards
ADD COLUMN progress int NOT NULL DEFAULT 0;