oojs.define({
    name: 'cookie',
    namespace: 'rs.common.utility',
    getCookie: function (key, win) {
        var result;
        var win = win || window;
        var doc = win.document;
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)");
        var regResult = reg.exec(doc.cookie);
        if (regResult) {
            result = regResult[2];
        }
        return result;
    },

    setCookie: function (key, value, options) {
        options = options || {};
        var expires = options.expires;
        if ('number' == typeof options.expires) {
            expires = new Date();
            expires.setTime(expires.getTime() + options.expires);
        }
        document.cookie = key + "=" + value + (options.path ? "; path=" + options.path : "") + (expires ? "; expires=" + expires.toGMTString() : "") + (options.domain ? "; domain=" + options.domain : "") + (options.secure ? "; secure" : '');
    }

});