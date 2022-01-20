const path = require('path');

module.exports = {
  entry: './server.js',
  target: 'node',
  mode: 'development',
  output: {
    filename: 'upload.js',
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  }
};