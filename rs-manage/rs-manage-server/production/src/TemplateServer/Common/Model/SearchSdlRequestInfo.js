/**
 * @file SDL查询接口-请求对象
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'SearchSdlRequestInfo',
    namespace: 'TemplateServer.Common.Model',
    protoType: 'rs.SearchSdlRequestInfo',
    property: {
        client: {
            type: 'TemplateServer.Common.Model.ClientInfo'
        },
        sdl: {
            type: 'TemplateServer.Common.Model.SdlInfo'
        }
    }
});
