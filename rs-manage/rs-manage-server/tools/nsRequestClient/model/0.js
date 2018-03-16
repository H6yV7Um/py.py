/**
 * @file api model for methodId === 0
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require */

const Base = require('./model');

const REQ_MODEL_NAME = 'rs.TemplateRequestInfo';
const RES_MODEL_NAME = 'rs.TemplateResponseInfo';


module.exports = class MethodModel0 extends Base {
    constructor() {
        super(
            0,
            REQ_MODEL_NAME,
            RES_MODEL_NAME,
            true
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
        return data.htmlSnippet.toString('utf8');
    }
};
