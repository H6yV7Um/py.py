/**
 * @file 模板查询接口返回对象模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchResponse',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchResponse',
    property: {
        template: {
            type: 'Demo.Common.Model.Template'
        },
        status: {
            type: 'number'
        },
        error: {
            type: 'string'
        }
    }
});
