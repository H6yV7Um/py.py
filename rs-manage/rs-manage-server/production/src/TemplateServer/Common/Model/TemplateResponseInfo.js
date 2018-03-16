/**
 * @file ģ����Ⱦ���ؽӿڶ���
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
