/* global oojs */
/* global actionTypeInfo */
/**
* @file 10012
* @author
*/
/* eslint-disable max-len */
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
            } catch (e) {
            }
            this.timer = 5000;
            this.autoLunbo(this.timer, 'frame');
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
                    if (tempClassName === 'gylogo' || tempClassName === 'bdlogo' || tempClassName.substring(0, 7)
                    === 'bd-logo') {
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
            var adType = this.getAttr(sourceElement, 'type');
            if (adType === 'phone') {
                var curl = this.getAttr(sourceElement, 'href');
                var href = this.getAttr(sourceElement, 'data-tel');
                this.sendByImage(curl, window, href);
                return this.stopEvent(event);
            }
            else if (adType === 'forward') {
                var href = this.getAttr(sourceElement, 'href');
                window.open(href, '_blank');
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
        sendByImage: function (url, win, href) {
            var img = new Image();
            var key = 'cpro_log_' + Math.floor(Math.random() * 2147483648).toString(36);
            win = win || window;
            win[key] = img;

            img.onload = img.onerror = img.onabort = function () {
                img.onload = img.onerror = img.onabort = null;
                win[key] = null;
                img = null;
                window.open(href, '_top');
            };
            img.src = url;
            var m = navigator.userAgent.toLowerCase();
            if (m.indexOf('safari') > -1 && m.indexOf('version') > -1
                && (m.indexOf('iphone') > -1 || m.indexOf('ipad') > -1 || m.indexOf('itouch') > -1)) {
                window.open(href, '_top');
            }
        }
    });