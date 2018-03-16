var http = require("http");
var fs = require('fs');//引入文件读取模块
var documentRoot = '/www';
http.createServer(function (req, res) {
    var url = req.url;
    var file = __dirname+url
    console.log('url='+url);
    console.log('__dirname+url='+file);
	fs.readFile( file , function(err,data){
    /*
        一参为文件路径
        二参为回调函数
            回调函数的一参为读取错误返回的信息，返回空就没有错误
            二参为读取成功返回的文本内容
    */
        if(err){
            res.writeHeader(404,{
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        }else{
            res.writeHeader(200,{
                'content-type' : 'text/html;charset="utf-8"'
            });
            res.write(data);//将index.html显示在客户端
            res.end();

        }
        });
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');