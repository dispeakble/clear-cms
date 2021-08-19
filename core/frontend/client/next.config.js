const serverUrl = process.env.SERVER_URL || 'http://localhost:9797';


if (process.env.ONLY_STATIC) {
  module.exports = {
    reactStrictMode: true,

    serverRuntimeConfig: {
      // Will only be available on the server side
      serverUrl: serverUrl,
      // secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },

    publicRuntimeConfig: {
      // Will be available on both server and client
      // staticFolder: '/static',
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
  }
} else {
  module.exports = {
    reactStrictMode: true,
    

    async rewrites() {
      return [
        {
          source: '/files/:path*',
          destination: `http://${serverUrl}/files/:path*` // Proxy to Backend
        },
        {
          source: '/api/:path*',
          destination: `http://${serverUrl}/:path*` // Proxy to Backend
        }
      ]
    },

    serverRuntimeConfig: {
      // Will only be available on the server side
      serverUrl: serverUrl,
      // secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },

    publicRuntimeConfig: {
      // Will be available on both server and client
      // staticFolder: '/static',
      wsEnabled: true,
    },
  }
}



