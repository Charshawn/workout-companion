'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getPIN } from '@/lib/auth'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChevronLeft, ChevronRight, TrendingUp, Activity } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Exercise {
  id: string
  workout_id: string
  name: string
  weight: number
  sets: number
  reps: number
  goal?: number
  goal_reps?: number
}

interface Workout {
  id: string
  name: string
}

interface ExerciseHistory {
  id: string
  exercise_id: string
  weight: number
  reps: number
  sets: number
  date: string
}

interface ExerciseWithHistory extends Exercise {
  history: ExerciseHistory[]
}

export function ExerciseGraphCarousel() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistory[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<string>('')
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [transitioning, setTransitioning] = useState(false)

  // Fetch data
  useEffect(() => {
    async function loadData() {
      const userPin = getPIN()
      if (!userPin) return

      const [
        { data: workoutsData },
        { data: exercisesData },
        { data: historyData }
      ] = await Promise.all([
        supabase.from('workouts').select('*').eq('user_pin', userPin).order('name').returns<Workout[]>(),
        supabase.from('exercises').select('*').eq('user_pin', userPin).order('name').returns<Exercise[]>(),
        supabase.from('exercise_history').select('*').eq('user_pin', userPin).order('date').returns<ExerciseHistory[]>()
      ])

      if (workoutsData) setWorkouts(workoutsData)
      if (exercisesData) setExercises(exercisesData)
      if (historyData) setExerciseHistory(historyData)

      // Auto-select first workout
      if (workoutsData && workoutsData.length > 0) {
        setSelectedWorkout(workoutsData[0].id)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  // Filter exercises by selected workout
  const filteredExercises: Exercise[] = selectedWorkout
    ? exercises.filter(ex => ex.workout_id === selectedWorkout)
    : []

  // Get current exercise
  const currentExercise: Exercise | undefined = filteredExercises[selectedExerciseIndex]

  // Get history for current exercise
  const currentHistory = currentExercise
    ? exerciseHistory.filter(h => h.exercise_id === currentExercise.id)
    : []

  // Chart data
  const chartData = currentHistory.map(h => ({
    date: formatDate(h.date),
    weight: h.weight,
    sets: h.sets,
    reps: h.reps,
    volume: h.weight * h.sets * h.reps
  }))

  // Calculate stats
  const personalBest = currentHistory.length > 0
    ? Math.max(...currentHistory.map(h => h.weight))
    : 0
  const totalVolume = currentHistory.reduce((sum, h) => sum + (h.weight * h.sets * h.reps), 0)
  const workoutsLogged = currentHistory.length

  // Navigation handlers with smooth transitions
  const handlePrevExercise = () => {
    if (selectedExerciseIndex > 0) {
      setTransitioning(true)
      setTimeout(() => {
        setSelectedExerciseIndex(selectedExerciseIndex - 1)
        setTransitioning(false)
      }, 150)
    }
  }

  const handleNextExercise = () => {
    if (selectedExerciseIndex < filteredExercises.length - 1) {
      setTransitioning(true)
      setTimeout(() => {
        setSelectedExerciseIndex(selectedExerciseIndex + 1)
        setTransitioning(false)
      }, 150)
    }
  }

  const handleWorkoutChange = (workoutId: string) => {
    setTransitioning(true)
    setTimeout(() => {
      setSelectedWorkout(workoutId)
      setSelectedExerciseIndex(0) // Reset to first exercise
      setTransitioning(false)
    }, 150)
  }

  const handleExerciseChange = (exerciseIndex: number) => {
    setTransitioning(true)
    setTimeout(() => {
      setSelectedExerciseIndex(exerciseIndex)
      setTransitioning(false)
    }, 150)
  }

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading progress data...</p>
        </div>
      </div>
    )
  }

  if (workouts.length === 0 || exercises.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center py-12 text-gray-400">
          <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No workout data yet. Start tracking on your Watch!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      {/* Header with Dropdowns */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          Progress Tracker
        </h2>

        <div className="flex gap-4 flex-wrap">
          {/* Workout Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 mb-2">Workout</label>
            <select
              value={selectedWorkout}
              onChange={(e) => handleWorkoutChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {workouts.map(workout => (
                <option key={workout.id} value={workout.id}>
                  {workout.name}
                </option>
              ))}
            </select>
          </div>

          {/* Exercise Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 mb-2">Exercise</label>
            <select
              value={selectedExerciseIndex}
              onChange={(e) => handleExerciseChange(Number(e.target.value))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              disabled={filteredExercises.length === 0}
            >
              {filteredExercises.map((exercise, index) => (
                <option key={exercise.id} value={index}>
                  {exercise.name}
                </option>
              ))}
              {filteredExercises.length === 0 && (
                <option value="">No exercises</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Exercise Navigation and Graph */}
      {currentExercise && (
        <div className={`transition-opacity duration-150 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          {/* Exercise Name with Navigation Arrows */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevExercise}
              disabled={selectedExerciseIndex === 0}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center flex-1">
              <h3 className="text-xl font-bold">{currentExercise.name}</h3>
              <div className="mt-1 flex gap-4 justify-center text-sm text-gray-400">
                <span>Current: {currentExercise.weight} lbs</span>
                {currentExercise.goal && <span>Goal: {currentExercise.goal} lbs</span>}
                <span>{currentExercise.sets} sets × {currentExercise.reps} reps</span>
              </div>
            </div>

            <button
              onClick={handleNextExercise}
              disabled={selectedExerciseIndex === filteredExercises.length - 1}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Graph */}
          {currentHistory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === 'Weight (lbs)' && props.payload) {
                        const { sets, reps } = props.payload
                        return [`${value} lbs (${sets} × ${reps})`, name]
                      }
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                    name="Weight (lbs)"
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* PR Stats */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Personal Best</p>
                    <p className="text-2xl font-bold text-green-400">
                      {personalBest} lbs
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Volume</p>
                    <p className="text-2xl font-bold text-purple-400">
                      {totalVolume.toLocaleString()} lbs
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Workouts Logged</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {workoutsLogged}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No history for this exercise yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
