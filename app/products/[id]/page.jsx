'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Newsletter from '../../components/Newsletter'
import { useCart } from '../../context/CartContext'

// Product Detail Skeleton Component
const ProductDetailSkeleton = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-32 bg-gray-200 rounded mb-8 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="bg-gray-200 border-[#9B9B9B] border p-8 h-[500px] animate-pulse" />

          {/* Content Skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>

            <div className="border-t border-b border-gray-200 py-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="w-10 h-10 bg-gray-200" />
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                </div>
              </div>

              <div className="h-12 bg-gray-200 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// Related Product Card Component
const RelatedProductCard = ({ product }) => (
  <Link
    href={`/products/${product.id}`}
    className="w-full block group transition-transform hover:-translate-y-1"
  >
    <div className="bg-[#F4F4F4] border-[#9B9B9B] border p-4 mb-4 h-[300px] flex items-center justify-center">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.title}
          width={160}
          height={160}
          className="object-contain transition-transform group-hover:scale-105"
        />
      ) : (
        <span className="material-icons-outlined text-4xl text-gray-400">
          image
        </span>
      )}
    </div>
    <h3 className="text-lg font-medium mb-1">{product.title}</h3>
    <p className="text-lg text-gray-500">${product.price.toFixed(2)}</p>
  </Link>
)

export default function ProductDetail({ params }) {
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const supabase = createClientComponentClient()
  const unwrappedParams = React.use(params)
  const productId = unwrappedParams.id
  const { cart, addToCart } = useCart()
  const isInCart = cart.some(item => item.id === product?.id)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      // Fetch the main product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError) throw productError

      if (productData) {
        setProduct(productData)

        // Fetch related products (excluding current product)
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .neq('id', productId)
          .limit(3)
          .order('created_at', { ascending: false })

        if (relatedError) throw relatedError

        setRelatedProducts(relatedData || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  const handleCheckout = () => {
    // Create checkout data with product and quantity
    const checkoutData = {
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image_url
      },
      quantity: quantity,
      totalPrice: (product.price * quantity).toFixed(2)
    }

    // Store checkout data in sessionStorage (not localStorage)
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData))

    // Navigate to checkout page
    router.push('/checkout')
  }

  return (
    <div className="pt-[80px]">
      <Navbar />

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : !product ? (
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Product not found.</p>
              <Link href="/products" className="text-blue-600 hover:underline">
                Back to products
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <Link
                  href="/products"
                  className="inline-flex items-center text-gray-600 hover:text-black mb-8"
                >
                  <span className="material-icons-outlined mr-1">arrow_back</span>
                  Back to products
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Product Image */}
                  <div className="bg-[#F4F4F4] border-[#9B9B9B] border p-8 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        width={400}
                        height={400}
                        className="object-contain"
                      />
                    ) : (
                      <span className="material-icons-outlined text-6xl text-gray-400">
                        image
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl font-antonio font-bold mb-4">{product.title}</h1>
                      <p className="text-2xl text-gray-600">${product.price.toFixed(2)}</p>
                    </div>

                    <div className="border-t border-b border-gray-200 py-8">
                      <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <div className="">
                      <div className="flex items-center justify-between mb-6">
                        <div className="font-medium text-3xl">${(product.price * quantity).toFixed(2)}</div>

                        <div className="flex items-center">
                          <button
                            onClick={increaseQuantity}
                            className="w-10 h-10 flex cursor-pointer items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            +
                          </button>
                          <div className="w-10 h-10 flex items-center justify-center">
                            {quantity}
                          </div>
                          <button
                            onClick={decreaseQuantity}
                            className="w-10 h-10 flex cursor-pointer items-center justify-center text-xl border border-gray-300 rounded-full hover:bg-gray-100"
                          >
                            -
                          </button>
                        </div>
                      </div>

                      {isInCart ? (
                        <>
                          <Link href="/cart" className="w-full block mb-2 bg-black text-white py-4 rounded-full text-center hover:bg-gray-800 transition-colors">
                            Go to Cart
                          </Link>
                          <Link href="/checkout" className="w-full block bg-green-600 text-white py-4 rounded-full text-center hover:bg-green-700 transition-colors">
                            Checkout
                          </Link>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            addToCart(product, quantity)
                            toast.success('Added to cart!')
                          }}
                          className="w-full bg-black cursor-pointer text-white py-4 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          Add to Cart
                        </button>
                      )}

                      <p className="text-gray-600 text-sm mt-4 md:text-left text-center">
                        Note: Once purchase is made, delivery will be between 5 - 12 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pb-20">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-2xl font-antonio font-bold mb-8">Related Products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedProducts.map(relatedProduct => (
                      <RelatedProductCard key={relatedProduct.id} product={relatedProduct} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <Newsletter bgColor="#CBFECE" />
      <Footer />
    </div>
  )
}
