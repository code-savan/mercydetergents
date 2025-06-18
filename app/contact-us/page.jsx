'use client'

import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Instagram, Mail } from 'lucide-react'
import Image from 'next/image'

const ContactPage = () => {
  return (
    <div className="pt-[80px]">
      <Navbar />

      {/* Contact Section */}
      <div className="w-full bg-cover bg-center" style={{ backgroundImage: "url('/contacthero.png')" }}>
        <div className="container mx-auto p-4 py-16">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Card - Contact Us */}
            <div className="w-full md:w-fit bg-white rounded-[15px] md:py-16 md:px-8 p-5 h-fit border border-[#606060]">
              <h1 className="font-antonio text-[48px] md:text-[128px] mb-1">Contact Us</h1>
              <p className="text-gray-600 md:mb-10 mb-6">
                Powerful, mess-free detergent designed <br /> for everyday use.
              </p>

              <div className="flex flex-col gap-3">
                {/* Instagram */}
                <div className="flex items-center gap-3">
                  <Instagram size={24} color="#BF9E4F" />
                  <span className="text-slate-600">mercypeterlaundrydetergent</span>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail size={24} color="#BF9E4F" />
                  <span className="text-slate-600">mercy@mercypeterdetergent.com</span>
                </div>
              </div>
            </div>

            {/* Right Card - Contact Form */}
            <div className="w-full md:w-1/2 bg-white rounded-[15px] p-5 md:p-16 border border-[#606060]">
              <p className="text-gray-600 mb-6 text-center">
                Leave a message and we'll get back to you.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

// ContactForm component
function ContactForm() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send message')
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Full name"
        className="border border-gray-300 rounded-lg p-3 w-full"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="johndoe@gmail.com"
        className="border border-gray-300 rounded-lg p-3 w-full"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="subject"
        placeholder="Subject"
        className="border border-gray-300 rounded-lg p-3 w-full"
        value={form.subject}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        className="border border-gray-300 rounded-lg p-3 w-full h-32"
        value={form.message}
        onChange={handleChange}
        required
      ></textarea>
      <button
        type="submit"
        className="bg-black text-white py-4 rounded-full mt-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send a message'}
      </button>
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-2 rounded text-green-700 text-sm">
          Message sent! We've received your message and will respond within 24 hours.
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-2 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </form>
  )
}

export default ContactPage
