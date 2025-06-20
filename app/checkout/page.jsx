'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { supabase } from '../../lib/supabase/config'

export default function CheckoutPage() {
  const router = useRouter()
  const [checkoutCart, setCheckoutCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const { clearCart } = useCart()
  const [shippingFee, setShippingFee] = useState(0)
  const [shippingLoading, setShippingLoading] = useState(true)

  useEffect(() => {
    // Retrieve cart from sessionStorage
    const storedCart = typeof window !== 'undefined' ? sessionStorage.getItem('checkoutCart') : null
    if (storedCart) {
      try {
        setCheckoutCart(JSON.parse(storedCart))
      } catch (error) {
        console.error('Failed to parse checkout cart:', error)
      }
    } else {
      // Fallback: get from CartContext if available
      if (typeof window !== 'undefined' && window.getCheckoutCart) {
        setCheckoutCart(window.getCheckoutCart())
      }
    }
    setIsLoading(false)
    fetchShippingFee()
  }, [])

  const fetchShippingFee = async () => {
    setShippingLoading(true)
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'shipping_fee')
        .single()
      if (error) throw error
      setShippingFee(Number(data?.value) || 0)
    } catch (err) {
      setShippingFee(0)
    } finally {
      setShippingLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const subtotal = checkoutCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = checkoutCart.length > 0 ? shippingFee : 0
  const total = subtotal + shipping

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validateForm()) return
    setSubmitting(true)
    try {
      // 1. Save cart to pending_carts table and get cart_id
      const pendingCartRes = await fetch('/api/pending-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutCart })
      })
      const pendingCartData = await pendingCartRes.json()
      if (!pendingCartRes.ok) throw new Error(pendingCartData.error || 'Failed to save cart')
      const cart_id = pendingCartData.id

      // 2. Prepare Stripe line_items for all cart items
      const line_items = checkoutCart.map(item => {
        const imageUrl = item.image_url && item.image_url.startsWith('http')
          ? item.image_url
          : `${process.env.NEXT_PUBLIC_BASE_URL}${item.image_url}`
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
              images: [imageUrl],
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: item.quantity,
        }
      })
      // Add shipping fee as a separate line item
      if (shipping > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping Fee',
            },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        })
      }
      // 3. Prepare minimal metadata for webhook
      const metadata = {
        cart_id,
        total_amount: total,
        ...formData
      }
      // 4. Call backend to create Stripe Checkout session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          line_items,
          customer_email: formData.email,
          metadata
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create payment session')
      // Clear cart after successful checkout
      clearCart()
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkoutCart')
      }
      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setSubmitError(err.message)
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="pt-[80px] min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">Loading checkout information...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!checkoutCart || checkoutCart.length === 0) {
    return (
      <div className="pt-[80px] min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">No items in cart</h1>
          <p className="mb-6">Your cart is empty. Please add some products before checkout.</p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 inline-block hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pt-[80px]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-antonio">Checkout</h1>
          <Link
            href="/cart"
            className="text-sm text-gray-600 hover:text-black transition-colors"
          >
            ← Back to cart
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-[#F9F9F9] p-6 border border-gray-200">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              {checkoutCart.map(item => (
                <div key={item.id} className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="bg-[#F4F4F4] p-2 border border-gray-200 w-20 h-20 flex items-center justify-center">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    <p className="font-medium">${item.price} each</p>
                  </div>
                </div>
              ))}
              <div className="space-y-2 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.state ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} p-2 focus:outline-none focus:border-black`}
                        disabled={submitting}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                        disabled={submitting}
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Kenya">Kenya</option>
                        <option value="South Africa">South Africa</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Section - In a real app, this would include payment options */}
                <div>
                  <h2 className="text-xl font-medium mb-4">Payment</h2>
                  <p className="text-gray-600 mb-4">
                    Click the button below to proceed to our secure payment platform.
                  </p>
                  <button
                    type="submit"
                    className="bg-black text-white py-3 px-6 w-full focus:outline-none hover:bg-gray-800 transition-colors"
                    disabled={submitting || shippingLoading}
                  >
                    {shippingLoading
                      ? 'Loading...'
                      : submitting
                        ? 'Redirecting to Payment...'
                        : `Proceed to Payment - $${total.toFixed(2)}`}
                  </button>
                  {submitError && <p className="text-red-500 text-sm mt-2">{submitError}</p>}
                  <p className="text-sm text-gray-600 mt-4">
                    Your payment will be processed securely. We do not store any payment information.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
