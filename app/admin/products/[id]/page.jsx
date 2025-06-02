'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'

export default function EditProduct({ params }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const unwrappedParams = React.use(params)
  const productId = unwrappedParams.id

  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(true)

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
        setFormData({
          title: data.title,
          price: data.price.toString(),
          description: data.description || '',
          image: data.image_url || ''
        })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

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
      // If no new file is selected, keep the existing image URL
      setFormData(prev => ({
        ...prev,
        image: product?.image_url || ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading('Updating product...')

    try {
      let imageUrl = formData.image

      // Only upload new image if it's a base64 string (newly selected image)
      if (formData.image && formData.image.startsWith('data:image')) {
        const base64Data = formData.image.split(',')[1]
        const buffer = Buffer.from(base64Data, 'base64')
        const fileName = `product-${Date.now()}.${formData.image.split(';')[0].split('/')[1]}`

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('product-images')
          .upload(`products/${fileName}`, buffer, {
            contentType: formData.image.split(';')[0].split(':')[1],
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw new Error('Error uploading image: ' + uploadError.message)
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('product-images')
          .getPublicUrl(`products/${fileName}`)

        imageUrl = publicUrl
      }

      // Update product data
      const { error: updateError } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)

      if (updateError) {
        throw new Error('Error updating product: ' + updateError.message)
      }

      toast.success('Product updated successfully!', { id: toastId })

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

  if (isLoading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Loading product...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!product && !isLoading) {
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
    <AdminLayout title="Edit Product">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Editing product #{productId}</p>
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
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
