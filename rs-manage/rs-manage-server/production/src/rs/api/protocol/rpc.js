/**
 * @file RPC协议层实现
 * @author zhangziqiu@baidu.com
 */
/* global oojs */
/* eslint-disable max-len */
require('node-oojs');

oojs.define({
    name: 'rpc',
    namespace: 'rs.api.protocol',
    deps: {
        pb: 'rs.common.model.protobuf',
        log: 'rs.common.utility.log',
        config: 'rs.common.config.global',
        nsHead: 'rs.common.model.nsHead',
        renderService: 'rs.api.service.renderService',
        templateService: 'rs.api.service.templateService',
        webpCompressService: 'rs.api.service.webpCompressService',
        utility: require('node-oojs-utility'),
        snappy: require('snappyjs'),
        converter: 'rs.common.model.converter',
        renderRequest: 'rs.common.model.renderRequest',
        renderResponse: 'rs.common.model.renderResponse',
        searchRequest: 'rs.common.model.searchRequest',
        searchResponse: 'rs.common.model.searchResponse',
        insertUpdateRequest: 'rs.common.model.insertUpdateRequest',
        insertUpdateResponse: 'rs.common.model.insertUpdateResponse',
        deleteRequest: 'rs.common.model.deleteRequest',
        deleteResponse: 'rs.common.model.deleteResponse',
        webpCompressRequest: 'rs.common.model.webpCompressRequest',
        webpCompressResponse: 'rs.common.model.webpCompressResponse',
        performanceMoniter: 'rs.common.utility.performanceMoniter',
        templateCache: 'rs.business.templateCache',
        StyleService: 'TemplateServer.Service.Style',
        ModelConverter: 'TemplateServer.Common.Model.Converter',
        TemplateRenderService: 'TemplateServer.Service.Template',
        SearchStyleRequestInfo: 'TemplateServer.Common.Model.SearchStyleRequestInfo',
        SearchStyleResponseInfo: 'TemplateServer.Common.Model.SearchStyleResponseInfo',
        SearchCreativeRequestInfo: 'TemplateServer.Common.Model.SearchCreativeRequestInfo',
        SearchCreativeResponseInfo: 'TemplateServer.Common.Model.SearchCreativeResponseInfo',
        RenderService: 'TemplateServer.Service.Render',
        renderRequestInfo: 'TemplateServer.Common.Model.RenderRequestInfo',
        renderResponseInfo: 'TemplateServer.Common.Model.RenderResponseInfo',
        SdlService: 'TemplateServer.Service.Sdl',
        SearchSdlRequestInfo: 'TemplateServer.Common.Model.SearchSdlRequestInfo',
        SearchSdlResponseInfo: 'TemplateServer.Common.Model.SearchSdlResponseInfo',
        CacheManager: 'TemplateServer.Business.CacheManager'
    },

    /**
     * 静态构造函数
     */
    $rpc: function () {
        // 创建全局日志对象
        oojs.log = oojs.create(this.log, this.config.log);
        oojs.perf = oojs.create(this.performanceMoniter);
        // 启动时从文件中加载模板到内存cache
        this.templateCache.setCacheFromFile();
        this.CacheManager.loadCache();

        // 启动服务
        process.on('message', this.processOnMessage.proxy(this));
        // 异常处理
        process.on('uncaughtException', this.processOnError.proxy(this));
        // 通知master进程启动成功
        process.send({action: 'workerOnStart', pid: process.pid});
        // 开启数据库监控, 定期更新文件缓存
        if (this.config.cache.startFileMonitor) {
            this.templateCache.startFileMonitor();
        }
        this.CacheManager.startMonitor();
    },

    /**
     * socket接收数据事件处理函数
     *
     * @param {Buffer} data 本次接收到的数据对象buffer
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnData: function (data, socket) {
        try {
            this.nsHead.multiPackageProcess({
                data: data,
                socket: socket,
                processFunction: this.processOnePackage.proxy(this)

            });
        }
        catch (err) {
            this.socketOnError(err, socket);
        }
    },

    /**
     * socket结束事件处理函数
     *
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnEnd: function (socket) {
        if (socket) {
            socket.preBuffer = null;
            // socket.end();
            socket = null;
        }
    },

    /**
     * socket 关闭事件处理函数
     *
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnClose: function (socket) {
        if (socket) {
            socket.preBuffer = null;
            oojs.log.info('SOCKET CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
            socket = null;
        }
    },

    /**
     * socket超时事件处理函数
     *
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnTimeout: function (socket) {
        if (socket) {
            socket.preBuffer = null;
            oojs.log.info('SOCKET TIMEOUT: ' + socket.remoteAddress + ' ' + socket.remotePort);
            // socket.destroy();
            // socket.end();
            socket = null;
        }
    },

    /**
     * socket异常事件处理函数
     *
     * @param {Error} err 异常对象
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnError: function (err, socket) {
        if (err && err.code && err.code.toUpperCase() === 'ECONNRESET') {
        }
        else {
            if (socket) {
                oojs.log.error('socketOnError-Address ' + socket.remoteAddress + ' ' + socket.remotePort);
            }
            oojs.log.error('socketOnError ', err);

        }
        if (socket) {
            socket.preBuffer = null;
            socket.destroy && socket.destroy();
            socket = null;
        }
    },

    /**
     * 进程message事件处理函数
     *
     * @param {string} message 消息字符串
     * @param {net.Socket} socket 本次连接的socket对象
     */
    processOnMessage: function (message, socket) {
        if (message === 'socket' && socket && socket.writable) {
            // 处理socket请求
            socket.setTimeout(this.config.server.socketTimeout);
            socket.on('data', this.socketOnData.proxy(this, socket));
            socket.on('end', this.socketOnEnd.proxy(this, socket));
            socket.on('close', this.socketOnClose.proxy(this, socket));
            socket.on('timeout', this.socketOnTimeout.proxy(this, socket));
            socket.on('error', this.socketOnError.proxy(this, socket));
            /**
             * https://nodejs.org/dist/latest-v6.x/docs/api/net.html#net_net_createserver_options_connectionlistener
             * 在创建 server 时将 pauseOnConnect 选项设置为 true，当 socket 在进程间传递时，被暂停掉了
             * 此处恢复 socket 运行
             */
            socket.resume();
        }
        else if (message === 'database-monitor') {
            // 监控数据库, 写入文件缓存
            this.templateCache.setFileFromDatabase();
            this.templateCache.startDatabaseMonitor();
        }
    },

    /**
     * 工作进程出现未捕获异常时的处理
     *
     * @param {Error} err 异常对象
     */
    processOnError: function (err) {
        // 记录错误日志
        oojs.log.error('processOnError ', err);

        if (err && err.message && err.message.toLowerCase().indexOf('channel') > -1) {
            // 通知master, 停止接受新的请求
            process.send({
                action: 'suicide'
            });
            // 2秒钟后关闭进程
            setTimeout(function () {
                process.exit(1);
            }, 2000);
        }

        return;

        /*
         // 通知master, 停止接受新的请求
         process.send({
         action: 'suicide'
         });
         // 10秒钟后关闭进程
         setTimeout(function () {
         process.exit(1);
         }, 10000);
         return;
         */
    },

    /**
     * 处理单次请求
     *
     * @param {Object} option 参数mapping对象
     * @param {Object} option.nsHead 本次请求的nsHead对象
     * @param {Object} option.bodyBuffer 除去nsHead的body部分buffer
     * @param {Object} option.socket 本次请求的socket对象
     * @return {boolean} 处理成功返回true
     */
    processOnePackage: function (option) {
        var nsHead = option.nsHead;
        var bodyBuffer = option.bodyBuffer;
        var socket = option.socket;

        if (!socket || !socket.writable) {
            return true;
        }

        var context = {};
        context.socket = socket;
        context.snappy = nsHead.snappy;
        context.startTime = (new Date()).getTime();
        context.methodId = nsHead.methodId;
        if (nsHead.snappy) {
            bodyBuffer = this.snappy.uncompress(bodyBuffer);
        }
        switch (nsHead.methodId) {
            case 0:
                // 模版渲染接口
                try {
                    context.requestInfo = this.pb.TemplateRequestInfo.decode(bodyBuffer);
                    context.log = this.renderService.log || [];
                    this.renderService.getTemplate(context, this.onGetTemplateFinished.proxy(this, context));
                }
                catch (ex) {
                    // 出现异常后, 不再终止socket, 改为返回错误代码
                    this.onGetTemplateError(ex, context);
                }
                break;
            case 1:
                // 模板(平台)渲染接口
                context.requestInfo = this.converter.decodePbItem(this.renderRequest, bodyBuffer);
                context.log = this.renderService.styleLog || [];
                this.renderService.getStyle(context,
                    this.onRpcCallback.proxy(this, context, this.renderResponse));
                break;
            case 2:
            case 100:
                // 模板查询接口
                context.requestInfo = this.converter.decodePbItem(this.searchRequest, bodyBuffer);
                context.log = this.templateService.log || [];
                this.templateService.search(context.requestInfo,
                    this.onRpcCallback.proxy(this, context, this.searchResponse));
                break;
            case 3:
            case 101:
                // 模板添加或更新接口
                context.requestInfo = this.converter.decodePbItem(this.insertUpdateRequest, bodyBuffer);
                context.log = this.templateService.log || [];
                this.templateService.insertUpdate(context.requestInfo,
                    this.onRpcCallback.proxy(this, context, this.insertUpdateResponse));
                break;
            case 4:
            case 102:
                // 模板删除接口
                context.requestInfo = this.converter.decodePbItem(this.deleteRequest, bodyBuffer);
                context.log = this.templateService.log || [];
                this.templateService.delete(context.requestInfo,
                    this.onRpcCallback.proxy(this, context, this.deleteResponse));
                break;
            case 5:
            case 200:
                // 将JPG压缩为webp接口
                context.requestInfo = this.converter.decodePbItem(this.webpCompressRequest, bodyBuffer);
                context.log = this.webpCompressService.log || [];
                this.webpCompressService.convert2webp(context,
                    this.onRpcCallback.proxy(this, context, this.webpCompressResponse));
                break;
            case 6:
                // 样式模板查询接口
                context.requestInfo = this.ModelConverter.byteToProto(this.SearchStyleRequestInfo, bodyBuffer);
                context.log = this.StyleService.log || [];
                context.requestModel = this.SearchStyleRequestInfo;
                context.responseModel = this.SearchStyleResponseInfo;
                oojs.promise
                    .resolve(context.requestInfo)
                    .then(this.StyleService.searchStyle.proxy(this.StyleService))
                    .then(this.onCallback.proxy(this, context))
                    .catch(this.onRpcError.proxy(this, context));
                break;
            case 7:
                // 创意需求查询接口
                context.requestInfo = this.ModelConverter.byteToProto(this.SearchCreativeRequestInfo, bodyBuffer);
                context.log = this.StyleService.creativeLog || [];
                context.requestModel = this.SearchCreativeRequestInfo;
                context.responseModel = this.SearchCreativeResponseInfo;
                oojs.promise
                    .resolve(context.requestInfo)
                    .then(this.StyleService.searchCreative.proxy(this.StyleService))
                    .then(this.onCallback.proxy(this, context))
                    .catch(this.onRpcError.proxy(this, context));
                break;
            case 8:
                // 2016-模板渲染服务, MessageId=8
                context.requestInfo = this.ModelConverter.byteToProto(this.renderRequestInfo, bodyBuffer);
                context.requestModel = this.renderRequestInfo;
                context.responseModel = this.renderResponseInfo;
                context.log = this.RenderService.log || [];
                oojs.promise
                    .resolve(context.requestInfo)
                    .then(this.RenderService.renderByStyleId.proxy(this.RenderService))
                    .then(this.onCallback.proxy(this, context))
                    .catch(this.onRpcError.proxy(this, context));
                break;
            case 9:
                // 2016-SDL查询接口, MessageId=9
                context.requestInfo = this.ModelConverter.byteToProto(this.SearchSdlRequestInfo, bodyBuffer);
                context.log = this.SdlService.log || [];
                context.requestModel = this.SearchSdlRequestInfo;
                context.responseModel = this.SearchSdlResponseInfo;
                oojs.promise
                    .resolve(context.requestInfo)
                    .then(this.SdlService.search.proxy(this.SdlService))
                    .then(this.onCallback.proxy(this, context))
                    .catch(this.onRpcError.proxy(this, context));
                break;
            default:
                break;
        }
        return true;
    },

    onRpcError: function (err, result, context, meta) {
        try {
            if (err) {
                return this.socketOnError(err, context && context.socket);
            }

            return true;
        }
        catch (ex) {
            this.socketOnError(ex, context && context.socket);
        }
    },

    onRpcCallback: function (err, result, context, meta) {
        try {
            if (err) {
                return this.socketOnError(err, context && context.socket);
            }

            // 判断socket
            if (!result || !context.socket || !context.socket.writable) {
                return;
            }

            // 构造response buffer
            var responseInfo = this.converter.convertToPb({
                meta: meta,
                data: result

            });
            var responseBuffer = responseInfo.toBuffer();
            var nsHead = this.nsHead.writeNsHead({
                snappy: context.snappy,
                bodyLength: responseBuffer.length

            });
            var resultBuffer = Buffer.concat([
                nsHead,
                responseBuffer
            ]);


            // 日志部分
            context.responseInfo = responseInfo;
            var logContext = this.getContextLog(context);
            this.accessLog(logContext);
            this.performanceLog(logContext);

            // 返回数据
            if (context && context.socket && context.socket.writable) {
                context.socket.write(resultBuffer);
                context = null;
            }
            return true;
        }
        catch (ex) {
            this.socketOnError(ex, context && context.socket);
        }
    },

    /**
     * 新版本Callback方法
     *
     * @param {Object} result 需要返回的结果
     * @param {Object} context 本次请求的上下文
     * @param {Object} meta 不知做啥用的
     * @return {boolean} 处理成功返回true
     */
    onCallback: function (result, context, meta) {
        try {
            // 构造response buffer
            var responseInfo = this.ModelConverter.objToProto(context.responseModel, result);
            var responseBuffer = responseInfo.toBuffer();
            var nsHead = this.nsHead.writeNsHead({
                snappy: context.snappy,
                bodyLength: responseBuffer.length

            });
            var resultBuffer = Buffer.concat([
                nsHead,
                responseBuffer
            ]);
            // 日志部分
            context.responseInfo = responseInfo;
            var logContext = this.getContextLog(context);
            this.accessLog(logContext);
            this.performanceLog(logContext);

            // 返回数据
            if (context && context.socket && context.socket.writable) {
                context.socket.write(resultBuffer);
                context = null;
            }

            return true;
        }
        catch (ex) {
            this.socketOnError(ex, context && context.socket);
        }
    },


    /**
     * 出错的异常处理
     *
     * @param {Object} err 异常对象
     * @param {Object} context 上下文对象
     * @return {boolean} 是否成功
     */
    onGetTemplateError: function (err, context) {
        oojs.log.error('onGetTemplateError', err);

        // 构造responseInfo
        var templateResponseInfo = new this.pb.TemplateResponseInfo();
        templateResponseInfo.searchId = '';
        templateResponseInfo.returnCode = 2;
        templateResponseInfo.error = err.message || 'unknow error';
        templateResponseInfo.htmlSnippet = '';
        context.responseInfo = templateResponseInfo;

        // 构造response buffer
        var responseBuffer = templateResponseInfo.toBuffer();
        if (context.snappy) {
            responseBuffer = this.snappy.compress(responseBuffer);
        }

        var nsHead = this.nsHead.writeNsHead({
            snappy: context.snappy,
            bodyLength: responseBuffer.length

        });
        var resultBuffer = Buffer.concat([
            nsHead,
            responseBuffer
        ]);

        // 返回数据
        if (context && context.socket) {
            if (context.socket.writable) {
                context.socket.write(resultBuffer);
            }
            context.socket.preBuffer = null;
            context.socket = null;
            context.requestInfo = null;
            context.responseInfo = null;
            context = null;
        }
        return true;
    },

    /**
     * 获取到模板数据后的事件处理函数
     *
     * @param {Error} err 异常对象
     * @param {string} result 返回的模板HTML字符串
     * @param {Object} context 本次连接的上下文对象
     * @return {boolean} 成功返回true
     */
    onGetTemplateFinished: function (err, result, context) {
        if (err) {
            // return this.socketOnError(err, context && context.socket);
            this.onGetTemplateError(err, context);
            return;
        }

        // 判断socket
        if (!context || !context.socket || !context.socket.writable) {
            return;
        }

        // 构造responseInfo
        var templateResponseInfo = new this.pb.TemplateResponseInfo();
        templateResponseInfo.searchId = context.requestInfo && context.requestInfo.searchId;
        templateResponseInfo.returnCode = 1;
        templateResponseInfo.error = null;
        templateResponseInfo.htmlSnippet = new Buffer(result);
        templateResponseInfo.expIds = context.expIdArray || [];
        context.responseInfo = templateResponseInfo;

        // 构造response buffer
        var responseBuffer = templateResponseInfo.toBuffer();
        if (context.snappy) {
            responseBuffer = this.snappy.compress(responseBuffer);
        }

        var nsHead = this.nsHead.writeNsHead({
            snappy: context.snappy,
            bodyLength: responseBuffer.length

        });
        var resultBuffer = Buffer.concat([
            nsHead,
            responseBuffer
        ]);

        // 日志部分
        var logContext = this.getContextLog(context);
        this.accessLog(logContext);
        this.performanceLog(logContext);

        // 返回数据
        if (context && context.socket && context.socket.writable) {
            context.socket.write(resultBuffer);
            context = null;
        }

        return true;
    },

    /**
     * 模板渲染性能日志
     *
     * @param {Object} logContext 本次连接的上下文对象
     * @return {boolean} 成功返回true
     */
    performanceLog: function (logContext) {
        logContext = logContext || {};
        var methodId = logContext.methodId;
        var styleType = logContext.styleType;
        if ((methodId === 8 || methodId === 0 || methodId === 1) && styleType) {
            oojs.perf.info(
                logContext.account,
                styleType,
                logContext.time,
                logContext.htmlSnippetLength
            );
        }
        return true;
    },

    /**
     * 接口 access log
     *
     * @param  {Object} logContext 本次连接的上下文对象
     * @return {boolean}           成功怎返回true
     */
    accessLog: function (logContext) {
        // 开始打 access 日志
        oojs.log.info(logContext || {info: 'no log info'});
        return true;
    },

    /**
     * 获取当前上下文字符串, 主要用于日志写入
     *
     * @param {Object} context 当前socket的上下文对象
     * @return {Object} 用于日志写入的Object
     */
    getContextLog: function (context) {

        var socket = context.socket;

        // log 需要的字段
        var result = {
            // cilent address
            clientAddress: socket.remoteAddress,
            // client port
            clientPort: socket.remotePort,
            // methodId
            methodId: context.methodId != null ? context.methodId : 'unknow',
            // account， 拆分到每个 context 中的 log 字段中
            account: '',
            // spend time
            time: (new Date()).getTime() - context.startTime,
            // response status code （为 1 时表示成功）
            resStatusCode: ''

            // 上面为必须字段，下面为不同接口的可选字段

            // // html snippet length (只有模板渲染接口需要)
            // htmlSnippetLength: 0,
            // // styleType(methodId 为 0 或 1) or styleId (methodId 为 7 或 8)
            // styleType: '',
            // // searchId (S值，内容为二进制)
            // searchId: '',
            // // requestId (请求id标示)
            // requestId: ''

        };

        var reqInfo = context.requestInfo || {};
        var resInfo = context.responseInfo || {};

        /**
         * 返回状态码处理 START
         */
        if (resInfo.returnCode != null) {
            // methodId 为 0 或 1 时
            result.resStatusCode = resInfo.returnCode;
        }
        else if (resInfo.status != null) {
            // methodId 为 2 或 3 或 4 或 5 时
            result.resStatusCode = resInfo.status;
            if (resInfo.status.statusCode != null) {
                // methodId 为 6 或 7 或 8 或 9 时
                result.resStatusCode = resInfo.status.statusCode;
            }
        }
        else {
            result.resStatusCode = 'response has no status code';
        }
        /**
         * 返回状态码处理 END
         */


        // 下面开始针对特定接口处理


        /**
         * 针对模板渲染接口处理 （methodId 为 0， 1， 8） START
         * reqInfo.styleType 在 methodId 为 0 或 1 的时候存在（必传）
         * reqInfo.styleId 在 methodId 为 7 或 8 的时候存在（可选）
         * 还是根据 methodId 来判断比较准确
         */
        // if (reqInfo && (reqInfo.styleType || reqInfo.styleId))

        // methodId === 0 new-dsp 调用 模板渲染接口 （super-nova）
        // methodId === 1 智能创意模板渲染接口
        // methodId === 8 百意模板渲染接口 （0dsp, nova-ui, fc-adapter）


        if (result.methodId === 8 || result.methodId === 0 || result.methodId === 1) {
            if (resInfo.htmlSnippet && resInfo.htmlSnippet.length) {
                // methodId 为 0 或 1 响应存在 htmlSnippet (可选)
                result.htmlSnippetLength = resInfo.htmlSnippet.length;
            }
            else if (resInfo.result && resInfo.result.length) {
                // methodId 为 8 响应存在 result (可选)
                result.htmlSnippetLength = resInfo.result.length;
            }
            else {
                // Snippet 长度为 0 是否可以作为模板渲染是否成功的标志？
                result.htmlSnippetLength = 0;
            }

            // styleType or styleId 处理， 为了字段统一
            if (reqInfo && (reqInfo.styleType || reqInfo.styleId)) {
                result.styleType = reqInfo.styleType || reqInfo.styleId || '';
            }
        }
        /**
         * 针对模板渲染接口处理 END
         */


        /**
         * 增加各接口所需的特殊 log 字段 START
         */
        if (context.log) {
            if (context.log.requestInfo) {
                for (var item in context.log.requestInfo) {
                    var currentItem = context.log.requestInfo[item];
                    if (typeof currentItem !== 'object') {
                        result[item] = reqInfo[item] || '';
                    }
                    else {
                        for (var subItem in currentItem) {
                            result[subItem] = reqInfo[item][subItem] || '';
                        }
                    }
                }
            }
            if (context.log.responseInfo) {
                for (var item in context.log.responseInfo) {
                    var currentItem = context.log.responseInfo[item];
                    if (typeof currentItem !== 'object') {
                        result[item] = resInfo[item] || '';
                    }
                    else {
                        for (var subItem in currentItem) {
                            result[subItem] = resInfo[item][subItem] || '';
                        }
                    }
                }
            }
        }
        /**
         * 增加各接口所需的特殊 log 字段 END
         */


        /**
         * 返回前的特殊处理 START
         */
        if (!result.account) {
            result.account = 'unknow';
        }
        if (result.searchId && result.searchId.toHex) {
            result.searchId = result.searchId.toHex();
        }
        if (result.requestId && result.requestId.toHex) {
            result.requestId = result.requestId.toHex();
        }
        /**
         * 返回前的特殊处理 END
         */


        return result;
    }

});
