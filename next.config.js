// next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    
    webpack: (config, { isServer }) => {
      if (!isServer) {
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