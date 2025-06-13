'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminLayout from '../../components/AdminLayout'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function OrderDetail() {
  const params = useParams()
  const orderId = params.id?.replace(/^MP-/, '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!orderId) return;
    console.log('OrderDetail: orderId param:', orderId)
    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, total_amount, items, customer:customer_id (full_name, email, phone, address, city, state, zip)')
        .eq('id', orderId)
        .single()
      console.log('OrderDetail: fetchOrder result:', { data, error })
      setOrder(data)
      setLoading(false)
    }
    fetchOrder()
  }, [orderId])

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

  // Export order as JSON
  const handleExport = () => {
    if (!order) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(order, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `order-${order.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  // Print order
  const handlePrint = () => {
    window.print();
  }

  if (loading) {
    return <AdminLayout title="Order Details"><div className="p-8 text-center text-gray-400">Loading...</div></AdminLayout>
  }
  if (!order) {
    return <AdminLayout title="Order Details"><div className="p-8 text-center text-gray-400">Order not found.</div></AdminLayout>
  }

  return (
    <AdminLayout title={`Order MP-${order.id}`}>
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
            {order.status || 'N/A'}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>print</span>
            Print
          </button>
          <button onClick={handleExport} className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>file_download</span>
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="col-span-3">
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Order Summary</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order ID</p>
                  <p className="font-medium">MP-{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Placed</p>
                  <p className="font-medium">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Customer</p>
                  <p className="font-medium">{order.customer?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="font-medium">Credit Card</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{order.customer?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="font-medium">{order.customer?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="font-medium">${order.total_amount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items (if you have an items table, otherwise show product and quantity) */}
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
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity || 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          ${(item.price && item.quantity) ? (item.price * item.quantity).toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No items found.</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${order.total_amount?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

      </div>
        {/* Shipping Information */}
        <div>
          <div className="bg-white border border-gray-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-medium">Shipping Address</h3>
            </div>
            <div className="p-6 space-y-2">
              {order.customer?.full_name && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Name:</span> {order.customer.full_name}
                </p>
              )}
              {order.customer?.address && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Address:</span> {order.customer.address}
                </p>
              )}
              {(order.customer?.city || order.customer?.state) && (
                <p className="text-sm mb-1">
                  <span className="font-medium">City/State:</span>{" "}
                  {order.customer.city}
                  {order.customer?.state ? `, ${order.customer.state}` : ""}
                </p>
              )}
              {order.customer?.zip && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Zip:</span> {order.customer.zip}
                </p>
              )}
              {/* {order.customer?.country && <p className="text-sm"><span className="font-medium">Country:</span> {order.customer.country}</p>} */}
            </div>
          </div>


        </div>
    </AdminLayout>
  )
}
