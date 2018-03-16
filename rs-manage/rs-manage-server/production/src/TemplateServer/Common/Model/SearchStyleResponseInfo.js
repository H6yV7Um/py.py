/**
 * @file 查询样式信息-返回接口对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchStyleResponseInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchStyleResponseInfo',
    property: {
        status: {
            type: 'TemplateServer.Common.Model.Status'
        },
        style: {
            type: 'TemplateServer.Common.Model.StyleInfo'
        },
        timeStamp: {
            type: 'string'
        }
    }
});
