import { supabase, UserProgress } from './supabase'

export interface ProgressData {
  exerciseId: string
  completed: boolean
  score: number
  attempts: number
}

export class ProgressTracker {
  static async saveProgress(data: ProgressData): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        exercise_id: data.exerciseId,
        completed: data.completed,
        score: data.score,
        attempts: data.attempts,
        last_attempt: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving progress:', error)
    }

    // Update user profile totals if completed
    if (data.completed) {
      await this.updateUserProfile(user.id)
    }
  }

  static async getProgress(exerciseId: string): Promise<UserProgress | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .single()

    if (error) {
      console.error('Error fetching progress:', error)
      return null
    }

    return data
  }

  static async getAllProgress(): Promise<UserProgress[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching all progress:', error)
      return []
    }

    return data || []
  }

  static async getCompletedExercises(): Promise<string[]> {
    const progress = await this.getAllProgress()
    return progress
      .filter(p => p.completed)
      .map(p => p.exercise_id)
  }

  private static async updateUserProfile(userId: string): Promise<void> {
    // Get current totals
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)

    const totalCompleted = progressData?.length || 0
    const totalScore = progressData?.reduce((sum, p) => sum + p.score, 0) || 0

    // Update profile
    await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        total_exercises_completed: totalCompleted,
        total_score: totalScore
      })
  }

  static async incrementAttempts(exerciseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get current progress or create new
    const currentProgress = await this.getProgress(exerciseId)
    const attempts = (currentProgress?.attempts || 0) + 1

    await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        exercise_id: exerciseId,
        attempts,
        last_attempt: new Date().toISOString(),
        completed: currentProgress?.completed || false,
        score: currentProgress?.score || 0
      })
  }
}