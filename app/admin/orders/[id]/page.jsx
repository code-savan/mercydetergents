'use client'

import React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'

// Demo orders data - same as in the orders page
const demoOrders = [
  {
    id: 'ORD-2023-001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+234 803 123 4567',
    date: '2023-11-15',
    status: 'Delivered',
    total: 89.97,
    items: [
      { id: 'PRD-001', name: 'Multi-Purpose Cleaner', price: 29.99, quantity: 1 },
      { id: 'PRD-002', name: 'Dish Washing Liquid', price: 19.99, quantity: 2 },
      { id: 'PRD-005', name: 'Fabric Softener', price: 19.99, quantity: 1 }
    ],
    shippingAddress: {
      street: '15 Broad Street',
      city: 'Lagos',
      state: 'Lagos State',
      zip: '100001',
      country: 'Nigeria'
    },
    paymentMethod: 'Credit Card',
    deliveryDate: '2023-11-18'
  },
  {
    id: 'ORD-2023-002',
    customer: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+234 705 987 6543',
    date: '2023-11-14',
    status: 'Processing',
    total: 45.50,
    items: [
      { id: 'PRD-003', name: 'Laundry Detergent', price: 25.50, quantity: 1 },
      { id: 'PRD-004', name: 'Glass Cleaner', price: 20.00, quantity: 1 }
    ],
    shippingAddress: {
      street: '7 Marina Road',
      city: 'Lagos',
      state: 'Lagos State',
      zip: '100001',
      country: 'Nigeria'
    },
    paymentMethod: 'Bank Transfer',
    deliveryDate: 'Pending'
  },
  {
    id: 'ORD-2023-003',
    customer: 'Michael Williams',
    email: 'mwilliams@example.com',
    phone: '+234 815 555 1234',
    date: '2023-11-10',
    status: 'Delivered',
    total: 134.25,
    items: [
      { id: 'PRD-001', name: 'Multi-Purpose Cleaner', price: 29.99, quantity: 2 },
      { id: 'PRD-002', name: 'Dish Washing Liquid', price: 19.99, quantity: 1 },
      { id: 'PRD-003', name: 'Laundry Detergent', price: 25.50, quantity: 1 },
      { id: 'PRD-006', name: 'Toilet Cleaner', price: 18.99, quantity: 1 },
      { id: 'PRD-004', name: 'Glass Cleaner', price: 20.00, quantity: 1 }
    ],
    shippingAddress: {
      street: '25 Awolowo Avenue',
      city: 'Ibadan',
      state: 'Oyo State',
      zip: '200001',
      country: 'Nigeria'
    },
    paymentMethod: 'Debit Card',
    deliveryDate: '2023-11-14'
  },
  {
    id: 'ORD-2023-004',
    customer: 'Emma Brown',
    email: 'emma.b@example.com',
    phone: '+234 902 111 2222',
    date: '2023-11-08',
    status: 'Cancelled',
    total: 29.99,
    items: [
      { id: 'PRD-001', name: 'Multi-Purpose Cleaner', price: 29.99, quantity: 1 }
    ],
    shippingAddress: {
      street: '12 Nnamdi Azikiwe Street',
      city: 'Port Harcourt',
      state: 'Rivers State',
      zip: '500001',
      country: 'Nigeria'
    },
    paymentMethod: 'Credit Card',
    deliveryDate: 'Cancelled'
  },
  {
    id: 'ORD-2023-005',
    customer: 'David Miller',
    email: 'david.m@example.com',
    phone: '+234 708 333 4444',
    date: '2023-11-05',
    status: 'Delivered',
    total: 159.85,
    items: [
      { id: 'PRD-003', name: 'Laundry Detergent', price: 25.50, quantity: 2 },
      { id: 'PRD-005', name: 'Fabric Softener', price: 19.99, quantity: 3 },
      { id: 'PRD-006', name: 'Toilet Cleaner', price: 18.99, quantity: 1 },
      { id: 'PRD-007', name: 'Air Freshener', price: 15.95, quantity: 2 }
    ],
    shippingAddress: {
      street: '5 Akin Adesola Street',
      city: 'Abuja',
      state: 'FCT',
      zip: '900001',
      country: 'Nigeria'
    },
    paymentMethod: 'Bank Transfer',
    deliveryDate: '2023-11-09'
  }
]

export default function OrderDetail() {
  const params = useParams()
  const orderId = params.id

  const order = demoOrders.find(o => o.id === orderId) || demoOrders[0]

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
    <AdminLayout title={`Order ${order.id}`}>
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
            href="/admin/orders"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <h2 className="text-xl font-medium">Order Details</h2>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
            {order.status}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>print</span>
            Print
          </button>
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>file_download</span>
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Order Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                  <p className="font-medium">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-medium">{order.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{order.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Delivery Date</p>
                  <p className="font-medium">{order.deliveryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div>
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Shipping Address</h3>
            </div>
            <div className="p-6">
              <p className="text-sm mb-1">{order.customer}</p>
              <p className="text-sm mb-1">{order.shippingAddress.street}</p>
              <p className="text-sm mb-1">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="text-sm mb-1">{order.shippingAddress.zip}</p>
              <p className="text-sm">{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Actions</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-2">
                <button className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors flex items-center justify-center text-sm w-full">
                  <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>mark_email_read</span>
                  Send Invoice
                </button>
                {order.status === 'Processing' && (
                  <button className="bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition-colors flex items-center justify-center text-sm w-full">
                    <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>local_shipping</span>
                    Mark as Shipped
                  </button>
                )}
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <button className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors flex items-center justify-center text-sm w-full">
                    <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>cancel</span>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
