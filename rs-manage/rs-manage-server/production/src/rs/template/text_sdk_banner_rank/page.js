/* global oojs */
/* global actionTypeInfo */
/**
* @file tuwen_sdk
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.text_sdk_banner_rank',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            this.sdk = parent.baidu.mobads.Sdk;
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
        } catch(e) {
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
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adIndex');
        adIndex = parseInt(adIndex, 10);
        var curl = this.getAttr(sourceElement, 'href');
        var smsinfo = actionTypeInfo[adIndex].smsInfo || '';
        var mailinfo = actionTypeInfo[adIndex].mailInfo || '';
        var telnum = actionTypeInfo[adIndex].telNum || '';
        var adType = this.getAttr(sourceElement, 'data-adType');
        adType = parseInt(adType, 10);
        var adInfo = this.adsExtention[adIndex];
        try {
            adInfo = JSON.parse(adInfo);
        } catch(e) {
            adInfo = {};
        }
        if (adType === 1) {
            this.sdk.open(curl, adInfo);
        } else if (adType === 2) {
            this.sdk.startDownload(curl, adInfo);
        } else if (adType === 4) {
            this.sdk.openMap(curl, adInfo);
        } else if (adType === 8) {
            this.Sdk.sendSMS(smsinfo, adInfo);
        }else if (adType === 16) {
            this.Sdk.sendSMS(mailinfo, adInfo);
        }else if (adType === 32) {
            this.Sdk.sendSMS(telnum, adInfo);
        }
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
    }
});