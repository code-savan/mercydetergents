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

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutCart', JSON.stringify(cart))
    }
    router.push('/checkout')
  }

  return (
    <div className="pt-[80px] min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-1 max-w-3xl w-full">
        <h1 className="text-4xl font-antonio font-bold mb-10 text-center">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="material-icons-outlined text-6xl text-gray-300 mb-6">shopping_cart</span>
            <p className="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
            <Link href="/products" className="inline-block border border-black text-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-colors font-semibold text-base mt-2">Shop Products</Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-32">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-6 bg-white  shadow-sm p-4 md:p-6 border border-gray-100">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 object-contain rounded-xl" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate">{item.title}</div>
                    <div className="text-gray-500 text-sm mt-1">Price: <span className="font-medium text-black">${Number(item.price).toFixed(2)}</span></div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-lg text-gray-700"
                        onClick={() => handleQuantityChange(item, -1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-2 text-base font-medium">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-lg text-gray-700"
                        onClick={() => handleQuantityChange(item, 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[80px]">
                    <div className="font-semibold text-base">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
                    <button
                      className="text-red-500 hover:underline text-xs mt-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Cart Summary and Actions fixed to bottom on desktop */}
            <div className="fixed bottom-0 left-0 w-full flex justify-center z-40 pointer-events-none">
              <div className="max-w-3xl w-full px-4 pb-6 pointer-events-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto">
                    <span className="text-lg font-medium">Subtotal</span>
                    <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2 w-full  mt-4 md:mt-0">
                    <button
                      className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-100 transition-colors text-base font-medium"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                    <button
                      className="flex-1 bg-black text-white py-2 rounded-lg text-center hover:bg-gray-800 transition-colors font-semibold text-base"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
