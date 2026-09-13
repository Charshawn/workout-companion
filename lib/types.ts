export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: Workout
        Insert: Workout
        Update: Partial<Workout>
      }
      exercises: {
        Row: Exercise
        Insert: Exercise
        Update: Partial<Exercise>
      }
      exercise_history: {
        Row: ExerciseHistory
        Insert: ExerciseHistory
        Update: Partial<ExerciseHistory>
      }
      workout_sessions: {
        Row: WorkoutSession
        Insert: WorkoutSession
        Update: Partial<WorkoutSession>
      }
    }
  }
}

export interface Workout {
  id: string
  name: string
  created_at: string
  user_pin: string
}

export interface Exercise {
  id: string
  workout_id: string
  name: string
  weight: number
  sets: number
  reps: number
  goal: number | null
  goal_reps: number | null
  created_at: string
  user_pin: string
}

export interface ExerciseHistory {
  id: string
  exercise_id: string
  weight: number
  reps: number
  sets: number
  date: string
  user_pin: string
}

export interface WorkoutSession {
  id: string
  workout_name: string
  exercise_name: string
  date: string
  duration: number | null
  user_pin: string
}
