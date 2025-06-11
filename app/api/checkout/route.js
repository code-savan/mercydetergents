import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { line_items, customer_email, metadata } = await request.json()
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email,
      metadata, // Pass order/product info for later use in webhook
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancelled`,
    })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
