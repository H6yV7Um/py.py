/**
 * @file Style缓存模块
 * @author qianxiaoli@baidu.com
 *         zhangziqiu@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'StyleCache',
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
    $StyleCache: function () {
        this.cacheFilePath = this.path.resolve(this.config.cache.cacheFilePath) + '/style/';
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
            result = this.cacheData[key];
        }
        else {
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

            // 过滤以"."开头的文件或文件夹
            if (fileName.indexOf('.') === 0) {
                continue;
            }

            // 只处理以".json"结尾的文件
            if (fileName.indexOf('.json') < 0) {
                continue;
            }

            if (fileStat.isFile()) {
                // 从文件中获取到对象JSON字符串. 并解析成对象
                filePath = this.path.resolve(filePath);
                var itemSource = this.fs.readFileSync(filePath, 'utf8');
                var itemObj = JSON.parse(itemSource);
                // 记录最后一次更新的时间戳
                if (itemObj && itemObj.updateTime) {
                    var tempUpdateTime = parseInt(itemObj.updateTime, 10);
                    if (tempUpdateTime > this.lastUpdateTime) {
                        this.lastUpdateTime = tempUpdateTime;
                    }
                }
                fileName = fileName.replace('.json', '');
                this.cacheData[fileName] = itemObj;
            }
        }
    },

    /**
     * 获取最后一次更新时间
     *
     * @return {number} 最后一次更新的毫秒数
     */
    getLastUpdateTime: function () {
        return this.lastUpdateTime;
    }

});
