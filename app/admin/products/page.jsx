'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdminLayout from '../components/AdminLayout'

export default function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [shippingFee, setShippingFee] = useState(null)
  const [isEditingShipping, setIsEditingShipping] = useState(false)
  const [shippingInput, setShippingInput] = useState('')
  const [isSavingShipping, setIsSavingShipping] = useState(false)
  const supabase = createClientComponentClient()
  const shippingInputRef = useRef(null)

  useEffect(() => {
    fetchProducts()
    fetchShippingFee()
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

      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
      toast.error('Failed to load products')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchShippingFee = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'shipping_fee')
        .single()
      if (error) throw error
      setShippingFee(data?.value)
    } catch (err) {
      setShippingFee(null)
    }
  }

  const handleEditShipping = () => {
    setShippingInput(shippingFee || '')
    setIsEditingShipping(true)
    setTimeout(() => {
      if (shippingInputRef.current) shippingInputRef.current.focus()
    }, 100)
  }

  const handleSaveShipping = async () => {
    setIsSavingShipping(true)
    try {
      const value = shippingInput.trim()
      if (!value || isNaN(Number(value))) {
        toast.error('Please enter a valid shipping fee')
        setIsSavingShipping(false)
        return
      }
      const { error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', 'shipping_fee')
      if (error) throw error
      setShippingFee(value)
      setIsEditingShipping(false)
      toast.success('Shipping fee updated')
    } catch (err) {
      toast.error('Failed to update shipping fee')
    } finally {
      setIsSavingShipping(false)
    }
  }

  const confirmDelete = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting product...')
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id)

      if (error) {
        throw error
      }

      // Close modal and refresh products list
      setShowDeleteModal(false)
      setProductToDelete(null)
      fetchProducts()
      toast.success('Product deleted successfully', { id: toastId })
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product', { id: toastId })
    }
  }

  if (error) {
    return (
      <AdminLayout title="Products">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="material-icons-outlined text-red-400">error</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Products">
      {/* Shipping Fee Section */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <span className="text-gray-700 font-medium">Shipping Fee:</span>
          {isEditingShipping ? (
            <input
              ref={shippingInputRef}
              type="number"
              min="0"
              className="mt-2 sm:mt-0 sm:ml-2 border border-gray-300 px-2 py-1 w-full sm:w-24 focus:outline-none focus:border-black"
              value={shippingInput}
              onChange={e => setShippingInput(e.target.value)}
              disabled={isSavingShipping}
            />
          ) : (
            <span className="mt-2 sm:mt-0 sm:ml-2 text-gray-900">${shippingFee ?? '...'}</span>
          )}
        </div>
        <div className="flex gap-2">
          {isEditingShipping ? (
            <>
              <button
                onClick={handleSaveShipping}
                className="bg-black text-white px-4 py-1 text-sm hover:bg-gray-800 disabled:opacity-50"
                disabled={isSavingShipping}
              >
                {isSavingShipping ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setIsEditingShipping(false)}
                className="text-gray-600 hover:text-gray-900 text-sm"
                disabled={isSavingShipping}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditShipping}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Product</h3>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this product?
            </p>
            <p className="text-gray-600 mb-6 font-medium">
              "{productToDelete.title}"
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setProductToDelete(null)
                }}
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

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{products.length} products</p>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors flex items-center text-sm"
        >
          <span className="material-icons-outlined mr-1" style={{ fontSize: '18px' }}>add</span>
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-500">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-icons-outlined text-4xl text-gray-400 mb-2">inventory_2</span>
            <p className="text-gray-500">No products found</p>
            <Link
              href="/admin/products/new"
              className="text-blue-600 hover:underline text-sm inline-block mt-2"
            >
              Add your first product
            </Link>
          </div>
        ) : (
          <table className="min-w-[700px] w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative bg-gray-50">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-icons-outlined text-gray-400">image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm min-w-[160px] flex flex-row gap-2 justify-end items-center">
                    <Link
                      href={`/admin/products/${product.id}/view`}
                      className="text-gray-600 hover:underline px-2 py-1"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:underline px-2 py-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(product)}
                      className="text-red-600 hover:underline px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
