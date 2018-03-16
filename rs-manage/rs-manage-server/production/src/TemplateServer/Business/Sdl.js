/**
 * @file Style业务逻辑对象
 * @author zhangziqiu@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'Sdl',
    namespace: 'TemplateServer.Business',
    deps: {
        SdlCache: 'TemplateServer.Data.SdlCache'
    },

    /**
     * 静态构造函数
     */
    $Sdl: function () {
    },

    /**
     * 获取所有Style对象
     * @param {Object} requestInfo 请求对象
     * @return {Array} style对象数组
     */
    getSdl: function (requestInfo) {
        var result = [];
        var key = requestInfo.sdl.creativeType + '_' + requestInfo.sdl.promotionDeviceType;
        result = this.SdlCache.getByKey(key);
        return result;
    },

    /**
     * 获取所有Style对象
     * @param {Object} requestInfo 请求对象
     * @return {Array} style对象数组
     */
    getAllSdl: function (requestInfo) {
        var result = [];
        result = this.SdlCache.getByKey();
        return result;
    }
});
