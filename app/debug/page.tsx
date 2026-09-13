'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getPIN } from '@/lib/auth'

export default function DebugPage() {
  const [currentPIN, setCurrentPIN] = useState<string | null>(null)
  const [allWorkouts, setAllWorkouts] = useState<any[]>([])
  const [allSessions, setAllSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDebugData() {
      const pin = getPIN()
      setCurrentPIN(pin)

      // Get ALL workouts (no PIN filter)
      const { data: workouts } = await supabase
        .from('workouts')
        .select('id, name, user_pin, created_at')
        .order('created_at', { ascending: false })

      // Get ALL sessions (no PIN filter)
      const { data: sessions } = await supabase
        .from('workout_sessions')
        .select('id, workout_name, exercise_name, user_pin, date')
        .order('date', { ascending: false })

      setAllWorkouts(workouts || [])
      setAllSessions(sessions || [])
      setLoading(false)
    }

    loadDebugData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading debug data...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Database Debug Info</h1>

      {/* Current PIN */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Your Current PIN</h2>
        <p className="text-4xl font-mono">{currentPIN || 'Not set'}</p>
      </div>

      {/* All Workouts */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">All Workouts in Database ({allWorkouts.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">User PIN</th>
                <th className="text-left p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {allWorkouts.map((workout) => (
                <tr key={workout.id} className="border-b border-gray-700">
                  <td className="p-2">{workout.name}</td>
                  <td className="p-2 font-mono">
                    {workout.user_pin || <span className="text-red-400">NULL</span>}
                  </td>
                  <td className="p-2 text-gray-400">{workout.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Sessions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">All Workout Sessions ({allSessions.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-2">Workout</th>
                <th className="text-left p-2">Exercise</th>
                <th className="text-left p-2">User PIN</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {allSessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-700">
                  <td className="p-2">{session.workout_name}</td>
                  <td className="p-2">{session.exercise_name}</td>
                  <td className="p-2 font-mono">
                    {session.user_pin || <span className="text-red-400">NULL</span>}
                  </td>
                  <td className="p-2 text-gray-400">{session.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
