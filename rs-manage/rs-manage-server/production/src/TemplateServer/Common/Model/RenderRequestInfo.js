/**
 * @file 渲染服务-请求对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'RenderRequestInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.RenderRequestInfo',
    property: {
        client: {
            type: 'TemplateServer.Common.Model.ClientInfo'
        },
        styleId: {
            type: 'number'
        },
        size: {
            type: 'TemplateServer.Common.Model.SizeInfo'
        },
        device: {
            type: 'TemplateServer.Common.Model.DeviceInfo'
        },
        ads: {
            type: 'string'
        },
        dupDomain: {
            type: 'string'
        },
        protocolType: {
            type: 'number'
        },
        appTrafficSource: {
            type: 'number'
        },
        styleConfig: {
            type: 'TemplateServer.Common.Model.StyleConfigInfo'
        }
    }
});
