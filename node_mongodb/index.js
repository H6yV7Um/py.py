var express = require('express');
var app = express();
var ejs = require('ejs')


var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost')

app.engine('.html', ejs.__express)
app.set('view engine','html')
app.get('/', function (req, res) {
  res.send('Hello World!'+res);
  // console.log(res)
});
app.get('/movielist', function (req, res) {
  Kitten.fetch(function(err,movies){
  	console.log('========='+movies)
  })
  res.render('movielist',{
  	title:'movilist'
  })
  // res.send('Hello World!');
});
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});