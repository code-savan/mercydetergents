import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Newsletter from '../../components/Newsletter'

// Product data (in a real app, this would come from a database or API)
const products = [
  { id: '1', image: '/bucket1.png', title: 'Lavender Floor cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '2', image: '/bucket2.png', title: 'Lime Floor cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '3', image: '/bucket3.png', title: 'Laundry Detergent', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '4', image: '/bucket4.png', title: 'Pods', price: '50', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '5', image: '/bucket5.png', title: 'Fabric Softener', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '6', image: '/bucket6.png', title: 'Multi-Surface Cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '7', image: '/bucket7.png', title: 'Dish Soap', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '8', image: '/bucket8.png', title: 'Stain Remover', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '9', image: '/bucket9.png', title: 'Bathroom Cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '10', image: '/bucket10.png', title: 'Glass Cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '11', image: '/bucket11.png', title: 'Carpet Cleaner', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
  { id: '12', image: '/bucket12.png', title: 'Disinfectant Spray', price: '30', description: 'Lorem ipsum dituling fasm och titretuligt sasor och osade och jäktig. Vint viledes sylingar rengen porur niligen. Norsk karaoke jäjoliga planet da vägen i autor. Homösk suprapol kikang. Tävla ut operafaktisk.' },
]

// Floor Cleaner products for similar products section
const floorCleaners = [
  { id: '1', image: '/bucket1.png', title: 'Floor Cleaner', price: '50' },
  { id: '2', image: '/bucket2.png', title: 'Floor Cleaner', price: '50' },
]

// Pods product for similar products section
const pods = [
  { id: '4', image: '/bucket4.png', title: 'Pods', price: '50' },
]

export async function generateMetadata({ params }) {
  const product = products.find(p => p.id === params.id)

  return {
    title: `${product?.title || 'Product'} | Mercy Peter Detergents`,
    description: product?.description || 'Explore our powerful, mess-free detergents designed for everyday use.'
  }
}

export default function ProductPage({ params }) {
  const product = products.find(p => p.id === params.id)

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
