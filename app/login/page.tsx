'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { generatePIN, savePIN, getPIN, isValidPIN } from '@/lib/auth'
import { Dumbbell, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [generatedPIN, setGeneratedPIN] = useState<string | null>(null)
  const [showGenerated, setShowGenerated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // If already has PIN, redirect to dashboard
    const existingPIN = getPIN()
    if (existingPIN) {
      router.push('/')
    }
  }, [router])

  const handleGeneratePIN = () => {
    const newPIN = generatePIN()
    setGeneratedPIN(newPIN)
    setShowGenerated(true)
    setError('')
  }

  const handleSaveGeneratedPIN = () => {
    if (generatedPIN) {
      savePIN(generatedPIN)
      router.push('/')
    }
  }

  const handleLogin = () => {
    if (!isValidPIN(pin)) {
      setError('Please enter a valid 4-digit PIN')
      return
    }
    savePIN(pin)
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Workout Dashboard
          </h1>
          <p className="text-gray-400">Secure access to your fitness data</p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          {!showGenerated ? (
            <>
              {/* PIN Entry */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Enter Your PIN
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '')
                      setPin(value)
                      setError('')
                    }}
                    placeholder="0000"
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white text-2xl text-center tracking-widest placeholder-gray-500"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                disabled={pin.length !== 4}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">
                    New user?
                  </span>
                </div>
              </div>

              {/* Generate PIN Button */}
              <button
                onClick={handleGeneratePIN}
                className="w-full py-4 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Generate My PIN
              </button>
            </>
          ) : (
            <>
              {/* Generated PIN Display */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-6">
                  <Lock className="w-8 h-8 text-green-400" />
                </div>

                <h2 className="text-2xl font-bold mb-3">Your PIN is Ready!</h2>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 rounded-xl p-6 mb-6">
                  <p className="text-gray-400 text-sm mb-2">Your 4-Digit PIN</p>
                  <p className="text-6xl font-bold tracking-wider text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                    {generatedPIN}
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 text-left">
                  <p className="text-yellow-400 text-sm font-medium mb-2">⚠️ Important!</p>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Save this PIN somewhere safe</li>
                    <li>• You'll need it to access your data</li>
                    <li>• Use the same PIN on your Watch app</li>
                  </ul>
                </div>

                <button
                  onClick={handleSaveGeneratedPIN}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                  I've Saved My PIN
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowGenerated(false)}
                  className="w-full mt-3 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Go Back
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Your data is secured with end-to-end encryption
        </p>
      </div>
    </div>
  )
}
