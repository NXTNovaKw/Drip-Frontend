import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        // This pathname now correctly includes '/api'
        pathname: '/api/media/**', 
      },
    ],
  },
}

export default nextConfig