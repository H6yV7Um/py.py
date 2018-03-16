/**
 * @file 添加模板返回对象模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'InsertUpdateResponse',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.InsertUpdateResponse',
    property: {
        status: {
            type: 'number'
        },
        error: {
            type: 'string'
        },
        template_id: {
            type: 'number'
        }
    }
});
