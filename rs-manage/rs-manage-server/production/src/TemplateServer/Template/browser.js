/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */

/* globals oojs */
oojs.define({
    name: 'browser',
    namespace: 'TemplateServer.Template',
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
    },
    getBrowserDetail: function (ua) {
        // http://stackoverflow.com/a/5918791/508236
        var tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return {
                name: 'IE',
                version: (tem[1] || '')
            };
        }

        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) {
                var result = tem.slice(1).join(' ').replace('OPR', 'Opera');
                return {
                    name: result.split(' ')[0],
                    version: result.split(' ')[1]
                };
            }
        }

        M = M[2] ? [
            M[1],
            M[2]] : [
                navigator.appName,
                navigator.appVersion,
                '-?'
            ];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
            M.splice(1, 1, tem[1]);
        }

        return {
            name: M[0],
            version: M[1]
        };
    }
});
