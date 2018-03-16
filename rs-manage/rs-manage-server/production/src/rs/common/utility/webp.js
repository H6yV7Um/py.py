oojs.define({
    name: 'webp',
    namespace: 'rs.common.utility',
    deps:{
        fs:require('fs'),
        childProcess:require('child_process')
    },
    deleteFile: function (filePath) {
        this.fs.unlink(filePath, function (err) {
            if (err) {
                return false;
            }
        });
    },
    checkIsGif: function (data) {
        // http://en.wikipedia.org/wiki/Magic_number_(programming)
        // 通过magic number判断文件类型
        return data.toString('ascii').indexOf('GIF89a') > -1
            || data.toString('ascii').indexOf('GIF87a') > -1;
    },
    checkIsJpg: function (data) {
        // http://en.wikipedia.org/wiki/Magic_number_(programming)
        // 通过magic number判断文件类型
        return data.toString('ascii').indexOf('JFIF') > -1
            || data.toString('ascii').indexOf('Exif') > -1;
    },
    checkIsPng: function (data) {
        // http://en.wikipedia.org/wiki/Magic_number_(programming)
        // 通过magic number判断文件类型
        return data.toString('ascii').indexOf('PNG\r\n\032\n') > -1;
    },
    //callback:function(err, data)
    binary2webp: function (data, callback) {
        // 只压缩JPG图片
        var isJpg = this.checkIsJpg(data);
        var isPng = this.checkIsPng(data);

        if (!isJpg && !isPng) {
            callback(new Error('is not jpeg or is not png'), '');
            return false;
        }

        var tempFolder = oojs.getClassPath('rs.common.utility').replace('.js', '') + '/temp4webp'; // 存放临时文件的文件夹
        var tempFileName = 'temp_' + Math.random().toFixed(10) * 10e10; // 临时文件名称
        var inputFilePath = tempFolder + "/" + tempFileName;
        var outputFilePath = tempFolder + "/" + tempFileName + ".webp";
        var cwebpPath = oojs.getClassPath('rs.common.utility').replace('.js','') + '/cwebp ';
        var timeout = 1000 * 10;
        var _this = this;

        // 从文件读取的data即是图片的二进制数据
        // 因为cwebp只能传入图片地址，不能是二进制文件，也不能是base64文件
        // 所以要先**将二进制存为实际的本地图片**
        this.fs.writeFile(inputFilePath, data, function (err) {
            // 如果出错，则删除该文件
            if (err) {
                callback(err, '');
                _this.deleteFile(inputFilePath);
                return false;
            }
            // 如果写入成功，则将图片转化为webp
            _this.childProcess.exec('pwd', function (err, rootPath, stderr) {
                // 默认输出会带换行符'\n'
                rootPath = rootPath.replace('\n', '');
                _this.childProcess.exec(cwebpPath + inputFilePath + ' -o ' + outputFilePath, {
                    env: {
                        'LD_LIBRARY_PATH': rootPath + '/dep'
                    }
                }, function (error, stdout, stderr) {
                    if (error) {
                        callback(error, '');
                        _this.deleteFile(inputFilePath);
                        _this.deleteFile(outputFilePath);
                        return true;
                    }

                    // 如果转化为webp成功
                    // 则再将webp从硬盘中读出来，
                    // 将读取的二进制返回
                    _this.fs.readFile(outputFilePath, function (err, data) {
                        if (err) {
                            return false;
                        }

                        // 如果读取成功，则将二进制返回
                        callback(null, data);
                        _this.deleteFile(outputFilePath);
                        _this.deleteFile(inputFilePath);
                        return true;
                    });
                });
            });


            // 慎重起见
            // 10s后再尝试删除
            setTimeout(function () {
                _this.deleteFile(inputFilePath);
                _this.deleteFile(outputFilePath);
            }, timeout);
        });
    }


});