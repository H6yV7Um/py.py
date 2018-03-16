/**
 * @file RPC客户端工具类
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Client',
    namespace: 'TemplateServer.Protocol.Rpc',
    deps: {
        nsHead: 'TemplateServer.Common.Model.NsHead',
        proto: 'TemplateServer.Common.Model.Proto',
        converter: 'TemplateServer.Common.Model.Converter',
        net: require('net')
    },

    /**
     * 默认设置
     */
    config: {
        // 请求的服务接口
        methodId: 0,
        // 是否启用snappy压缩
        snappy: false,
        // 服务器地址
        serverAddress: '127.0.0.1',
        // 服务器端口
        serverPort: 8124,
        // 请求对象模型
        requestModel: 'TemplateServer.Common.Model.SearchRequest',
        // 返回对象模型
        responseModel: 'TemplateServer.Common.Model.SearchResponse',
        // 是否缓存requestInfo, 每次发送请求都对requestInfo序列化十分消耗客户端性能.
        // 开启后, 会缓存第一次调用write函数时传递的requestInfo, 后续再传递的requestInfo将失效.
        isCacheRequestInfo: false
    },

    /**
     * 动态构造函数
     *
     * @param {Object} config 配置文件,参见Client.config属性
     * @constructor
     */
    Client: function (config) {
        // 设置配置文件
        this.config = this.merge(config, this.config);
        this.config.requestModel = oojs.using(this.config.requestModel);
        this.config.responseModel = oojs.using(this.config.responseModel);
        // 创建promise,初始状态为fullfilled
        this.promise = oojs.promise.resolve(config);
    },

    /**
     * 将源对象的属性合并到目标对象,同名属性使用源对象的值.
     *
     * @param {Object} source 源对象
     * @param {Object} to 目标对象
     * @return {Object} 合并后的对象引用
     */
    merge: function (source, to) {
        for (var key in source) {
            if (source.hasOwnProperty(key) && typeof source[key] !== 'undefined') {
                to[key] = source[key];
            }

        }
        return to;
    },

    /**
     * 创建连接
     *
     * @return {Object} 当前对象的this指针
     */
    connect: function () {
        this.promise = this.promise.then(function (config) {
            var socketPromise = oojs.create(oojs.promise);
            this.socket = new this.net.Socket();
            this.socket.connect(config.serverPort, config.serverAddress, function () {
                // 解决win10下+node-0.12环境下存在的socket异常.
                // 如果不设置延时,则socket.write会hold
                setTimeout(function () {
                    socketPromise._resolve();
                }, 5);
            });
            return socketPromise;
        }.proxy(this));
        return this;
    },

    /**
     * 发送请求
     *
     * @param {Object} requestInfo 请求对象
     * @return {Object} 返回当前对象的this指针
     */
    write: function (requestInfo) {
        // 写入请求数据
        this.promise = this.promise.then(function () {
            // 此步骤本身使用socket的事件机制,也是异步, 所以返回一个子Promise
            var writePromise = oojs.create(oojs.promise);
            // 首先设置回调函数
            this.socket.on('data', function (data) {
                this.nsHead.processPackage({
                    data: data,
                    socket: this.socket,
                    processFunction: function (data) {
                        writePromise._resolve(data);
                    }
                });
            }.proxy(this));
            // 写入数据
            var totalBuffer;
            var messageBuffer = this.converter.objToProto(this.config.requestModel, requestInfo).toBuffer();
            var nsHead = this.nsHead.writeNsHead({
                methodId: this.config.methodId,
                snappy: this.config.snappy,
                bodyLength: messageBuffer.length
            });
            totalBuffer = Buffer.concat([
                nsHead,
                messageBuffer
            ]);

            if (this.socket.writable) {
                this.socket.write(totalBuffer);
            }
            else {
                writePromise._reject(new Error('socket.writable:false'));
            }
            return writePromise;
        }.proxy(this));

        // 处理返回的数据包
        this.promise = this.promise.then(function (data) {
            var nsHead = data.nsHead;
            var bodyBuffer = data.bodyBuffer;
            if (nsHead.snappy) {
                bodyBuffer = this.snappy.uncompress(bodyBuffer);
            }

            var responseInfo = this.converter.byteToProto(this.config.responseModel, bodyBuffer);
            return responseInfo;
        }.proxy(this));

        return this;
    },

    /**
     * 收到数据后的处理
     *
     * @param {Function} onFullFill 成功时的回调函数
     * @param {Function} onRejected 失败时的回调函数
     * @return {Object} 返回当前对象的this指针
     */
    then: function (onFullFill, onRejected) {
        this.promise = this.promise.then(onFullFill, onRejected);
        return this;
    },

    /**
     * 关闭连接
     *
     * @return {Object} 返回当前对象的this指针
     */
    close: function () {
        this.promise = this.promise.then(function () {
            this.socket.destroy();
            this.socket = null;
            return true;
        }.proxy(this));
        return this;
    },

    /**
     * 异常处理
     *
     * @param {Function} func 异常处理函数
     * @return {Object} 返回当前对象的this指针
     */
    error: function (func) {
        this.promise = this.promise.catch(func);
        return this;
    }
});
