module.exports = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/files/:path*',
        destination: 'http://localhost:9797/files/:path*' // Proxy to Backend
      }
    ]
  }
}
