oojs.define({
    name: 'cuid',
    namespace: 'rs.business',
    deps: {
        cookie: 'rs.common.utility.cookie',
        log: 'rs.common.utility.log'
    },
    $cuid: function () {
        this.getCuid();
    },
    getCuid: function () {
        window.getCuid = function (g) {
            if (g.error !== 0) {
                return
            }
            var h = this.cookie.getCookie('cuid');
            if (!h) {
                var e = new Date();
                e.setTime(e.getTime() + 86400000);
                h = g.cuid;
                this.cookie.setCookie('cuid', h, {
                    path: '/',
                    expires: e
                });
                var f = '//eclick.baidu.com/cuid.jpg?cuid=' + h;
                this.log.sendByImage(f)
            }
        }.proxy(this);
        var h = document.getElementsByTagName('head')[0];
        var a = document.createElement('script');
        a.type = 'text/javascript';
        a.src = '//127.0.0.1:6259/getcuid?callback=getCuid';
        b.appendChild(a)
    }
});