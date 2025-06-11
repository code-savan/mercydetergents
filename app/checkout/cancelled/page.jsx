import React from 'react'
import Link from 'next/link'
import { XCircle } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const CancelledPage = () => {
  return (
    <div className="pt-[120px] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-xl w-full mx-auto text-center p-8 bg-[#FFF8F8] border border-red-200 rounded">
          <div className="flex justify-center mb-6">
            <XCircle size={64} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-antonio mb-4 text-red-700">Order Cancelled</h1>
          <p className="text-lg mb-8 text-gray-700">
            Your payment was not completed and your order has been cancelled.<br />
            If this was a mistake, you can try again or contact our support team for help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors"
            >
              Return to Products
            </Link>
            <Link
              href="/contact-us"
              className="bg-white text-black border border-black px-8 py-3 hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CancelledPage
