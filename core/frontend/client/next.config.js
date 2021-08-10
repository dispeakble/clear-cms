module.exports = {
  reactStrictMode: true,

  serverRuntimeConfig: {
    // Will only be available on the server side
    serverUrl: 'http://localhost:9797',
    // secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    // staticFolder: '/static',
  },

  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: 'http://localhost:9797/files/:path*' // Proxy to Backend
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:9797/:path*' // Proxy to Backend
      }
    ]
  }
}
