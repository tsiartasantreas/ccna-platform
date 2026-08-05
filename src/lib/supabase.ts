import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Profile {
  id: string;
  email?: string;
  avatar_url?: string;
  display_name: string | null;
  preferred_language: 'en' | 'el';
  theme: 'dark' | 'light';
  plan: 'free' | 'pro';
  revolut_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  module_number: number;
  lesson_number: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
  time_spent_seconds: number;
}

export interface QuizScore {
  id: string;
  user_id: string;
  module_number: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  attempt_number: number;
  completed_at: string;
}

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}
