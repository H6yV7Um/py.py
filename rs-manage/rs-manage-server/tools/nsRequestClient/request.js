/**
 * @file nsRpc request
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

const path = require('path');
const net = require('net');
const Stream = require('stream').Stream;
const nsHead = require('./nsHead');

const DEFAULT_REQUEST_OPTIONS = {
    address: '127.0.0.1',
    port: 3000,
    data: {},
    methodId: 0
};
const noop = function () {};


class ResStream extends Stream {
    constructor() {
        super();
        this.writable = true;
        this.preData = null;
        this.complete = false;
        // 多业务包处理数据
        this.resultPack = [];
    }

    write(chunk) {

        let nsLen = nsHead.nsLen;

        /**
         * nsHead 包处理，包括了如下情况：
         * 1、一个业务包分散在多次 rpc data 事件传递
         * 2、一次 rpc data 事件传递的数据包含了多了业务包
         *
         * 触发事件：
         * 1、每处理完一个业务包，触发一次 data 事件，传递的数据格式： {header(nsHead plain Object), body(body buffer)}
         * 2、当所有数据包处理完成触发一次 end 事件，传递的数据格式： [{header(nsHead plain Object), body(body buffer)}, ...]
         *
         * @param {Buffer} buf    buffer 数据
         * @return {*}
         */
        let multiProcess = buf => {
            // 本次需要处理的 data
            let data = buf;
            if (this.preData) {
                data = Buffer.concat([this.preData, buf]);
                // 清空上一个包的遗留
                this.preData = null;
            }


            // 如果 data 长度海不能满足一个 nsHead ，先保留数据，供下次合并一起处理
            if (data.length < nsLen) {
                this.preData = data;
                return;
            }

            // 若满足了一个业务包的长度，则处理这个业务包，如下
            let nh = nsHead.unpack(data.slice(0, nsLen)); // nsHead

            // 长度不满足，表示本次的数据不满足一个业务包的长度，先保留数据，供下次合并一起处理
            if (data.length < nh.bodyLength + nsLen) {
                this.preData = data;
                return;
            }

            // 若已经满足一个 nsHead 业务包的条件，则解析这个业务包
            if (nh.magicNumber === nsHead.magicNum) {
                let packInfo = {
                    // nsHead 的 head 部分
                    header: nh,
                    // nsHead 的 body 部分
                    body: data.slice(nsLen, nh.bodyLength + nsLen)
                };
                // 每解析出一个业务包，就触发一次 data 事件
                this.emit('data', packInfo);
                // 保留解析出来的业务包数据，供 end 时使用
                this.resultPack.push(packInfo);
                // 针对一次 rpc on data 事件发送多个业务包
                if (data.length > nh.bodyLength + nsLen) {
                    return multiProcess(data.slice(nh.bodyLength + nsLen));
                }
                // 所有数据处理完成，设置完成标记位，并触发 end 事件，将所有数据传递出去
                this.complete = true;
                this.emit('end', this.resultPack);
            }

        };

        if (!Buffer.isBuffer(chunk)) {
            chunk = new Buffer(chunk);
        }

        try {
            multiProcess(chunk);
        }
        catch (e) {
            this.emit('error', e);
        }

    }

    end() {
        if (this.complete === false) {
            this.emit('error', new Error('socket connection closed unexpectedly'));
            return;
        }
    }
}

class Request {
    constructor({
        address = DEFAULT_REQUEST_OPTIONS.address,
        port = DEFAULT_REQUEST_OPTIONS.port,
        data = DEFAULT_REQUEST_OPTIONS.data,
        methodId = DEFAULT_REQUEST_OPTIONS.methodId
    } = DEFAULT_REQUEST_OPTIONS) {
        this.address = address;
        this.port = port;
        this.data = data;
        this.methodId = methodId;
        this.methodModel = new (require(path.join(__dirname, 'model', this.methodId) + '.js'))();
    }

    packNsHead({
        methodId = 0,
        snappy = false,
        bodyLength = 0
    }) {
        let data = {
            // id,
            // logId,
            // traceId,
            // parentSpanId,
            // spanId,
            // magicNumber: nsHead.magicNum, // 已经写死在 nsHead 模块中
            methodId: methodId,
            bodyLength: bodyLength,
            flags: snappy
        };
        return nsHead.pack(data);
    }

    write(socket, data) {
        let bufData = this.methodModel.beforeRequest(data, this);
        socket.write(bufData);
    }

    doRequest(callback) {
        let socket = new net.Socket();


        socket.setTimeout(2000, noop);

        socket.on('close', err => {
            socket.destroy();
        });


        socket.on('connect', () => {
            let response = new ResStream();

            response.on('end', () => {
                socket.end();
            });

            socket.on('timeout', () => {
                response.emit('error', new Error('socket connect timeout (2s)'));
            });

            socket.on('error', err => {
                response.emit('error', err);
            });

            callback && callback(response);
            socket.pipe(response);

            // // 延迟 10ms 往 socket 中写数据，timeout 情况明显减少
            // setTimeout(() => {
            //     this.write(socket, this.data);
            // }, 10);

            this.write(socket, this.data);

        });

        socket.connect({
            host: this.address,
            port: this.port
        });


    }
}


module.exports = Request;
