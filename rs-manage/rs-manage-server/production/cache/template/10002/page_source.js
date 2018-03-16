/**
 * @file 10002 template page event
 */
/* eslint-disable max-len */
/* globals rs */
/* globals oojs */
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    // Sdk js 接口
    sdk: {},
    // 广告扩展字段
    adsExtention: [],
    resizeTimer: null,
    $page: function () {
        try {
            this.adClick('container');
        } catch (e) {}
    },
    // 绑定广告点击
    adClick: function (containerId) {
        containerId = containerId || 'container';
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
            var tempId = linkArray[i].id;
            if (tempClassName) {
                tempClassName = tempClassName.toLowerCase();
                if (tempClassName === 'gylogo' || tempClassName === 'bdlogo'
                    || tempClassName.substring(0, 7) === 'bd-logo') {
                    continue;
                }
            }
            this.bind(linkArray[i], 'click', this.onAdClick.proxy(this));
        }
    },
    // 广告被点击
    onAdClick: function (event) {
        /* globals e */
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adtype');
        adIndex = parseInt(adIndex, 10);
        // safari跳转appStore
        var m = navigator.userAgent.toLowerCase();
        if (adIndex === 5 && m.indexOf('safari') > -1 && m.indexOf('version') > -1 && (/iphone|ipad|ipod|itouch/.test(m))) {
            window.top.location = sourceElement.href;
            return this.stopEvent(event);
        }
        var adType = this.getAttr(sourceElement, 'type');
        if (adType === 'phone') {
            var curl = this.getAttr(sourceElement, 'curl');
            var href = this.getAttr(sourceElement, 'href');
            var m = navigator.userAgent.toLowerCase();
            if (m.indexOf('safari') > -1 && m.indexOf('version') > -1
                && (m.indexOf('iphone') > -1 || m.indexOf('ipad') > -1 || m.indexOf('itouch') > -1)) {
                window.open(href, '_top');
            }
            var iframe = document.createElement('iframe');
            if (curl) {
                iframe.src = curl;
            }
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            return this.stopEvent(event);
        } else if (adType === 'message') {
            var userAgent = navigator.userAgent;
            var msgCon = this.getAttr(sourceElement, 'msgCon');
            var msgNum = this.getAttr(sourceElement, 'msgNum');
            var newmsg = msgCon;
            var isIphone = userAgent.toLowerCase().match(/iphone/i) === 'iphone';
            if (isIphone) {
                newmsg = newmsg.replace(/\?body/, ';body');
            }
            var isBaiduboxapp = userAgent.toLowerCase().match('baiduboxapp') === 'baiduboxapp';
            var index = newmsg.indexOf('=');
            var link = newmsg.substring(0, index) + '=' + encodeURIComponent(newmsg.substring(index + 1));
            if (isBaiduboxapp) {
                var bodyindex = newmsg.indexOf('body');
                link = link.substring(0, bodyindex - 1) + ' ' + link.substring(bodyindex - 1);
            }
            var m = navigator.userAgent.toLowerCase();
            if (m.indexOf('safari') > -1 && m.indexOf('version') > -1
                && (m.indexOf('iphone') > -1 || m.indexOf('ipad') > -1 || m.indexOf('itouch') > -1)) {
                window.open(link, '_top');
            }
            var iframe = document.createElement('iframe');
            var curl = this.getAttr(sourceElement, 'curl');
            if (curl) {
                iframe.src = curl;
            }
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            return this.stopEvent(event);
        }
    },
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, handler);
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        } else {
            return element[key];
        }
    },
    formatEventObj: function (e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        return e;
    },
    // 阻止默认行为
    stopEvent: function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
});