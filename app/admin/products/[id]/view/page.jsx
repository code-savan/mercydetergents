'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminLayout from '../../../components/AdminLayout'

export default function ViewProduct({ params }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const unwrappedParams = React.use(params)
  const productId = unwrappedParams.id

  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setProduct(data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting product...')
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) {
        throw error
      }

      toast.success('Product deleted successfully', { id: toastId })
      // Redirect to products page after successful deletion
      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product', { id: toastId })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="View Product">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Loading product...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !product) {
    return (
      <AdminLayout title="Product Not Found">
        <div className="bg-white border border-gray-100 p-6">
          <p className="mb-4">The requested product could not be found.</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="View Product">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <h2 className="text-xl font-medium">Product Details</h2>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/products/${productId}`}
            className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors flex items-center text-sm"
          >
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>edit</span>
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors flex items-center text-sm"
          >
            <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>delete</span>
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="bg-white border border-gray-100 p-6">
          <div className="aspect-square relative bg-gray-50">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-icons-outlined text-6xl text-gray-400">image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-medium mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Product Name</p>
                <p className="font-medium">{product.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="font-medium">${product.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Product ID</p>
                <p className="font-medium">{product.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-medium mb-4">Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
          </div>

          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-medium mb-4">Timestamps</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Created At</p>
                <p className="font-medium">
                  {new Date(product.created_at).toLocaleString()}
                </p>
              </div>
              {product.updated_at && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(product.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
