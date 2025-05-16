'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const ProductCard = ({ id, image, title, price }) => {
  return (
    <Link href={`/products/${id}`} className="min-w-[280px] flex-shrink-0 mr-4 block group transition-transform hover:-translate-y-1">
      <div className="bg-[#F4F4F4] border-[#9B9B9B] border p-4 mb-6 h-[450px] flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          width={240}
          height={240}
          className="object-contain transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-lg text-gray-500">${price}</p>
    </Link>
  )
}

const ProductSlider = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [progress, setProgress] = useState(0)
  const sliderRef = useRef(null)

  const products = [
    { id: '1', image: '/bucket1.png', title: 'Lavender Floor cleaner', price: '30' },
    { id: '2', image: '/bucket2.png', title: 'Lime Floor cleaner', price: '30' },
    { id: '3', image: '/bucket3.png', title: 'Laundry Detergent', price: '30' },
    { id: '4', image: '/bucket4.png', title: 'Pods', price: '30' },
    { id: '5', image: '/bucket5.png', title: 'Fabric Softener', price: '30' },
    { id: '6', image: '/bucket6.png', title: 'Multi-Surface Cleaner', price: '30' },
    { id: '7', image: '/bucket7.png', title: 'Dish Soap', price: '30' },
    { id: '8', image: '/bucket8.png', title: 'Stain Remover', price: '30' },
    { id: '9', image: '/bucket9.png', title: 'Bathroom Cleaner', price: '30' },
    { id: '10', image: '/bucket10.png', title: 'Glass Cleaner', price: '30' },
    { id: '11', image: '/bucket11.png', title: 'Carpet Cleaner', price: '30' },
    { id: '12', image: '/bucket12.png', title: 'Disinfectant Spray', price: '30' },
  ]

  const updateScrollState = () => {
    if (!sliderRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current

    // Update navigation buttons states
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5) // 5px buffer to account for rounding

    // Update progress bar
    const maxScroll = scrollWidth - clientWidth
    const currentProgress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
    setProgress(currentProgress)
  }

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return

    const { clientWidth } = sliderRef.current
    const scrollAmount = clientWidth * 0.8 // Scroll 80% of the visible width

    sliderRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    // Update initial state
    updateScrollState()

    // Add scroll event listener
    const handleScroll = () => {
      updateScrollState()
    }

    slider.addEventListener('scroll', handleScroll, { passive: true })

    // Handle resize
    const handleResize = () => {
      updateScrollState()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      slider.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-20 items-end mb-20">
          {/* Left side - Title */}
          <div className="w-full md:w-1/2">
            <h2 className="font-antonio text-[48px] md:text-[64px] leading-none">
              Our <br className='hidden md:block' />
              Products
            </h2>
          </div>

          {/* Right side - Benefits */}
          <div className="md:w-1/2">
            <p className="md:text-lg text-gray-600">
              Key product benefits: Fast stain removal, No harsh
              chemicals, Fresh scent option, Work in all machines.
            </p>
          </div>
        </div>
      </div>

      {/* Products Slider - Full width container */}
      <div className="relative mb-12">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto pb-6 hide-scrollbar pl-4 md:px-[100px]"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
        >
          <div className="flex">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                title={product.title}
                price={product.price}
              />
            ))}
          </div>
        </div>

        {/* Controls - Back in container */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            {/* Progress Bar */}
            <div className="w-full h-[2px] bg-gray-200 mt-6 mb-8">
              <div
                className="h-full bg-black transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 flex-shrink-0">
              <button
                onClick={() => scrollSlider('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous products"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Next products"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSlider
