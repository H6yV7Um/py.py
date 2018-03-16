/**
 * @file proto转换工具类.
 * @author zhangziqiu(zhangziqiu@baidu.com)
 */
/* global oojs */

oojs.define({
    name: 'Proto',
    namespace: 'TemplateServer.Common.Model',
    deps: {
        protobufjs: require('protobufjs'),
        path: require('path')
    },
    cache: {},

    /**
     * 静态构造函数
     */
    $Proto: function () {
        this.protoFilePath = this.path.resolve(oojs.getPath()) + '/rs/api/protocol/rs.proto';
        this.builder = this.protobufjs.loadProtoFile(this.protoFilePath);
    },

    /**
     * 编译proto对象
     *
     * @param {string} type proto类名
     * @return {Object} proto对象
     */
    build: function (type) {
        this.cache[type] = this.builder.build(type);
        return this.cache[type];
    },

    /**
     * 获取proto对象
     *
     * @param {string} type proto类名
     * @return {Object} proto对象
     */
    getClass: function (type) {
        var result = this.cache[type];
        if (!result) {
            result = this.build(type);
        }
        return result;
    }
});
