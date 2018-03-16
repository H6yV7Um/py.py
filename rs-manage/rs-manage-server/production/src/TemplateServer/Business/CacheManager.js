/**
 * @file Cache管理类
 * @author zhangziqiu@baidu.com
 */
/* global oojs */

oojs.define({
    name: 'CacheManager',
    namespace: 'TemplateServer.Business',
    deps: {
        Config: 'TemplateServer.Common.Config.Global',
        StyleCache: 'TemplateServer.Data.StyleCache',
        TemplateCache: 'TemplateServer.Data.TemplateCache',
        SdlCache: 'TemplateServer.Data.SdlCache'
    },

    /**
     * 静态构造函数
     */
    $CacheManager: function () {
        this.fileIntervalSeconds = this.Config.cache.fileIntervalSeconds;
    },


    /**
     * 加载所有缓存
     */
    loadCache: function () {
        this.StyleCache.setCacheFromFile();
        this.TemplateCache.setCacheFromFile();
        this.SdlCache.setCacheFromFile();
    },

    /**
     * 开启监控
     */
    startMonitor: function () {
        var random = parseInt(Math.random() * 20000, 10);
        setTimeout(function () {
            this.fileMonitorId = setInterval(this.loadCache.proxy(this),
                this.fileIntervalSeconds * 1000);
        }.proxy(this), random);
    }

});
