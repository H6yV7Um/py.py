/**
 * @file 查询创意需求-返回对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchCreativeResponseInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchCreativeResponseInfo',
    property: {
        status: {
            type: 'TemplateServer.Common.Model.Status'
        },
        creativeRequired: {
            type: 'TemplateServer.Common.Model.CreativeRequiredInfo'
        }
    }
});
