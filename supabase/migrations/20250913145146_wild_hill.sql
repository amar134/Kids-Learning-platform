/*
  # User Authentication and Profiles Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `user_type` (enum: student, parent, teacher)
      - `grade_level` (integer, for students)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `school_details`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `school_name` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `syllabus` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enum for user types
CREATE TYPE user_type_enum AS ENUM ('student', 'parent', 'teacher');

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  user_type user_type_enum NOT NULL DEFAULT 'student',
  grade_level integer CHECK (grade_level >= 1 AND grade_level <= 5),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create school details table
CREATE TABLE IF NOT EXISTS school_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  school_name text NOT NULL,
  address text,
  city text,
  state text,
  syllabus text DEFAULT 'CBSE',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_details ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for school_details
CREATE POLICY "Users can read own school details"
  ON school_details
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own school details"
  ON school_details
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_school_details_updated_at
  BEFORE UPDATE ON school_details
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();