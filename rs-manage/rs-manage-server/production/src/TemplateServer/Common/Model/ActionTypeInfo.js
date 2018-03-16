/**
 * @file 客户端模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'ActionTypeInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.AdElement.ActionTypeInfo',
    property: {
        smsInfo: {
            type: 'string'
        },
        telNum: {
            type: 'string'
        },
        mailInfo: {
            type: 'string'
        }
    }
});
