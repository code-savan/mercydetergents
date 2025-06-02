// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/config'

// const AuthContext = createContext({})

// export const useAuth = () => useContext(AuthContext)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     // Get session on mount
//     const getSession = async () => {
//       console.log('AuthContext: Getting initial session')
//       const { data: { session }, error } = await supabase.auth.getSession()
//       console.log('AuthContext: Initial session:', session)

//       if (session) {
//         // Verify admin status
//         const { data: adminData, error: adminError } = await supabase
//           .from('admin_users')
//           .select('*')
//           .eq('email', session.user.email)
//           .single()

//         console.log('AuthContext: Admin check:', { adminData, adminError })

//         if (adminData) {
//           console.log('AuthContext: Setting user:', session.user)
//           setUser(session.user)
//         } else {
//           console.log('AuthContext: Not an admin, signing out')
//           await supabase.auth.signOut()
//           router.push('/admin/login')
//         }
//       }
//       setLoading(false)
//     }

//     getSession()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log('AuthContext: Auth state changed:', { event, session })

//       if (session) {
//         // Verify admin status on auth changes
//         const { data: adminData, error: adminError } = await supabase
//           .from('admin_users')
//           .select('*')
//           .eq('email', session.user.email)
//           .single()

//         console.log('AuthContext: Auth change admin check:', { adminData, adminError })

//         if (adminData) {
//           console.log('AuthContext: Setting user on auth change:', session.user)
//           setUser(session.user)
//         } else {
//           console.log('AuthContext: Not an admin on auth change, signing out')
//           await supabase.auth.signOut()
//           router.push('/admin/login')
//         }
//       } else {
//         console.log('AuthContext: No session on auth change')
//         setUser(null)
//         if (window.location.pathname.startsWith('/admin') &&
//             window.location.pathname !== '/admin/login') {
//           router.push('/admin/login')
//         }
//       }
//       setLoading(false)
//     })

//     return () => {
//       subscription.unsubscribe()
//     }
//   }, [router])

//   const value = {
//     user,
//     loading,
//     signOut: async () => {
//       console.log('AuthContext: Signing out')
//       await supabase.auth.signOut()
//       router.push('/admin/login')
//     }
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   )
// }
