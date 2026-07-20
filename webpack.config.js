const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (_, argv) => ({
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash].js',
    clean: true,
  },
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(png|jpe?g|gif|webp|mp3|ogg|skel|atlas|json)$/i, type: 'asset/resource' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: 'public', noErrorOnMissing: true },
        { from: 'assets/spine_1/azure.png', to: 'azure.png' },
      ],
    }),
  ],
  devServer: {
    static: './dist',
    port: 8080,
    hot: true,
  },
});
