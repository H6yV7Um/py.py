/**
 * @file ��ʽ����ģ��
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'StyleInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.StyleInfo',
    property: {
        styleId: {
            type: 'number'
        },
        styleGroupId: {
            type: 'number'
        },
        size: {
            type: 'TemplateServer.Common.Model.SizeInfo'
        },
        flowType: {
            type: 'number'
        },
        layout: {
            type: 'number'
        },
        creativeType: {
            type: 'number'
        },
        attachType: {
            type: 'number'
        }
    }
});
