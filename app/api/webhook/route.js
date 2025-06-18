export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// IMPORTANT: Stripe webhooks require the raw request body for signature verification.
// Do NOT parse the body as JSON or text before passing to stripe.webhooks.constructEvent.

import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '../../utils/sendEmail'

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
  console.log('Raw body length:', body.length)
  console.log('Stripe signature:', sig)

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
        return NextResponse.json({ error: 'Customer upsert error', details: customerError }, { status: 500 })
      }

      // 2. Fetch cart from pending_carts using cart_id
      let cart = []
      if (!metadata.cart_id) {
        console.error('No cart_id in metadata')
        return NextResponse.json({ error: 'No cart_id in metadata' }, { status: 500 })
      }
      const { data: pendingCart, error: pendingCartError } = await supabase
        .from('pending_carts')
        .select('items')
        .eq('id', metadata.cart_id)
        .single()
      if (pendingCartError || !pendingCart) {
        console.error('Failed to fetch pending cart:', pendingCartError)
        return NextResponse.json({ error: 'Failed to fetch pending cart', details: pendingCartError }, { status: 500 })
      }
      cart = pendingCart.items
      // Optionally, delete the pending cart after use
      await supabase.from('pending_carts').delete().eq('id', metadata.cart_id)
      const total_amount = parseFloat(metadata.total_amount)
      // Define these variables once, for use in both emails
      const orderSummaryText = cart.map(item => `${item.title} x${item.quantity || 1} - $${item.price?.toFixed(2) || '0.00'}`).join('\n')
      const orderSummaryHtml = cart.map(item => `
        <tr>
          <td style="padding:8px 0; border-bottom:1px solid #eee;">
            <strong>${item.title}</strong><br/>
            <span style="color:#666; font-size:13px;">Quantity: ${item.quantity || 1}</span>
          </td>
          <td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">$${item.price?.toFixed(2) || '0.00'}</td>
        </tr>
      `).join('')
      const shippingInfo = `<div style="margin-top:24px; padding:16px; background:#f8fafc; border-radius:8px; border-left:4px solid #22c55e;">
        <h3 style="margin:0 0 8px 0; font-size:16px; color:#222;">Shipping Information</h3>
        <div style="color:#444; font-size:14px;">Your order will be processed and shipped within 1-2 business days. You can expect delivery within 5-12 business days after shipping.</div>
      </div>`
      const shippingFeeNote = `<div style="margin-top:16px;color:#b45309;font-size:14px;"><strong>Note:</strong> A $10 shipping fee has been added to your total.</div>`
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
        return NextResponse.json({ error: 'Order insert error', details: orderError }, { status: 500 })
      } else {
        console.log('Order insert success:', orderData)
        // Fetch the order from the orders table to ensure the ID is available
        const { data: insertedOrder, error: fetchOrderError } = await supabase
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        let orderId = insertedOrder?.id
        if (fetchOrderError || !orderId) {
          console.error('Order fetch error after insert:', fetchOrderError)
          orderId = null
        }
        const orderLink = orderId ? `http://localhost:3000/admin/orders/${orderId}` : 'Order ID not available'
        const ownerHtml = `
          <div style="max-width:480px;margin:0 auto;font-family:sans-serif;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;">
            <h1 style="font-size:22px;margin-bottom:8px;color:#0ea5e9;">New Order Received</h1>
            <p style="font-size:15px;margin-bottom:18px;">A new order has been placed.</p>
            <div style="background:#f9f9f9;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
              <h2 style="font-size:17px;margin:0 0 12px 0;">Order Details</h2>
              <table style="width:100%;border-collapse:collapse;">${orderSummaryHtml}</table>
              <div style="margin-top:16px;font-weight:600;font-size:16px;display:flex;justify-content:space-between;">
                <span>Total</span>
                <span>$${total_amount.toFixed(2)}</span>
              </div>
            </div>
            <div style="margin-bottom:18px;font-size:14px;color:#444;">Customer: <strong>${customer.full_name}</strong> (${customer.email})</div>
            <a href="${orderLink}" style="display:inline-block;padding:10px 20px;background:#22c55e;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">View Order</a>
            <div style="margin-top:18px;color:#b45309;font-size:14px;"><strong>Note:</strong> A $10 shipping fee has been added to the total.</div>
          </div>
        `
        const ownerEmailResult = await sendEmail({
          to: 'mercy@mercypetersdetergents.com',
          subject: 'New Order Received',
          text: `A new order has been placed.\n\nCustomer: ${customer.full_name} (${customer.email})\nOrder Details:\n${orderSummaryText}\nTotal: $${total_amount.toFixed(2)}\n\nView order: ${orderLink}\n\nNote: A $10 shipping fee has been added to the total.`,
          html: ownerHtml
        })
        if (ownerEmailResult.error) {
          console.error('Store owner email sending error:', ownerEmailResult.error)
        }
        // Resend the customer email with the order ID included
        if (orderId) {
          const customerHtmlWithId = `
            <div style="max-width:480px;margin:0 auto;font-family:sans-serif;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;">
              <h1 style="font-size:24px;margin-bottom:8px;color:#22c55e;">Thank You for Your Order!</h1>
              <p style="font-size:16px;margin-bottom:24px;">Hi ${customer.full_name || ''},<br>Your order has been received and is being processed. You will receive a confirmation email shortly.</p>
              <div style="background:#f9f9f9;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
                <h2 style="font-size:18px;margin:0 0 12px 0;">Order Details</h2>
                <table style="width:100%;border-collapse:collapse;">${orderSummaryHtml}</table>
                <div style="margin-top:16px;font-weight:600;font-size:16px;display:flex;justify-content:space-between;">
                  <span>Total</span>
                  <span>$${total_amount.toFixed(2)}</span>
                </div>
              </div>
              <div style="margin:16px 0 8px 0;font-size:15px;color:#0ea5e9;"><strong>Your Order ID:</strong> <span style="font-family:monospace;">${orderId}</span></div>
              ${shippingInfo}
              ${shippingFeeNote}
              <div style="margin-top:32px;font-size:13px;color:#888;">Shipping to: ${customer.full_name}, ${customer.address}, ${customer.city}, ${customer.state}, ${customer.zip}</div>
            </div>
          `
          await sendEmail({
            to: session.customer_email,
            subject: 'Your Order Confirmation',
            text: `Thank you for your order!\n\nOrder Details:\n${orderSummaryText}\n\nTotal: $${total_amount.toFixed(2)}\n\nOrder ID: ${orderId}\n\nShipping Information: Your order will be processed and shipped within 1-2 business days. You can expect delivery within 5-12 business days after shipping.\nShipping to: ${customer.full_name}, ${customer.address}, ${customer.city}, ${customer.state}, ${customer.zip}\n\nNote: A $10 shipping fee has been added to your total.`,
            html: customerHtmlWithId
          })
        }
      }
      break
    }
    default: {
      console.error('Unhandled event type:', event.type)
      return NextResponse.json({ error: 'Unhandled event type' }, { status: 400 })
    }
  }

  return NextResponse.json({ message: 'Webhook processed successfully' }, { status: 200 })
}
