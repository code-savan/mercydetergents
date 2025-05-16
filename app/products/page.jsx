import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

export const metadata = {
  title: 'Products | Mercy Peter Detergents',
  description: 'Explore our full line of powerful, mess-free detergents designed for everyday use.',
}

// Product Card Component
const ProductCard = ({ id, image, title, price }) => {
  return (
    <Link href={`/products/${id}`} className="w-full block group transition-transform hover:-translate-y-1">
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

export default function ProductsPage() {
  // Product data
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

  return (
    <div className="pt-[80px]">
      <Navbar />

      {/* Hero Section */}
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
      </div>

      <Newsletter bgColor="#CBFECE" />
      <Footer />
    </div>
  )
}
