'use client'

import { useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useRouter, usePathname } from 'next/navigation'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if still loading or if it's the login page
    if (loading || pathname === '/admin/login') return

    // If not authenticated and trying to access admin routes, redirect to login
    if (!isAuthenticated && pathname.startsWith('/admin')) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, loading, router, pathname])

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-2 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  // If accessing admin area and not authenticated, don't render children yet
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !isAuthenticated) {
    return null
  }

  // Otherwise, render the children components
  return children
}
