/* global oojs */
/* global winUrlArr */
/* global actionTypeInfo */

/**
* @file tuwen_sdk_feedtemplet_static
* @author liguangyi
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: '',
    deps: {},
    sdkIsEmpty: function () {
        if (!this.sdk) {
            return true;
        }

        for (var key in this.sdk) {
            return false;
        }

        return true;
    },
    checkViewState: function () {
        if (this.sdkNotExist) {
            return;
        }

        var self = this;

        var checkInterval = setInterval(function () {
            self.carousel.conti();
            var curAdIndex = self.carousel.getCurAdIndex();
            if (!self.adsLoadState[curAdIndex]) {
                var imgs = document.querySelectorAll('#container .item img');
                var el = imgs[curAdIndex];
                el.src = self.getAttr(el, 'data-src');
                if (self.adsLoadState.length > 1) {
                    self.sendWin(curAdIndex);
                }
                self.adsLoadState[curAdIndex] = true;
            }

            if (self.allAdsIsLoaded()) {
                window.clearInterval(checkInterval);
            }
        }, 1000 * 1);
    },
    sendWin: function (curNum) {
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
        }
        catch (e) {}
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
        }
    },
    allAdsIsLoaded: function () {
        for (var i = 0; i < this.adsLoadState.length; i++) {
            var state = this.adsLoadState[i];

            if (!state) {
                return false;
            }

        }

        return true;
    },
    showImages: function () {
        this.sdkNotExist = true;
        var self = this;

        var imgs = Array.prototype.slice.call(document.querySelectorAll('#container .item img'));

        imgs.forEach(function (el, index) {
            el.src = el.getAttribute('data-src');
            self.adsLoadState[index] = true;
            self.sendWin(index);
        });
    },
    $page: function () {
        this.sdkNotExist = false;

        var container = document.querySelector('#container');
        var target = document.querySelector('#container .image-list');
        this.carousel = this.init(target, container);
        this.carousel.pause();
        this.adsLoadState = [];
        var self = this;

        var ctrlDots = Array.prototype.slice.call(document.querySelectorAll('#container .controller-list-item'));

        ctrlDots.forEach(function (ele, index) {
            ele.addEventListener('click', function (e) {
                var selectIndex = this.getAttribute('data-selectIndex');
                self.carousel.goto(selectIndex);
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, false);
        });

        for (var i = 0; i < this.carousel.getAdsLength(); i++) {
            this.adsLoadState[i] = 0;
        }

        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);

            if (!this.sdk || this.sdkIsEmpty()) {
                this.showImages();
            }
            var container = document.getElementById('container');

            if (!this.sdkNotExist) {
                this.checkViewState();
            }
            else {
                this.conti();
            }

            if (window.adsExtention && container) {
                this.adClick('container', window.adsExtention);
            }

        }
        catch (e) {
            this.showImages();
            this.conti();
        }
    },
    onAdClick: function (event) {
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adindex');
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        if (!this.sdkNotExist) {
            this.sdk.handleClick(adInfo);
        }

        return this.stopEvent(event);
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
    init: function (target, surface) {
        var items = target.children;
        this.target = target;
        this.count = items.length;

        var startPos = null;
        var curPos = null;

        this.itemWidth = parseInt(window.getComputedStyle(items[0]).width, 10);

        var maxOffsetLeft = (this.count - 1) * this.itemWidth * (-1);
        var minOffsetLeft = 0;
        this.curCarouselStyleLeft = 0;

        this.eventQueue = {};
        this.curItemIndex = 0;
        this.prevItemIndex = -1;

        var self = this;
        this.carouselInterval = null;

        if (this.count > 1) {
            this.carouselClockSetup();
        }

        return this;
    },
    getAdsLength: function () {
        return this.count;
    },
    getCurAdIndex: function () {
        return this.curItemIndex;
    },
    carouselClockSetup: function () {
        var self = this;
        if (this.carouselInterval) {
            return;
        }

        this.carouselInterval = setInterval(function () {
            self.next();
        }, 1000 * 5);
    },
    on: function (eventName, eventHandler) {
        this.eventQueue[eventName] = this.eventQueue[eventName] || [];
        this.eventQueue[eventName].push(eventHandler);
    },
    to: function (index) {
        this.curCarouselStyleLeft = index * this.itemWidth * (-1);
        this.target.style.transition = '.3s all ease-out';
        this.target.style.left = this.curCarouselStyleLeft + 'px';
    },
    goto: function (index) {
        this.pause();
        this.conti();

        this.prevItemIndex = this.curItemIndex;
        this.curItemIndex = index % this.count;
        this.triggerChangeEvent();

        this.to(this.curItemIndex);
    },
    next: function () {
        this.curItemIndex = ++this.curItemIndex % this.count;
        this.triggerChangeEvent();
        this.to(this.curItemIndex);
    },
    prev: function () {
        this.prevItemIndex = this.curItemIndex;
        this.curItemIndex = (this.count + --this.curItemIndex) % this.count;
        this.triggerChangeEvent();
        this.to(this.curItemIndex);
    },
    conti: function () {
        this.carouselClockSetup();
    },
    pause: function () {
        if (this.carouselInterval) {
            window.clearInterval(this.carouselInterval);
            this.carouselInterval = null;
        }

    },
    triggerChangeEvent: function () {
        var self = this;
        var handlerQueue = this.eventQueue.change;
        if (handlerQueue && handlerQueue.length) {
            handlerQueue.forEach(function (handler) {
                handler.call(self, self.prevItemIndex, self.curItemIndex);
            });
        }

    }
});
