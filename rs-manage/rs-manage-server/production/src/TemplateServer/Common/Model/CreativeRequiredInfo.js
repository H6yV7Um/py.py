/**
 * @file 创意需求模型, 描述在检索时需要检索哪些创意.
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'CreativeRequiredInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.CreativeRequiredInfo',
    property: {
        creativeType: {
            type: 'number'
        },
        width: {
            type: 'number'
        },
        height: {
            type: 'number'
        },
        count: {
            type: 'number'
        }
    }
});
