/**
 * @file 客户端模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Thumbnail',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.Thumbnail',
    property: {
        id: {
            type: 'number'
        },
        template_id: {
            type: 'number'
        },
        type: {
            type: 'number'
        },
        width: {
            type: 'string'
        },
        height: {
            type: 'string'
        },
        url: {
            type: 'string'
        }
    }
});
