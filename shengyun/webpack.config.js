var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
    //插件项
    // plugins: [commonsPlugin],
    //页面入口文件配置
    entry: {
        index : './src/index.js'
    //     'webpack/hot/dev-server',
    // 'webpack-dev-server/client?http://localhost:8080'
    },
    //入口文件输出配置
    output: {
        path: 'dist/js/page',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
        {
            test: /\.js/,
            loader: 'babel',
            include: /src/,
        },
		{
		    test: /\.scss/,
		    //loader: 'style!css!sass',
		    // Or
		    loaders: ['style', 'css', 'sass'],
		},
		{
		    test: /\.html/,
		    loader: 'html',
		}
      
        ]
    }
};