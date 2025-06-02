import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const formData = await request.json()

    // Upload image to Supabase Storage if provided
    let imageUrl = null
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

      // Get public URL for the uploaded image
      const { data: { publicUrl } } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(`products/${fileName}`)

      imageUrl = publicUrl
    }

    // Insert product data into the database
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert([{
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (insertError) {
      throw new Error('Error creating product: ' + insertError.message)
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product
    }, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({
      error: error.message
    }, { status: 500 })
  }
}
