'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        router.push(redirectTo)
        return
      }

      if (requireAdmin && currentUser.role !== 'admin') {
        router.push('/dashboard') // Redirect non-admin users to dashboard
        return
      }
    }
  }, [currentUser, loading, router, requireAdmin, redirectTo])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!currentUser) {
    return null
  }

  if (requireAdmin && currentUser.role !== 'admin') {
    return null
  }

  return <>{children}</>
}
