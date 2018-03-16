/**
 * @file 样式配置信息
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'StyleConfigInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.StyleConfigInfo',
    property: {
        isShowCloseFeedBack: {
            type: 'boolean'
        },
        actionType: {
            type: 'number'
        },
        ext: {
            type: 'string'
        },
        adslot_type: {
            type: 'string'
        }
    }
});
