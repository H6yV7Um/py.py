/**
 * @file SDL信息对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SdlInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SdlInfo',
    property: {
        styleId: {
            type: 'number'
        },
        size: {
            type: 'TemplateServer.Common.Model.SizeInfo'
        },
        promotionDeviceType: {
            type: 'number'
        },
        creativeType: {
            type: 'number'
        },
        content: {
            type: 'string'
        }
    }
});
