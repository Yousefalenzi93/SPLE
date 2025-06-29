const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    esmExternals: false
  },
  webpack: (config, { isServer }) => {
    // Fix for module resolution issues
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    }
    
    // Ensure proper file extensions are resolved
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json']
    
    // Additional module resolution fixes
    config.resolve.modules = [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ]
    
    return config
  }
}

module.exports = nextConfig
