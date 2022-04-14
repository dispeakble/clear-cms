
// Put this in src/client/next.config.js
// This is so .next folder is in the root directory. Make sure to add .next to .gitignore

const serverUrl = `https://${process.env.website_domain}` || 'http://localhost:9898';

module.exports = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  distDir: '../../.next',
  devIndicators: {
    buildActivity: false
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    enabled: true
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
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
      }
    ]
  }
};