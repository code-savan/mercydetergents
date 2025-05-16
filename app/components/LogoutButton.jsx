'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../auth/AuthContext'

export default function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm hover:underline text-red-500"
    >
      Log out
    </button>
  )
}
