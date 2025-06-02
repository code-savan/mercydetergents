'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'

export default function AddProduct() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }))
      }
      reader.readAsDataURL(file)
    } else {
      setFormData(prev => ({
        ...prev,
        image: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading('Adding product...')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error creating product')
      }

      toast.success('Product added successfully!', { id: toastId })

      // Clear form after success
      setFormData({
        title: '',
        price: '',
        description: '',
        image: ''
      })

      // Redirect to products page after a short delay
      setTimeout(() => {
        router.push('/admin/products')
      }, 1000)

    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message, { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout title="Add New Product">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Create a new product for your store</p>
        </div>
        <Link
          href="/admin/products"
          className="text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-white border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <ImageUpload
              initialImage={formData.image}
              onChange={handleImageChange}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                required
                placeholder="e.g. Lavender Floor Cleaner"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                required
                placeholder="e.g. 30"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                required
                placeholder="Enter product description..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
