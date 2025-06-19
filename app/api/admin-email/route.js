import { NextResponse } from 'next/server'
import { sendEmail } from '../../utils/sendEmail'

export async function POST(req) {
  try {
    const { to, subject, message } = await req.json()
    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    const html = `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:10px;box-shadow:0 2px 8px #0001;padding:32px 24px;">
      <h2 style="font-size:20px;margin-bottom:12px;color:#0ea5e9;">Message from Mercy Peter Detergents</h2>
      <div style="font-size:15px;color:#222;white-space:pre-line;">${message}</div>
      <div style="margin-top:32px;font-size:13px;color:#888;">This message was sent by the store admin.</div>
    </div>`
    const result = await sendEmail({
      to,
      subject,
      text: message,
      html
    })
    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Failed to send email.' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Failed to send email.' }, { status: 500 })
  }
}
