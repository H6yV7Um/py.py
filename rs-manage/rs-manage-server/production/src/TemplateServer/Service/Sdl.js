/**
 * @file RPC协议层实现
 * @author zhangziqiu(zhangziqiu@qq.com)
 */
/* global oojs */

oojs.define({
    name: 'Sdl',
    namespace: 'TemplateServer.Service',
    deps: {
        Sdl: 'TemplateServer.Business.Sdl'
    },

    // 需要发送的日志字段
    log: {
        requestInfo: {
            client: {
                requestId: 1,
                account: 1
            }
        }
    },

    /**
     * 静态构造函数
     */
    $Sdl: function () {

    },

    /**
     * 查询 SDL
     *
     * @param {Object} requestInfo 请求对象
     * @return {oojs.promise} 返回promise对象
     */
    search: function (requestInfo) {
        var status = {};
        var sdl = [];
        try {
            // requestInfo.sdl.creativeType有可能为0，故通过!==null来判断
            if (requestInfo.sdl && requestInfo.sdl.creativeType !== null && requestInfo.sdl.promotionDeviceType) {
                sdl = this.Sdl.getSdl(requestInfo);
            } else {
                sdl = this.Sdl.getAllSdl(requestInfo);
            }
            status.statusCode = 1;
            status.detail = 'finished';
        }
        catch (ex) {
            status.statusCode = 2;
            status.detail = ex.message;
            oojs.log.error('[searchsdl]', ex);
        }
        var result = {
            status: status,
            sdl: sdl
        };
        return result;
    }
});
