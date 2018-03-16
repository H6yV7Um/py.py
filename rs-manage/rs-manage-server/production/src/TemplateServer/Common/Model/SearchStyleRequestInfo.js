/**
 * @file 查询样式信息-请求接口对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchStyleRequestInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchStyleRequestInfo',
    property: {
        client: {
            type: 'TemplateServer.Common.Model.ClientInfo'
        },
        timeStamp: {
            type: 'string'
        }
    }
});
