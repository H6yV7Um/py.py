/* global oojs */
/* global actionTypeInfo */
/**
* @file
* @author
*/
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    // Sdk js �ӿ�
    sdk: {},
    // �����չ�ֶ�
    adsExtention: [],
    resizeTimer: null,
    $page: function () {
        try {
            this.adClick('container');
        } catch (e) {
        }
    },
    // �󶨹����
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
    // ��汻���
    onAdClick: function (event) {
        /* globals e */
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a'
            && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adtype');
        adIndex = parseInt(adIndex, 10);
        // safari��תappStore
        var m = navigator.userAgent.toLowerCase();
        if (adIndex === 5 && m.indexOf('safari') > -1 && m.indexOf('version') > -1 && (/iphone|ipad|ipod|itouch/.test(m))) {
            window.top.location = sourceElement.href;
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
    // ��ֹĬ����Ϊ
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