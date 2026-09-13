-- Add user_pin column to all tables
-- Run this in your Supabase SQL Editor

-- Add user_pin to workouts table
ALTER TABLE workouts
ADD COLUMN user_pin VARCHAR(4);

-- Add user_pin to exercises table
ALTER TABLE exercises
ADD COLUMN user_pin VARCHAR(4);

-- Add user_pin to exercise_history table
ALTER TABLE exercise_history
ADD COLUMN user_pin VARCHAR(4);

-- Add user_pin to workout_sessions table
ALTER TABLE workout_sessions
ADD COLUMN user_pin VARCHAR(4);

-- Create indexes for fast filtering by PIN
CREATE INDEX idx_workouts_user_pin ON workouts(user_pin);
CREATE INDEX idx_exercises_user_pin ON exercises(user_pin);
CREATE INDEX idx_exercise_history_user_pin ON exercise_history(user_pin);
CREATE INDEX idx_workout_sessions_user_pin ON workout_sessions(user_pin);

-- Optional: Set default PIN for existing data (you can skip this if you have no data yet)
-- UPDATE workouts SET user_pin = '0000' WHERE user_pin IS NULL;
-- UPDATE exercises SET user_pin = '0000' WHERE user_pin IS NULL;
-- UPDATE exercise_history SET user_pin = '0000' WHERE user_pin IS NULL;
-- UPDATE workout_sessions SET user_pin = '0000' WHERE user_pin IS NULL;
