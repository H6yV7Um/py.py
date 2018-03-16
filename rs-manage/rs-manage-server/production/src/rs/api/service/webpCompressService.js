/**
 * @file Describe webpCompressService
 * @author liguangyi
 */

/* global oojs */
oojs.define({
    name: 'webpCompressService',
    namespace: 'rs.api.service',
    deps: {
        fs: require('fs'),
        converter: 'rs.common.model.converter',
        webp: 'rs.common.utility.webp',
        webpCompressRequest: 'rs.common.model.webpCompressRequest',
        webpCompressResponse: 'rs.common.model.webpCompressResponse'

    },
    log: {
        requestInfo: {
            account: 1
        }
    },
    convert2webp: function (context, callback) {
        var requestInfo = context.requestInfo || {};
        var data = requestInfo.data;

        var socket = context.socket;
        var time = new Date();
        var log = JSON.stringify({
            ip: socket.remoteAddress,
            service: 'webp',
            timestamp: time.toLocaleDateString() + ' ' + time.toLocaleTimeString()

        });

        oojs.log.info(log);

        // 检查输入参数
        if (!data) {
            this.convert2webpCallback(new Error('no input data'), '', requestInfo, callback);
        }

        this.webp.binary2webp(data.toBuffer(), this.convert2webpCallback.proxy(this, requestInfo, callback));
    },
    convert2webpCallback: function (err, data, requestInfo, callback) {
        var errorString = '';
        var status = 0;

        if (err) {
            status = 1;
            errorString = JSON.stringify(err);
        }
        var responseInfo = {
            status: status,
            error: errorString,
            data: data

        };
        var pbResponseInfo = this.converter.convertToPb({
            meta: this.webpCompressResponse,
            data: responseInfo

        });
        callback(null, pbResponseInfo);
    }

});
