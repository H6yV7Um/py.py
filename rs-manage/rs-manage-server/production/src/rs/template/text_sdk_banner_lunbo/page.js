/* global oojs */
/* global actionTypeInfo */
/**
* @file text_sdk_banner_lunbo
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.text_sdk_banner_lunbo',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
        } catch(e) {
        }
        this.timer = 5000;
        this.autoLunbo(this.timer, 'frame');
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        if (closeBtn && this.sdk && this.sdk.AdCloseAvailable && this.sdk.AdCloseAvailable()) {
            this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
        } else {
            closeBtn.style.display = 'none';
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
                if (tempClassName === 'gylogo' || tempClassName === 'bdlogo' || tempClassName.substring(0, 7) === 'bd-logo') {
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
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        // 排查问题添加的临时日志
        var act = this.getAttr(sourceElement, 'data-adtype');
        var stamp = (new Date()).getTime();
        var clickLogSrc = 'https://eclick.baidu.com/se.jpg?exp=70543&act=' + act + '&stamp=' + stamp + '&templateName=text_sdk_banner_lunbo';
        var isIOS = (/iphone|ipad|ipod/i).test(window.navigator.userAgent.toLowerCase());
        clickLogSrc = isIOS ? clickLogSrc + '&os=ios' : clickLogSrc + '&os=android';
        this.sendByImage(clickLogSrc);
        // 排查问题添加的临时日志-end
        this.sdk.handleClick(adInfo);
        // 排查问题添加的临时日志
        var clickLogSrc2 = 'https://eclick.baidu.com/se.jpg?exp=77543&act=' + act + '&stamp=' + stamp + '&templateName=text_sdk_banner_lunbo';
        clickLogSrc2 = isIOS ? clickLogSrc2 + '&os=ios' : clickLogSrc2 + '&os=android';
        this.sendByImage(clickLogSrc2);
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
        if (event && event.stopPropagation) {
            event.preventDefault();
        }
        return false;
    },
    // 自动轮播
    lunbo: function () {
        clearTimeout(this.lunboTimer);
        this.displayDom.style.top = 0;
        this.hiddenDom.style.top = this.lunboStep + 'px';
        this.lunboInterval = setInterval(function () {
            this.displayDom.style.top = parseFloat(this.displayDom.style.top.replace('px', '')) - this.lunboEachStep + 'px';
            this.hiddenDom.style.top = parseFloat(this.hiddenDom.style.top.replace('px', '')) - this.lunboEachStep + 'px';
            if (Math.abs(this.hiddenDom.style.top.replace('px', '')) <= this.lunboEachStep || Math.abs(this.hiddenDom.style.top.replace('px', '')) === 0) {
                clearInterval(this.lunboInterval);
                this.hiddenDom.style.top = 0;
                this.displayDom.style.top = this.lunboStep + 'px';
                var tempDom = this.displayDom;
                this.displayDom = this.hiddenDom;
                this.hiddenDom = tempDom;
            }
        }.proxy(this), 50);
    },
    autoLunbo: function (lunboTime, lunboDom, lunboStep) {
        this.lunboDomArray = document.querySelectorAll('div.' + lunboDom);
        this.lunboStep = this.lunboDomArray[0].offsetHeight;
        if (this.lunboStep && this.lunboDomArray.length) {
            this.lunboEachStep = this.lunboStep / 10;
            this.displayDom =  this.displayDom || this.lunboDomArray[0];
            this.hiddenDom = this.hiddenDom || this.lunboDomArray[1];
            this.lunboTimer = setTimeout(function () {
                this.lunboAd();
            }.proxy(this), this.timer);
        }
    },
    lunboAd: function () {
        clearInterval(this.lunboInterval);
        this.lunbo();
        this.lunboTimer = setTimeout(function () {
            this.lunboAd();
        }.proxy(this), this.timer);
    },
    sendByImage: function (url, win) {
        var img = new Image();
        var key = 'cpro_log_' + Math.floor(Math.random() * 2147483648).toString(36);
        win = win || window;
        win[key] = img;

        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
            win[key] = null;
            img = null;
        };
        img.src = url;
    }
});