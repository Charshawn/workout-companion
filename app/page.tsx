'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDateTime } from '@/lib/utils'
import { Activity, Dumbbell, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'
import { ProtectedPage } from '@/components/ProtectedPage'
import { PINDisplay } from '@/components/PINDisplay'
import { ExerciseGraphCarousel } from '@/components/ExerciseGraphCarousel'
import { getPIN } from '@/lib/auth'
import { WorkoutSession } from '@/lib/types'

interface Stats {
  totalWorkouts: number
  totalExercises: number
  totalSessions: number
  recentSessions: WorkoutSession[]
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalWorkouts: 0,
    totalExercises: 0,
    totalSessions: 0,
    recentSessions: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const userPin = getPIN()
      console.log('Loading stats with PIN:', userPin)
      if (!userPin) return

      const [
        { count: totalWorkouts },
        { count: totalExercises },
        { count: totalSessions },
        { data: recentSessions }
      ] = await Promise.all([
        supabase.from('workouts').select('*', { count: 'exact', head: true }).eq('user_pin', userPin),
        supabase.from('exercises').select('*', { count: 'exact', head: true }).eq('user_pin', userPin),
        supabase.from('workout_sessions').select('*', { count: 'exact', head: true }).eq('user_pin', userPin),
        supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_pin', userPin)
          .order('date', { ascending: false })
          .limit(10)
          .returns<WorkoutSession[]>()
      ])

      console.log('Query results:', {
        totalWorkouts,
        totalExercises,
        totalSessions,
        recentSessionsCount: recentSessions?.length
      })

      setStats({
        totalWorkouts: totalWorkouts ?? 0,
        totalExercises: totalExercises ?? 0,
        totalSessions: totalSessions ?? 0,
        recentSessions: recentSessions ?? []
      })
      setLoading(false)
    }

    loadStats()
  }, [])

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Workout Dashboard
          </h1>
          <p className="text-gray-400 text-lg">Track your fitness journey</p>
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 mb-8">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/progress"
            className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Dumbbell className="w-8 h-8" />}
            title="Total Workouts"
            value={stats.totalWorkouts}
            color="bg-blue-500/10 text-blue-400"
          />
          <StatCard
            icon={<Activity className="w-8 h-8" />}
            title="Exercises Tracked"
            value={stats.totalExercises}
            color="bg-purple-500/10 text-purple-400"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Total Sessions"
            value={stats.totalSessions}
            color="bg-green-500/10 text-green-400"
          />
          <StatCard
            icon={<Calendar className="w-8 h-8" />}
            title="This Week"
            value={stats.totalSessions > 0 ? Math.min(stats.totalSessions, 7) : 0}
            color="bg-orange-500/10 text-orange-400"
          />
        </div>

        {/* Progress Graph Carousel */}
        <div className="mb-12">
          <ExerciseGraphCarousel />
        </div>

        {/* Recent Workouts */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-400" />
            Recent Workouts
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : stats.recentSessions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No workouts yet. Start tracking on your Watch!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{session.workout_name}</h3>
                    <p className="text-gray-400">{session.exercise_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{formatDateTime(session.date)}</p>
                    {session.duration && (
                      <p className="text-xs text-gray-500">
                        {Math.round(session.duration / 60)}min
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <PINDisplay />
    </div>
    </ProtectedPage>
  )
}

function StatCard({ icon, title, value, color }: {
  icon: React.ReactNode
  title: string
  value: number
  color: string
}) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <div className={`${color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
