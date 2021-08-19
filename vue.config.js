var path = require("path");
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },

  configureWebpack: (config) => {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    config.resolve.extensions = ['.js', '.json', '.vue', '.css', '.scss'];
  },
  //扩展 webpack 配置，使packages加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(path.resolve(__dirname, './src/index.js'))
      .end()
      .use('babel')
      .loader('babel-loader')
  },
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'sass',
  //     patterns: [path.resolve(__dirname, './packages/style/index.scss')]
  //   }
  // }
}