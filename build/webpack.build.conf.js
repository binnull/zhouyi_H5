/**
 * Created by Feng on 2017/7/15.
 */
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseConfig = require('./webpack.base.conf.js')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

var buildConfig = {
  entry: {
    main: './src/main.js',
    vendors: ['vue', 'vue-router']
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: '[name].build.[hash].js'
  },
  plugins: [
    new ExtractTextPlugin('[name].style.[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new UglifyJSPlugin({
      sourceMap: false,
      parallel: true,
      uglifyOptions: {
        ecma: 5,
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句
          // 还可以兼容ie浏览器
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
          unused: true,
          keep_infinity: true
        },
        safari10: true
      }
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devtool: '#cheap-hidden-source'
}

module.exports = merge(baseConfig, buildConfig)
