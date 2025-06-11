'use client'

import React from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const router = useRouter()

  const handleQuantityChange = (product, delta) => {
    if (product.quantity + delta <= 0) return
    addToCart(product, delta)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutCart', JSON.stringify(cart))
    }
    router.push('/checkout')
  }

  return (
    <div className="pt-[80px] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-1">
        <h1 className="text-3xl font-antonio mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">Your cart is empty.</p>
            <Link href="/products" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">Shop Products</Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.title} className="w-16 h-16 object-contain rounded" />
                        )}
                        <span>{item.title}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => handleQuantityChange(item, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => handleQuantityChange(item, 1)}>+</button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-red-500 hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors" onClick={clearCart}>Clear Cart</button>
              <div className="text-xl font-medium">Total: <span className="font-bold">${total.toFixed(2)}</span></div>
            </div>
            <button
              className="w-full md:w-auto bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors text-lg font-medium"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
