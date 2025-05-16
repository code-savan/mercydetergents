import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Newsletter from '../../components/Newsletter'
import { products, floorCleaners, pods } from '../../data/products'

export async function generateMetadata({ params }) {
  // For metadata generation, params is already resolved by Next.js
  const product = products.find(p => p.id === params.id)

  return {
    title: `${product?.title || 'Product'} | Mercy Peter Detergents`,
    description: product?.description || 'Explore our powerful, mess-free detergents designed for everyday use.'
  }
}

export default function ProductPage({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params)
  const productId = unwrappedParams.id

  const product = products.find(p => p.id === productId)

  // Fallback in case product is not found
  if (!product) {
    return (
      <div className="pt-[80px]">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold">Product not found</h1>
          <Link href="/products" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="pt-[80px]">
      <Navbar />

      {/* Product Detail Section */}
      <div className="flex flex-col lg:flex-row md:h-[650px]">
        {/* Left Side - Product Image with back button */}
        <div className="relative w-full lg:w-[57%] bg-white ">
          {/* Back button */}
          <Link
            href="/products"
            className="absolute md:top-8 top-4 md:left-8 left-4 z-10 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="flex items-center justify-center h-[350px] md:h-full bg-[#F4F4F4]">
            <Image
              src={product.image}
              alt={product.title}
              width={270}
              height={270}
              className="object-contain md:w-[270px] w-[200px]"
              priority
            />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="w-full lg:w-[43%] p-8 lg:py-12 lg:px-16 flex flex-col">
          <h1 className="font-antonio text-5xl lg:text-6xl leading-none">
            {product.title}
          </h1>

        <hr className='my-4 border-gray-200' />

          <p className="text-gray-700 text-sm lg:text-base">
            {product.description}
          </p>

        <hr className='my-6 border-gray-200' />

          <div className="">
            <div className="flex items-center justify-between mb-6">
              <div className="font-medium text-3xl">${product.price}</div>

              <div className="flex items-center">
                <button className="w-10 h-10 flex cursor-pointer items-center justify-center text-xl border border-gray-300 rounded-full">
                  +
                </button>
                <div className="w-10 h-10 flex items-center justify-center">
                  1
                </div>
                <button className="w-10 h-10 flex cursor-pointer items-center justify-center text-xl border border-gray-300 rounded-full">
                  -
                </button>
              </div>
            </div>

            <button className="w-full bg-black cursor-pointer text-white py-4 rounded-full hover:bg-gray-800 transition-colors">
              Buy products
            </button>

            <p className="text-gray-600 text-sm mt-4 md:text-left text-center">
              Note: Once purchase is made, delivery will be between 5 - 12 business days
            </p>
          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-antonio mb-8">Similar Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Product - Pods */}
          <div className="">
            <div className="bg-[#F4F4F4] border border-gray-200 h-[450px] flex items-center justify-center mb-4">
              <Image
                src="/bucket4.png"
                alt="Pods"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-medium">Pods</h3>
            <p className="text-lg font-medium">$50</p>
          </div>

          {/* Second Product - Floor Cleaner */}
          <div className="">
            <div className="bg-[#F4F4F4] border border-gray-200 h-[450px] flex items-center justify-center mb-4">
              <Image
                src="/bucket1.png"
                alt="Floor Cleaner"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-medium">Floor Cleaner</h3>
            <p className="text-lg font-medium">$50</p>
          </div>

          {/* Third Product - Floor Cleaner */}
          <div className="">
            <div className="bg-[#F4F4F4] border border-gray-200 h-[450px] flex items-center justify-center mb-4">
              <Image
                src="/bucket2.png"
                alt="Floor Cleaner"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-medium">Floor Cleaner</h3>
            <p className="text-lg font-medium">$50</p>
          </div>
        </div>
      </div>

      <Newsletter bgColor="#FFDBC0" />
      <Footer />
    </div>
  )
}
