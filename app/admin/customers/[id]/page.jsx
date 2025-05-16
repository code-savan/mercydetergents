'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'

// Demo customers data - same as in the customers page
const demoCustomers = [
  {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 803 123 4567',
    orders: 3,
    totalSpent: 89.97,
    dateJoined: '2023-10-15',
    address: {
      street: '15 Broad Street',
      city: 'Lagos',
      state: 'Lagos State',
      zip: '100001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-001', date: '2023-11-15', status: 'Delivered', total: 29.99 },
      { id: 'ORD-2023-010', date: '2023-10-25', status: 'Delivered', total: 39.98 },
      { id: 'ORD-2023-015', date: '2023-09-12', status: 'Delivered', total: 20.00 }
    ]
  },
  {
    id: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+234 705 987 6543',
    orders: 1,
    totalSpent: 45.50,
    dateJoined: '2023-10-25',
    address: {
      street: '7 Marina Road',
      city: 'Lagos',
      state: 'Lagos State',
      zip: '100001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-002', date: '2023-11-14', status: 'Processing', total: 45.50 }
    ]
  },
  {
    id: 'CUST-003',
    name: 'Michael Williams',
    email: 'mwilliams@example.com',
    phone: '+234 815 555 1234',
    orders: 5,
    totalSpent: 134.25,
    dateJoined: '2023-09-05',
    address: {
      street: '25 Awolowo Avenue',
      city: 'Ibadan',
      state: 'Oyo State',
      zip: '200001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-003', date: '2023-11-10', status: 'Delivered', total: 49.99 },
      { id: 'ORD-2023-008', date: '2023-10-15', status: 'Delivered', total: 19.99 },
      { id: 'ORD-2023-012', date: '2023-10-02', status: 'Delivered', total: 24.99 },
      { id: 'ORD-2023-018', date: '2023-09-20', status: 'Delivered', total: 19.99 },
      { id: 'ORD-2023-022', date: '2023-09-05', status: 'Delivered', total: 19.29 }
    ]
  },
  {
    id: 'CUST-004',
    name: 'Emma Brown',
    email: 'emma.b@example.com',
    phone: '+234 902 111 2222',
    orders: 2,
    totalSpent: 67.98,
    dateJoined: '2023-10-08',
    address: {
      street: '12 Nnamdi Azikiwe Street',
      city: 'Port Harcourt',
      state: 'Rivers State',
      zip: '500001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-004', date: '2023-11-08', status: 'Cancelled', total: 29.99 },
      { id: 'ORD-2023-011', date: '2023-10-20', status: 'Delivered', total: 37.99 }
    ]
  },
  {
    id: 'CUST-005',
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+234 708 333 4444',
    orders: 4,
    totalSpent: 159.85,
    dateJoined: '2023-08-15',
    address: {
      street: '5 Akin Adesola Street',
      city: 'Abuja',
      state: 'FCT',
      zip: '900001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-005', date: '2023-11-05', status: 'Delivered', total: 45.90 },
      { id: 'ORD-2023-009', date: '2023-10-18', status: 'Delivered', total: 55.99 },
      { id: 'ORD-2023-013', date: '2023-10-01', status: 'Delivered', total: 39.98 },
      { id: 'ORD-2023-019', date: '2023-09-12', status: 'Delivered', total: 17.98 }
    ]
  },
  {
    id: 'CUST-006',
    name: 'Olivia Wilson',
    email: 'olivia.w@example.com',
    phone: '+234 802 777 8888',
    orders: 2,
    totalSpent: 75.90,
    dateJoined: '2023-10-30',
    address: {
      street: '8 Allen Avenue',
      city: 'Lagos',
      state: 'Lagos State',
      zip: '101001',
      country: 'Nigeria'
    },
    recentOrders: [
      { id: 'ORD-2023-006', date: '2023-11-02', status: 'Delivered', total: 45.95 },
      { id: 'ORD-2023-014', date: '2023-10-30', status: 'Processing', total: 29.95 }
    ]
  }
]

export default function CustomerDetail() {
  const params = useParams()
  const customerId = params.id

  const customer = demoCustomers.find(c => c.id === customerId) || demoCustomers[0]

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
    <AdminLayout title={`Customer: ${customer.name}`}>
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
        <div className="flex items-center gap-4">
          <Link
            href="/admin/customers"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <h2 className="text-xl font-medium">Customer Profile</h2>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>edit</span>
            Edit
          </button>
          <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>mail</span>
            Email Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div>
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium">Customer Information</h3>
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Customer ID</p>
                <p className="font-medium">{customer.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Joined</p>
                <p className="font-medium">{customer.dateJoined}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Shipping Address</h3>
            </div>
            <div className="p-6">
              <p className="text-sm mb-1">{customer.name}</p>
              <p className="text-sm mb-1">{customer.address.street}</p>
              <p className="text-sm mb-1">{customer.address.city}, {customer.address.state}</p>
              <p className="text-sm mb-1">{customer.address.zip}</p>
              <p className="text-sm">{customer.address.country}</p>
            </div>
          </div>
        </div>

        {/* Orders and Stats */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Customer Overview</h3>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-medium">{customer.orders}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-2xl font-medium">${customer.totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                <p className="text-2xl font-medium">
                  ${customer.orders > 0 ? (customer.totalSpent / customer.orders).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-medium">Recent Orders</h3>
              <Link
                href="/admin/orders"
                className="text-sm text-blue-600 hover:underline"
              >
                View all orders
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
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
                  {customer.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total.toFixed(2)}
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
        </div>
      </div>
    </AdminLayout>
  )
}
