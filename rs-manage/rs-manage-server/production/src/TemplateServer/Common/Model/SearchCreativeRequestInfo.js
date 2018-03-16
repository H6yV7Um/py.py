/**
 * @file 查询创意需求-请求对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchCreativeRequestInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchCreativeRequestInfo',
    property: {
        client: {
            type: 'TemplateServer.Common.Model.ClientInfo'
        },
        styleId: {
            type: 'number'
        },
        size: {
            type: 'TemplateServer.Common.Model.SizeInfo'
        }
    }
});
