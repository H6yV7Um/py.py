/**
 * @file 设备对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'DeviceInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.DeviceInfo',
    property: {
        userAgent: {
            type: 'string'
        },
        deviceType: {
            type: 'number'
        }
    }
});
