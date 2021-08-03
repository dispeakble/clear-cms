const config = require('./package.json');

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${config.proxy}/:path*`
      },
    ]
  },
}
