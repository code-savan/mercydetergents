'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

      {/* Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 bg-opacity-20 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Mobile Menu / Sidebar */}
      <div
        className={`fixed top-0 bottom-0 right-0 bg-white transition-transform duration-300 w-full md:w-[450px] pt-[72px] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="absolute top-6 right-6 text-xl cursor-pointer">
          <button onClick={() => setIsMenuOpen(false)}>Close</button>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8 text-[64px] font-antonio">
            <Link
              href="/"
              className="hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className="hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/products"
              className="hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/contact-us"
              className="hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
