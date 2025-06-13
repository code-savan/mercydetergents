'use client'
import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import Link from 'next/link'

export default function FloatingCart() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)

  // Handler to decrease quantity
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      addToCart(item, -1)
    }
  }
  // Handler to increase quantity
  const handleIncrease = (item) => {
    addToCart(item, 1)
  }

  return (
    <>
      {/* Floating Cart Button (always bottom right) */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-black rounded-lg w-16 h-16 flex items-center justify-center shadow-lg hover:bg-gray-900 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open cart"
      >
        <span className="material-icons-outlined text-white text-3xl">shopping_cart</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Slide-in Cart Sheet (always from right) */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{ background: open ? 'rgba(0,0,0,0.3)' : 'transparent' }}
        onClick={() => setOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-300">
            <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-black">
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
          <div className="p-5 flex-1 overflow-y-auto min-h-[200px] pb-32">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-16">No items in cart.</div>
            ) : (
              <ul className="space-y-6">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 object-contain rounded-lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate text-base">{item.title}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-lg text-gray-700"
                          onClick={() => handleDecrease(item)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 text-base font-medium">{item.quantity}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-lg text-gray-700"
                          onClick={() => handleIncrease(item)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-gray-500 text-xs mt-1">Price: <span className="font-medium text-black">${Number(item.price).toFixed(2)}</span></div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="font-semibold text-sm">${(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
                      <button
                        className="text-red-500 hover:underline text-xs"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Cart Summary and Actions fixed to bottom */}
          <div className="fixed bottom-0 right-0 w-full max-w-md border-t border-gray-300 bg-white px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-medium">Subtotal</span>
              <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
            </div>
            {cart.length > 0 && (
              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 border border-black text-black py-2 rounded-lg text-center hover:bg-black hover:text-white transition-colors font-semibold text-base"
                  onClick={() => setOpen(false)}
                >
                  View Cart & Checkout
                </Link>
                <button
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-100 transition-colors text-base font-medium"
                  onClick={() => { clearCart(); setOpen(false) }}
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
