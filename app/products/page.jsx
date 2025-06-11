'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import { useCart } from '../context/CartContext'

// Product Skeleton Component
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 border-[#9B9B9B] border p-4 mb-6 h-[450px]" />
    <div className="h-5 bg-gray-200 rounded w-2/3 mb-1" />
    <div className="h-5 bg-gray-200 rounded w-1/4" />
  </div>
)

export default function Products() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pt-[80px]">
      <Navbar />

      {/* Hero Section - Always visible */}
      <div
        className="relative w-full h-[500px] flex items-center"
        style={{
          backgroundImage: "url('/explorehero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="font-antonio text-7xl md:text-[96px] text-white leading-none">
            Explore our<br />
            products
          </h1>
        </div>
      </div>

      {/* Products Grid */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className='mb-16 flex justify-between items-center'>
            <p className='text-[22px] md:text-[32px] font-antonio font-bold'>Our Products</p>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-full px-4 md:px-6 py-3 pr-8 md:pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200 md:text-[16px] text-[13px]">
                <option value="all">Shop all products</option>
                <option value="cleaning">Cleaning products</option>
                <option value="laundry">Laundry products</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Show skeletons while loading
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="w-full block">
                  <ProductSkeleton />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products available.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="w-full block group transition-transform hover:-translate-y-1">
                  <Link
                    href={`/products/${product.id}`}
                    className="w-full block"
                  >
                    <div className="bg-[#F4F4F4] border-[#9B9B9B] border p-4 mb-6 h-[450px] flex items-center justify-center">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          width={240}
                          height={240}
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <span className="material-icons-outlined text-6xl text-gray-400">
                          image
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium mb-1">{product.title}</h3>
                    <p className="text-lg text-gray-500">${product.price.toFixed(2)}</p>
                  </Link>
                  <button
                    className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product, 1);
                      toast.success('Added to cart!')
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Newsletter bgColor="#CBFECE" />
      <Footer />
    </div>
  )
}
