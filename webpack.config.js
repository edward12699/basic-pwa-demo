const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');
const fs = require('fs')

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('src/mydomain.key'),
      cert: fs.readFileSync('src/mydomain.crt'),
      // ca: fs.readFileSync('/path/to/ca.pem'),
    }

  },
  plugins: [
    // ...其他插件...
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js',
    }),
  ],
  // ...其他配置...
};



