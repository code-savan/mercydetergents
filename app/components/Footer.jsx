import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left side - Logo */}
        <div className="w-full md:w-auto">
          <Image
            src="/biglogo.png"
            alt="Mercy Peter Laundry Detergents"
            width={630}
            height={457}
            className="w-full md:w-[500px] h-auto"
            priority
          />
        </div>

        {/* Right side - Navigation and Newsletter */}
        <div className="w-full md:w-auto flex flex-col items-start gap-6">
          {/* Navigation */}
          <nav className="flex gap-6">
            <Link href="/" className="underline hover:no-underline">Home</Link>
            <Link href="/about-us" className="underline hover:no-underline">About Us</Link>
            <Link href="/products" className="underline hover:no-underline">Products</Link>
            <Link href="/contact-us" className="underline hover:no-underline">Contact Us</Link>
          </nav>

          {/* Social and Contact */}
          <div className="flex flex-col items-start gap-2 w-full">
            <div className="flex items-center gap-2 w-fit">
              <Instagram className="opacity-60 text-[#BF9E4F]" size={24} />
              <span>mercypeterlaundrydetergent</span>
            </div>
            <div className="flex items-center gap-2 w-fit">
              <Mail className="opacity-60 text-[#BF9E4F]" size={24} />
              <span>mercy@mercypeterdetergent.com</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-start gap-4">
            <h3 className="font-antonio text-[40px] leading-none">Subscribe to our newsletter.</h3>
            <div className="w-full max-w-md flex flex-col gap-2">
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              <button className="w-full bg-black text-white cursor-pointer py-3 rounded-full hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
