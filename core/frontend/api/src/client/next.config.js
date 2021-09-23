
// Put this in src/client/next.config.js
// This is so .next folder is in the root directory. Make sure to add .next to .gitignore

module.exports = {
  reactStrictMode: true,
  distDir: '../../.next',
  devIndicators: {
    buildActivity: false
  }
};