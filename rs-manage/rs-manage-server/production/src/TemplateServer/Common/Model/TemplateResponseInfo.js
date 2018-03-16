/**
 * @file 模版渲染返回接口对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'TemplateResponseInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.TemplateResponseInfo',
    property: {
        searchId: {
            type: 'string'
        },
        returnCode: {
            type: 'number'
        },
        error: {
            type: 'string'
        },
        htmlSnippet: {
            type: 'string'
        }
    }
});
