'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useCart } from '../context/CartContext'

const ProductCard = ({ id, image, title, price, product }) => {
  const { addToCart } = useCart()
  return (
    <div className="min-w-[280px] flex-shrink-0 mr-4 block group transition-transform hover:-translate-y-1 relative">
      <Link href={`/products/${id}`} className="block">
        <div className="bg-[#F4F4F4] border-[#9B9B9B] border p-4 mb-6 h-[450px] flex items-center justify-center relative">
          {image ? (
            <Image
              src={image}
              alt={title}
              width={240}
              height={240}
              className="object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <span className="material-icons-outlined text-6xl text-gray-400">image</span>
          )}
          {/* Floating Add to Cart Icon */}
          <button
            className="absolute bottom-4 right-4 bg-black text-white rounded-full w-11 h-11 flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 hover:bg-gray-900 transition-all group/addtocart"
            onClick={e => {
              e.preventDefault();
              addToCart(product, 1);
              if (typeof window !== 'undefined' && window.toast) window.toast.success('Added to cart!')
            }}
            aria-label="Add to cart"
            tabIndex={0}
          >
            <span className="material-icons-outlined text-2xl">add_shopping_cart</span>
            <span className="absolute bottom-12 right-0 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover/addtocart:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add to cart</span>
          </button>
        </div>
        <h3 className="text-lg font-medium mb-1">{title}</h3>
        <p className="text-lg text-gray-500">${price}</p>
      </Link>
    </div>
  )
}

const ProductSliderSkeleton = () => (
  <div className="min-w-[280px] flex-shrink-0 mr-4 block animate-pulse">
    <div className="bg-gray-200 border-[#9B9B9B] border p-4 mb-6 h-[450px] flex items-center justify-center" />
    <div className="h-5 bg-gray-200 rounded w-2/3 mb-1" />
    <div className="h-5 bg-gray-200 rounded w-1/4" />
  </div>
)

const ProductSlider = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [progress, setProgress] = useState(0)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const sliderRef = useRef(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

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
            {isLoading
              ? Array(6).fill(0).map((_, idx) => <ProductSliderSkeleton key={idx} />)
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.image_url}
                    title={product.title}
                    price={product.price?.toFixed ? product.price.toFixed(2) : product.price}
                    product={product}
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
