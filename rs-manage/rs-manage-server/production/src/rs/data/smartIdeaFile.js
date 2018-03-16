oojs.define({
    name: 'smartIdeaFile',
    namespace: 'rs.data',
    fileStatus: {},
    $smartIdeaFile: function () {
        this.fs = require('fs');
		this.iconv = require('iconv-lite');
    },
    cache: {},
	
	getFileSync:function(path){
		var result = "";
		var fileBuffer = this.fs.readFileSync(path);
		result = this.iconv.decode(fileBuffer, 'gbk');
		return result;
	},
	
	
    getMainFile: function () {
        var result;
        var mainFilePath = oojs.getPath() + '/rs/template/smart_idea_base/config/smart_idea_templates.conf';
		
		if(this.cache[mainFilePath]){
			return this.cache[mainFilePath];
		}
		else{
			result = this.getFileSync(mainFilePath);
			this.cache[mainFilePath] = result;
			return result;
		}
		
        
    },

    getSubFile: function (fileName) {
        var result;
        var filePath = oojs.getPath() + '/rs/template/smart_idea_base/config/' + fileName;
		
		if(this.cache[filePath]){
			return this.cache[filePath];
		}
		else{
			result = this.getFileSync(filePath);
			this.cache[filePath] = result;
			return result;
		}
    },

    getVarFile: function (fileName) {
        var result;
        var filePath = oojs.getPath() + '/rs/template/smart_idea_base/config/codefiles/' + fileName;
		
		if(this.cache[filePath]){
			return this.cache[filePath];
		}
		else{
			result = this.getFileSync(filePath);
			this.cache[filePath] = result;
			return result;
		}
    }
});