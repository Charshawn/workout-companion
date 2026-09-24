'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getPIN } from '@/lib/auth'
import { TrendingUp, Award, AlertCircle, Flame } from 'lucide-react'

interface ExerciseHistory {
  id: string
  exercise_id: string
  weight: number
  reps: number
  sets: number
  date: string
}

interface Exercise {
  id: string
  name: string
  weight: number
}

interface Insight {
  type: 'increase' | 'pr' | 'plateau'
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

export function WorkoutInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function analyzeWorkouts() {
      const userPin = getPIN()
      if (!userPin) return

      const [
        { data: exercises },
        { data: history }
      ] = await Promise.all([
        supabase.from('exercises').select('*').eq('user_pin', userPin).returns<Exercise[]>(),
        supabase.from('exercise_history').select('*').eq('user_pin', userPin).order('date', { ascending: false }).returns<ExerciseHistory[]>()
      ])

      if (!exercises || !history) {
        setLoading(false)
        return
      }

      const newInsights: Insight[] = []
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

      // 1. Biggest increases this week
      const weeklyIncreases = exercises.map(exercise => {
        const exerciseHistory = history.filter(h => h.exercise_id === exercise.id)
        const recentHistory = exerciseHistory.filter(h => new Date(h.date) >= oneWeekAgo)
        const olderHistory = exerciseHistory.filter(h => new Date(h.date) < oneWeekAgo)

        if (recentHistory.length === 0 || olderHistory.length === 0) return null

        const recentAvg = recentHistory.reduce((sum, h) => sum + h.weight, 0) / recentHistory.length
        const olderAvg = olderHistory.reduce((sum, h) => sum + h.weight, 0) / olderHistory.length
        const increase = recentAvg - olderAvg

        return { exercise, increase, recentAvg }
      }).filter(Boolean)

      const biggestIncrease = weeklyIncreases.sort((a, b) => (b?.increase || 0) - (a?.increase || 0))[0]

      if (biggestIncrease && biggestIncrease.increase > 0) {
        newInsights.push({
          type: 'increase',
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Biggest Increase This Week',
          description: `${biggestIncrease.exercise.name} up ${biggestIncrease.increase.toFixed(1)} lbs on average`,
          color: 'bg-green-500/10 border-green-500/30 text-green-400'
        })
      }

      // 2. Recent PRs (last workout)
      const latestDate = history.length > 0 ? history[0].date : null
      if (latestDate) {
        const lastWorkoutHistory = history.filter(h => h.date === latestDate)
        const prs = lastWorkoutHistory.filter(h => {
          const exerciseHistory = history.filter(hist => hist.exercise_id === h.exercise_id)
          const maxWeight = Math.max(...exerciseHistory.map(hist => hist.weight))
          return h.weight === maxWeight
        })

        if (prs.length > 0) {
          const prExercises = prs.map(pr => {
            const exercise = exercises.find(e => e.id === pr.exercise_id)
            return exercise?.name
          }).filter(Boolean)

          newInsights.push({
            type: 'pr',
            icon: <Award className="w-5 h-5" />,
            title: 'Personal Records!',
            description: `Hit PRs in ${prExercises.slice(0, 2).join(', ')}${prExercises.length > 2 ? ` +${prExercises.length - 2} more` : ''}`,
            color: 'bg-purple-500/10 border-purple-500/30 text-purple-400'
          })
        }
      }

      // 3. Plateauing exercises (no improvement in 2+ weeks)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

      const plateaus = exercises.filter(exercise => {
        const exerciseHistory = history.filter(h => h.exercise_id === exercise.id)
        const recentHistory = exerciseHistory.filter(h => new Date(h.date) >= twoWeeksAgo)

        if (recentHistory.length < 3) return false

        const weights = recentHistory.map(h => h.weight)
        const allSame = weights.every(w => w === weights[0])
        const noIncrease = Math.max(...weights) === weights[weights.length - 1]

        return allSame || !noIncrease
      })

      if (plateaus.length > 0) {
        newInsights.push({
          type: 'plateau',
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'Time to Level Up',
          description: `${plateaus[0].name} has been steady - try increasing weight or volume`,
          color: 'bg-orange-500/10 border-orange-500/30 text-orange-400'
        })
      }

      // 4. Workout streak (bonus insight)
      const uniqueDates = [...new Set(history.map(h => h.date.split('T')[0]))]
      const recentDates = uniqueDates.filter(date => new Date(date) >= oneWeekAgo)

      if (recentDates.length >= 4) {
        newInsights.push({
          type: 'increase',
          icon: <Flame className="w-5 h-5" />,
          title: 'On Fire!',
          description: `${recentDates.length} workout days this week - keep it up!`,
          color: 'bg-red-500/10 border-red-500/30 text-red-400'
        })
      }

      setInsights(newInsights)
      setLoading(false)
    }

    analyzeWorkouts()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Your Insights</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Your Insights</h2>
        <p className="text-gray-400 text-center py-8">
          Keep logging workouts to unlock personalized insights!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-blue-400" />
        Your Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`${insight.color} border rounded-xl p-6 transition-all hover:scale-105`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                {insight.icon}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm opacity-90">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
