'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (file) => {
    // In a real app with Supabase, this would handle uploading
    // For now, we'll just update the local state
    if (file) {
      // Mock success - in real app, we'd get back a URL from Supabase
      setFormData(prev => ({
        ...prev,
        image: '/bucket1.png' // Placeholder path for demo
      }))
    } else {
      // Reset image if deleted
      setFormData(prev => ({
        ...prev,
        image: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, this would send data to an API
    setTimeout(() => {
      setIsLoading(false)
      setMessage({
        type: 'success',
        text: 'Product added successfully! (Note: This is just a simulation, no actual data is being saved in this demo)'
      })

      // Clear form after success
      if (message.type === 'success') {
        setFormData({
          title: '',
          price: '',
          description: '',
          image: ''
        })
      }
    }, 1000)
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

      {message.text && (
        <div className={`mb-6 p-4 border ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                  required
                  placeholder="e.g. 30"
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
