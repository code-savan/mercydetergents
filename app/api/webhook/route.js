import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripe secret key and webhook secret from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

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
    case 'checkout.session.completed':
      // TODO: Update order in DB, mark as paid, fulfill, etc.
      console.log('Payment succeeded:', event.data.object)
      break
    // Add more event types as needed
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true })
}
