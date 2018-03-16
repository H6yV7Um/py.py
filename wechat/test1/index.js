"use strict";
var Koa = require('koa');
var sha1 = require('sha1');
var config = {
	appID: 'wx690f7c97cb7ceb30',
	appsecret: '8e17c877334154ef0a7963820f4654c5',
	Token: '2334'
}
var app= new Koa();
app.use(function *(next) {
	// body...
	// { signature: 'd7709fe7d0bd0b90b03588a9c0e0c94cb4aaaf8c',
  //echostr: '1940133834095816670',
  //timestamp: '1494558670',
 // nonce: '1160028935' }

 console.log(this.query);
 var signature = this.query.signature;
 var nonce = this.query.nonce;
 var timestamp = this.query.timestamp;
 var echostr = this.query.echostr;
 var str = [config.Token,timestamp,nonce].sort().join('')
 var sha = sha1(str);
 if(sha===signature){
   this.body = echostr + ''
 }else{
 	this.body = 'hello'
 }

})
app.listen(80);
console.log('listening 80');