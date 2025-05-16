'use client'

import React from 'react'
import Image from 'next/image'

const AboutBrand = () => {
  const buckets = [
    { id: 1, image: '/bucket1.png' },
    { id: 2, image: '/bucket2.png' },
    { id: 3, image: '/bucket3.png' },
    { id: 4, image: '/bucket4.png' },
    { id: 5, image: '/bucket5.png' },
    { id: 6, image: '/bucket6.png' },
    { id: 7, image: '/bucket7.png' },
    { id: 8, image: '/bucket8.png' },
    { id: 9, image: '/bucket9.png' },
    { id: 10, image: '/bucket10.png' },
    { id: 11, image: '/bucket11.png' },
    { id: 12, image: '/bucket12.png' },
  ]

  return (
    <div className="w-full relative">
      {/* Main Content */}
      <div className="bg-[#FEE8CD] py-24 md:h-[500px] relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 md:gap-20">
            {/* Left side - Title */}
            <div className="md:w-2/5">
              <h2 className="font-antonio text-[48px] md:text-[70px] lg:text-[96px] leading-none mb-8 md:mb-12">
                About the<br />
                brand.
              </h2>
            </div>

            {/* Right side - About text */}
            <div className="md:w-3/5">
              <div className="flex flex-col gap-6">
                <p className="text-base md:text-lg">
                  I started this brand because I wanted a detergent that actually worked
                  without all the extra nonsense. Something simple, effective, and
                  reliable. Over time, I realized that many people were frustrated by either
                  harsh formulas, weak results, or products that just didn't live up to the
                  hype. So I decided to create my own solution.
                </p>
                <p className="text-base md:text-lg">
                  At its core, this brand is about getting back to the basics: clean clothes,
                  clean formula, and no fuss. I've worked hard to make sure every
                  product we offer is powerful enough to handle the toughest stains, yet
                  balanced enough to be used every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/* Bottom Buckets - Visible at the bottom half */}
      <div className="w-full h-[115px] absolute overflow-hidden -bottom-[90px] md:-bottom-[40px]">
        <div className="flex">
          {buckets.map((bucket) => (
            <div key={bucket.id} className="relative h-[230px] w-[190px]">
              <Image
                src={bucket.image}
                alt="Product bucket"
                width={200}
                height={230}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
      </div>

    </div>
  )
}

export default AboutBrand
