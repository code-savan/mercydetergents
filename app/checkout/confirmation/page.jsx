'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams } from 'next/navigation'

function ConfirmationContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!sessionId) {
        setError('No session ID provided.')
        setLoading(false)
        return
      }
      console.log('Confirmation: sessionId param:', sessionId)
      const { data, error } = await supabase
        .from('orders')
        .select('*, product:product_id (title, price, image_url)')
        .eq('stripe_session_id', sessionId)
      console.log('Confirmation: fetchOrders result:', { data, error })
      if (error || !data || data.length === 0) {
        setError('Order not found.')
      } else {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [sessionId])

  const total = orders.reduce((sum, o) => sum + (o.product?.price || 0) * o.quantity, 0)

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      <h1 className="text-4xl font-antonio mb-4">Thank You for Your Order!</h1>
      {loading ? (
        <p className="text-lg mb-8">Loading your order details...</p>
      ) : error ? (
        <p className="text-lg text-red-500 mb-8">{error}</p>
      ) : (
        <>
          <p className="text-lg mb-8">
            Your order has been received and is being processed. You will receive a confirmation email shortly.
          </p>
          <div className="bg-[#F9F9F9] p-6 border border-gray-200 mb-8 text-left">
            <h2 className="text-xl font-medium mb-4">Order Details</h2>
            <div className="space-y-4 mb-4">
              {orders.map(order => (
                <div key={order.id} className="flex items-center gap-4 border-b pb-4">
                  {order.product?.image_url && (
                    <img src={order.product.image_url} alt={order.product.title} className="w-16 h-16 object-contain border rounded" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{order.product?.title}</div>
                    <div className="text-gray-500 text-sm">Quantity: {order.quantity}</div>
                    <div className="text-gray-500 text-sm">Price: ${order.product?.price?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="font-medium">${((order.product?.price || 0) * order.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-8">
            A receipt with order details has been sent to your email. If you have any questions about your order, please contact our customer service team.
          </p>
        </>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
        <Link
          href="/contact-us"
          className="bg-white text-black border border-black px-8 py-3 hover:bg-gray-100 transition-colors"
        >
          Contact Support
        </Link>
      </div>
      <div className="mt-12 p-6 bg-[#FFF8E1] border-l-4 border-yellow-400">
        <h3 className="font-medium mb-2">Shipping Information</h3>
        <p className="text-gray-700">
          Your order will be processed and shipped within 1-2 business days. You can expect delivery within 5-12 business days after shipping.
        </p>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <div className="pt-[80px]">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <Suspense fallback={<div className="max-w-2xl mx-auto text-center"><p className="text-lg mb-8">Loading your order details...</p></div>}>
          <ConfirmationContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
