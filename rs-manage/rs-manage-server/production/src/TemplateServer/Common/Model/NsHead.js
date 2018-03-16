/**
 * @file NsHead模型工具类.
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'NsHead',
    namespace: 'TemplateServer.Common.Model',

    /**
     * 从buffer中读取nsHead
     *
     * @param {Buffer} buffer buffer对象
     * @return {Object} nsHead对象
     */
    readNsHead: function (buffer) {
        var result = {};
        result.id = buffer.readUInt16LE(0);
        result.flags = buffer.readUInt16LE(2, 3);
        result.logId = buffer.readUInt32LE(4, 7);
        result.traceId = buffer.readDoubleLE(8, 15);
        result.parentSpanId = buffer.readUInt32LE(16, 19);
        result.spanId = buffer.readUInt32LE(20, 23);
        result.magicNumber = buffer.readUInt32LE(24, 27);
        result.methodId = buffer.readUInt32LE(28, 31);
        result.bodyLength = buffer.readUInt32LE(32, 35);
        result.snappy = result.flags & 1;
        return result;
    },

    /**
     * 创建nsHead对象
     *
     * @param {Object} option 用于设置nsHead对象的各种参数
     * @param {number} option.methodId 服务id
     * @param {boolean} option.snappy 是否启用snappy压缩
     * @param {number} option.bodyLength 数据包body部分的长度
     * @return {Buffer} nsHead的Buffer对象
     */
    writeNsHead: function (option) {
        var result = new Buffer(36);
        var methodId = parseInt(typeof option.methodId !== 'undefined' ? option.methodId : 0, 10);
        var flags = option.snappy ? 0x01 : 0x00;
        result.writeUInt16LE(0x00, 0); // id
        result.writeUInt16LE(flags, 2); // flags
        result.writeUInt32LE(0, 4); // log id
        result.writeDoubleLE(0, 8); // trace id
        result.writeUInt32LE(0, 16); // parent span id
        result.writeUInt32LE(0, 20); // span id
        result.writeUInt32LE(0xfb709394, 24); // magic number
        result.writeUInt32LE(methodId, 28); // method id
        result.writeUInt32LE(option.bodyLength, 32); // body length
        return result;
    },

    /**
     * 长连接中nsHead多包的处理
     *
     * @param {Object} option  参数mapping对象
     * @param {Object} option.data 网络包buffer对象
     * @param {Object} option.socket  当前的socket对象
     * @param {Object} option.processFunction  处理一次请求包的处理函数
     */
    processPackage: function (option) {
        var data = option.data;
        var socket = option.socket;
        var processFunction = option.processFunction;

        var dataBuffer;
        if (socket.preBuffer) {
            dataBuffer = Buffer.concat([
                socket.preBuffer,
                data
            ]);
            socket.preBuffer = null;
        }
        else {
            dataBuffer = data;
        }

        // 处理nsHead
        var nsHead;
        var nsHeadBuffer;
        if (dataBuffer.length && dataBuffer.length >= 36) {
            nsHeadBuffer = dataBuffer.slice(0, 36);
            nsHead = this.readNsHead(nsHeadBuffer);
        }
        else {
            socket.preBuffer = dataBuffer;
            dataBuffer = null;
            nsHeadBuffer = null;
            return;
        }

        // 处理pb部分
        var pbData = dataBuffer.slice(36);
        var multiData = false;
        if (nsHead.magicNumber === 4218459028 && pbData.length >= nsHead.bodyLength) {
            // 一次onData发送了多个业务包
            if (pbData.length > nsHead.bodyLength) {
                multiData = true;
            }
        }
        else {
            socket.preBuffer = dataBuffer;
            dataBuffer = null;
            nsHeadBuffer = null;
            pbData = null;
            nsHead = null;
            return;
        }

        var msgData = pbData.slice(0, nsHead.bodyLength);
        processFunction({
            nsHead: nsHead,
            bodyBuffer: msgData,
            socket: socket
        });

        if (multiData) {
            var leftData = pbData.slice(nsHead.bodyLength);
            this.processPackage({
                data: leftData,
                socket: socket,
                processFunction: processFunction
            });
        }

    }
});
