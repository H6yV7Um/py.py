/* global oojs */
/* global actionTypeInfo */
/* global adWidth */
/* global adHeight */
/**
* @file tuwen_sdk_1
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_sdk_1',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            this.container = document.getElementById('container');
            if (window.adsExtention && this.container) {
                this.adClick('container', window.adsExtention);
                this.secondCheck = document.getElementById('secondCheck');
                this.secondCheckButton = document.getElementById('secondCheckButton');
                this.bind(this.secondCheckButton, 'click', this.secondCheckButtonClickHandle.proxy(this));
                this.bind(this.secondCheck, 'click', this.secondCheckClickHandle.proxy(this));
            }
        } catch (e) {
        }
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
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
        var adInfo = this.getAdInfo(event);
        var e = this.formatEventObj(event);
        if (this.isInEdge(e, 0.01, 0.01)) {
            this.secondCheckButton.style.right = '0';
            this.secondCheck.className = 'second-check show';
            setTimeout(function () {
                this.secondCheckButton.style.right = '1em';
            }.proxy(this), 0);
        }
        else {
            this.secondCheck.className = 'second-check hide';
            this.sdk.handleClick(adInfo);
        }
        return this.stopEvent(event);
    },
    secondCheckButtonClickHandle: function (event) {
        var adInfo = this.getAdInfo(event);
        this.sdk.handleClick(adInfo);
        this.secondCheck.className = 'second-check hide';
    },
    secondCheckClickHandle: function (event) {
        this.secondCheck.className = 'second-check hide';
    },
    getAdInfo: function (event) {
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        if (!this.adInfo) {
            var adIndex = this.getAttr(sourceElement, 'data-adindex');
            adIndex = parseInt(adIndex, 10);
            this.adInfo = this.adsExtention[adIndex];
        }
        this.adInfo.curl = sourceElement.href || this.adInfo.curl;
        return this.adInfo;
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
    isInEdge: function (e, w, h) {
        if (!e || !h || !w) {
            return false;
        }
        var x = e.clientX;
        var y = e.clientY;
        try {
            var cw = adWidth;
            var ch = adHeight;
            var offsetTop = this.container.offsetTop;
            var offsetLeft = this.container.offsetLeft;
            var left = cw * w + offsetLeft;
            var top = ch * h + offsetTop;
            if (x > left && x < cw + offsetLeft - cw * w && y > top && y < ch + offsetTop - ch * h) {
                return false;
            }
        } catch (e) {
            return true;
        }
        return true;
    }
});