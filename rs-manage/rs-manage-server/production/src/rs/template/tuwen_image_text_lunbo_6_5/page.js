/**
 * @file tuwen_image_text_lunbo_6_5 template page event
 *@author qianxiaoli
 */
/* eslint-disable max-len */
/* globals oojs */
/* globals rs */
/* globals winUrlArr */
var interval;
var currentNum = 0;
var delta = {};
var start = {};
var lunbo = {
    pre: function () {
        this.stop();
        this.doCircle(currentNum, false);
    },
    next: function () {
        this.stop();
        this.doCircle(currentNum, true);
    },
    touchstart: function () {
        this.stop();
    },
    touchmove: function () {

    },
    touchend: function () {

    },
    stop: function () {
        clearTimeout(interval);
    },
    sendWin: function (curNum) {
        // 添加winURL
        try {
            for (var i = 0, len = winUrlArr[curNum].length; i < len; i++) {
                var imageWin = new Image();
                if (winUrlArr[curNum][i] !== 0) {
                    imageWin.src = winUrlArr[curNum][i];
                }
                else {
                    return;
                }
                winUrlArr[curNum][i] = 0;
                imageWin.onload = imageWin.onerror = function () {};
            }
        } catch (e) {}
    },
    doCircle: function (num, isNext) {
        var itemUl = document.getElementById('itemUl');
        var ulChildren = itemUl.children;
        var ulLen = itemUl.children.length;
        var itemUlWidth = itemUl.clientWidth;
        var itemCircleChildren = document.getElementById('itemCircle').children;
        var leftValue = 0;
        if (isNext) {
            if (num < ulLen - 1) {
                leftValue = parseInt(ulChildren[num].style.left === '' ? ulChildren[num].clientLeft : ulChildren[num].style.left, 10) + itemUlWidth;
                ulChildren[num + 1].style.left = leftValue + 'px';
                // itemUl.style.transform = 'translate3d(' + (-leftValue) + 'px, 0, 0)';
                if (num + 1 === ulLen - 1) {
                    ulChildren[0].style.left = leftValue + itemUlWidth + 'px';
                }
                else {
                    ulChildren[num + 2].style.left = leftValue + itemUlWidth + 'px';
                }
                itemUl.style.left = -leftValue + 'px';
                // itemCircleChildren[num].style.backgroundPosition = '0px 0px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num++;
            }
            else {
                leftValue = parseInt(ulChildren[ulLen - 1].style.left === '' ? ulChildren[ulLen - 1].clientLeft : ulChildren[ulLen - 1].style.left, 10) + itemUlWidth;
                ulChildren[0].style.left = leftValue + 'px';
                ulChildren[1].style.left = leftValue + itemUlWidth + 'px';
                // itemUl.style.transform = 'translate3d(' + (-leftValue) + 'px, 0, 0)';
                itemUl.style.left = -leftValue + 'px';
                // itemCircleChildren[num].style.backgroundPosition = '0px 0px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num = 0;
            }
            currentNum = num;
        }
        else {
            if (num === 0) {
                leftValue = parseInt(ulChildren[num].style.left === '' ? ulChildren[num].clientLeft : ulChildren[num].style.left, 10) - itemUlWidth;
                ulChildren[ulLen - 1].style.left = leftValue + 'px';
                if (ulLen - 2 > - 1) {
                    ulChildren[ulLen - 2].style.left = leftValue - itemUlWidth + 'px';
                }
                else {
                    ulChildren[0].style.left = leftValue - itemUlWidth + 'px';
                }
                // itemUl.style.transform = 'translate3d(' + (-leftValue) + 'px, 0, 0)';
                itemUl.style.left = -leftValue + 'px';
                // itemCircleChildren[num].style.backgroundPosition = '0px 0px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num = ulLen - 1;
            }
            else {
                leftValue = parseInt(ulChildren[num].style.left === '' ? ulChildren[num].clientLeft : ulChildren[num].style.left, 10) - itemUlWidth;
                ulChildren[num - 1].style.left = leftValue + 'px';
                if (num - 1 > 0) {
                    ulChildren[num - 2].style.left = leftValue - itemUlWidth + 'px';
                }
                else {
                    ulChildren[ulLen - 1].style.left = leftValue - itemUlWidth + 'px';
                }
                // itemUl.style.transform = 'translate3d(' + (-leftValue) + 'px, 0, 0)';
                itemUl.style.left = -leftValue + 'px';
                // itemCircleChildren[num].style.backgroundPosition = '0px 0px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num--;
            }
            currentNum = num;
        }
        var rem = parseInt(document.getElementById('container').clientWidth, 10) / 16;
        // itemCircleChildren[num].style.backgroundPosition = '0px  ' + '0.4' * rem + 'px';
        itemCircleChildren[num].className = 'circle circleNow';
        itemUl.style.transition = 'right .5s ease-in-out';
        interval = setTimeout(function () {lunbo.doCircle(num, true); }, 5000);
        this.sendWin(currentNum);
    }
};
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_image_text_lunbo_6_5',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            lunbo.sendWin(0);
            interval = setTimeout(function () {lunbo.doCircle(0, true); }, 5000);
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
        } catch (e) {
        }
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        this.bind(closeBtn, 'click', function () {rs.template.tuwen_image_text_lunbo_6_5.page.sdk.onAdPlayEnd(); lunbo.stop(); rs.template.tuwen_image_text_lunbo_6_5.page.stopEvent(this); });
    },
    onNextClick: function (event) {
        lunbo.next();
        return this.stopEvent(event);
    },
    onPreClick: function (event) {
        lunbo.pre();
        return this.stopEvent(event);
    },
    onAdTouchStart: function (event) {
        lunbo.stop();
        var touches = event.touches[0];
        start = {
            x: touches.pageX,
            y: touches.pageY
        };
        delta = {};
        // return this.stopEvent(event);
    },
    onAdTouchMove: function (event) {
        var touches = event.touches[0];
        delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
        };
        var itemUl = document.getElementById('itemUl');
        var ulChildren = itemUl.children;
        var leftValue = parseInt(ulChildren[currentNum].style.left === '' ? ulChildren[currentNum].clientLeft : ulChildren[currentNum].style.left, 10) - delta.x;
        // itemUl.style.transform = 'translate3d(' + ( - leftValue) + 'px, 0, 0)';
        itemUl.style.left = -leftValue + 'px';
        itemUl.style.transition = 'right .5s ease-in-out';
        this.stopEvent(event);
    },
    onAdTouchEnd: function (event) {
        if (Math.abs(delta.x) < 10 || delta.x === undefined) {
            // this.onAdClick(event);
            return;
        }
        if (delta.x > 0) {
            lunbo.pre();
        }
        else {
            lunbo.next();
        }
        // this.stopEvent(event);
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
            this.bind(linkArray[i], 'touchstart', this.onAdTouchStart.proxy(this));
            this.bind(linkArray[i], 'touchmove', this.onAdTouchMove.proxy(this));
            this.bind(linkArray[i], 'touchend', this.onAdTouchEnd.proxy(this));
        }
    },
    doClose: function () {
        rs.template.tuwen_image_text_fulllunbo.page.sdk.onAdPlayEnd();
        lunbo.stop();
        rs.template.tuwen_image_text_fulllunbo.page.stopEvent(this);
    },
    // 广告被点击
    onAdClick: function (event) {
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        if (sourceElement.id.indexOf('closeDiv') > -1) {
            this.doClose();
        }
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adindex');
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        this.sdk.handleClick(adInfo);
        lunbo.next();
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
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
});
