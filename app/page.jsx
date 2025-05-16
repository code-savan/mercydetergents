import React from "react";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import FAQ from "./components/FAQ";
import Navbar from "./components/Navbar";
import ProductSlider from "./components/ProductSlider";
import AboutBrand from "./components/AboutBrand";
import Hero from "./components/Hero";
import Image from "next/image";

export const metadata = {
  title: 'Mercy Peter Detergents | Clean Made Simple',
  description: 'Powerful, mess-free detergent designed for everyday use with no harsh chemicals.',
}

export default function Home() {
  return (
    <div className="pt-[80px]">
      <Navbar />
      <Hero />
      <div
        className="w-full h-[350px] bg-cover bg-center"
        style={{ backgroundImage: "url('/laundryexample.png')" }}
      />
      <AboutBrand />
      <ProductSlider />
      <FAQ />
      <Newsletter bgColor="#F4BBBC" />
      <Footer />
    </div>
  );
}
