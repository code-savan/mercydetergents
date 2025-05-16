import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AboutHero from '../components/AboutHero'
import Newsletter from '../components/Newsletter'
import FAQ from '../components/FAQ'


export const metadata = {
  title: 'About Us | Mercy Peter Detergents',
  description: 'Learn about our story and how Mercy Peter Detergents began.',
}

export default function AboutUsPage() {
  return (
    <div className="pt-[80px]">
      <Navbar />
      <AboutHero />
      <div className='bg-[#1C1C1C] w-full h-[600px] flex items-center justify-center'>
        <p className='md:text-[20px] lg:w-[50%] md:w-[70%] w-[90%] text-center md:text-white text-white/80'>
        I started this brand because I wanted a detergent that actually worked without all the extra nonsense. Something simple, effective, and reliable. Over time, I realized that many people were frustrated by either harsh formulas, weak results, or products that just didn't live up to the hype. So I decided to create my own solution.
            <br /> <br />
        At its core, this brand is about getting back to the basics: clean clothes, clean formula, and no fuss. I've worked hard to make sure every product we offer is powerful enough to handle the toughest stains, yet balanced enough to be used every day.
        </p>
      </div>
      <div
        className='w-full h-[600px] flex items-center justify-center'
        style={{ backgroundImage: "url('/hero.svg')" }}
      >
        <div className='bg-[#1C1C1C] lg:w-[50%] md:w-[70%] w-[90%] h-[150px] flex items-center justify-center'>
        <p className="text-white">Our Products speak for themselves</p>
        </div>
      </div>

      <FAQ />
      <Footer />
    </div>
  )
}
