import React from 'react'

const Newsletter = ({ bgColor = '#F4BBBC' }) => {
  return (
    <div
      className="relative md:h-[294px] h-[350px] w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 w-full h-full opacity-10 z-10"
        style={{
          backgroundImage: "url('/hero.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between justify-center items-center h-full gap-8">
          {/* Left side - Text */}
          <div className="md:w-1/2">
            <h2 className="font-antonio text-[64px] leading-none">
              Subscribe to<br />
              our newsletter.
            </h2>
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 w-full max-w-md">
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
              />
              <button
                className="w-full bg-black text-white cursor-pointer py-3 rounded-full hover:bg-gray-800 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
