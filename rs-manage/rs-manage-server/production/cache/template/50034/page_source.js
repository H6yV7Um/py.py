/**
 * @file tuwen_image_text_lunbo_6_5 template page event
 * @author qianxiaoli
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
        if (!itemUl) {
            return;
        }
        var ulChildren = itemUl.children;
        var ulLen = itemUl.children.length;
        if (ulLen === 1) {
            return;
        }
        var itemUlWidth = itemUl.clientWidth;
        var itemCircleChildren = document.getElementById('itemCircle').children;
        var leftValue = 0;
        if (isNext) {
            if (num < ulLen - 1) {
                leftValue = parseInt(ulChildren[num].style.left === '' ? ulChildren[num].clientLeft : ulChildren[num].style.left, 10) + itemUlWidth;
                ulChildren[num + 1].style.left = leftValue + 'px';
                if (num + 1 === ulLen - 1) {
                    ulChildren[0].style.left = leftValue + itemUlWidth + 'px';
                }
                else {
                    ulChildren[num + 2].style.left = leftValue + itemUlWidth + 'px';
                }
                itemUl.style.left = -leftValue + 'px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num++;
            }
            else {
                leftValue = parseInt(ulChildren[ulLen - 1].style.left === '' ? ulChildren[ulLen - 1].clientLeft : ulChildren[ulLen - 1].style.left, 10) + itemUlWidth;
                ulChildren[0].style.left = leftValue + 'px';
                ulChildren[1].style.left = leftValue + itemUlWidth + 'px';
                itemUl.style.left = -leftValue + 'px';
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
                itemUl.style.left = -leftValue + 'px';
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
                itemUl.style.left = -leftValue + 'px';
                itemCircleChildren[num].className = 'circle';
                itemUl.style.transition = 'right .5s ease-in-out';
                num--;
            }
            currentNum = num;
        }
        var rem = parseInt(document.getElementById('container').clientWidth, 10) / 16;
        itemCircleChildren[num].className = 'circle circleNow';
        itemUl.style.transition = 'right .5s ease-in-out';
        interval = setTimeout(function () {
            lunbo.doCircle(num, true);
        }, 5000);
        this.sendWin(currentNum);
    }
};
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        try {
            lunbo.sendWin(0);
                 interval = setTimeout(function () {
                    lunbo.doCircle(0, true);
                }, 5000);
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            if(this.sdk){
                var closeBtn = document.getElementById('closeBtn');
                closeBtn.style.display = 'block';
                this.bindCloseHandler(closeBtn);
            }
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            this.containerResize();
            this.bind(window, 'resize', function () {
                this.containerResize();
            }.proxy(this));
        } catch (e) {
        }
    },
    bindCloseHandler: function (closeBtn) {
        var btnClose = closeBtn;
        if (btnClose) {
            this.bind(btnClose, 'click', function () {
                this.sdk.onAdPlayEnd();
                lunbo.stop();
                this.stopEvent(this);
            }.proxy(this));
        } else {
            btnClose.style.display = 'none'
        }
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
 
        itemUl.style.left = -leftValue + 'px';
        itemUl.style.transition = 'right .5s ease-in-out';
        this.stopEvent(event);
    },
    onAdTouchEnd: function (event) {
        if (Math.abs(delta.x) < 10 || delta.x === undefined) {
   
            return;
        }
        if (delta.x > 0) {
            lunbo.pre();
        }
        else {
            lunbo.next();
        }
    },
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
            var isTouch = true;
            var itemUl = document.getElementById('itemUl');
            if (!itemUl) {
                isTouch = false;
            }
            var ulChildren = itemUl.children;
            var ulLen = itemUl.children.length;
            if (ulLen === 1) {
                isTouch = false;
            }
            if (isTouch) {
                this.bind(linkArray[i], 'touchstart', this.onAdTouchStart.proxy(this));
                this.bind(linkArray[i], 'touchmove', this.onAdTouchMove.proxy(this));
                this.bind(linkArray[i], 'touchend', this.onAdTouchEnd.proxy(this));
            }
        }
    },
    doClose: function () {
        this.sdk.onAdPlayEnd();
        lunbo.stop();
        this.stopEvent(this);
    },

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
        var act = parseInt(this.getAttr(sourceElement, 'data-adtype'), 10);
        var clickUrl = this.getAttr(sourceElement, 'href');

        adInfo.curl = sourceElement.href || adInfo.curl;
        if (act === 4){
            window.top.location = sourceElement.href;
            return this.stopEvent(e);
        }
        this.sdk.handleClick(adInfo);
        lunbo.next();
        return this.stopEvent(e);
    },
    containerResize: function () {
        var con = document.getElementById('container');
        var itemUl = document.getElementById('itemUl');
        var ulChildren = itemUl.children;
        var ulLen = itemUl.children.length;
        var conW = parseInt(window.innerWidth, 10);
        var conH = parseInt(window.innerHeight, 10);

        if (con.clientWidth === 0 || con.clientHeight === 0 || (ulLen && ulLen > 1)) {
            return;
        }
        var topBar = 20;
        var m = navigator.userAgent.toLowerCase();
        var isIos = ((m.indexOf('iphone') > -1) || (m.indexOf('ipad') > -1));
        conH = isIos ? conH - topBar : conH;
        var itemBg = document.getElementById('itemBg');
        var imgAD = document.getElementById('imgAD');
        var logo = document.getElementById('bd-logo');
        var adMark = document.getElementById('mob-bd-adIcon');
        var fbIconDiv = document.getElementById('fbIconDiv');
        if (itemBg && imgAD) {
            con.style.marginTop = 0;
            con.style.marginLeft = 0;
            con.style.height = '100%';
            var borW = parseInt(this.getAttr(imgAD, 'data-imgBorder'), 10);
            var imgRatio = parseFloat(this.getAttr(imgAD, 'data-imgRatio'));
            var conRatio = (conH - borW * 2) / (conW - borW * 2);

 
            var itemBgW = 0; 
            var itemBgH = 0; 

           if (conRatio >= 1) {
         
                itemBgW = conW;
                itemBgH = itemBgW * 5 / 6;
            } else {
                // 横屏的情况
                /*itemBgW = conH * 6 / 5;
                itemBgH = conH;*/
                if (logo) {
                    logo.style.bottom = '0px';
                    logo.style.right = (conW - itemBgW) / 2 + 26 + 'px';
                    logo.style.display = '';
                }
                if (adMark) {
                    adMark.style.bottom = '0px';
                    adMark.style.right = (conW - itemBgW) / 2 + 'px';
                }
                if (fbIconDiv) {
                    fbIconDiv.style.bottom = '0px';
                    fbIconDiv.style.right = (conW - itemBgW) / 2 + 'px';
                }
                return false;
            }
            var itemBgPaddingLeft =  60 / 750 * itemBgW;
            var itemBgPaddingTop =  113 / 625 * itemBgH;


            var imgADW = 0;
            var imgADH = 0;
            if (imgRatio > conRatio) {
                imgADH = itemBgH - itemBgPaddingTop * 2;
                imgADW = imgADH * 2;
            }
            else {
                imgADW = itemBgW - itemBgPaddingLeft * 2;
                imgADH = imgADW / 2;
            }

     
            var centerCssTxt = 'width:' + imgADW + 'px;height:' + imgADH + 'px;';
            imgAD.style.cssText = centerCssTxt;
     
            var itemBgCssText =  'width:' + itemBgW + 'px;height:' + itemBgH + 'px;margin:'
                + (conH - borW * 2 - itemBgH) / 2 + 'px ' + (conW - borW * 2 - itemBgW) / 2 + 'px;padding:' + itemBgPaddingTop + 'px ' + itemBgPaddingLeft + 'px';
            itemBg.style.cssText = itemBgCssText;
   
            var btn = document.getElementById('btn');
            var btnStyle = 'width:' + itemBgW / 3 + 'px;height:' + itemBgW / 15 + 'px;line-height:' + itemBgW / 15 + 'px;font-size:' + itemBgW / 30 + 'px;position:absolute;left:' + (itemBgW - itemBgW / 3) / 2 + 'px;bottom:' + itemBgH / 15 + 'px;';
            if (btn) {
                btn.style.cssText = btnStyle;
            }

            var linkItem = document.getElementById('item0');
            if (linkItem) {
                linkItem.style.cssText = 'width:' + itemBgW + 'px;height:' + itemBgH
                + 'px;position:absolute;z-index:15;left:' + (conW - borW * 2 - itemBgW) / 2
                + 'px;top:0px;';
            }
            if (logo) {
                logo.style.bottom = (conH - itemBgH) / 2 + (isIos ? topBar : 0) / 2 + 'px';
                logo.style.right = (conW - itemBgW) / 2 + 26 + 'px';
                logo.style.display = '';
            }
            if (adMark) {
                adMark.style.bottom = (conH - itemBgH) / 2 + (isIos ? topBar : 0) / 2 + 'px';
                adMark.style.right = (conW - itemBgW) / 2 + 'px';
            }
            if (fbIconDiv) {
                fbIconDiv.style.bottom = (conH - itemBgH) / 2 + (isIos ? topBar : 0) / 2 + 'px';
                fbIconDiv.style.right = (conW - itemBgW) / 2 + 'px';
            }
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