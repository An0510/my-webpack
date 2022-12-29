const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  // target: 'web',
  module: {
    rules: [
      // 对js文件进行babel-loader处理（将ES6语法转换成ES5）
      {
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
            }
          }   
        ]
      }
    ]
  }
}