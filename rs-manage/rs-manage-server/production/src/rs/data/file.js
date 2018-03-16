oojs.define({
    name: 'file',
    namespace: 'rs.data',
    fileStatus: {},
    $file: function () {
        this.fs = require('fs');
        this.path = require('path');
        this.ev = oojs.create(oojs.event);
    },
    defaultOptions: {
        cache: true,
        prefix: false,
        watchDirectoryChange: false,
        watchFileChange: false,
        gzip: false,
        deflate: false,
        hashAlgo: false,
        compressJs: false
    },

    cache: {},

    getFileSync: function (filePath, option) {
        var result = '';
        option = option || this.defaultOptions;

        //获取文件目录
        var filePath = this.path.resolve(filePath);

        if (option && option.cache && this.cache[filePath]) {
            //从Cache中获取
            result = this.cache[filePath];
        }
        else {
            //从文件中获取
            result = this.fs.readFileSync(filePath, 'utf8');
            if (option && option.compressJs) {
                var uglifyJS = require("uglify-js");
                result = uglifyJS.minify(result, {
                    fromString: true
                }).code;
            }

            if (option && option.cache) {
                this.cache[filePath] = result;
            }
        }

        return result;

    },

    getFile: function (filePath, option, callback) {
        if (typeof option === 'function') {
            callback = option;
            option = this.defaultOptions;
        }
        callback = callback || function () {};

        //获取文件
        var filePath = this.path.resolve(filePath);
        var eventKey = "event-" + filePath;

        if (this.cache[filePath]) {
            callback(null, this.cache[filePath]);
        }
        else {
            //文件读取后的回调函数			
            var getFileOnLoad = function (data, callback) {
                    callback(null, data)
                }.proxy(this, callback);

            if (this.fileStatus[filePath]) {
                this.ev.bind(filePath, getFileOnLoad);
            }
            else {
                this.fileStatus[filePath] = true;
                this.ev.bind(filePath, getFileOnLoad);

                //文件读取后, 触发getFile传入的回调函数
                this.fs.readFile(filePath, {}, function (err, data, option) {
                    if (err) {
                        his.ev.emit('error', err);
                    }
                    data = data.toString('utf8');
                    if (option && option.compressJs) {
                        var uglifyJS = require("uglify-js");
                        data = uglifyJS.minify(data, {
                            fromString: true
                        }).code;
                    }
                    this.cache[filePath] = data;
                    this.ev.emit(filePath, data);
                }.proxy(this, option));

            }
        }
    }
});