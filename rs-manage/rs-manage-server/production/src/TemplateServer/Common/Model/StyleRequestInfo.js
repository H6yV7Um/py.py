/**
 * @file 模板查询接口请求对象模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'StyleRequestInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.StyleRequestInfo',
    property: {
        account: {
            type: 'string'
        },
        searchId: {
            type: 'string'
        },
        styleConfig: {
            type: 'string'
        },
        userAgent: {
            type: 'string'
        },
        actionType: {
            type: 'number'
        },
        width: {
            type: 'number'
        },
        height: {
            type: 'number'
        },
        sizeType: {
            type: 'number'
        },
        styleType: {
            type: 'number'
        },
        adElements: {
            type: 'TemplateServer.Common.Model.AdElement'
        },
        smartIdeaAdData: {
            type: 'string'
        }
    }
});
