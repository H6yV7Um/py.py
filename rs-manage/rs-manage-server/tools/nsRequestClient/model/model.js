/**
 * @file api model base
 * @author chenzhansheng <chenzhansheng@baidu.com>
 */

/* eslint-disable fecs-no-require, no-console */

const protobuf = require('protobufjs');
const snappy = require('snappyjs');
const nsHead = require('../nsHead');

const PROTO_PATH = require('../../../config').PROTO_PATH;
console.log('++++++++++++++++++++++'+PROTO_PATH)

const pbBuilder = protobuf.loadProtoFile(PROTO_PATH);

/**
 * api protobuf model  cache
 *
 * @type {Object}
 */
let modelCache = {};

module.exports = class MethodModel {

    constructor(methodId, reqModel, resModel, snappy = false) {
        if (methodId == null) {
            throw new Error('methodId must be exist!');
        }
        if (reqModel == null) {
            throw new Error('reqModel must be exist!');
        }
        if (resModel == null) {
            throw new Error('resModel must be exist!');
        }
        this.methodId = methodId;
        this.ReqModel = MethodModel.getModelByName(reqModel);
        this.ResModel = MethodModel.getModelByName(resModel);
        this.snappy = snappy;
    }

    /**
     * get api protobuf model
     *
     * @param {string} name    api model name
     * @return {?Object} protobuf model
     */
    static getModelByName(name) {
        if (modelCache[name]) {
            return modelCache[name];
        }
        let model = null;
        try {
            // model = modelCache[name] = modelRoot.lookupType(name);
            model = modelCache[name] = pbBuilder.build(name);
            model.__$Message__ = pbBuilder.lookup(name);
        }
        catch (e) {
            console.error(`Model [${name}] build fail with error:`);
            console.error(e);
        }
        return model;
    }

    /**
     * before request
     *
     * @param {*} data    request data
     * @param {Object} scope requestClient instance
     * @return {Buffer} request buffer
     */
    beforeRequest(data, scope) {
        let msg = new this.ReqModel(createData(data, this.ReqModel));
        let buf = msg.toBuffer();

        if (this.snappy) {
            buf = snappy.compress(buf);
        }

        let nshead = nsHead.pack({
            methodId: this.methodId,
            flags: this.snappy,
            bodyLength: buf.length
        });

        return Buffer.concat([nshead, buf]);
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
        return data;
    }
};

function createData(data, model) {
    // 根据 model field 筛选数据
    let fieldArr = Array.isArray(model.__$Message__.children) ? model.__$Message__.children : [];

    fieldArr = fieldArr
        .map(field => field.name || null)
        .filter(field => field != null);

    let result = {};

    Object.keys(data).forEach(key => {
        if (fieldArr.indexOf(key) === -1) {
            return;
        }
        result[key] = data[key];
    });

    return result;

}
