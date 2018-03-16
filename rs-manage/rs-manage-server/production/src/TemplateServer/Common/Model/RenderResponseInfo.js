/**
 * @file ��Ⱦ����-���ض���
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'RenderResponseInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.RenderResponseInfo',
    property: {
        status: {
            type: 'TemplateServer.Common.Model.Status'
        },
        client: {
            type: 'TemplateServer.Common.Model.ClientInfo'
        },
        result: {
            type: 'string'
        },
        isSendWin: {
            type: 'boolean'
        }
    }
});
