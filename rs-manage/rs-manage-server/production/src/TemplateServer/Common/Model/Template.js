/**
 * @file 客户端模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Template',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.Template',
    property: {
        id: {
            type: 'number'
        },
        style_type: {
            type: 'number'
        },
        name: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        thumbnail: {
            type: 'string'
        },
        sdl: {
            type: 'string'
        },
        version: {
            type: 'number'
        },
        create_time: {
            type: 'string'
        },
        create_account: {
            type: 'string'
        },
        create_user_id: {
            type: 'string'
        },
        create_user_platform: {
            type: 'string'
        },
        update_time: {
            type: 'string'
        },
        update_account: {
            type: 'string'
        },
        update_user_id: {
            type: 'string'
        },
        update_user_platform: {
            type: 'string'
        },
        status: {
            type: 'number'
        },
        remark: {
            type: 'string'
        },
        size: {
            type: 'TemplateServer.Common.Model.TemplateSize'
        }
    }
});
