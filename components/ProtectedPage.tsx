'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPIN } from '@/lib/auth'

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const pin = getPIN()
    if (!pin) {
      router.push('/login')
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
