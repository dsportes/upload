const path = require('path');

module.exports = {
  entry: './server.js',
  target: 'node',
  mode: 'development',
  output: {
    filename: 'update.js',
    path: path.resolve(__dirname, 'dist'),
  },
};