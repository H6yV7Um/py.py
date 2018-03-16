/* global oojs */

/* global actionTypeInfo */

/**
* @file tuwen_sdk_feedtemplet_static
* @author liguangyi
*/

/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_sdk_feed_window',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
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
                        window.clearInterval(checkInterval);
                        var imgs = Array.prototype.slice.call(document.querySelectorAll('#container .ad-item-image'));
                        imgs.forEach(function (el, index) {
                            el.src = self.getAttr(el, 'data-src');
                            self.sendWin(index);
                        });
                    }
                    else {
                    }
                });
            }
            catch (e) {
            }
        }, 1000 * 1);

    },
    showImages: function () {
        this.sdkNotExist = true;
        var self = this;
        var imgs = Array.prototype.slice.call(document.querySelectorAll('#container .ad-item-image'));
        imgs.forEach(function (el, index) {
            el.src = self.getAttr(el, 'data-src');
        });
    },
    $page: function () {
        var self = this;
        this.sdkNotExist = false;

        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);

            if (!this.sdk || this.sdkIsEmpty()) {
                this.showImages();
                // this.sdkNotExist = true;
                // var imgs = Array.prototype.slice.call(
                //                 document.querySelectorAll('#container .ad-item-image')
                //             );
                // imgs.forEach(function (el, index) {
                //     el.src = self.getAttr(el, 'data-src');
                // });
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
            this.checkViewState();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }

        }
        catch (e) {
            // 因为要给业务端使用
            // 所以在访问parent时会产生跨域错误
            // 相反，如果报错，则意味着是业务端使用，直接显示图片
            this.showImages();
        }
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
        var adIndex = this.getAttr(sourceElement, 'data-adindex');
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        if (!this.sdkNotExist) {
            this.sdk.handleClick(adInfo);
        }

        return this.stopEvent(event);
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
