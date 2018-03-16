/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_feedtemplet_static
* @author liguangyi
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_sdk_feed_lunbo_title',
    deps: {
        Carousel: 'rs.template.SwipeCarousel'
    },
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
            try {
                self.sdk.getAdViewState(function (visible) {
                    if (visible === 'BaiduMobAdSpamOK' || visible === 'SHOW_STATE_SHOW') {
                        self.carousel.continue();
                        var curAdIndex = self.carousel.getCurAdIndex();
                        if (!self.adsLoadState[curAdIndex]) {
                            var imgs = document.querySelectorAll('#container .item img');
                            var el = imgs[curAdIndex];
                            el.src = self.getAttr(el, 'data-src');
                            // 可能存在单个轮播的情况
                            // 该情况下不发送winUrl日志
                            if (self.adsLoadState.length > 1) {
                                self.sendWin(curAdIndex);
                            }
                            self.adsLoadState[curAdIndex] = true;
                        }

                        if (self.allAdsIsLoaded()) {
                            window.clearInterval(checkInterval);
                        }
                    }
                    else {
                        self.carousel.pause();
                    }
                });
            }
            catch (e) {}
        }, 1000 * 1);
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
        });
    },
    $page: function () {
        this.sdkNotExist = false;

        var container = document.querySelector('#container');
        var target = document.querySelector('#container .image-list');
        this.carousel = this.Carousel.init(target, container);
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
                // this.sdkNotExist = true;

                // var imgs = Array.prototype.slice.call(
                //     document.querySelectorAll('#container .item img')
                // );

                // imgs.forEach(function (el, index) {
                //     el.src = el.getAttribute('data-src');
                //     self.adsLoadState[index] = true;
                // })
            }

            // FOR TEST
            // if (!this.sdk || this.sdkIsEmpty()) {
            //     this.sdk = {
            //         getAdViewState: function (callback) {
            //             callback.call(this, 'SHOW_STATE_SHOW');
            //         },
            //         handleClick: new Function()
            //     }
            // }

            // if (!window.winUrlArr) {
            //     window.winUrlArr = [['//baidu.com'], ['//tieba.baidu.com'], ['//image.baidu.com']];
            // }
            // FOR TEST
            var container = document.getElementById('container');

            if (!this.sdkNotExist) {
                this.checkViewState();
            }
            else {
                this.carousel.continue();
            }

            if (window.adsExtention && container) {
                this.adClick('container', window.adsExtention);
            }

        }
        catch (e) {
            this.showImages();
            this.carousel.continue();
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

    }
});
