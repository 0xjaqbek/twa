// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = {
  // other webpack config
  plugins: [
    new Dotenv()
  ]
};
