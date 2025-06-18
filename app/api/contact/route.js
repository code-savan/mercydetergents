import { NextResponse } from 'next/server'
import { sendEmail } from '../../utils/sendEmail'

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    // Email to store owner
    const ownerHtml = `
      <div style="max-width:480px;margin:0 auto;font-family:sans-serif;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;">
        <h1 style="font-size:22px;margin-bottom:8px;color:#0ea5e9;">New Contact Message</h1>
        <div style="margin-bottom:18px;font-size:15px;color:#444;">You have received a new message from the website contact form.</div>
        <div style="background:#f9f9f9;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
          <div style="margin-bottom:8px;"><strong>Name:</strong> ${name}</div>
          <div style="margin-bottom:8px;"><strong>Email:</strong> ${email}</div>
          <div style="margin-bottom:8px;"><strong>Subject:</strong> ${subject}</div>
          <div style="margin-bottom:8px;"><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</div>
        </div>
      </div>
    `
    await sendEmail({
      to: 'mercy@mercypetersdetergents.com',
      subject: `Contact Form: ${subject}`,
      text: `New message from ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      html: ownerHtml
    })

    // Confirmation email to sender
    const senderHtml = `
      <div style="max-width:480px;margin:0 auto;font-family:sans-serif;background:#fff;border-radius:12px;box-shadow:0 2px 8px #0001;padding:32px 24px;">
        <h1 style="font-size:22px;margin-bottom:8px;color:#22c55e;">Message Received</h1>
        <div style="margin-bottom:18px;font-size:15px;color:#444;">Hi ${name},<br/>Thank you for reaching out! We've received your message and will respond within 24 hours.</div>
        <div style="background:#f9f9f9;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
          <div style="margin-bottom:8px;"><strong>Your Message:</strong></div>
          <div style="color:#555;">${message.replace(/\n/g, '<br/>')}</div>
        </div>
        <div style="margin-top:18px;font-size:13px;color:#888;">Mercy Peter Detergents Team</div>
      </div>
    `
    await sendEmail({
      to: email,
      subject: `We've received your message`,
      text: `Hi ${name},\n\nThank you for reaching out! We've received your message and will respond within 24 hours.\n\nYour message:\n${message}\n\nMercy Peter Detergents Team`,
      html: senderHtml
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
