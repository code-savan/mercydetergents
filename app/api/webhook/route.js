import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Stripe secret key and webhook secret from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// Use Supabase service role key for server-side access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
)

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

      // 2. Insert order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer.id,
          product_id: metadata.product_id,
          quantity: parseInt(metadata.quantity, 10),
          total_amount: parseFloat(metadata.total_price),
          status: 'paid',
          stripe_session_id: session.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (orderError) {
        console.error('Order insert error:', orderError)
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
