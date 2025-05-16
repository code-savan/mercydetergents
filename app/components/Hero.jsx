'use client'

import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <div
      className="relative w-full h-[650px] bg-white flex items-center"
      style={{
        backgroundImage: "url('/hero.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* White card overlay */}
      <div className="container mx-auto px-4 ">
        <div className="bg-white rounded-[15px] border border-slate-500 py-12 px-8 w-fit">
          <h1 className="font-antonio text-5xl md:text-[128px] leading-none mb-4">
            Clean Made<br />
            Simple.
          </h1>
          <p className="text-gray-600 md:text-xl mb-8">
            Powerful, mess-free detergent designed<br />
            for everyday use.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Shop all products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
