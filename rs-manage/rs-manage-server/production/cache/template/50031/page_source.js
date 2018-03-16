/* global oojs */

/**
* @file tuwen_sdk_logo_multi_image
* @author liguangyi
*/
/* eslint-disable */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_sdk_logo_multi_image',
    deps: {},
    sdk: {},
    adsExtention: [],
    $page: function () {

        try {
            this.sdk = (
                window.baidu
                && window.baidu.mobads
                && window.baidu.mobads.Sdk)
            || (parent
                && parent.baidu
                && parent.baidu.mobads
                && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            this.container = document.getElementById('container');
            if (window.adsExtention && this.container) {
                this.adClick('container', window.adsExtention);
            }
        } catch (e) {
        }

        var container = document.querySelector('.container');
        var gallery = document.querySelector('.gallery');
        var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery__item'));
        var centerGalleryItem = galleryItems[1];

        var galleryStyle = window.getComputedStyle(gallery);
        var galleryWidth = parseInt(galleryStyle.width, 10);
        var galleryHeight = parseInt(galleryStyle.height, 10);
        var itemWidth = parseInt(window.getComputedStyle(centerGalleryItem).width, 10);

        // 图片gap
        var imageGap = container.getAttribute('data-gap');
        if (imageGap > 0) {
            var widthLeftForImages = galleryWidth - imageGap * 2;
            var imageWidth = widthLeftForImages / 3;
            var imageHeight = imageWidth / 3 * 2;

            galleryItems.forEach(function (item, index) {
                item.style.width = imageWidth + 'px';
                item.style.height = imageHeight + 'px';
                item.style.float = 'left';
                item.style.marginLeft = 0;
                if (index !== 0) {
                    item.style.marginLeft = imageGap + 'px';
                }
            });
            // 水平居中
            galleryItems[0].style.marginLeft = galleryWidth - imageGap * 2 - imageWidth * 3 + 'px';
            // 垂直居中？
        } else {
            var marginWidth = (galleryWidth - itemWidth * 3) / 2;
            centerGalleryItem.style.marginLeft = marginWidth + 'px';
        }

        // 调整logo位置
        var logoArea = document.querySelector('#logoArea'); // 空白元素，点击区域
        var bdlogo = document.querySelector('#bd-logo'); // 熊掌图标
        var mobbdadIcon = document.querySelector('.mob-bd-adIcon'); // 广告二字

        var containerPaddingLeft = parseInt(
                                        window.getComputedStyle(
                                            document.querySelector('#container')
                                        ).paddingLeft
                                    , 10);
        if (logoArea) {
            logoArea.style.left = containerPaddingLeft + 'px';
            logoArea.style.bottom = '1px';
        }

        if (bdlogo) {
            bdlogo.style.left = containerPaddingLeft + 'px';
            bdlogo.style.bottom = '1px';
        }

        if (mobbdadIcon) {
            mobbdadIcon.style.left = containerPaddingLeft + 'px';
            mobbdadIcon.style.bottom = '1px';
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
                if (tempClassName === 'gylogo'
                    || tempClassName === 'bdlogo'
                    || tempClassName.substring(0, 7) === 'bd-logo') {
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
