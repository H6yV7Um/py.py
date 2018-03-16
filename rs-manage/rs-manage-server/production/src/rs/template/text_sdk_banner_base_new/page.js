/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_banner_lunbo
* @author liguangyi
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.text_sdk_banner_base_new',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    makeIconAndPicVerticalCenter: function () {
        var icon = document.querySelector('.icon');
        var container = document.querySelector('.container');

        if (!icon || !container) {
            return;
        }

        var containerHeight = parseInt(window.getComputedStyle(container).height, 10);
        var iconHeight = parseInt(window.getComputedStyle(icon).height, 10);

        icon.style.marginTop = (containerHeight - iconHeight) / 2 + 'px';

        var pic = document.querySelector('.pic');
        if (pic) {
            var picHeight = parseInt(window.getComputedStyle(pic).height, 10);
            pic.style.marginTop = (containerHeight - picHeight) / 2 + 'px';
        }
    },
    makeTextVerticalCenter: function () {
        var title = document.querySelector('.title');
        var desc = document.querySelector('.desc');
        var container = document.querySelector('.container');

        var titleHeight = parseInt(window.getComputedStyle(title).height, 10);
        var descHeight = parseInt(window.getComputedStyle(desc).height, 10);
        var containerHeight = parseInt(window.getComputedStyle(container).height, 10);

        var titleMarginBottom = 3;
        title.style.marginBottom = titleMarginBottom + 'px';
        title.style.marginTop = (containerHeight - titleHeight - descHeight - titleMarginBottom) / 2 + 'px';
    },
    $page: function () {
        this.makeIconAndPicVerticalCenter();
        this.makeTextVerticalCenter();
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }

        }
        catch (e) {}
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
    // 绑定关闭按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        if (closeBtn && this.sdk && this.sdk.AdCloseAvailable && this.sdk.AdCloseAvailable()) {
            this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
        } else {
            closeBtn.style.display = 'none';
        }
    },
    // 广告被点击
    onAdClick: function (event) {
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = parseInt(
            this.getAttr(sourceElement, 'data-adindex'), 10
        );
        var act = parseInt(this.getAttr(sourceElement, 'data-adtype'), 10);
        var clickUrl = this.getAttr(sourceElement, 'href');
        var adInfo = this.adsExtention[adIndex];

        adInfo.curl = clickUrl || adInfo.curl;
        adInfo.act = act;
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