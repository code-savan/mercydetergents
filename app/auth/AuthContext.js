'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

// Demo admin credentials
const DEMO_ADMIN = {
  email: 'admin@mercypeter.com',
  password: 'admin123'
}

// Create the auth context
const AuthContext = createContext({})

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem('mercypeter_admin_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    // In a real app, this would be an API call to authenticate
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      const userData = { email, role: 'admin' }
      setUser(userData)
      localStorage.setItem('mercypeter_admin_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem('mercypeter_admin_user')
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext)
}
