/**
 * @file StyleContentCache缓存模块
 * @author fanwenjuan@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'StyleContentCache',
    namespace: 'TemplateServer.Data',
    deps: {
        config: 'TemplateServer.Common.Config.Global',
        fs: require('fs'),
        path: require('path'),
        uglifyJS: require('uglify-js')
    },
    cache: {},
    $StyleContentCache: function () {
        this.loadAllFiles();
    },

    getContent: function (styleId) {
        // 获取文件
        this.cacheFilePath = this.path.resolve(this.config.cache.cacheFilePath + '/cache_content/' + styleId + '/');
        if (!this.cache[styleId]) {
            var files = this.fs.readdirSync(this.cacheFilePath);
            var fileName = '';
            var file = '';
            var itemTempArray = [];
            this.cache[styleId] = {};
            // 缓存文件
            files.forEach(function (item) {
                // 过滤以"."开头的文件或文件夹
                if (item.indexOf('.') === 0) {
                    return;
                }
                fileName = item;
                var filePath = this.path.resolve(this.cacheFilePath + '/' + item);
                if (fileName === 'layout.js') {
                    file = require(filePath);
                } else {
                    file = this.fs.readFileSync(filePath, 'utf8');
                }
                if (fileName === 'page.js') {
                    file = this.uglifyJS.minify(file, {
                        fromString: true
                    }).code;
                    this.cache[styleId]['page.js'] = file;
                } else if (fileName === 'layout.js') {
                    this.cache[styleId]['layout.js'] = file;
                } else if (fileName === 'page.html') {
                    this.cache[styleId]['page.html'] = file;
                }
            }.proxy(this));
        }
        return this.cache[styleId];
    },
    getFileType: function (fileName) {
        var result = '';
        var fileTypeRegex = /\.([^\.]*)$/gmi;
        var matchs = fileTypeRegex.exec(fileName);
        if (matchs) {
            result = matchs[1];
        }
        return result.toLowerCase();
    },
    loadAllFiles: function () {
        var basePath = this.path.resolve(oojs.getPath() + 'TemplateServer/Template/');
        var files = this.fs.readdirSync(basePath);

        for (var i = 0, count = files.length; i < count; i++) {
            var fileName = files[i];
            if (fileName.indexOf('.') === 0) {
                continue;
            }
            var filePath = this.path.resolve(basePath + '/' + fileName);

            var fileType = this.getFileType(fileName);
            var compressJs = fileType === 'js' ? true : false;

            // 从文件中获取
            var result = this.fs.readFileSync(filePath, 'utf8');
            if (compressJs) {
                result = this.uglifyJS.minify(result, {
                    fromString: true
                }).code;
            }
            this.cache[fileName] = result;
        }
    },

    get: function (key) {
        return this.cache[key] || '';
    }
});
