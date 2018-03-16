/**
 * @file 尺寸对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SizeInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SizeInfo',
    property: {
        sizeType: {
            type: 'number'
        },
        valueType: {
            type: 'number'
        },
        width: {
            type: 'number'
        },
        widthEnd: {
            type: 'number'
        },
        height: {
            type: 'number'
        },
        heightEnd: {
            type: 'number'
        },
        scale: {
            type: 'number'
        },
        scaleEnd: {
            type: 'number'
        }
    }
});
