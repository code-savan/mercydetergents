'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/20">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left"
      >
        <span className="text-xl">{question}</span>
        <Plus
          className={`transition-transform ${isOpen ? 'rotate-45' : 'rotate-0'}`}
          size={24}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-white/60 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqData = [
    {
      question: "What types of products do you sell?",
      answer: "We offer laundry detergents, floor cleaners (in various scents), detergent pods, and fabric softeners — all formulated for powerful and reliable cleaning."
    },
    {
      question: "Can I use your products in both top and front-load washing machines?",
      answer: "Yes! All our laundry products are compatible with both top and front-loading machines."
    },
    {
      question: "Are your products safe for all fabrics and surfaces?",
      answer: "Yes, our laundry products are safe for all fabric types, and our floor cleaners are suitable for most hard surfaces. Always follow usage instructions for best results."
    },
    {
      question: "How do I place an order?",
      answer: "Simply browse our products, add items to your cart, and proceed to checkout. The process is quick and requires no account signup."
    },
    {
      question: "How long does delivery take?",
      answer: "Orders are typically delivered within 2–5 business days, depending on your location. You'll receive a confirmation once your order is placed."
    }
  ]

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-full bg-black text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-20">
          {/* Left side - Title */}
          <div className="md:w-1/3">
            <h2 className="font-antonio text-[48px] md:text-[64px] leading-none">
              Frequently<br />
              asked<br />
              questions
            </h2>
          </div>

          {/* Right side - FAQ items */}
          <div className="md:w-2/3">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
