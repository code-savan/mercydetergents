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
  }
}

module.exports = nextConfig
