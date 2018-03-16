/**
 * @file File Cache
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'fileCache',
    namespace: 'rs.data',
    deps: {
        config: 'rs.common.config.global',
        fs: require('fs'),
        path: require('path')

    },
    // 缓存文件名前缀，避免判断文件类型
    filePre: 'fc_',
    // 缓存内容格式
    dataFormat: {
        // 以JSON对象格式存储的内容
        json: {
            set: function (data, replacer) {
                data = JSON.stringify(data, replacer);
                return new Buffer(data, 'utf8');
            },
            get: function (data, reviver) {
                data = data.toString('utf8');
                return JSON.parse(data, reviver);
            }

        },
        // 以字符串形式存储的内容，默认编码'utf8'
        string: {
            set: function (data) {
                return new Buffer(data, 'utf8');
            },
            get: function (data) {
                return data.toString('utf8');
            }

        },
        // 以'utf8'编码存储的Buffer内容
        buffer: {
            set: function (data) {
                return data;
            },
            get: function (data) {
                return data;
            }

        }

    },

    /**
     *  初始化模板文件缓存
     *
     **/
    $fileCache: function () {
        // 缓存文件失效时间
        this.expiredTime = this.config.fileCache.expireTime;
        // 缓存文件存放路径
        this.basePath = this.config.fileCache.filePath;

        // 初始化缓存文件路径
        if (!this.fs.existsSync(this.basePath)) {
            this.fs.mkdirSync(this.basePath);
        }

        var versions = this.initAllVersions(this.basePath);
        this.legacyVersionPath = versions.legacy;
        this.currentVersionPath = versions.current;
        this.temporaryVersionPath = versions.temporary;
    },

    /**
     *  版本信息文件名
     *
     *  @property infoFileName
     */
    infoFileName: 'info',

    /**
     *  缓存文件版本 - old
     *
     *  @property versionLegacy
     */
    versionLegacy: 'fc_version_bg',

    /**
     *  缓存文件版本 - current
     *
     *  @property versionCurrent
     */
    versionCurrent: 'fc_version_c',

    /**
     *  缓存文件版本 - temporary
     *
     *  @property versionTemporary
     */
    versionTemporary: 'fc_version_t',

    /**
     *  初始化文件缓存版本
     *
     * @param {string} basePath 文件缓存基础路径
     * @return {Object} 包含各版本库路径
     **/
    initAllVersions: function (basePath) {
        var bgPath = this.path.join(basePath, this.versionLegacy);
        var newPath = this.path.join(basePath, this.versionCurrent);
        var temPath = this.path.join(basePath, this.versionTemporary);
        // 初始化缓存版本路径
        if (!this.fs.existsSync(bgPath)) {
            this.fs.mkdirSync(bgPath);
        }
        if (!this.fs.existsSync(newPath)) {
            this.fs.mkdirSync(newPath);
        }
        return {
            legacy: bgPath,
            current: newPath,
            temporary: temPath

        };
    },

    /**
     *  设置版本信息，可以设置全部属性-对象，单个属性-key:value，或者不设置-只返回属性信息
     *
     * @param {string} versionPath 缓存版本路径
     * @param {string | Object=} key 属性key；属性对象
     * @param {*=} value 弱传入该参数，则为参数1对应属性值
     * @return {Object} 版本信息对象
     **/
    versionInfo: function (versionPath, key, value) {
        if (!this.fs.existsSync(versionPath)) {
            // 版本不存在时返回null
            return null;
        }

        // 参数处理
        var info;
        if (typeof value === 'undefined') {
            info = key;
        }

        // 版本信息文件路径
        var infoFilePath = this.path.join(versionPath, this.infoFileName);

        if (!info) {
            // 原版本信息存在且非设置全部属性时，读取原版本信息
            if (this.fs.existsSync(infoFilePath)) {
                var data = this.fs.readFileSync(infoFilePath, {
                    encoding: null,
                    flag: 'r'

                });
                info = this.dataFormat.json.get(data);
            }
            else {
                info = {};
            }
        }

        // 设置单个属性
        if (typeof value === 'string' && typeof value !== 'undefined') {
            info[key] = value;
        }
        // 生成/更新版本信息时
        if (arguments.length > 1) {
            // 没有新设置内容时避免操作文件
            var infoData = this.dataFormat.json.set(info);
            this.fs.writeFileSync(infoFilePath, infoData, {
                encoding: 'utf8',
                mode: parseInt('0666', 8),
                flag: 'w'

            });
        }
        return info;
    },

    /**
     *  切换新旧版本
     *
     * @param {string=} legacy 旧版本路径
     * @param {string=} current 新版本路径
     * @param {string=} temporary 中间状态路径名
     * @return {boolean} 是否操作成功
     **/
    switchVersion: function (legacy, current, temporary) {
        legacy = legacy || this.legacyVersionPath;
        current = current || this.currentVersionPath;
        temporary = temporary || this.temporaryVersionPath;

        this.fs.renameSync(legacy, temporary);
        this.fs.renameSync(current, legacy);
        this.fs.renameSync(temporary, current);
        return true;
    },

    /**
     *  merge新旧版本可用缓存列表
     *
     * @param {string=} legacy 旧版本路径
     * @param {string=} current 新版本路径
     * @return {Array} 可用缓存列表
     **/
    availableCacheList: function (legacy, current) {
        legacy = legacy || this.legacyVersionPath;
        current = current || this.currentVersionPath;
        // 旧版本信息
        var legacyInfo = this.versionInfo(legacy);
        // 新版本信息
        var currentInfo = this.versionInfo(current);

        var cList = [];
        // 遍历新版本缓存文件信息
        for (var key in currentInfo) {
            if (key === 'checkTime') {
                // 属性checkTime是唯一版本全局属性
                continue;
            }

            if (key && currentInfo.hasOwnProperty(key)) {
                // fileInfo为缓存文件信息，包含updateTime、status两个属性
                var fileInfo = currentInfo[key];
                var oldFileInfo = legacyInfo[key];
                // 缓存文件不可用或内容较旧时使用另一版本中缓存文件
                if (!fileInfo.status
                    || (oldFileInfo && oldFileInfo.updateTime && fileInfo.updateTime < oldFileInfo.updateTime)) {
                    if (oldFileInfo.status) {
                        cList.push({
                            key: key,
                            updateTime: oldFileInfo.updateTime,
                            version: legacy

                        });
                    }
                }
                else {
                    cList.push({
                        key: key,
                        updateTime: fileInfo.updateTime,
                        version: current

                    });
                }
            }
        }
        return cList;
    },

    /**
     *  更新文件缓存，对更新内容检查新旧版本对应文件状态是否可用
     *
     * @param {Array.<Object>} cacheContent 待缓存完整数据（数组），对比文件缓存，更新增量
     * @param {string} cacheContent.key 内容key
     * @param {string | Buffer | JSON} cacheContent.value 待缓存内容
     * @param {Date} cacheContent.updateTime 待缓存内容更新时间
     * @param {string=} cacheContent.format 缓存格式
     * @param {Function=} cacheContent.conversion 缓存格式转换函数（JSON格式时有效）
     * @param {Date} checkTime 更新操作基于的检查时间
     * @param {Function} callback 更新完成回调函数
     * @param {string=} legacy 旧版本路径
     * @param {string=} current 新版本路径
     **/
    updateCache: function (cacheContent, checkTime, callback, legacy, current) {
        // 缓存文件状态都为可用或都为不可用时更新旧版本文件缓存
        // 新旧版本只有其一为可用时更新不可用版本
        // 不存在时更新旧版本
        legacy = legacy || this.legacyVersionPath;
        current = current || this.currentVersionPath;
        // 旧版本信息
        var legacyInfo = this.versionInfo(legacy);
        // 新版本信息
        var currentInfo = this.versionInfo(current);
        var cInfo;

        var setCache = function (data) {
            if (data && data.err) {
                oojs.log.error(data.err);
            }
        };
        var eventGroup = [];
        var ev = oojs.create(oojs.event);
        // 遍历待缓存数据
        for (var i = 0, length = cacheContent.length; i < length; i++) {
            var eventName = 'cached' + i;
            ev.bind(eventName, setCache);

            var content = cacheContent[i];

            // 待缓存数据包含以下内容
            var key = content.key;
            var value = content.value;
            var updateTime = content.updateTime;
            var format = content.format;
            var conversion = content.conversion;

            var lStatus = legacyInfo[key] && legacyInfo[key].status;
            var cStatus = currentInfo[key] && currentInfo[key].status;
            if (lStatus && !cStatus) {
                // 更新新版本
                this.set(current, key, value,
                    this.updateVersionInfo.proxy(this, ev, eventName, currentInfo, key, updateTime),
                    format, conversion);
                // 需要更新新版本信息时才覆盖原信息文件，减少文件操作次数
                cInfo = currentInfo;
            }
            else {
                // 更新旧版本
                this.set(legacy, key, value,
                    this.updateVersionInfo.proxy(this, ev, eventName, legacyInfo, key, updateTime),
                    format, conversion);
            }
            eventGroup.push(eventName);
        }

        // 合并更新文件缓存事件
        var versionInfoOption = {
            legacy: legacy,
            current: current,
            lInfo: legacyInfo,
            cInfo: cInfo
        };
        // 有内容更新时更新版本信息，否则触发操作完成回调
        if (eventGroup.length) {
            ev.group('update-cache', eventGroup, (function (data, checkTime, callback, option) {
                // 更新版本check时间
                option.lInfo.checkTime = +checkTime;
                this.versionInfo(option.legacy, option.lInfo);
                if (option.cInfo) {
                    // 需要更新新版本信息时才覆盖原信息文件，减少文件操作次数
                    this.versionInfo(option.current, option.cInfo);
                }
                // 完成版本更新，切换新旧版本
                this.switchVersion();
                // 执行更新完成回调函数
                callback();
            }).proxy(this, checkTime, callback, versionInfoOption));
        }
        else {
            callback();
        }
    },

    /**
     *  更新文件缓存版本信息
     *
     * @param {Error=} err 操作异常信息
     * @param {oojs.event} ev 操作所属事件
     * @param {string} eventName 操作触发完成事件名
     * @param {Object} versionInfo 版本信息对象引用
     * @param {string} key 缓存文件key
     * @param {Date} updateTime 缓存内容更新时间
     **/
    updateVersionInfo: function (err, ev, eventName, versionInfo, key, updateTime) {
        // 修改版本信息
        versionInfo[key] = {
            status: !err,
            updateTime: +updateTime

        };
        // 更新完成，触发事件完成
        ev.emit(eventName, {
            err: err

        });
    },

    /**
     *  从缓存文件中获取内容
     *
     * @param {string} versionPath 缓存版本路径
     * @param {string} key 缓存文件key
     * @param {Function} callback 获取完成回调函数
     * @param {string} format 缓存文件的内容格式
     * @param {Function} conversion 格式转换函数
     **/
    get: function (versionPath, key, callback, format, conversion) {
        // 格式转换函数conversion只在json格式时有效
        if (!format || !this.dataFormat[format.toLowerCase()]) {
            format = 'buffer';
        }
        callback = callback || function () {};

        key = this.path.join(versionPath, this.filePre + key);
        var formatGet = this.dataFormat[format.toLowerCase()].get;
        if (this.fs.existsSync(key)) {
            this.fs.readFile(key, {
                encoding: null,
                flag: 'r'

            }, function () {
                var arr = Array.prototype.slice.call(arguments);
                arr[1] = formatGet(arr[1], conversion);
                callback.apply(null, arr);
            });
        }
    },

    /**
     *  设置缓存文件内容
     *
     * @param {string} versionPath 缓存版本路径
     * @param {string} key 缓存文件key
     * @param {string | Buffer | JSON} value 需要设置的缓存内容
     * @param {Function} callback 完成设置回调函数
     * @param {string} format 缓存文件的内容格式
     * @param {Function} conversion 格式转换函数
     **/
    set: function (versionPath, key, value, callback, format, conversion) {
        // 格式转换函数conversion只在json格式时有效
        if (!format || !this.dataFormat[format.toLowerCase()]) {
            format = 'buffer';
        }
        callback = callback || function () {};

        key = this.path.join(versionPath, this.filePre + key);
        var data = this.dataFormat[format.toLowerCase()].set(value, conversion);
        this.fs.writeFile(key, data, {
            encoding: 'utf8',
            mode: parseInt('0666', 8),
            flag: 'w'

        }, callback);
    },

    /**
     *  去除对应缓存文件
     *
     * @param {string} key 缓存文件key
     * @param {string} versionPath 缓存版本路径
     **/
    removeSync: function (key, versionPath) {
        key = this.path.join(versionPath, this.filePre + key);
        this.fs.unlinkSync(key);
    },

    /**
     *  当前版本是否过期
     *
     * @param {Date=} checkTime 是否过期check时间
     * @param {string=} current 当前版本路径
     * @param {number=} expiredTime 过期时间
     * @return {boolean} 该版本是否过期
     **/
    isExpired: function (checkTime, current, expiredTime) {
        checkTime = checkTime || new Date();
        current = current || this.currentVersionPath;
        expiredTime = expiredTime || this.expiredTime;
        var result = true;

        var info = this.versionInfo(current);
        if (info.checkTime) {
            result = (checkTime - info.checkTime) >= expiredTime;
        }
        return result;
    },

    /**
     *  版本最新check时间
     *
     * @param {string=} version 版本路径，默认返回当前版本check时间
     * @return {Date | null} 最新check时间，不存在时返回null
     **/
    lastCheckTime: function (version) {
        version = version || this.currentVersionPath;
        var info = this.versionInfo(version);
        return info.checkTime ? (new Date()).setTime(info.checkTime) : null;
    }

});
