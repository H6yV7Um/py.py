/**
 * @file Style缓存模块
 * @author fanwenjuan@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'SdlCache',
    namespace: 'TemplateServer.Data',
    deps: {
        config: 'TemplateServer.Common.Config.Global',
        fs: require('fs'),
        path: require('path')
    },
    // 存储模板数据
    cacheData: [],
    // 缓存目录
    cacheFilePath: '',
    // 文件监控的间隔时间, 单位秒
    fileIntervalSeconds: 900,
    // 最后一次更新时间戳
    lastUpdateTime: 0,

    /**
     * 静态构造函数
     */
    $SdlCache: function () {
        this.cacheFilePath = this.path.resolve(this.config.cache.cacheFilePath) + '/sdl/';
        this.fileIntervalSeconds = this.config.cache.fileIntervalSeconds;
    },

    /**
     *  根据缓存索引key获取到缓存对象
     *
     * @param {string} key 缓存索引key
     * @return {Object} 缓存对象
     **/
    getByKey: function (key) {
        var result;
        if (key) {
            // 查询单条缓存对象
            result = [];
            result.push(this.cacheData[key]);
        } else {
            // 查询所有缓存对象
            result = [];
            for (var tempKey in this.cacheData) {
                if (this.cacheData.hasOwnProperty(tempKey)) {
                    result.push(this.cacheData[tempKey]);
                }
            }
        }
        return result;
    },

    /**
     * 从文件加载到内存
     */
    setCacheFromFile: function () {
        var files = this.fs.readdirSync(this.cacheFilePath);
        // 首先建立cacheData, key为模板id
        for (var i = 0, count = files.length; i < count; i++) {
            var fileName = files[i];
            var filePath = this.cacheFilePath + fileName;
            var fileStat = this.fs.statSync(filePath);
            var sdlInfo = {};
            // 过滤以"."开头的文件或文件夹
            if (fileName.indexOf('.') === 0) {
                continue;
            }

            if (fileStat.isFile()) {
                // 从文件中获取到对象JSON字符串. 并解析成对象
                filePath = this.path.resolve(filePath);
                var file = this.fs.readFileSync(filePath, 'utf8');
                // 记录最后一次更新的时间戳
                sdlInfo = this.getSdlInfo(fileName);
                sdlInfo['content'] = file;
                var key = sdlInfo.creativeType + '_' + sdlInfo.promotionDeviceType;
                if (sdlInfo.isSmartIdea) {
                    key = key + '_' + sdlInfo.isSmartIdea;
                }
                this.cacheData[key] = sdlInfo;
            }
        }
    },
    getSdlInfo: function (fileName) {
        var sdlInfo = {};
        sdlInfo.size = {};
        var fileNameArr = fileName.split('_');
        var creativeType = fileNameArr[0];
        if (creativeType === 'text') {
            sdlInfo.creativeType = 0;
            if (fileNameArr[1]) {
                var promotionDeviceTypeName = fileNameArr[1].split('.')[0];
                if (promotionDeviceTypeName === 'pc') {
                    sdlInfo.promotionDeviceType = 1;
                    sdlInfo.styleId = '10001';
                } else if (promotionDeviceTypeName === 'mobile') {
                    sdlInfo.promotionDeviceType = 2;
                    sdlInfo.styleId = '10002';
                } else if (promotionDeviceTypeName === 'all') {
                    sdlInfo.promotionDeviceType = 3;
                    sdlInfo.styleId = '10001';
                }
            }
        }else if (creativeType === 'image') {
            sdlInfo.creativeType = 1;
            if (fileNameArr[1]) {
                promotionDeviceTypeName = fileNameArr[1].split('.')[0];
                if (promotionDeviceTypeName === 'pc') {
                    sdlInfo.promotionDeviceType = 1;
                    sdlInfo.styleId = '20001';
                }else if (promotionDeviceTypeName === 'mobile') {
                    sdlInfo.promotionDeviceType = 2;
                    sdlInfo.styleId = '20002';
                }else if (promotionDeviceTypeName === 'all') {
                    sdlInfo.promotionDeviceType = 3;
                    sdlInfo.styleId = '20001';
                }
            }
        }else if (creativeType === 'flash') {
            sdlInfo.creativeType = 2;
            if (fileNameArr[1]) {
                promotionDeviceTypeName = fileNameArr[1].split('.')[0];
                if (promotionDeviceTypeName === 'pc') {
                    sdlInfo.promotionDeviceType = 1;
                    sdlInfo.styleId = '30001';
                }
            }
        }else if (creativeType === 'textWithIcon') {
            sdlInfo.creativeType = 4;
            if (fileNameArr[1]) {
                promotionDeviceTypeName = fileNameArr[1].split('.')[0];
                if (promotionDeviceTypeName === 'pc') {
                    sdlInfo.promotionDeviceType = 1;
                    sdlInfo.styleId = '50001';
                } else if (promotionDeviceTypeName === 'mobile') {
                    sdlInfo.promotionDeviceType = 2;
                    sdlInfo.styleId = '50002';
                } else if (promotionDeviceTypeName === 'all') {
                    sdlInfo.promotionDeviceType = 3;
                    sdlInfo.styleId = '50001';
                }
            }
        } else if (creativeType === 'video') {
            sdlInfo.creativeType = 7;
            if (fileNameArr[1]) {
                promotionDeviceTypeName = fileNameArr[1].split('.')[0];
                if (promotionDeviceTypeName === 'pc') {
                    sdlInfo.promotionDeviceType = 1;
                    sdlInfo.styleId = '80001';
                } else if (promotionDeviceTypeName === 'mobile') {
                    sdlInfo.promotionDeviceType = 2;
                    sdlInfo.styleId = '80002';
                }
            }
        }
        if (!!fileNameArr[2]) {
            sdlInfo.isSmartIdea = 'smart';
        } else {
            sdlInfo.isSmartIdea = '';
        }
        return sdlInfo;
    }
});
