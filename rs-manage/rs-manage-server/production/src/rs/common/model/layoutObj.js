oojs.define({
    name: 'layoutObj',
    namespace: 'oojs.model',
    //dom元素名
	tagName:'div',
	//css样式类名
	'class':'classA',
	//style样式, 如果传递了cssName, 则自动用style中的内容生成以cssName命名的样式类. 
	style: {
		display:'block',
		'background-color':'#00ffff'
	},
	//dom元素内部的内容
	'innerHTML':'Hello World'
	
});