'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { useAuth } from '@/app/context/AuthContext'

export default function AdminLayout({ children, title }) {
//   const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [sidebarVisible, setSidebarVisible] = React.useState(false)

  React.useEffect(() => {
    if (sidebarOpen) setSidebarVisible(true)
    else setTimeout(() => setSidebarVisible(false), 250)
  }, [sidebarOpen])

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex">
      {/* Sidebar (Desktop) */}
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

      {/* Sidebar (Mobile) */}
      {(sidebarOpen || sidebarVisible) && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay: subtle blur/gray, not solid black */}
          <div
            className={`fixed inset-0 transition-opacity duration-300 ${sidebarOpen ? 'bg-black/80 bg-opacity-10 opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Drawer with smooth slide in/out */}
          <div
            className={`relative w-64 bg-white h-full shadow-xl z-50 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ willChange: 'transform' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h1 className="font-antonio text-2xl">Mercy Peter</h1>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="text-gray-500 hover:text-black text-2xl">&times;</button>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-1">
                <li>
                  <Link href="/admin" className={`flex items-center px-4 py-3 text-sm ${isActive('/admin') && pathname === '/admin' ? 'bg-black text-white' : 'hover:bg-gray-50'}`} onClick={() => setSidebarOpen(false)}>
                    <span className="material-icons-outlined text-lg mr-3">dashboard</span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products" className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/products') ? 'bg-black text-white' : 'hover:bg-gray-50'}`} onClick={() => setSidebarOpen(false)}>
                    <span className="material-icons-outlined text-lg mr-3">inventory_2</span>
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/admin/orders" className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/orders') ? 'bg-black text-white' : 'hover:bg-gray-50'}`} onClick={() => setSidebarOpen(false)}>
                    <span className="material-icons-outlined text-lg mr-3">shopping_bag</span>
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/admin/customers" className={`flex items-center px-4 py-3 text-sm ${isActive('/admin/customers') ? 'bg-black text-white' : 'hover:bg-gray-50'}`} onClick={() => setSidebarOpen(false)}>
                    <span className="material-icons-outlined text-lg mr-3">people</span>
                    Customers
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="p-4 border-t border-gray-100">
              <Link href="/" className="flex items-center px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setSidebarOpen(false)}>
                <span className="material-icons-outlined text-lg mr-3">storefront</span>
                View Store
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center">
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="text-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-black rounded-md flex items-center justify-center">
              <span className="material-icons-outlined">menu</span>
            </button>
            <h1 className="font-antonio text-xl ml-2">Mercy Peter</h1>
          </div>

          <h2 className="text-xl font-medium hidden md:block">{title}</h2>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:inline-block">
            mercy@mercypeterdetergent.com
            </span>
            {/* <button
            //   onClick={signOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button> */}
          </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1 px-3 py-1.5 border shadow-sm border-black/60 bg-white text-black text-sm font-medium hover:bg-gray-50 transition md:hidden"
          title="Go to Products"
          style={{ borderRadius: 0 }}
        >
          Store

          <span
            className="material-icons-outlined text-base"
            style={{ fontSize: '18px', }}
          >
            north_east
          </span>

        </Link>
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
