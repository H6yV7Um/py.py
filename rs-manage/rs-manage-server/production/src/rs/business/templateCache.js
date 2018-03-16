/**
 * @file 模板缓存模块
 * @author zhangziqiu@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'templateCache',
    namespace: 'rs.business',
    deps: {
        config: 'rs.common.config.global',
        templateDA: 'rs.data.template',
        otpl: 'rs.business.otplRenderEngine',
        file: 'rs.data.file',
        fs: require('fs'),
        path: require('path')
    },
    $templateCache: function () {
        this.cacheFilePath = this.path.resolve(this.config.cache.cacheFilePath) + '/';
        this.databaseIntervalSeconds = this.config.cache.databaseIntervalSeconds;
        this.fileIntervalSeconds = this.config.cache.fileIntervalSeconds;
    },

    // 存储模板数据
    cacheData: {},
    // 存储模板索引, 索引指向cacheData中的对象
    cacheIndex: {},
    // 缓存目录
    cacheFilePath: '',
    // 数据库监控的间隔时间, 单位秒
    databaseIntervalSeconds: 1800,
    // 文件监控的间隔时间, 单位秒
    fileIntervalSeconds: 900,

    /**
     * 生成cacheIndex的key: 主模板id_sizeType_sizeWidth_sizeHeight
     *
     * @param {number | string} templateId 模板id
     * @param {number | number} sizeType 模板尺寸类型
     * @param {number | number} width 模板尺寸 - 宽度信息
     * @param {number | number} height 模板尺寸 - 高度信息
     * @return {string} cacheIndex的key
     */
    getCacheIndexKey: function (templateId, sizeType, width, height) {
        var result = 'template_'
            + templateId.toString() + '_'
            + sizeType.toString() + '_'
            + width.toString() + '_'
            + height.toString();
        return result;
    },

    /**
     *  从内存中获取模板
     *
     * @param {string} templateId 模板id
     * @param {number} sizeType 模板尺寸类型
     * @param {number} width 模板尺寸 - 宽度信息
     * @param {number} height 模板尺寸 - 高度信息
     * @return {Object} 模板对象
     **/
    getFromCache: function (templateId, sizeType, width, height) {
        var cacheIndexKey = this.getCacheIndexKey(
            templateId,
            sizeType,
            width,
            height);
        var result = this.cacheIndex[cacheIndexKey];
        return result;
    },

    /**
     * 从文件中加载模版到内存
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

            if (fileStat.isFile()) {
                var fileReadOption = {
                    cache: false,
                    compressJs: false
                };
                try {
                    // 从文件中获取到对象JSON字符串. 并解析成对象
                    var itemSource = this.file.getFileSync(filePath, fileReadOption);

                    var itemObj = JSON.parse(itemSource);
                    // 只处理template.content不为空的模板
                    if (itemObj.content) {
                        // 预处理模板
                        var templateContent = this.otpl.toServerRenderTemplate(itemObj.content, {
                            commonModule: true
                        });
                        // 预编译模板

                        itemObj.templateFunction = this.otpl.compile(templateContent);
                        this.cacheData[itemObj.id] = itemObj;

                    }

                } catch (e) {
                    oojs.log.error('setCacheFromFile-' + fileName, e);
                }
            }
        }

        // 根据模板的从属关系以及尺寸信息, 建立模板索引.
        var temLogArr = [];
        for (var key in this.cacheData) {
            if (key && this.cacheData.hasOwnProperty(key)) {
                var templateItem = this.cacheData[key];
                var templateId = templateItem.id;
                var styleType = templateItem.style_type;
                for (var sizeIndex = 0, sizeCount = templateItem.size.length; sizeIndex < sizeCount; sizeIndex++) {
                    var sizeItem = templateItem.size[sizeIndex];
                    var templateKey = templateId;
                    if (styleType && styleType !== templateId && styleType !== 9000) {
                        // 处理子模板, 子模板使用主模板id作为key
                        templateKey = styleType;
                    }
                    var cacheIndexKey = this.getCacheIndexKey(
                        templateKey,
                        sizeItem.type,
                        sizeItem.width,
                        sizeItem.height);
                    this.cacheIndex[cacheIndexKey] = this.cacheData[templateId];
                    temLogArr.push(templateKey + '_' + sizeItem.type + '_' + sizeItem.width
                    + '_' + sizeItem.height + '_' + templateId);
                }
            }
        }
        oojs.log.info('setCacheFromFile(styleType_sizeType_SW_SH_subTemId): ['
        + temLogArr.join(',') + ']');
    },


    /**
     *  从数据库中加载数据, 生成缓存文件.
     **/
    setFileFromDatabase: function () {
        // 查询条件
        var searchObj = {status: 1};
        // 是否包括公共模版
        var withPublic = true;
        // 是否包括子模版
        var withSubTemplate = true;
        this.templateDA.search(searchObj, withPublic, withSubTemplate, this.setFileFromDatabaseCallback.proxy(this));
    },

    /**
     * setFileFromDatabase回调函数
     *
     * @param {Object} err 异常对象
     * @param {Array} templateArray 模板数组
     * @return {boolean} 是否执行成功
     */
    setFileFromDatabaseCallback: function (err, templateArray) {
        if (err) {
            oojs.log.error('[setFileFromDatabase]', err);
            return false;
        }
        var temItemIdArr = [];
        // 写入文件
        for (var i = 0, count = templateArray.length; i < count; i++) {
            var templateItem = templateArray[i];
            if (templateItem.content) {
                var fileContent = JSON.stringify(templateItem);
                var filePath = this.cacheFilePath + templateItem.id;
                temItemIdArr.push(templateItem.id + '_' + templateItem.style_type);
                this.fs.writeFileSync(filePath, fileContent, {
                    encoding: 'utf8',
                    mode: parseInt('0666', 8),
                    flag: 'w'
                });
            }
        }
        oojs.log.info('setFileFromDatabase(subTemId_styleType)): [' + temItemIdArr.join(',') + ']');
        /*删除数据库已不存在的模板缓存*/
        var temItemIdStr = ',' + temItemIdArr.join(',') + ',';
        var cacheFilePath = this.cacheFilePath;
        var folderExists = this.fs.existsSync(cacheFilePath);
        if (folderExists) {
            var that = this;
            var dirList = this.fs.readdirSync(cacheFilePath);
            dirList.forEach(function (fileName) {
                if (fileName.indexOf('.') === 0) {
                    return;
                }
                if (temItemIdStr.indexOf(',' + fileName + '_') < 0
                && that.fs.statSync(cacheFilePath + fileName).isFile()) {
                    that.fs.unlinkSync(cacheFilePath + fileName);
                }
            });
        }
        return true;
    },

    /**
     * 开始文件监控, 每间隔 intervalSeconds 后重新读取文件, 写入内存
     *
     * @param {number} intervalSeconds 间隔的秒数
     * @return {boolean} 是否执行成功
     */
    startFileMonitor: function () {
        var random = parseInt(Math.random() * 20000, 10);
        setTimeout(function () {
            this.fileMonitorId = setInterval(this.setCacheFromFile.proxy(this),
                this.fileIntervalSeconds * 1000);
        }.proxy(this), random);
        return true;
    },

    /**
     * 停止监文件控
     */
    stopFileMonitor: function () {
        clearInterval(this.fileMonitorId);
    },

    /**
     * 开始数据库监控, 每间隔 intervalSeconds 后重新读取数据库, 写入文件
     *
     * @param {number} intervalSeconds 间隔的秒数.
     */
    startDatabaseMonitor: function () {
        var random = parseInt(Math.random() * 20000, 10);
        setTimeout(function () {
            this.databaseMonitorId = setInterval(this.setFileFromDatabase.proxy(this),
                this.databaseIntervalSeconds * 1000);
        }.proxy(this), random);
    },

    /**
     * 停止数据库监控
     */
    stopDatabaseMonitor: function () {
        clearInterval(this.databaseMonitorId);
    }

});
