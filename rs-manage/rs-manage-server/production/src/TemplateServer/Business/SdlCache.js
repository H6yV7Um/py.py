/**
 * @file TemplateServer.defaultValueManager
 * @author fanwenjuan@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'SdlCache',
    namespace: 'TemplateServer.Business',
    deps: {
        config: 'TemplateServer.Common.Config.Global',
        fs: require('fs'),
        path: require('path')
    },
    getSdl: function (requestInfo) {
        var result = [];
        this.cacheFilePath = this.path.resolve(this.config.cache.cacheFilePath + '/cache_sdl/');
        var files = this.fs.readdirSync(this.cacheFilePath);
        var fileName = '';
        var file = '';
        var itemTempArray = [];
            // 缓存文件
        files.forEach(function (item) {
            // 过滤以"."开头的文件或文件夹
            if (item.indexOf('.') === 0) {
                return;
            }
            fileName = item;
            var filePath = this.path.resolve(this.cacheFilePath + '/' + item);
            file = this.fs.readFileSync(filePath, 'utf8');
            result.push(file);
        }.proxy(this));
        return result;
    }
});