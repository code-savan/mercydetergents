'use client'

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { formatRelativeDate } from '../../utils/formatDate'

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, total_amount, items, customer:customer_id (full_name, email)')
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

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

  // Export all orders as JSON
  const handleExport = () => {
    if (!orders || orders.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `orders.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <AdminLayout title="Orders">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{orders.length} orders</p>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>filter_list</span>
            Filter
          </button>
          <button onClick={handleExport} className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm">
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
                  Products
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
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-gray-400">No orders found.</td></tr>
              ) : orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-blue-50 cursor-pointer group"
                  onClick={() => window.location.href = `/admin/orders/${order.id}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') window.location.href = `/admin/orders/${order.id}`; }}
                  aria-label={`View order MP-${order.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    MP-{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customer?.full_name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{order.customer?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created_at ? formatRelativeDate(order.created_at) : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {order.status || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {order.items && order.items.slice(0,2).map((item, idx) => (
                        <span key={idx} className="inline-block bg-gray-100 border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 truncate max-w-[80px]">{item.title}</span>
                      ))}
                      {order.items && order.items.length > 2 && (
                        <span className="inline-block bg-gray-200 rounded px-2 py-1 text-xs text-gray-600">+{order.items.length - 2} more</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{order.items?.length || 0} item{order.items?.length === 1 ? '' : 's'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${order.total_amount?.toFixed(2) || '0.00'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 group-hover:underline"
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
