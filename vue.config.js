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
    config.resolve.extensions = ['.js', '.ts', '.tsx', '.json', '.vue', '.css', '.scss'];

  },
  //扩展 webpack 配置，使packages加入编译
  chainWebpack: config => {
    config.module.rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()

    config.module.rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      })
      .end()
      .use('md-loader')
      .loader(path.resolve(__dirname, './md-loader/index.js'))
      .end()

    config.module
      .rule('js')
      .include
      .add(path.resolve(__dirname, './src/index.js'))
      .end()
      .use('babel')
      .loader('babel-loader');

    config.module
      .rule('typescript')
      .test(/\.tsx?$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use("ts-loader")
      .loader('ts-loader')
      .options({
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/],
        happyPackMode: false,
      })
      .end();


  },
  // pluginOptions: {
  //   'style-resources-loader': {
  //     preProcessor: 'sass',
  //     patterns: [path.resolve(__dirname, './packages/style/index.scss')]
  //   }
  // },
  css: {
    extract: true,
  }
}