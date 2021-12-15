
// Put this in src/client/next.config.js
// This is so .next folder is in the root directory. Make sure to add .next to .gitignore

const serverUrl = process.env.SERVER_URL || 'http://localhost:9898';

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
  reactStrictMode: true,
  distDir: '../../.next',
  devIndicators: {
    buildActivity: false
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    enabled: true
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    // staticFolder: '/static',
    serverUrl: serverUrl,
    wsEnabled: false,
  },

  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: `${serverUrl}/files/:path*` // Proxy to static files
      },
      {
        source: '/api/:path*',
        destination: `${serverUrl}/:path*` // Proxy to Backend
      }
    ]
  }
};