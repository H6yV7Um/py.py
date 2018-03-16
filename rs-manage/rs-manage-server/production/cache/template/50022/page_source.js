/**
 * @file 50022 tuwen_wap_feed_banner_2
 * @author
 */
 /*global oojs */
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk)
            || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            this.containerResize();
        } catch (e) {
        }
    },
    containerResize: function (event) {
            var item = document.getElementById('item');
            var title = document.getElementById('title');
            // 获用户的阅读模式
            var item0 = document.getElementById('item0');
            var userMode = this.getAttr(item0, 'data-mode');
            if (parseInt(userMode, 10)) {
                this.bind(item, 'touchstart', function () {
                    title.style.Color = '#535353';
                    item.style.background = '#dcdcdc';
                });
            } else {
                this.bind(item, 'touchstart', function () {
                    title.style.Color = '#c9c9c9';
                    item.style.background = '#f00';
                });
            }
        },
    // 绑定广告点击
    adClick: function (containerId, adsExtention) {
        this.adsExtention = adsExtention || window.adsExtention;
        containerId = containerId || 'container';
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
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
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adindex');
        var adType = parseInt(this.getAttr(sourceElement, 'data-adtype'), 10);
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        var m = navigator.userAgent.toLowerCase();
        if (adType === 5 && m.indexOf('safari') > -1 && m.indexOf('version') > -1
            && (m.indexOf('iphone') > -1 || m.indexOf('ipad') > -1 || m.indexOf('itouch') > -1)) {
            window.top.location = sourceElement.href;
            this.stopEvent(event);
        }
        this.sdk.handleClick(adInfo);
        return this.stopEvent(event);
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
        }
        else {
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
        }
        else {
            window.event.cancelBubble = true;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
});