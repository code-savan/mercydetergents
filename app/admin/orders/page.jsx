'use client'

import React from 'react'
import AdminLayout from '../components/AdminLayout'
import Link from 'next/link'

// Demo orders data
const demoOrders = [
  {
    id: 'ORD-2023-001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    date: '2023-11-15',
    status: 'Delivered',
    total: 89.97,
    items: 3
  },
  {
    id: 'ORD-2023-002',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    date: '2023-11-14',
    status: 'Processing',
    total: 45.50,
    items: 2
  },
  {
    id: 'ORD-2023-003',
    customer: 'Michael Williams',
    email: 'mwilliams@example.com',
    date: '2023-11-10',
    status: 'Delivered',
    total: 134.25,
    items: 5
  },
  {
    id: 'ORD-2023-004',
    customer: 'Emma Brown',
    email: 'emma.b@example.com',
    date: '2023-11-08',
    status: 'Cancelled',
    total: 29.99,
    items: 1
  },
  {
    id: 'ORD-2023-005',
    customer: 'David Miller',
    email: 'david.m@example.com',
    date: '2023-11-05',
    status: 'Delivered',
    total: 159.85,
    items: 4
  }
]

export default function OrdersAdmin() {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout title="Orders">
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
        <p className="text-sm text-gray-500">{demoOrders.length} orders</p>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>filter_list</span>
            Filter
          </button>
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
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {demoOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${order.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{order.items} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
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
