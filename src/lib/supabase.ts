import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  full_name: string;
  user_type: 'student' | 'parent' | 'teacher';
  grade_level?: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolDetails {
  id: string;
  user_id: string;
  school_name: string;
  address?: string;
  city?: string;
  state?: string;
  syllabus: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  created_by: string;
  title: string;
  subject: 'math' | 'english' | 'evs' | 'games' | 'all';
  grade_level: number;
  exercise_type: string;
  content: any;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  exercise_id: string;
  score: number;
  total_questions: number;
  time_spent: number;
  completed_at: string;
}

export interface StudentStats {
  id: string;
  student_id: string;
  total_points: number;
  badges: string[];
  streak_days: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

export interface DailyChallenge {
  id: string;
  student_id: string;
  subject: 'math' | 'english' | 'evs' | 'games';
  challenge_text: string;
  is_completed: boolean;
  challenge_date: string;
  points_awarded: number;
  created_at: string;
}

export interface ParentStudentLink {
  id: string;
  parent_id: string;
  student_id: string;
  relationship: string;
  created_at: string;
}