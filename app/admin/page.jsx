'use client'

import React from 'react'
import Link from 'next/link'
import AdminLayout from './components/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Products</h3>
            <span className="material-icons-outlined">inventory_2</span>
          </div>
          <p className="text-3xl font-medium mb-2">12</p>
          <Link href="/admin/products" className="text-sm text-blue-600 hover:underline">
            Manage products
          </Link>
        </div>

        <div className="bg-white border border-gray-100 p-6 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Orders</h3>
            <span className="material-icons-outlined">shopping_bag</span>
          </div>
          <p className="text-3xl font-medium mb-2">--</p>
          <p className="text-xs text-gray-500">Coming soon</p>
        </div>

        <div className="bg-white border border-gray-100 p-6 opacity-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Customers</h3>
            <span className="material-icons-outlined">people</span>
          </div>
          <p className="text-3xl font-medium mb-2">--</p>
          <p className="text-xs text-gray-500">Coming soon</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-white border border-gray-100 p-4 flex items-center hover:border-black transition-colors"
          >
            <span className="material-icons-outlined mr-3">add</span>
            <span>Add New Product</span>
          </Link>

          <Link
            href="/"
            className="bg-white border border-gray-100 p-4 flex items-center hover:border-black transition-colors"
          >
            <span className="material-icons-outlined mr-3">storefront</span>
            <span>View Store</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
