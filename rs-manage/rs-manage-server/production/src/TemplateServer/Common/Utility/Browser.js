/**
 * @file 工具类Browser
 * @author fanwenjuan(fanwenjuan@baidu.com)
 */

/* global oojs */

oojs.define({
    name: 'Browser',
    namespace: 'TemplateServer.Common.Utility',
    $browser: function () {},

    getBrowser: function (userAgent) {
        var result = {
            type: '',
            version: '1.0'
        };

        if (userAgent && /msie (\d+\.\d)/i.test(userAgent)) {
            result.type = 'ie';
            result.version = +RegExp['\x241'];
        }

        return result;
    }

});