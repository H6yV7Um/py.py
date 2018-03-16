/* global oojs */
/**
* @file 50015tuwen_wap_glb
* @author qianxiaoli
*/
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    sdk: {},
    adsExtention: [],
    $page: function () {
        try {
            if (document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            var ua = navigator.userAgent;
            var itemA = document.getElementById('item_0');
            var url = itemA.href || '';
            if (/(iPhone|iPod|iPad)/.test(ua) && /baiduboxapp\//i.test(ua)) {
                url = 'baiduboxapp://easybrowse?opentype=1&isla=0&openurl=' + encodeURIComponent(url) + '&newbrowser=1';
                itemA.href = url;
            }
            var tu = this.getAttr(itemA, 'data-tu');
            if (!tu && !!location.href) {
                var arr1 = location.href.split('&di=');
                if (arr1.length > 1) {
                    var arr2 = arr1[1].split('&');
                    if (arr2.length > 1) {
                        tu = arr2[0];
                    }
                }
            }
            if (!tu) {
                return;
            }
            var message = {
                msgName: 'cpro_displayAd',
                msg: {
                    tu: tu,
                    dspid: 6,
                    dsiplayAd: 1
                }
            };
            var msgStr = '{"msgName":"cpro_displayAd","msg":{"tu":"' + tu + '","dspid":6,"displayAd":1}}';
            if (!!window.postMessage) {
                parent.postMessage(msgStr, '*');
            }
            // 监听字体大小调整
            this.registerMessage();
        } catch (e) {
        }
    },
    // 动态调整长query 字体
    registerMessage: function () {
        if (window.postMessage) {
            var self = this;
            window.addEventListener('message', function (e) {
                var data = e.data;
                if (window.JSON && JSON.parse) {
                    data = JSON.parse(data);
                    if (data.msgName && data.msgName === 'cpro_ajustFont' && data.msg && data.msg.fontSize) {
                        var fS = data.msg.fontSize;
                        if (typeof(data.msg.fontSize) !== 'number') {
                            fS = parseInt(fS, 10);
                        }
                        // UE的设计将字体放大三倍 不超过行高
                        var desc = document.getElementById('desc_0');
                        fS = fS / 3;
                        if (desc) {
                            desc.style.fontSize = fS + 'px';
                        }
                    }
                };

            }, false);
        };
    },
    // 绑定广告点击
    adClick: function (containerId) {
        containerId = containerId || 'container';
        var container = document.getElementById(containerId);
        var linkArray = container.getElementsByTagName('a');
        for (var i = 0; i < linkArray.length; i++) {
            var tempClassName = linkArray[i].className;
            if (tempClassName) {
                tempClassName = tempClassName.toLowerCase();
                if (tempClassName === 'gylogo' || tempClassName === 'bdlogo'
                || tempClassName.substring(0, 7) === 'bd-logo') {
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
        var adAct = this.getAttr(sourceElement, 'data-adtype');
        var m = navigator.userAgent.toLowerCase();
        adAct = parseInt(adAct, 10);
        if (adAct === 5 && m.indexOf('safari') > -1 && m.indexOf('version') > -1
            && (m.indexOf('iphone') > -1 || m.indexOf('ipad') > -1 || m.indexOf('itouch') > -1)) {
            window.top.location = sourceElement.href;
            this.stopEvent(event);
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
    }
});