oojs.define({
	name: 'templateFileManager',
	namespace: 'rs.business',
	deps:{
		styleType:'rs.common.model.styleType',
		file:'rs.data.file'
	},
	$templateFileManager : function(){
		
	},
	cache : {},
	
	getFileType:function(fileName){
		var result = "";
		//this.fileTypeRegex =  this.fileTypeRegex || /\.([^\.]*)$/gmi;
		var fileTypeRegex = /\.([^\.]*)$/gmi;
		var matchs = fileTypeRegex.exec(fileName);
		if(matchs){
			result = matchs[1];
		}				
		return result.toLowerCase();
	},
	
	loadAllFiles:function(){
		var basePath = oojs.getPath() + "rs/template/";
		var fs = require('fs');		
		var files = fs.readdirSync(basePath);
		for(var i=0, count=files.length; i<count; i++){
			var fileName = files[i];
			var filePath = basePath + fileName;
			var fileStat = fs.statSync(filePath);
			
			//过滤以"."开头的文件或文件夹
			if(fileName.indexOf('.')===0){
				continue;
			}
			
			if(fileStat.isFile()){
				var fileType = this.getFileType(fileName);
				var compressJs = fileType==='js'?true:false;
				var fileReadOption = {
					cache: false,
					compressJs: compressJs
				};
				this.cache[fileName] = this.file.getFileSync(filePath, fileReadOption);
			}
			else if(fileStat.isDirectory()){
				//读取page.html
				var htmlFilePath = filePath + '/page.html';
				var fileReadOption = {
					cache: false,
					compressJs: false
				};
				this.cache[fileName] = this.file.getFileSync(htmlFilePath, fileReadOption);
				
				//读取page.js
				var jsFilePath = filePath + '/page.js';				
				if(fs.existsSync(jsFilePath)){				
					var jsFileReadOption = {
						cache: false,
						compressJs: true
					};
					this.cache[fileName+".js"] = this.file.getFileSync(jsFilePath, jsFileReadOption);
				}
			}
		
		}

		//load all template layout engines
		/*
		var styleTypes = this.styleType.getAll();
		for( var i= 0, count=styleTypes.length; i<count; i++ ){
			oojs.reload( 'rs.template.' +  styleTypes[i].toLowerCase() + '.layout');
		}
		*/
	},
	
	get:function( key ){
		return this.cache[key] || "";
	}
});