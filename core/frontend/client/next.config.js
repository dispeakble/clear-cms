module.exports = {
  reactStrictMode: true,

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
