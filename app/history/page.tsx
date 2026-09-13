'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WorkoutSession } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { Calendar, Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<WorkoutSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWorkout, setFilterWorkout] = useState('')

  useEffect(() => {
    async function loadSessions() {
      const { data } = await supabase
        .from('workout_sessions')
        .select('*')
        .order('date', { ascending: false })

      if (data) {
        setSessions(data)
        setFilteredSessions(data)
      }
      setLoading(false)
    }

    loadSessions()
  }, [])

  useEffect(() => {
    let filtered = sessions

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.exercise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.workout_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterWorkout) {
      filtered = filtered.filter(session => session.workout_name === filterWorkout)
    }

    setFilteredSessions(filtered)
  }, [searchTerm, filterWorkout, sessions])

  const uniqueWorkouts = Array.from(new Set(sessions.map(s => s.workout_name)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Workout History
          </h1>
          <p className="text-gray-400 text-lg">Complete log of all your training sessions</p>
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
            className="px-6 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Progress
          </Link>
          <Link
            href="/history"
            className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            History
          </Link>
        </nav>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
            </div>

            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterWorkout}
                onChange={(e) => setFilterWorkout(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none cursor-pointer"
              >
                <option value="">All Workouts</option>
                {uniqueWorkouts.map(workout => (
                  <option key={workout} value={workout}>{workout}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading workout history...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              {sessions.length === 0
                ? 'No workouts yet. Start tracking on your Watch!'
                : 'No results found. Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Workout</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Exercise</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDateTime(session.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                          {session.workout_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {session.exercise_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {session.duration ? `${Math.round(session.duration / 60)}min` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Results Count */}
            <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-600">
              <p className="text-sm text-gray-400">
                Showing {filteredSessions.length} of {sessions.length} total sessions
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
