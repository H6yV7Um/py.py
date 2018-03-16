/**
 * nodemon --harmony app
 */
require('babel-core/register');
const convert = require('koa-convert') //
const cors = require('koa-cors') //跨域
const Koa = require('koa');
const app = new Koa();
app.use(convert(cors()));

const fs = require('fs');
const path = require('path');

const tools = require('./tools');
const client = require('./tools/nsRequestClient');
const {MOCK_DATA_DIR, RPC} = require('./config');

async function render() {
    // mock目录
	let MOCK_DIR = path.join(__dirname,'mock');
	// mock数据文件
	//let filename = path.join(MOCK_DIR, view);
	// rs baiyi模板目录
	let tplDir = path.join(__dirname, 'production', 'cache', 'template')
	// 
	let arr = [];
	fs.readdirSync(tplDir).forEach(fileDirs => {
		let fileDir = fileDirs.split(".")[0];
		arr.push(fileDir);
	})
	// 数组去重
    let templateNum = uniqe(arr, tplDir);
	// 读取文件
	// return fs.readFileSync(filename,{encoding: 'utf-8'});
	// return new Promise((resolve, reject) =>{
	// 	fs.readFile(filename, {encoding: 'utf-8'},function (err, data) {
 //    	resolve(data)
 //       })
	// })
    return templateNum;
}

function uniqe(arr, tplDir){
    let obj ={};
    let len = arr.length;
    let newArr =[];
    for(var i=0 ; i<len ; i++){
    	var key = arr[i];
    	if(obj[key]!==1) {
    		obj[key] = 1;
    	}
    }
    for(var key in obj) {
    	var _o = {};
    	_o.id = key;
    	_o.path = path.join(tplDir, key)
    	_o.discription = '百意模板';
    	_o.name = '模板名称';
    	_o.updateTime = '2017-09-26';
    	_o.operator = 'liuboying';
    	// _o.requestInfo = path.join(_o.path, 'request' , key+'.js')
    	newArr.push(_o)
    }
    return newArr;
}

// 这里可以配置本地mock数据
// vue-web
async function route(url, query) {
	console.log('url====' + url);
	const methodId = '8';
	switch (url) {
		case '/templatelists':
	    	let html = await render();
	        return html
		    break;
		case '/requestInfo':
		console.log('id======'+query.id);
		    let id = query.id;
		    let filename = path.join(__dirname, 'production', 'cache', 'template',id, 'request' , id+'.js');
            return fs.readFileSync(filename,{encoding: 'utf-8'});
		    break;
		case '/api/8':
		    const mockData = tools.getMockFile(MOCK_DATA_DIR, query.mockFile);
		    // console.log('mockFile======' + query.mockFile);
		    // 
		    console.log('mockData======' + mockData);
		    try {
		        let htmlArr = await client.request({
		            address: RPC.address,
		            port: RPC.port,
		            methodId: methodId,
		            data: mockData
		        });
		        console.log('======' + htmlArr)
		        return htmlArr.join('');

		    }
		    catch (e) {
		        console.error(e);
		        // ctx.body = e.toString();
		    }
		    break;
		default:
		break;
	}
	
}
app.use(async ctx => {
	let url = ctx.request.path;
	let query = ctx.query;
	let data = await route(url, query);
    ctx.body = data;
})
app.listen(3000)

console.log('lisening 3000 port')