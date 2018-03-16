/* global oojs */

/* global actionTypeInfo */

/**
* @file image_full_splash
* @author fanwenjuan
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_full_splash',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    // sdkIsEmpty: function () {
    //     for (var key in sdk) {
    //         return false;
    //     }
    //     return true;
    // },
    $page: function () {
        var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        var isAnd = /Android/i.test(navigator.userAgent);

        var target = document.querySelector('#container img');
        var bgTarget = document.querySelector('.item-bg-image');
        var start = +new Date;
        var loadTime = 0;

        var qk = adsExtention[0].qk;
        var img = new Image();
        img.src = 'http://eclick.baidu.com/mdsptest.jpg?type=start&production=splash&v=' + (isIOS ? 'ios' : 'android') + '&qk=' + qk;

        target.onload = function () {
            loadTime = +new Date - start;
            var img = new Image();
            img.src = 'http://eclick.baidu.com/mdsptest.jpg?type=end&production=splash&v=' + (isIOS ? 'ios' : 'android') + '&qk=' + qk + '&t=' + loadTime;
        };

        if (stuffSrc) {
            target.src = stuffSrc;
            bgTarget.style.backgroundImage = 'url(' + stuffSrc + ')';
        }

        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            // FOR TEST
            // if (!this.sdk || this.sdkIsEmpty()) {
            //     this.sdk = {
            //         handleClick: function () {
            //         	alert('This is handleClick');
            //         }
            //     }
            // }
            // FOR TEST
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            // 广告标识的逻辑判断
            var adIcon = document.getElementsByClassName('mob-bd-adIcon')[0];
            if (this.sdk && !this.sdk.needsAdIcon) {
                adIcon.style.display = 'none';
            }
        }
        catch (e) {}
    },
    // sendWin: function (curNum) {
    //     // 添加winURL
    //     try {
    //         for (var i = 0, len = winUrlArr[curNum].length; i < len; i++) {
    //             var imageWin = new Image();
    //             if (winUrlArr[curNum][i] !== 0) {
    //                 imageWin.src = winUrlArr[curNum][i];
    //             }
    //             else {
    //                 return;
    //             }
    //             winUrlArr[curNum][i] = 0;
    //             imageWin.onload = imageWin.onerror = function () {};
    //         }
    //     } catch (e) {}
    // },
    // 绑定下载按钮事件
    // bindCloseHandler: function () {
    //     var closeBtn = document.getElementById('closeBtn');
    //     this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
    // },
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
        this.sdk.handleClick(adInfo);
        return this.stopEvent(event);
    },
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        }
        else {
            element.attachEvent('on' + type, handler);
        }
    },
    getAttr: function (element, key) {
        if (element && element.getAttribute) {
            return element.getAttribute(key);
        }

        return element[key];

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
