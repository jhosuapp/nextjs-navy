// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false, // Temporalmente false para debugging
    
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Fuerza TODOS los CSS al bundle principal
        config.optimization.splitChunks = {
          ...config.optimization.splitChunks,
          cacheGroups: {
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
              priority: 10,
            },
          },
        }
      }
      return config
    },
}