/**
 * @file 客户端对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'ClientInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.ClientInfo',
    property: {
        dspId: {
            type: 'number'
        },
        sspId: {
            type: 'number'
        },
        requestId: {
            type: 'string'
        },
        account: {
            type: 'string'
        }
    }
});
