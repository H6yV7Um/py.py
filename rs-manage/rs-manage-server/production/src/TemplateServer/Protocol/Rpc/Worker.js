/**
 * @file 工作进程
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

require('node-oojs');

oojs.define({
    name: 'Worker',
    namespace: 'Demo.Protocol.Rpc',
    deps: {
        nsHead: 'Demo.Common.Model.NsHead',
        proto: 'Demo.Common.Model.Proto',
        converter: 'Demo.Common.Model.Converter',
        templateRequestInfo: 'Demo.Common.Model.TemplateRequestInfo',
        templateResponseInfo: 'Demo.Common.Model.templateResponseInfo',
        log: 'Demo.Common.Utility.Log',
        config: 'Demo.Common.Config.Global',
        templateService: 'Demo.Service.Template'
    },

    /**
     * 静态构造函数
     */
    $Worker: function () {
        // 创建全局日志对象
        oojs.log = oojs.create(this.log, this.config.log);
        // 启动服务
        process.on('message', this.processOnMessage.proxy(this));
        // 异常处理
        process.on('uncaughtException', this.processOnError.proxy(this));
        // 通知master进程启动成功
        process.send({
            action: 'workerOnStart',
            pid: process.pid
        });
    },

    /**
     * socket接收数据事件处理函数.
     *
     * @param {Buffer} data 本次接收到的数据对象buffer
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnData: function (data, socket) {
        try {
            this.nsHead.processPackage({
                data: data,
                socket: socket,
                processFunction: this.processRequest.proxy(this)
            });
        }
        catch (err) {
            this.socketOnError(err, socket);
        }
    },

    /**
     * socket结束事件处理函数.
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
     * socket 关闭事件处理函数.
     *
     * @param {net.Socket} socket 本次连接的socket对象
     */
    socketOnClose: function (socket) {
        if (socket) {
            socket.preBuffer = null;
            oojs.log.info('SOCKET CLOSED: ' + socket.remoteAddress + ' ' + socket.remotePort);
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
     * socket异常事件处理函数.
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
            socket.on('data', this.socketOnData.proxy(this, socket));
            socket.on('end', this.socketOnEnd.proxy(this, socket));
            socket.on('close', this.socketOnClose.proxy(this, socket));
            socket.on('timeout', this.socketOnTimeout.proxy(this, socket));
            socket.on('error', this.socketOnError.proxy(this, socket));
            socket.setTimeout(this.config.server.socketTimeout);
        }
    },

    /**
     * 工作进程出现未捕获异常时的处理
     *
     * @param {Error} err 异常对象
     */
    processOnError: function (err) {
        // 记录错误日志
        oojs.log.fatal('processOnError ', err);
        // 通知master, 停止接受新的请求
        process.send({
            action: 'suicide'
        });
        // 10秒钟后关闭进程
        setTimeout(function () {
            process.exit(1);
        }, 10000);
        return;
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
    processRequest: function (option) {
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

        switch (nsHead.methodId) {
            case 0:
                // 模板查询接口
                context.requestInfo = this.converter.byteToProto(this.templateRequestInfo, bodyBuffer);
                context.requestModel = this.templateRequestInfo;
                context.responseModel = this.templateResponseInfo;
                oojs.promise
                    .resolve(context.requestInfo)
                    .then(this.templateService.render.proxy(this.templateService))
                    .then(this.onRpcCallback.proxy(this, context))
                    .catch(this.onRpcError.proxy(this, context));
                break;
            default:
                break;
        }
        return true;
    },

    /**
     * Rpc通用回调函数
     *
     * @param {Object} result 服务层返回的处理结果
     * @param {Object} context 当前请求的上下文对象
     */
    onRpcCallback: function (result, context) {
        // 构造response buffer
        var responseBuffer = this.converter
            .objToProto(context.responseModel, result)
            .toBuffer();

        var nsHead = this.nsHead.writeNsHead({
            snappy: context.snappy,
            bodyLength: responseBuffer.length
        });
        var resultBuffer = Buffer.concat([
            nsHead,
            responseBuffer
        ]);
        context.socket.write(resultBuffer);

        // 返回数据
        if (context && context.socket && context.socket.writable) {
            context.socket.write(resultBuffer);
            context = null;
        }
    },

    /**
     * Rpc错误处理
     *
     * @param {Object} err 异常类对象
     * @param {Object} context 当前请求的上下文对象
     */
    onRpcError: function (err, context) {
        if (err) {
            this.socketOnError(err, context && context.socket);
        }
    }
});
