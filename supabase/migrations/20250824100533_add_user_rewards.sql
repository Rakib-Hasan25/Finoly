-- Create the rewards table
CREATE TABLE rewards (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points INT DEFAULT 0,
  health INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create the user_rewards table
CREATE TABLE user_rewards (
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reward_id BIGINT REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('AVAILABLE', 'COMPLETE', 'CLAIMED')) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  PRIMARY KEY(user_id, reward_id)
);