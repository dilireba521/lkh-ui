var path = require("path");
const WebpackAliyunOss = require('webpack-aliyun-oss');//上传到oss才需要引入
const oss = require('./oss.config');
module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    }
  },

  configureWebpack: (config) => {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    config.resolve.extensions = ['.js', '.ts', '.tsx', '.json', '.vue', '.css', '.scss'];
    let webpackAliyunOss = [
      new WebpackAliyunOss({
        from: ['./dist/**'], // 上传那个文件或文件夹  可以是字符串或数组
        // dist: "/test",  // 需要上传到oss上的给定文件目录
        region: oss.region, // 只是示例，如果是别的地区请填别的地区
        accessKeyId: oss.accessKeyId, // 不知道ak和sk的百度以下把～
        accessKeySecret: oss.accessKeySecret,
        bucket: oss.bucket,  // bucket的name
        overwrite: true,//覆盖oss同名文件，必须为true否则再次上传时会报错
      })
    ]
    config.plugins = [...config.plugins, ...webpackAliyunOss]
  },
  //扩展 webpack 配置，使packages加入编译
  chainWebpack: config => {

    config.module.rule('jsx')
      .test(/\.(jsx?|babel|es6)$/)
      .use('babel')
      .loader('babel-loader')
      .end();

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
  // css: {
  //   extract: true,
  // }
}