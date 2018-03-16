/**
 * @file 性能检测模块
 * @author zhangziqiu@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'performanceMoniter',
    namespace: 'rs.common.utility',
    deps: {
        fs: require('fs'),
        path: require('path'),
        styleType: 'rs.common.model.styleType'

    },
    // 写日志的时间间隔.
    writeTime: 5000,
    // 默认值
    defaultValue: {
        // 统计项的默认值
        item: {
            name: '',
            count: 0,
            time: 0,
            avg: 0,
            size: 0

        },
        // 日志项的默认值
        log: {
            account: {},
            template: {}

        }

    },

    /**
     * 动态构造函数
     * @param {Object} config 参数对象.
     * @param {string} config.mode 日志模式.分为客户端'client'和服务器端'master'.
     * @param {string} config.filePath 日志文件路径
     */
    performanceMoniter: function (config) {
        config = config || {};
        this.mode = config.mode || 'client';
        this.filePath = this.path.resolve(config.filePath || './logs/performance.txt');
        this.accessLog = oojs.fastClone(this.defaultValue.log);
        this.accessLogArray = [];
        this.writeLogPercent = parseInt(100000 / this.writeTime, 10);
        if (this.mode === 'master') {
            // master模式
            this.masterOnStart();
        }
        else {
            // client模式
            this.clientOnStart();
        }
    },

    /**
     * 主进程启动函数
     */
    masterOnStart: function () {
        setInterval(this.masterOnWatch.proxy(this), this.writeTime);
    },

    /**
     * 主进程定时执行的函数
     */
    masterOnWatch: function () {
        var account = {};
        var accountArray = [];
        var template = {};
        var templateArray = [];
        var key;

        if (this.accessLogArray && this.accessLogArray.length) {
            for (var i = 0, count = this.accessLogArray.length; i < count; i++) {
                var accountItem = this.accessLogArray[i].account;
                var templateItem = this.accessLogArray[i].template;
                for (key in accountItem) {
                    if (key && accountItem.hasOwnProperty(key)) {
                        account[key] = account[key] || oojs.fastClone(this.defaultValue.item);
                        account[key].count += accountItem[key].count;
                        account[key].time += accountItem[key].time;
                        account[key].size += accountItem[key].size;
                    }
                }
                for (key in templateItem) {
                    if (key && templateItem.hasOwnProperty(key)) {
                        template[key] = template[key] || oojs.fastClone(this.defaultValue.item);
                        template[key].count += templateItem[key].count;
                        template[key].time += templateItem[key].time;
                        template[key].size += templateItem[key].size;
                    }
                }
            }

            for (key in account) {
                if (key && account.hasOwnProperty(key)) {
                    account[key].name = key;
                    account[key].avg = (account[key].time / account[key].count).toFixed(2);
                    account[key].sizeAvg = (account[key].size / account[key].count).toFixed(2);
                    accountArray.push(account[key]);
                }
            }

            for (key in template) {
                if (key && template.hasOwnProperty(key)) {
                    template[key].name = key;
                    template[key].avg = (template[key].time / template[key].count).toFixed(2);
                    template[key].sizeAvg = (template[key].size / template[key].count).toFixed(2);
                    templateArray.push(template[key]);
                }
            }

            // 对template排序
            var sortedArray = templateArray.sort(function (a, b) {
                if (a.avg < b.avg) {
                    return 1;
                }
                else if (a.avg > b.avg) {
                    return -1;
                }

                return 0;
            });

            // 写入结果
            var result = '模板名称' + '\t'
                    + '每秒请求数' + '\t'
                    + '平均响应时间' + '\t'
                    + '平均大小'
                    + '\n';
            var resultArray = accountArray.concat(sortedArray);
            for (var j = 0, jcount = resultArray.length; j < jcount; j++) {
                var tempResultItem = resultArray[j];
                result += tempResultItem.name + '\t'
                    + tempResultItem.count + '\t'
                    + tempResultItem.avg + '\t'
                    + tempResultItem.sizeAvg
                    + '\n';
            }
            this.fs.writeFile(this.filePath, result, function () {
            });
            this.accessLogArray = [];
        }
    },

    /**
     * 主进程收到进程消息时的事件处理函数
     * @param {Object} message 消息对象
     */
    masterOnMessage: function (message) {
        if (message.accessLog) {
            this.accessLogArray.push(message.accessLog);
        }
    },

    /**
     * 子进程启动函数
     */
    clientOnStart: function () {
        setInterval(this.clientOnWatch.proxy(this), this.writeTime);
    },

    /**
     * 子进程监控函数
     */
    clientOnWatch: function () {
        var msg = {
            action: 'performance'

        };
        if (this.accessLog) {
            msg.accessLog = this.accessLog;
        }
        this.accessLog = {
            account: {},
            template: {}
        };
        process.send(msg);
    },

    /**
     * 性能日志记录函数
     * @param {string} account 调用服务的账号
     * @param {number} styleType 调用服务的StyleType
     * @param {number} time 当次执行时间
     * @param {number} size 模板字节大小
     */
    info: function (account, styleType, time, size) {
        var randomNum = parseInt(Math.random() * 100, 10);
        if (randomNum > this.writeLogPercent) {
            return;
        }
        var styleTypeKey = styleType < 10000 ? this.styleType.get(styleType) : styleType;
        var accountKey = account;

        // 分模板统计
        size = size / 1000;
        this.accessLog.template[styleTypeKey] = this.accessLog.template[styleTypeKey]
            || oojs.fastClone(this.defaultValue.item);
        var templateItem = this.accessLog.template[styleTypeKey];
        templateItem.name = styleTypeKey;
        templateItem.count++;
        templateItem.time = templateItem.time + time;
        templateItem.size = templateItem.size + size;
        // 分account统计
        this.accessLog.account[accountKey] = this.accessLog.account[accountKey]
            || oojs.fastClone(this.defaultValue.item);
        var accountItem = this.accessLog.account[accountKey];
        accountItem.name = accountKey;
        accountItem.count++;
        accountItem.time = accountItem.time + time;
        accountItem.size = accountItem.size + size;
    }

});
