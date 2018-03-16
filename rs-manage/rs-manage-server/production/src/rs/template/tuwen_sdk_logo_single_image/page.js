/* eslint-disable */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_sdk_logo_single_image',
    deps: {},
    sdk: {},
    adsExtention: [],
    $page: function () {

        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            this.container = document.getElementById('container');
            if (window.adsExtention && this.container) {
                this.adClick('container', window.adsExtention);
            }
        } catch (e) {
        }

        // 调整logo位置
        var logoArea = document.querySelector('#logoArea'); // 空白元素，点击区域
        var bdlogo = document.querySelector('#bd-logo'); // 熊掌图标
        var mobbdadIcon = document.querySelector('.mob-bd-adIcon') // 广告二字
        var baiduIconHeight = parseInt(window.getComputedStyle(mobbdadIcon).height);

        var container = document.querySelector('.container');
        var logoWrapper = document.querySelector('.logo-wrapper');
        var contentWrapper = document.querySelector('.content-wrapper');
        var material = document.querySelector('.material');

        var containerStyle = window.getComputedStyle(container);
        var containerPaddingLeft = parseInt(containerStyle.paddingLeft);
        var containerPaddingRight = parseInt(containerStyle.paddingRight);
        var containerPaddingTop = parseInt(containerStyle.paddingTop);
        var containerWidth = parseInt(containerStyle.width);
        var containerHeight = parseInt(containerStyle.height);

        var contentWrapperStyle = window.getComputedStyle(contentWrapper);
        var contentWrapperWidth = parseInt(contentWrapperStyle.width);
        var contentWrapperHeight = parseInt(contentWrapperStyle.height);
        var logoWrapperWidth = parseInt(window.getComputedStyle(logoWrapper).width);
        var materialBottom = parseInt(window.getComputedStyle(material).bottom);

        var gapWidthBetweenLogoAndContent = containerWidth - containerPaddingLeft - containerPaddingRight - contentWrapperWidth - logoWrapperWidth;

        logoWrapper.style.marginLeft = (containerWidth - containerPaddingLeft - containerPaddingRight - logoWrapperWidth - contentWrapperWidth) / 2 + 'px';

        var logoMarginLeft = containerPaddingLeft + logoWrapperWidth + gapWidthBetweenLogoAndContent;
        var logBottomDistance = (containerHeight - containerPaddingTop - contentWrapperHeight - baiduIconHeight + materialBottom) / 2;

        if (logoArea) {
            logoArea.style.left = logoMarginLeft + 'px';
            logoArea.style.bottom = logBottomDistance + 'px';
        }

        if (bdlogo) {
            bdlogo.style.left = logoMarginLeft + 30 + 'px';
            bdlogo.style.bottom = logBottomDistance + 'px';
        }

        if (mobbdadIcon) {
            mobbdadIcon.style.left = logoMarginLeft + 'px';
            mobbdadIcon.style.bottom = logBottomDistance + 'px';   
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
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
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
        var adInfo = this.getAdInfo(event);
        var e = this.formatEventObj(event);
        this.sdk.handleClick(adInfo);
        return this.stopEvent(event);
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
    }    
});