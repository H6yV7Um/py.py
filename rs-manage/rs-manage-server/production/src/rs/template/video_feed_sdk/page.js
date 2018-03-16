/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_banner_lunbo
* @author liguangyi
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.video_feed_sdk',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }

            // 调整logo位置
            var logoArea = document.querySelector('#logoArea'); // 空白元素，点击区域
            var bdlogo = document.querySelector('#bd-logo'); // 熊掌图标
            var mobbdadIcon = document.querySelector('.feed-adIcon'); // 广告
            var bdlogoStyle = window.getComputedStyle(bdlogo);

            var footer = document.querySelector('.footer');
            var footerStyle = window.getComputedStyle(footer);
            var footerHeight = parseInt(footerStyle.height, 10);

            var bdlogoHeight = parseInt(bdlogoStyle.height, 10);
            var bdlogoWidth = parseInt(bdlogoStyle.width, 10);
            var bdlogoHeight = parseInt(bdlogoStyle.height, 10);

            var bglogoLeft = 3;
            var iconLeft = 5;

            var commonBottom = (footerHeight - bdlogoHeight) / 2;

            if (logoArea) {
                logoArea.style.left = bdlogoWidth + iconLeft + bglogoLeft + 'px';
                logoArea.style.bottom = commonBottom + 'px';
            }

            if (mobbdadIcon) {
                mobbdadIcon.style.left = bdlogoWidth + iconLeft + bglogoLeft + 'px';
                mobbdadIcon.style.bottom = commonBottom + 'px';
            }

            if (bdlogo) {
                bdlogo.style.left = bglogoLeft + 'px';
                bdlogo.style.bottom = commonBottom + 'px';
            }
        }
        catch (e) {
            console.log(e);
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
        var adIndex = parseInt(
            this.getAttr(sourceElement, 'data-adindex'), 10
        );
        var act = parseInt(this.getAttr(sourceElement, 'data-adtype'), 10);
        var clickUrl = this.getAttr(sourceElement, 'href');
        var adInfo = JSON.parse(JSON.stringify(this.adsExtention[adIndex]));
        adInfo.act = act;
        var clickTarget = event.target;
        // 如果是下载类广告，
        // 下载类的广告，按钮用curl，其它用v_url，lp的，都用v_url
        if (act === 2) {
            // 点击的是下载按钮
            // 则广告点击串是curl
            if (clickTarget.className.indexOf('footer-text') > -1) {
                adInfo.curl = clickUrl;
            // 否则广告的点击串是 mcurl
            } else {
                var clickArea = document.getElementById('a0');
                adInfo = this.addVideoInfo(adInfo);
                adInfo.v_url = this.getAttr(clickArea, 'href');
            }
        } else {
            adInfo = this.addVideoInfo(adInfo);
            adInfo.v_url = clickUrl || adInfo.curl;
        }
        try {
            this.sdk.handleClick(adInfo);
        } catch(e) {
            console.log(e);
        }
        return this.stopEvent(event);
    },
    addVideoInfo: function (info) {
        if (!window.videoInfo) {
            return info;
        }
        info['action'] = 'video';
        info['v_video'] = videoInfo.v_video;
        info['v_video_w'] = videoInfo.v_video_w;
        info['v_video_h'] = videoInfo.v_video_h;
        info['v_image'] = videoInfo.v_image;
        info['v_url'] = videoInfo.v_url;
        return info;
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