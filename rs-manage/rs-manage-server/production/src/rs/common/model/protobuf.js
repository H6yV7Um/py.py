/**
 * @file protobuf model
 * @author chenguanquan@baidu.com
 */

/* global oojs */
oojs.define({
    name: 'protobuf',
    namespace: 'rs.common.model',
    cache: {},
    $protobuf: function () {
        var pb = require('protobufjs');
        var path = require('path');
        var protoFilePath = path.resolve(oojs.getPath(), '../');
        protoFilePath = protoFilePath + '/src/rs/api/protocol/rs.proto';
        this.builder = pb.loadProtoFile(protoFilePath);
        this.TemplateRequestInfo = this.builder.build('rs.TemplateRequestInfo');
        this.StyleRequestInfo = this.builder.build('rs.StyleRequestInfo');
        this.RenderRequestInfo = this.builder.build('rs.RenderRequestInfo');
        this.TemplateResponseInfo = this.builder.build('rs.TemplateResponseInfo');
        this.AdElement = this.builder.build('rs.AdElement');
        this.StyleType = this.builder.build('rs.StyleType');
    },

    build: function (name) {
        return this[name] = this.builder.build(name);
    },

    getClass: function (type) {
        var result = this.cache[type];
        if (!result) {
            result = this.builder.build(type);
            this.cache[type] = result;
        }
        return result;
    },

    setClass: function (type) {
        this.cache[type] = this.builder.build(type);
    }

});
