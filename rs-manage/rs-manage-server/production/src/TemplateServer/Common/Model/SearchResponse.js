/**
 * @file ģ���ѯ�ӿڷ��ض���ģ��
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
