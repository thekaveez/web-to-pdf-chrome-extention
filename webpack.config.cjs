const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    popup: './src/popup.js',
    options: './src/options.js',
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // This is important for service workers
    environment: {
      // The environment supports arrow functions
      arrowFunction: true,
      // The environment does not support BigInt literals
      bigIntLiteral: false,
      // The environment supports const and let
      const: true,
      // The environment supports destructuring
      destructuring: true,
      // The environment does not support dynamic import()
      dynamicImport: false,
      // The environment supports forOf
      forOf: true,
      // The environment supports ES modules
      module: false, // Service workers must be in classic script mode
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: './src/options.html',
      filename: 'options.html',
      chunks: ['options']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};