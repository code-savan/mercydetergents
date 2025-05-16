'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../auth/AuthContext'
import LogoutButton from '../../components/LogoutButton'

export default function AdminLayout({ children, title }) {
  const { user } = useAuth()
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-100 bg-white hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-antonio text-2xl">Mercy Peter</h1>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className={`flex items-center px-4 py-3 text-sm ${isActive('/admin') && pathname === '/admin' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <span className="material-icons-outlined text-lg mr-3">dashboard</span>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/products') ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <span className="material-icons-outlined text-lg mr-3">inventory_2</span>
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/orders') ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <span className="material-icons-outlined text-lg mr-3">shopping_bag</span>
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/customers"
                className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/customers') ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                <span className="material-icons-outlined text-lg mr-3">people</span>
                Customers
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
          >
            <span className="material-icons-outlined text-lg mr-3">storefront</span>
            View Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center">
          <div className="md:hidden">
            <h1 className="font-antonio text-xl">Mercy Peter</h1>
          </div>

          <h2 className="text-xl font-medium hidden md:block">{title}</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:inline-block">
              {user?.email}
            </span>
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="md:hidden mb-6">
            <h2 className="text-xl font-medium">{title}</h2>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}
