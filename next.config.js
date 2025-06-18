/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ['hxvjfyxwnmcpwthtdgjt.supabase.co'],
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'hxvjfyxwnmcpwthtdgjt.supabase.co'
        }
    ]
  },
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "font-src 'self' https://fonts.gstatic.com https://js.stripe.com https://b.stripecdn.com;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
