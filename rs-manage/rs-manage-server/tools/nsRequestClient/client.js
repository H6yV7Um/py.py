/**
 * @file nsRpc request client
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require, no-console */

const snappy = require('snappyjs');
const Request = require('./request');


class Client {
    constructor(options) {
        // 保存下 options, 供查看
        this.options = options;
        this.request = new Request(options);
    }

    doRequest() {
        return new Promise((resolve, reject) => {
            let methodModel = this.request.methodModel;
            this.request.doRequest(resStream => {
                resStream.on('end', (pkgs, err) => {

                    if (err) {
                        reject(err);
                        return;
                    }

                    let result = pkgs.map(({header, body}) => {
                        let bodyBuf = body;
                        if (header.snappy) {
                            bodyBuf = snappy.uncompress(bodyBuf);
                        }

                        let bodyMsg = methodModel.ResModel.decode(bodyBuf);

                        return methodModel.afterResponse(bodyMsg, bodyBuf, this.request);
                    });

                    resolve(result);
                });

                resStream.on('error', err => {
                    reject(err);
                });
            });
        });
    }
}

module.exports = Client;
