oojs.define({
    name: 'cookieSync',
    namespace: 'rs.business',
    deps: {
        cookie: 'rs.common.utility.cookie',
        log: 'rs.common.utility.log'
    },
    $cookieSync: function () {
        this.sync();
    },
    sync: function () {
        var baiduId = this.cookie.getCookie("BAIDUID");
        var cproId = this.cookie.getCookie("CPROID");
        var isUserSend = this.cookie.getCookie("ISUS");
        var isUserSendBid = this.cookie.getCookie("ISBID");
        var isNeedSend = false;
        var isNeedSendBid = false;
        var currentTimeStamp = (new Date()).getTime();

        //sync baiduid and cproid
        if (!cproId && baiduId) {
            var sendUrl = '//cpro.baidustatic.com/sync.htm?cproid=' + encodeURIComponent(baiduId);
            this.log.sendByIframe(sendUrl);
        }

        //sync cproid with others 
        if (cproId && !isUserSend) {
            isNeedSend = true;
        }
        else if (cproId && isUserSend && cproId !== isUserSend) {
            //如果cproId有变化, 则需要同步
            isNeedSend = true;
        }

        if (baiduId && !isUserSendBid) {
            isNeedSendBid = true;
        }
        else if (baiduId && isUserSendBid && baiduId !== isUserSendBid) {
            //如果baiduId有变化, 则需要同步
            isNeedSendBid = true;
        }
        if (isNeedSend || isNeedSendBid) {
            var expireDate = new Date();
            expireDate.setTime(expireDate.getTime() + 86400000);
            this.cookie.setCookie('ISBID', baiduId || '1', {
                path: "/",
                expires: expireDate
            });
            this.cookie.setCookie('ISUS', cproId || '1', {
                path: "/",
                expires: expireDate
            });
            if (cproId && baiduId) {
                var urlCproId = cproId;
                var cproIdIndex = cproId.indexOf(':');
                if (cproIdIndex && cproIdIndex > 0) {
                    urlCproId = cproId.substring(0, cproIdIndex);
                }
                this.log.sendByIframe('//s.cpro.baidu.com/s.htm?cproid=' + urlCproId + '&t=' + currentTimeStamp);
            }
            if (cproId) {
                this.log.sendByIframe('//weibo.com/aj/static/sync.html?t=' + currentTimeStamp);
                this.log.sendByIframe('//pos.baidu.com/sync_pos.htm?cproid='
                    + encodeURIComponent(cproId)
                    + '&t=' + currentTimeStamp);
                var urlCproId = cproId;
                var cproIdIndex = cproId.indexOf(':');
                if (cproIdIndex && cproIdIndex > 0) {
                    urlCproId = cproId.substring(0, cproIdIndex);
                }
            }
        }

    }

});