'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '../context/CartContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Check if a path is the current active route
  const isActive = (path) => {
    if (path === '/') {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-b-slate-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <Link href="/" className="relative h-[72px] w-fit md:ml-0 -ml-8">
            <Image
              src="/logo.png"
              alt="Mercy Peter Detergents"
              width={150}
              height={150}
              className="object-contain h-[68px]"
              priority
            />
          </Link>

          <div className="flex items-center gap-6">
            {/* Cart Icon */}
            <Link href="/cart" className="relative group">
              <span className="material-icons-outlined text-3xl text-black">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 group"
            >
              <span className="text-sm tracking-widest font-antonio font-bold">MENU</span>
              <div className="flex flex-col gap-[4px]">
                <span className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`} />
                <span className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 opacity-0' : 'w-6'}`} />
                <span className={`h-[2px] bg-black transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-6'}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 bg-opacity-20 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu / Sidebar */}
      <div
        className={`fixed top-0 bottom-0 right-0 bg-white transition-transform duration-300 w-full md:w-[550px] pt-[72px] flex flex-col justify-between ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-6 right-6 text-xl cursor-pointer">
          <button onClick={() => setIsMenuOpen(false)}>Close</button>
        </div>

        <div className="container mx-auto py-8">
          <div className="flex flex-col font-antonio">
            <Link
              href="/"
              className={`text-[64px] py-4 px-6 transition-all duration-300 w-full ${isActive('/') ? 'border-l-4 border-black' : 'hover:bg-black hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className={`text-[64px] py-4 px-6 transition-all duration-300 w-full ${isActive('/about-us') ? 'border-l-4 border-black' : 'hover:bg-black hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/products"
              className={`text-[64px] py-4 px-6 transition-all duration-300 w-full ${isActive('/products') ? 'border-l-4 border-black' : 'hover:bg-black hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/contact-us"
              className={`text-[64px] py-4 px-6 transition-all duration-300 w-full ${isActive('/contact-us') ? 'border-l-4 border-black' : 'hover:bg-black hover:text-white'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Tagline component */}
        <div className="bg-[#1E1E1E] p-8 w-full">
          <p className="text-[#B5B5B5] text-[20px] leading-tight">
            Powerful, mess-free detergent designed for everyday use.
          </p>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
