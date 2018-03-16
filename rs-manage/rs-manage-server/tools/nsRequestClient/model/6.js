/**
 * @file api model for methodId === 6
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

const Base = require('./model');

const REQ_MODEL_NAME = 'rs.SearchStyleRequestInfo';
const RES_MODEL_NAME = 'rs.SearchStyleResponseInfo';

module.exports = class MethodModel6 extends Base {
    constructor() {
        super(
            6,
            REQ_MODEL_NAME,
            RES_MODEL_NAME,
            false
        );
    }

    /**
     * after response
     *
     * @param {Object} data response data, js plain object
     * @param {Buffer} dataBuffer response data , protobuffer
     * @param {Object} scope requestClient instance
     * @return {*} 根据接口看返回 html 页面还是 json 数据
     */
    afterResponse(data, dataBuffer, scope) {
        return JSON.stringify(data);
    }
};
