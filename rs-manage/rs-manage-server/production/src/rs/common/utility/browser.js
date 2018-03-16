oojs.define({
    name: "browser",
    namespace: "rs.common.utility",
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