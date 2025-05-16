'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'

export default function ImageUpload({ initialImage, onChange }) {
  const [preview, setPreview] = useState(initialImage || '')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // In a real implementation, this would upload to Supabase Storage
    // For now, we'll just create a local preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      if (onChange) {
        onChange(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
        if (onChange) {
          onChange(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="space-y-4">
      <div
        className={`border border-dashed h-64 flex flex-col items-center justify-center transition duration-200 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Product preview"
              fill
              className="object-contain p-2"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setPreview('')
                if (onChange) {
                  onChange(null)
                }
              }}
            >
              <span className="material-icons-outlined" style={{ fontSize: '16px' }}>delete</span>
            </button>
          </div>
        ) : (
          <>
            <span className="material-icons-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
            <p className="text-sm text-gray-500">Drag & drop an image or click to select</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {!preview && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={triggerFileInput}
            className="text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Select Image
          </button>
        </div>
      )}
    </div>
  )
}
