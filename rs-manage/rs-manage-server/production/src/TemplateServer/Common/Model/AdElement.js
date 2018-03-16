/**
 * @file 客户端模型
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'AdElement',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.AdElement',
    property: {
        encoding: {
            type: 'number'
        },
        title: {
            type: 'string'
        },
        desc: {
            type: 'string'
        },
        monitorUrl: {
            type: 'string'
        },
        clickUrl: {
            type: 'string'
        },
        midTime: {
            type: 'number'
        },
        showUrl: {
            type: 'string'
        },
        stuffType: {
            type: 'number'
        },
        stuffSrc: {
            type: 'string'
        },
        width: {
            type: 'number'
        },
        height: {
            type: 'number'
        },
        smartIdeaProduct: {
            type: 'TemplateServer.Common.Model.SmartIdeaProduct'
        },
        extention: {
            type: 'string'
        },
        actionType: {
            type: 'number'
        },
        actionTypeInfo: {
            type: 'TemplateServer.Common.Model.ActionTypeInfo'
        },
        bid: {
            type: 'string'
        }
    }
});
