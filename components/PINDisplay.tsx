'use client'

import { useEffect, useState } from 'react'
import { getPIN, clearPIN } from '@/lib/auth'
import { Lock, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function PINDisplay() {
  const [pin, setPin] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setPin(getPIN())
  }, [])

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      clearPIN()
      router.push('/login')
    }
  }

  if (!pin) return null

  return (
    <div className="fixed bottom-6 right-6 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
      <Lock className="w-4 h-4 text-gray-400" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Your PIN</span>
        <span className="text-sm font-mono font-bold text-white tracking-wider">{pin}</span>
      </div>
      <button
        onClick={handleLogout}
        className="ml-2 p-2 hover:bg-gray-700 rounded transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>
    </div>
  )
}
