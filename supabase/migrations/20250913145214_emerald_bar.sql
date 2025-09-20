/*
  # Parent-Student Relationship Schema

  1. New Tables
    - `parent_student_links`
      - `id` (uuid, primary key)
      - `parent_id` (uuid, references user_profiles)
      - `student_id` (uuid, references user_profiles)
      - `relationship` (text)
      - `created_at` (timestamp)
    
    - `daily_challenges`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references user_profiles)
      - `subject` (enum)
      - `challenge_text` (text)
      - `is_completed` (boolean)
      - `challenge_date` (date)
      - `points_awarded` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for parent-student data access
*/

-- Create parent-student links table
CREATE TABLE IF NOT EXISTS parent_student_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  relationship text DEFAULT 'parent',
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, student_id),
  CHECK (parent_id != student_id)
);

-- Create daily challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  subject subject_enum NOT NULL,
  challenge_text text NOT NULL,
  is_completed boolean DEFAULT false,
  challenge_date date DEFAULT CURRENT_DATE,
  points_awarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, subject, challenge_date)
);

-- Enable Row Level Security
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- Policies for parent_student_links
CREATE POLICY "Parents can manage their student links"
  ON parent_student_links
  FOR ALL
  TO authenticated
  USING (parent_id = auth.uid())
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Students can read their parent links"
  ON parent_student_links
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Policies for daily_challenges
CREATE POLICY "Students can read own challenges"
  ON daily_challenges
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own challenges"
  ON daily_challenges
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Parents can read their children's challenges"
  ON daily_challenges
  FOR SELECT
  TO authenticated
  USING (
    student_id IN (
      SELECT student_id FROM parent_student_links 
      WHERE parent_id = auth.uid()
    )
  );

CREATE POLICY "System can insert challenges"
  ON daily_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to generate daily challenges
CREATE OR REPLACE FUNCTION generate_daily_challenges()
RETURNS void AS $$
DECLARE
  student_record RECORD;
  challenge_subjects subject_enum[] := ARRAY['math', 'english', 'evs', 'games'];
  subject_item subject_enum;
  challenge_texts text[] := ARRAY[
    'Solve 5 addition problems',
    'Find 3 rhyming words', 
    'Name 5 animals',
    'Complete memory game',
    'Practice multiplication tables',
    'Read a short story',
    'Learn about plants',
    'Play word scramble'
  ];
BEGIN
  -- Generate challenges for all students
  FOR student_record IN 
    SELECT id, grade_level FROM user_profiles WHERE user_type = 'student'
  LOOP
    -- Generate 4 challenges per student (one per subject)
    FOREACH subject_item IN ARRAY challenge_subjects
    LOOP
      INSERT INTO daily_challenges (student_id, subject, challenge_text, challenge_date)
      VALUES (
        student_record.id,
        subject_item,
        challenge_texts[1 + floor(random() * array_length(challenge_texts, 1))::int],
        CURRENT_DATE
      )
      ON CONFLICT (student_id, subject, challenge_date) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;