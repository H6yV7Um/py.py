/**
 * @fileOverview  npm run dev
 * @description  入口文件
 * @author [author]liuboying@baidu.com
 */
// 检查node npm版本
require('./check-versions')()
// 设置环境变量
var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
// 端口配置
var port = process.env.PORT || config.dev.port
// 是否自动打开浏览器
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// 配置代理
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable
// 引入express
var app = express()
// 引入webpack编译
var compiler = webpack(webpackConfig)
console.log('path:'+webpackConfig.output.path + 'publicPath:' +webpackConfig.output.publicPath)
// Webpack dev middleware 是WebPack的一个中间件。它用于在 Express中分发需要通过 WebPack 编译的文件
// 单独使用它就可以完成代码的热重载（hot reloading）功能。
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
// Webpack hot middleware 它通过订阅Webpack的编译更新，之后通过执行 webpack 的 HMR api 将这些代码模块的更新推送给浏览器端
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})
// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// 将静态资源文件所在的目录作为参数传递给 express.static 中间件就可以提供静态资源文件的访问了
// staticPath为静态资源访问时的挂载路径
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  console.log('readyPromise:::' + resolve);
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
