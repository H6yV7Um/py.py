/**
 * @file ���ģ���������ģ��
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'InsertUpdateRequest',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.InsertUpdateRequest',
    property: {
        account: {
            type: 'string'
        },
        template: {
            type: 'TemplateServer.Common.Model.Template'
        },
        sub_template: {
            type: 'TemplateServer.Common.Model.Template'
        }
    }
});
