'use client'

import React from 'react'
import AdminLayout from '../components/AdminLayout'
import Link from 'next/link'

// Demo customers data
const demoCustomers = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 803 123 4567',
    orders: 3,
    totalSpent: 89.97,
    dateJoined: '2023-10-15'
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+234 705 987 6543',
    orders: 1,
    totalSpent: 45.50,
    dateJoined: '2023-10-25'
  },
  {
    id: 'CUST-003',
    name: 'Michael Williams',
    email: 'mwilliams@example.com',
    phone: '+234 815 555 1234',
    orders: 5,
    totalSpent: 134.25,
    dateJoined: '2023-09-05'
  },
  {
    id: 'CUST-004',
    name: 'Emma Brown',
    email: 'emma.b@example.com',
    phone: '+234 902 111 2222',
    orders: 2,
    totalSpent: 67.98,
    dateJoined: '2023-10-08'
  },
  {
    id: 'CUST-005',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+234 708 333 4444',
    orders: 4,
    totalSpent: 159.85,
    dateJoined: '2023-08-15'
  },
  {
    id: 'CUST-006',
    name: 'Olivia Wilson',
    email: 'olivia.w@example.com',
    phone: '+234 802 777 8888',
    orders: 2,
    totalSpent: 75.90,
    dateJoined: '2023-10-30'
  }
]

export default function CustomersAdmin() {
  return (
    <AdminLayout title="Customers">
      {/* Notification Banner */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="material-icons-outlined text-yellow-400">info</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              The content below is for presentation purposes only and will become live when confidential credentials are handed over to the developer.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{demoCustomers.length} customers</p>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-white border border-gray-300 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-64"
            />
            <span className="material-icons-outlined absolute left-3 top-2 text-gray-400" style={{ fontSize: '18px' }}>search</span>
          </div>
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>file_download</span>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {demoCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.dateJoined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      View
                    </Link>
                    <button className="text-gray-600 hover:underline">
                      Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
