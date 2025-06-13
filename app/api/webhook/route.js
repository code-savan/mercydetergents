export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Stripe secret key and webhook secret from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Use Supabase service role key for server-side access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
  const sig = req.headers.get('stripe-signature')
  const buf = await req.arrayBuffer()
  const body = Buffer.from(buf)

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const metadata = session.metadata || {}
      console.log('Webhook: session:', session)
      console.log('Webhook: metadata:', metadata)

      // 1. Upsert customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .upsert({
          email: session.customer_email,
          full_name: metadata.fullName,
          phone: metadata.phone,
          address: metadata.address,
          city: metadata.city,
          state: metadata.state,
          zip: metadata.zipCode,
          updated_at: new Date().toISOString(),
        }, { onConflict: ['email'] })
        .select()
        .single()

      if (customerError) {
        console.error('Customer upsert error:', customerError)
        break
      }

      // 2. Fetch cart from pending_carts using cart_id
      let cart = []
      if (!metadata.cart_id) {
        console.error('No cart_id in metadata')
        break
      }
      const { data: pendingCart, error: pendingCartError } = await supabase
        .from('pending_carts')
        .select('items')
        .eq('id', metadata.cart_id)
        .single()
      if (pendingCartError || !pendingCart) {
        console.error('Failed to fetch pending cart:', pendingCartError)
        break
      }
      cart = pendingCart.items
      // Optionally, delete the pending cart after use
      await supabase.from('pending_carts').delete().eq('id', metadata.cart_id)
      const total_amount = parseFloat(metadata.total_amount)
      const orderPayload = {
        customer_id: customer.id,
        items: cart,
        total_amount,
        status: 'paid',
        stripe_session_id: session.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      console.log('Order insert payload:', orderPayload)
      const { error: orderError, data: orderData } = await supabase.from('orders').insert(orderPayload)
      if (orderError) {
        console.error('Order insert error:', orderError.message, orderError)
      } else {
        console.log('Order insert success:', orderData)
        // Send emails to store owner and customer
        try {
          const orderSummary = cart.map(item => `${item.title} x${item.quantity || 1} - $${item.price?.toFixed(2) || '0.00'}`).join('\n')
          const emailBody = `Thank you for your order!\n\nOrder Details:\n${orderSummary}\n\nTotal: $${total_amount.toFixed(2)}\n\nShipping to: ${customer.full_name}, ${customer.address}, ${customer.city}, ${customer.state}, ${customer.zip}`
          // Email to customer
          await resend.emails.send({
            from: 'Mercy Peter Detergents <onboarding@resend.dev>',
            to: [session.customer_email],
            subject: 'Your Order Confirmation',
            text: emailBody
          })
          // Email to store owner
          await resend.emails.send({
            from: 'Mercy Peter Detergents <onboarding@resend.dev>',
            to: ['codesavan@proton.me'],
            subject: 'New Order Received',
            text: `A new order has been placed.\n\nCustomer: ${customer.full_name} (${customer.email})\nOrder Details:\n${orderSummary}\nTotal: $${total_amount.toFixed(2)}`
          })
        } catch (emailErr) {
          console.error('Error sending order emails:', emailErr)
        }
      }
      break
    }
    // Add more event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
