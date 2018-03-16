/**
 * @file  接口地址配置
 */
/* eslint-disable */
console.log('请求接口环境: process.env.NODE_ENV' + process.env.NODE_ENV);
// RD开发环境
if (process.env.NODE_ENV === 'development') {
    server = location.origin; // 本地环境
    // server = 'http://172.23.4.41:8080'; // RD环境
    var stylelist = server + '/static/mock/data/stylelist.json';
    var templatelist = server + '/static/mock/data/templatelist.json';
}
// 线上环境
if (process.env.NODE_ENV === 'production') {
    server = 'https://xxx'; // 线上环境
    var stylelist = server + '/style/list';
    var templatelist = server + '/template/list';
}


module.exports = {
  // 百意样式列表
  stylelist: stylelist,
  // 每个样式模板列表
  templatelist: templatelist
};
/* eslint-disable */