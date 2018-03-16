/**
 * @file 支持多进程模型的日志模块
 * @author zhangziqiu(zhangziqiu@baidu.com)
 *         sunshanghai(shanghai_sun@qq.com)
 */

/* global oojs */
/* eslint-disable no-console */

oojs.define({
    name: 'Log',
    namespace: 'Demo.Common.Utility',
    deps: {
        fs: require('fs'),
        path: require('path')
    },

    /**
     *配置项
     */
    config: {
        // 客户进程向主进程发送日志消息的时间间隔, 单位ms
        clientTimeSpan: 1000,
        // 主进程写文件的时间间隔, 单位ms
        masterTimeSpan: 1000,
        // 每个多少分钟切割文件, 单位分钟. 只能是0-60之间的并且能被60整除的数字.
        fileTimeSpan: 15,
        // 日志目录
        filePath: './logs/',
        // info和notice级别日志记录的文件名
        accessFileName: 'accesslog',
        // error和fatal级别的日志记录的文件名
        fatalFileName: 'errorlog',
        // 日志级别
        level: 'info',
        // 模式, 客户端模式为'client', 主进程模式为'master'
        mode: 'client'
    },

    /**
     * 日志级别枚举值
     */
    levelEnum: {
        info: 400,
        notice: 300,
        error: 200,
        fatal: 100
    },

    /**
     * 动态构造函数
     *
     * @param {Object} config 参数对象. 参见 this.config属性
     */
    Log: function (config) {
        // 传入了配置项, 进行配置项合并
        if (config) {
            var keys = Object.keys(config);
            for (var i = 0, count = keys.length; i < count; i++) {
                this.config[keys[i]] = config[keys[i]];
            }
        }
        // 对于日志文件文件夹需要预处理
        this.config.filePath = this.path.resolve(this.config.filePath) + '/';
        this.currentAccessFilePath = this.config.filePath + this.config.accessFileName;
        this.currentFatalFilePath = this.config.filePath + this.config.fatalFileName;

        // 处理level, 将字符串转换成数字
        this.config.level = this.levelEnum[this.config.level] || this.levelEnum.info;
        // 初始化日志数组
        this.accessLog = [];
        this.errorLog = [];
        this.fatalLog = [];
        // 启动
        if (this.config.mode === 'master') {
            // master模式
            this.masterOnStart();
        }
        else {
            // client模式
            this.clientOnStart();
        }
    },

    /**
     * 将数字以两位数字的形式表示, 小于10的数字前面补0
     *
     * @param {number} num 数字
     * @return {string} 两位数字的字符串, 比如'01','13'
     */
    fixTwoBit: function (num) {
        if (num < 10) {
            return '0' + num;
        }
        return num.toString();
    },

    /**
     * 将字符串或对象转化为字符串
     *
     * @param {string|Object} msg 带转换的字符串或者对象
     * @return {string} 转换后的字符串
     */
    getObjString: function (msg) {
        var result = '';
        if (typeof msg === 'object') {
            result = JSON.stringify(msg).replace(/\\n/gi, '');
        }
        else {
            result = msg;
        }
        return result;
    },

    /**
     * 将异常对象转化为字符串
     *
     * @param {Object} error 异常对象
     * @return {string} 转换后的字符串
     */
    getErrorString: function (error) {
        if (error && error.message && error.stack) {
            return error.message + '\n' + error.stack;
        }
    },

    /**
     * 获取当前时间的时间字符串
     *
     * @return {string} 时间字符串, 比如"2015-12-31 23:59:59: "
     */
    getCurrentDateString: function () {
        var d = new Date();
        var result = '' + this.fixTwoBit(d.getMonth() + 1) + '-'
            + this.fixTwoBit(d.getDate()) + ' '
            + this.fixTwoBit(d.getHours()) + ':'
            + this.fixTwoBit(d.getMinutes()) + ':'
            + this.fixTwoBit(d.getSeconds()) + ': ';
        return result;
    },

    /**
     * 最后一次文件时间戳, 默认为空字符串
     */
    lastFileTimeStamp: '',

    /**
     * 执行日志文件的相关操作
     */
    rollingFile: function () {
        // 获取当前时间戳
        var currentTime = new Date();
        var currentFileTimeStamp = '' + currentTime.getFullYear()
            + this.fixTwoBit(currentTime.getMonth() + 1)
            + this.fixTwoBit(currentTime.getDate())
            + this.fixTwoBit(currentTime.getHours());

        // 每隔 this.config.fileTimeSpan 分钟切割日志
        var currentMinute = currentTime.getMinutes();
        var fileTimeSpan = this.config.fileTimeSpan;
        currentMinute = this.fixTwoBit(parseInt(currentMinute / fileTimeSpan, 10) * fileTimeSpan);
        currentFileTimeStamp = currentFileTimeStamp + currentMinute;

        // 时间戳检查
        if (this.lastFileTimeStamp && this.lastFileTimeStamp === currentFileTimeStamp) {
            return;
        }

        // 判断是否需要日志切分
        if (this.lastFileTimeStamp && this.lastFileTimeStamp !== currentFileTimeStamp) {
            // 关闭当前句柄
            try {
                if (this.accessStream) {
                    this.accessStream.end();
                }
                if (this.fatalStream) {
                    this.fatalStream.end();
                }
            }
            catch (ex) {
            }
            // 重命名文件
            if (this.fs.existsSync(this.currentAccessFilePath)) {
                this.fs.renameSync(this.currentAccessFilePath, this.currentAccessFilePath + '.' + currentFileTimeStamp);
            }
            if (this.fs.existsSync(this.currentFatalFilePath)) {
                this.fs.renameSync(this.currentFatalFilePath, this.currentFatalFilePath + '.' + currentFileTimeStamp);
            }
        }

        // 创建句柄
        this.accessStream = this.fs.createWriteStream(this.currentAccessFilePath, {
            flags: 'a',
            encoding: 'utf8',
            mode: parseInt('0666', 8)

        });
        this.fatalStream = this.fs.createWriteStream(this.currentFatalFilePath, {
            flags: 'a',
            encoding: 'utf8',
            mode: parseInt('0666', 8)

        });
        this.lastFileTimeStamp = currentFileTimeStamp;
    },

    /**
     * 主进程模式中, 需要调用此函数添加待监控的工作进程.
     *
     * @param {Object} worker 工作进程
     */
    addWorker: function (worker) {
        worker.on('message', this.masterOnMessage.proxy(this));
    },

    /**
     * 主进程模式-启动函数.
     */
    masterOnStart: function () {
        // master模式下需要需要写入文件, 如果日志文件夹不存在则需要创建
        if (!this.fs.existsSync(this.config.filePath)) {
            this.fs.mkdirSync(this.config.filePath);
        }
        // 执行文件操作
        this.rollingFile();
        // 开始监控
        setInterval(this.masterOnWatch.proxy(this), this.config.masterTimeSpan);
    },

    /**
     * 主进程模式-定时函数, 每次执行时执行文件切割和日志文件写入.
     */
    masterOnWatch: function () {
        this.rollingFile();
        if (this.accessLog && this.accessLog.length) {
            this.accessStream.write(this.accessLog.join('\n') + '\n');
            this.accessLog = [];
        }
        if (this.errorLog && this.errorLog.length) {
            this.fatalStream.write(this.errorLog.join('\n') + '\n');
            this.errorLog = [];
        }

        if (this.fatalLog && this.fatalLog.length) {
            this.fatalStream.write(this.fatalLog.join('\n') + '\n');
            this.fatalLog = [];
        }
    },

    /**
     * 主进程模式-收到消息时的处理
     *
     * @param {Object} message 收到的worker进程发送来的消息
     * @param {string} message.action 消息字符串. 日志模块使用'log'
     * @param {string|Object} message.accessLog info级别的日志
     * @param {string|Object} message.errorLog error级别的日志
     * @param {string|Object} message.fatalLog fatal级别的日志
     */
    masterOnMessage: function (message) {
        if (message && message.action && message.action === 'log') {
            if (message.accessLog && message.accessLog.length) {
                this.accessLog = this.accessLog.concat(message.accessLog);
            }
            if (message.errorLog && message.errorLog.length) {
                this.errorLog = this.errorLog.concat(message.errorLog);
            }
            if (message.fatalLog && message.fatalLog.length) {
                this.fatalLog = this.fatalLog.concat(message.fatalLog);
            }
        }
    },

    /**
     * 客户端模式-启动函数
     */
    clientOnStart: function () {
        setInterval(this.clientOnWatch.proxy(this), this.config.clientTimeSpan);
    },

    /**
     * 客户端模式-定时函数, 每次执行时将已经记录的日志发送给主进程
     */
    clientOnWatch: function () {
        var msg = {
            action: 'log'

        };
        msg.accessLog = this.accessLog;
        msg.errorLog = this.errorLog;
        msg.fatalLog = this.fatalLog;
        this.accessLog = [];
        this.errorLog = [];
        this.fatalLog = [];
        process.send(msg);
    },

    /**
     * info级别日志
     *
     * @param {string|Object} msg 日志消息对象或字符串
     */
    info: function (msg) {
        if (msg && this.config.level >= this.levelEnum.info) {
            var messageString = this.getObjString(msg);
            messageString = 'NOTICE: ' + this.getCurrentDateString() + ' ' + messageString;
            this.accessLog.push(messageString);
        }
    },

    /**
     * notice级别日志
     *
     * @param {string|Object} msg 日志消息对象或字符串
     */
    notice: function (msg) {
        if (msg && this.config.level >= this.levelEnum.notice) {
            var messageString = this.getObjString(msg);
            messageString = 'NOTICE: ' + this.getCurrentDateString() + ' ' + messageString;
            this.accessLog.push(messageString);
            console.log(messageString);
        }
    },

    /**
     * error级别日志
     *
     * @param {string|Object} msg 日志消息对象或字符串
     * @param {Object} error 异常对象
     */
    error: function (msg, error) {
        if (msg && this.config.level >= this.levelEnum.error) {
            var messageString = this.getObjString(msg);
            if (error) {
                messageString = messageString + '\n' + this.getErrorString(error);
            }
            messageString = 'WARNING: ' + this.getCurrentDateString() + ' ' + messageString;
            this.errorLog.push(messageString);
        }
    },

    /**
     * fatal级别日志
     *
     * @param {string|Object} msg 日志消息对象或字符串
     * @param {Object} error 异常对象
     */
    fatal: function (msg, error) {
        if (msg && this.config.level >= this.levelEnum.fatal) {
            var messageString = this.getObjString(msg);
            if (error) {
                messageString = messageString + '\n' + this.getErrorString(error);
            }
            messageString = 'FATAL: ' + this.getCurrentDateString() + ' ' + messageString;
            this.fatalLog.push(messageString);
            console.log(messageString);
        }
    }

});
