/**
 * @file SDL��ѯ�ӿ�-���ض���
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchSdlResponseInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchSdlResponseInfo',
    property: {
        status: {
            type: 'TemplateServer.Common.Model.Status'
        },
        sdl: {
            type: 'TemplateServer.Common.Model.SdlInfo'
        }
    }
});
