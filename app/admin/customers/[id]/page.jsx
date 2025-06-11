'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function CustomerDetail() {
  const params = useParams()
  const customerId = params.id
  const [customer, setCustomer] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchData = async () => {
      // Fetch customer
      const { data: customerData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()
      // Fetch orders for this customer
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, created_at, status, total_amount')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })
      setCustomer(customerData)
      setOrders(ordersData || [])
      setLoading(false)
    }
    fetchData()
  }, [customerId])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Processing':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <AdminLayout title="Customer Profile"><div className="p-8 text-center text-gray-400">Loading...</div></AdminLayout>
  }
  if (!customer) {
    return <AdminLayout title="Customer Profile"><div className="p-8 text-center text-gray-400">Customer not found.</div></AdminLayout>
  }

  const ordersCount = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
  const avgOrderValue = ordersCount > 0 ? (totalSpent / ordersCount) : 0

  return (
    <AdminLayout title={`Customer: ${customer.full_name}`}>
      {/* Notification Banner */}
      {/* <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
      </div> */}

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
                  {customer.full_name?.split(' ').map(n => n[0]).join('')}
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
                <p className="font-medium">{customer.full_name}</p>
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
                <p className="font-medium">{customer.created_at ? new Date(customer.created_at).toLocaleDateString() : ''}</p>
              </div>
            </div>
          </div>

          {/* Address (if available) */}
          {(customer.address || customer.city || customer.state || customer.zip || customer.country) && (
            <div className="bg-white border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-medium">Shipping Address</h3>
              </div>
              <div className="p-6">
                {customer.address && <p className="text-sm mb-1">{customer.address}</p>}
                {customer.city && <p className="text-sm mb-1">{customer.city}{customer.state ? `, ${customer.state}` : ''}</p>}
                {customer.zip && <p className="text-sm mb-1">{customer.zip}</p>}
                {customer.country && <p className="text-sm">{customer.country}</p>}
              </div>
            </div>
          )}
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
                <p className="text-2xl font-medium">{ordersCount}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Total Spent</p>
                <p className="text-2xl font-medium">${totalSpent.toFixed(2)}</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                <p className="text-2xl font-medium">
                  ${avgOrderValue.toFixed(2)}
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
                  {orders.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">No orders found.</td></tr>
                  ) : orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        MP-{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                          {order.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.total_amount?.toFixed(2) || '0.00'}
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
