// 'use client'

// import React, { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { redirect, useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/config'

// export default function Access() {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: ''
//   })
//   const [error, setError] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [isRegistering, setIsRegistering] = useState(false)
//   const router = useRouter()

//   // Check if already logged in and is admin
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const { data: { session }, error: sessionError } = await supabase.auth.getSession()

//         if (sessionError) throw sessionError

//         if (session) {
//           const { data: adminData, error: adminError } = await supabase
//             .from('admin_users')
//             .select('*')
//             .eq('email', session.user.email)
//             .single()

//           if (!adminError && adminData) {
//             window.location.href = '/admin'
//           }
//         }
//       } catch (error) {
//         console.error('Auth check error:', error)
//       }
//     }
//     checkAuth()
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setIsLoading(true)

//     try {
//       if (isRegistering) {
//         // Validate passwords match
//         if (formData.password !== formData.confirmPassword) {
//           throw new Error('Passwords do not match')
//         }

//         // Register new user
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             emailRedirectTo: `${window.location.origin}/admin`
//           }
//         })

//         if (authError) throw authError

//         // Add user to admin_users table
//         const { error: adminError } = await supabase
//           .from('admin_users')
//           .insert([{
//             email: formData.email,
//             role: 'admin',
//             created_at: new Date().toISOString()
//           }])

//         if (adminError) throw adminError

//         setError('Registration successful! Please check your email to verify your account.')
//         setIsRegistering(false)
//       } else {
//         // First attempt to sign in
//         const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
//           email: formData.email,
//           password: formData.password,
//         })

//         if (authError) {
//           throw new Error('Invalid email or password')
//         }

//         // Then check if user is admin
//         const { data: adminCheck, error: adminError } = await supabase
//           .from('admin_users')
//           .select('*')
//           .eq('email', formData.email)
//           .single()

//         if (adminError || !adminCheck) {
//           // If not admin, sign out and throw error
//           await supabase.auth.signOut()
//           throw new Error('Unauthorized access: Not an admin user')
//         }

//         // Wait for auth state to be updated
//         await new Promise(resolve => setTimeout(resolve, 500))

//         // If everything is successful, redirect to admin
//         window.location.href = '/admin'
//       }
//     } catch (err) {
//       console.error('Error:', err)
//       setError(err.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg">
//         <div className="text-center mb-8">
//           <h1 className="font-antonio text-3xl font-bold">
//             {isRegistering ? 'Create Admin Account' : 'Admin Access'}
//           </h1>
//           <p className="text-gray-600 mt-2">
//             {isRegistering
//               ? 'Register a new admin account'
//               : 'Sign in to access the admin panel'}
//           </p>
//         </div>

//         {error && (
//           <div className={`mb-4 p-3 rounded-md ${
//             error.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//           }`}>
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="admin@mercypeter.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete={isRegistering ? 'new-password' : 'current-password'}
//               required
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="••••••••"
//             />
//           </div>

//           {isRegistering && (
//             <div>
//               <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type="password"
//                 autoComplete="new-password"
//                 required
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="••••••••"
//               />
//             </div>
//           )}

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
//             >
//               {isLoading
//                 ? (isRegistering ? 'Creating Account...' : 'Signing in...')
//                 : (isRegistering ? 'Create Account' : 'Sign in')}
//             </button>
//           </div>
//         </form>

//         <div className="mt-8 text-center">
//           <Link href="/" className="text-sm text-blue-600 hover:underline">
//             Return to website
//           </Link>

//           <div className="mt-4">
//             <button
//               type="button"
//               onClick={() => setIsRegistering(!isRegistering)}
//               className="text-sm text-blue-600 hover:underline"
//             >
//               {isRegistering
//                 ? 'Already have an account? Sign in'
//                 : 'Need to create an admin account?'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
