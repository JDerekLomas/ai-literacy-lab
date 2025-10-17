import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProgress {
  id: string
  user_id: string
  exercise_id: string
  completed: boolean
  score: number
  attempts: number
  last_attempt: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string | null
  total_exercises_completed: number
  total_score: number
  created_at: string
  updated_at: string
}

export interface ExerciseStats {
  exercise_id: string
  total_attempts: number
  total_completions: number
  average_score: number
  completion_rate: number
}