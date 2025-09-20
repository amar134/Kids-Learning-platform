/*
  # Exercises and Progress Tracking Schema

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `created_by` (uuid, references user_profiles)
      - `title` (text)
      - `subject` (enum)
      - `grade_level` (integer)
      - `exercise_type` (text)
      - `content` (jsonb)
      - `is_public` (boolean)
      - `created_at` (timestamp)
    
    - `student_progress`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `exercise_id` (uuid, references exercises)
      - `score` (integer)
      - `total_questions` (integer)
      - `time_spent` (integer, in seconds)
      - `completed_at` (timestamp)
    
    - `student_stats`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `total_points` (integer)
      - `badges` (text array)
      - `streak_days` (integer)
      - `last_activity` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Create enum for subjects
CREATE TYPE subject_enum AS ENUM ('math', 'english', 'evs', 'games', 'all');

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject subject_enum NOT NULL DEFAULT 'all',
  grade_level integer NOT NULL CHECK (grade_level >= 1 AND grade_level <= 5),
  exercise_type text NOT NULL,
  content jsonb NOT NULL,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create student progress table
CREATE TABLE IF NOT EXISTS student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  time_spent integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(student_id, exercise_id, completed_at)
);

-- Create student stats table
CREATE TABLE IF NOT EXISTS student_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_points integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  streak_days integer DEFAULT 0,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id)
);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_stats ENABLE ROW LEVEL SECURITY;

-- Policies for exercises
CREATE POLICY "Users can read public exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can read own exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can manage own exercises"
  ON exercises
  FOR ALL
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policies for student_progress
CREATE POLICY "Students can read own progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can insert own progress"
  ON student_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Parents can read their children's progress"
  ON student_progress
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT id FROM user_profiles 
      WHERE user_type = 'student' 
      AND id IN (
        SELECT student_id FROM parent_student_links 
        WHERE parent_id = auth.uid()
      )
    )
  );

-- Policies for student_stats
CREATE POLICY "Students can read own stats"
  ON student_stats
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can manage own stats"
  ON student_stats
  FOR ALL
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER handle_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_student_stats_updated_at
  BEFORE UPDATE ON student_stats
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();