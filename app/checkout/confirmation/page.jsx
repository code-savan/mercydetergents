'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSearchParams } from 'next/navigation'

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const supabase = createClientComponentClient()

  useEffect(() => {
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
        setError('Order not found.')
      } else {
        setOrder(data)
      }
      setLoading(false)
    }
    fetchOrder()
  }, [sessionId])

  return (
    <div className="pt-[80px]">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number:</p>
                    <p className="font-medium">MP-{order.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date:</p>
                    <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method:</p>
                    <p className="font-medium">Credit Card</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping Method:</p>
                    <p className="font-medium">Standard Shipping</p>
                  </div>
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
      </div>

      <Footer />
    </div>
  )
}
