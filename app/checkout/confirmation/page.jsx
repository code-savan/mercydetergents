'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams } from 'next/navigation'

function ConfirmationContent() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retries, setRetries] = useState(0)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const supabase = createClientComponentClient()

  useEffect(() => {
    let timeoutId
    const fetchOrder = async () => {
      if (!sessionId) {
        setError('No session ID provided.')
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()
      if (error || !data) {
        if (retries < 7) {
          setRetries(r => r + 1)
          timeoutId = setTimeout(fetchOrder, 2000)
        } else {
          setError('Order is still processing. Please refresh this page in a moment.')
          setLoading(false)
        }
      } else {
        setOrder(data)
        setLoading(false)
      }
    }
    fetchOrder()
    return () => clearTimeout(timeoutId)
  }, [sessionId, retries])

  const total = order?.total_amount || 0

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
              {order.items.map((item, idx) => (
                <div key={item.product_id || idx} className="flex items-center gap-4 border-b border-b-gray-300 pb-4">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 object-contain  rounded" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-gray-500 text-sm">Quantity: {item.quantity}</div>
                    <div className="text-gray-500 text-sm">Price: ${Number(item.price).toFixed(2)}</div>
                  </div>
                  <div className="font-medium">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>${Number(total).toFixed(2)}</span>
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
