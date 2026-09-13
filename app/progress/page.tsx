'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ExerciseHistory, Exercise } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface ExerciseWithHistory extends Exercise {
  history: ExerciseHistory[]
}

export default function ProgressPage() {
  const [exercises, setExercises] = useState<ExerciseWithHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .order('name')
        .returns<Exercise[]>()

      const { data: historyData } = await supabase
        .from('exercise_history')
        .select('*')
        .order('date')
        .returns<ExerciseHistory[]>()

      if (exercisesData && historyData) {
        const exercisesWithHistory: ExerciseWithHistory[] = exercisesData.map(exercise => ({
          ...exercise,
          history: historyData.filter(h => h.exercise_id === exercise.id)
        }))
        setExercises(exercisesWithHistory)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Progress Tracking
          </h1>
          <p className="text-gray-400 text-lg">Visualize your strength gains</p>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/progress"
            className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Progress
          </Link>
          <Link
            href="/history"
            className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            History
          </Link>
        </nav>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading progress data...</p>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No exercise data yet. Start tracking on your Watch!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {exercises.filter(ex => ex.history.length > 0).map(exercise => (
              <div key={exercise.id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    {exercise.name}
                  </h2>
                  <div className="mt-2 flex gap-6 text-sm text-gray-400">
                    <span>Current: {exercise.weight} lbs</span>
                    {exercise.goal && <span>Goal: {exercise.goal} lbs</span>}
                    <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={exercise.history.map(h => ({
                    date: formatDate(h.date),
                    weight: h.weight,
                    volume: h.weight * h.sets * h.reps
                  }))}>
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

                {/* PR Display */}
                {exercise.history.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Personal Best</p>
                        <p className="text-2xl font-bold text-green-400">
                          {Math.max(...exercise.history.map(h => h.weight))} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Volume</p>
                        <p className="text-2xl font-bold text-purple-400">
                          {exercise.history.reduce((sum, h) => sum + (h.weight * h.sets * h.reps), 0).toLocaleString()} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Workouts Logged</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {exercise.history.length}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
