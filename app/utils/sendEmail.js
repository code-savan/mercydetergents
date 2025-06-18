import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Send an email using Resend
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 * @param {string} [options.from] - Sender email address (default: 'Mercy Peter Detergents <mercy@mercypetersdetergents.com>')
 * @returns {Promise<{id?: string, error?: any}>}
 */
export async function sendEmail({ to, subject, text, html, from }) {
  try {
    const response = await resend.emails.send({
      from: from || 'Mercy Peter Detergents <mercy@mercypetersdetergents.com>',
      to: [to],
      subject,
      text,
      ...(html ? { html } : {}),
    })
    if (response.error) {
      console.error('Resend email error:', response.error)
      return { error: response.error }
    }
    return { id: response.id }
  } catch (err) {
    console.error('Resend email exception:', err)
    return { error: err }
  }
}
