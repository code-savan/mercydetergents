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

              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Full name"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />

                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="border border-gray-300 rounded-lg p-3 w-full"
                />

                <textarea
                  placeholder="Message"
                  className="border border-gray-300 rounded-lg p-3 w-full h-32"
                ></textarea>

                <button className="bg-black text-white py-4 rounded-full mt-2 hover:bg-gray-800 transition-colors">
                  Send a message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ContactPage
