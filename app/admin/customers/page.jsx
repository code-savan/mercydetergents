'use client'

import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { formatRelativeDate } from '../../utils/formatDate'
import { toast } from 'sonner'

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailTo, setEmailTo] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCustomers = async () => {
      // Fetch all customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false })

      // Fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, customer_id, total_amount')

      // Aggregate orders for each customer
      const customersWithStats = (customersData || []).map(c => {
        const customerOrders = (ordersData || []).filter(o => o.customer_id === c.id)
        return {
          ...c,
          ordersCount: customerOrders.length,
          totalSpent: customerOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
        }
      })

      setCustomers(customersWithStats)
      setLoading(false)
    }
    fetchCustomers()
  }, [])

  // Export all customers as JSON
  const handleExport = () => {
    if (!customers || customers.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customers, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `customers.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const handleOpenEmail = (customer) => {
    setEmailTo(customer.email)
    setEmailSubject('')
    setEmailMessage('')
    setShowEmailModal(true)
  }

  const handleSendEmail = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/admin-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, message: emailMessage })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')
      toast.success('Email sent!')
      setShowEmailModal(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  // Filter customers by search
  const filteredCustomers = customers.filter(c => {
    const q = search.toLowerCase()
    return (
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout title="Customers">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
        <p className="text-sm text-gray-500">{filteredCustomers.length} customers</p>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white border border-gray-300 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-full"
            />
            <span className="material-icons-outlined absolute left-3 top-2 text-gray-400" style={{ fontSize: '18px' }}>search</span>
          </div>
          <button onClick={handleExport} className="bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors flex items-center text-sm w-full sm:w-auto justify-center">
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>file_download</span>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="min-w-[700px] w-full divide-y divide-gray-100">
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
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading customers...</td></tr>
            ) : filteredCustomers.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No customers found.</td></tr>
            ) : filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {customer.full_name?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.full_name}</div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.ordersCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.created_at ? formatRelativeDate(customer.created_at) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    View
                  </Link>
                  <button className="text-gray-600 hover:underline" onClick={() => handleOpenEmail(customer)}>
                    Email
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Email Customer</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="email" className="w-full border px-3 py-2 rounded" value={emailTo} disabled />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Subject</label>
              <input type="text" className="w-full border px-3 py-2 rounded" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Message</label>
              <textarea className="w-full border px-3 py-2 rounded min-h-[100px]" value={emailMessage} onChange={e => setEmailMessage(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEmailModal(false)} disabled={sending}>Cancel</button>
              <button className="px-4 py-2 bg-black text-white rounded" onClick={handleSendEmail} disabled={sending || !emailSubject || !emailMessage}>
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
