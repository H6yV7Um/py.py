/**
 * @file 删除智能创意模板
 * @author liguangyi
 */
/* global oojs */

oojs.define({
    name: 'DeleteResponse',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.DeleteResponse',
    property: {
        status: {
            type: 'number'
        },
        count: {
            type: 'number'
        },
        error: {
            type: 'string'
        }
    }
});
