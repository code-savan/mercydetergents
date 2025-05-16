'use client'

import React from 'react'

const AboutHero = () => {
  return (
    <div
      className="relative w-full h-[650px] flex flex-col items-center justify-center text-center"
      style={{
        backgroundImage: "url('/abouthero.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h1 className="font-antonio text-6xl md:text-7xl lg:text-[128px] leading-none mb-8">
          How It All<br />
          Began.
        </h1>
        <p className="text-gray-600 text-xl md:text-[20px] max-w-2xl">
          Powerful, mess-free detergent designed<br className="hidden md:block" />
          for everyday use.
        </p>
      </div>
    </div>
  )
}

export default AboutHero
