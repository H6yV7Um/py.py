/**
 * @file 50010 template page event
 * @author qianxiaoli
 */
/* eslint-disable max-len */
/* globals oojs */
/* globals rs */
/* globals winUrlArr */
var ImageSlider = function (element, opt) {
    opt = opt || {};
    this.$slider = element;
    this.options = {
        speed: opt.speed || 500, // 滑动速度
        minDistance: opt.minDistance || 15, // 移动的最小距离
        showBullets: opt.showBullets || true, // 是否显示轮播圆点标记
        active: opt.active || 0, // 从第几张开始显示
        interval: opt.interval || 5000, // 定时轮播间隔时间
        isSendWin: opt.isSendWin || true // 是否发送winnotice
    };
    this.$images = [].slice.call(this.$slider.getElementsByTagName('li'));
    this.active = this.options.active;
    this.init();
};
ImageSlider.prototype = {
    init: function () {
        this.prepareGesturesConainer();
        this.prepareBullets();
        this.startSwipes();
    },
    prepareBullets: function () {
        var self = this;
        if (self.options.showBullets) {
            var ulParentNode = self.$slider.parentNode;
            var bulletsContainer = document.createElement('ul');
            self.$bulletsContainer = bulletsContainer;
            bulletsContainer.className = 'item-circle';
            ulParentNode.appendChild(bulletsContainer);

            var imgCount = self.$images.length;
            var screenWidth = parseInt(ulParentNode.clientWidth, 10);
            bulletsContainer.style.marginLeft = (screenWidth - imgCount * 18) / 2 + 'px';
            var label;
            self.$labels = [];
            for (var i = 0; i < imgCount; i++) {
                label = document.createElement('li');
                bulletsContainer.appendChild(label);
                if (i === self.options.active) {
                    label.className = 'current';
                }
                self.$labels.push(label);
            }
        }
    },
    prepareGesturesConainer: function () {
        var imgCount = this.$images.length;
        var lastLi = this.$images[imgCount - 1];
        var firstLi = this.$images[0];
        var ul = lastLi.parentNode;
        var node = lastLi.cloneNode(true);
        node.id = 'nodeFirst';

        this.$slideContainer = ul;
        var nodeTail = firstLi.cloneNode(true);
        nodeTail.id = 'nodeTail';
        ul.insertBefore(node, firstLi);
        ul.appendChild(nodeTail);
    },
    startSwipes: function () {
        // 屏幕宽度
        var that = this;
        var bannerImgs = this.$slider;
        var ulLen = bannerImgs.getElementsByTagName('li').length - 2; // 实际显示图片的张数
        var screenWidth = bannerImgs.parentNode.clientWidth; // 屏幕宽度
        var index = 1;

        // 默认显示的应该是第二张图片
        setTranslateX(screenWidth * index * -1);
        doSendWin(0);

        function doSendWin(curNum) {
            // 添加winURL
            try {
                for (var i = 0, len = winUrlArr[index - 1].length; i < len; i++) {
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
        }

        // 添加过渡效果
        function setTransition() {
            bannerImgs.style.webkitTransition = 'all ' + that.options.speed / 1000 + 's';
            bannerImgs.style.transition = 'all ' + that.options.speed / 1000 + 's';
        }

        // 清除过渡效果
        function clearTransition() {
            bannerImgs.style.webkitTransition = 'none';
            bannerImgs.style.transition = 'none';
        }

        // 设置移动距离
        function setTranslateX(distance) {
            bannerImgs.style.webkitTransform = 'translateX(' + distance + 'px)';
            bannerImgs.style.transform = 'translateX(' + distance + 'px)';
            doTransitionEnd();
        }

        // 控制小圆点
        function setPoint() {
            var labels = document.querySelector('.item-circle').getElementsByTagName('li');
            for (var i = 0; i < ulLen; i++) {
                labels[i].className = '';
            }
            labels[index - 1].className += 'current';
            if (that.options.isSendWin) {
                doSendWin(index - 1);
            }
        }

        function doTransitionEnd() {
            if (index > ulLen) {
                index = 1;
            } else if (index < 1) {
                index = ulLen;
            }
            setPoint();
            setTimeout(function () {
                clearTransition();
            }, that.options.speed);
            // clearTransition();
        }

        if (this.options.interval > 0) {
            // 设置定时器
            var timer = setInterval(function () {
                index++;
                setTransition();
                setTranslateX(screenWidth * index * -1);
            }, that.options.interval);
        }


        // 添加touch事件
        var startX = 0;
        var moveX = 0;
        var isMove = false;

        this.bind(bannerImgs, 'touchstart', function (event) {
            isMove = false;
            clearInterval(timer);
            startX = event.touches[0].clientX;
        });

        this.bind(bannerImgs, 'touchmove', function (event) {
            isMove = true;
            moveX = event.touches[0].clientX - startX;
            setTranslateX(moveX + index * screenWidth * -1);
            event.preventDefault();
        });

        this.bind(bannerImgs, 'touchend', function (event) {
            if (isMove && Math.abs(moveX) > that.options.minDistance) {
                if (moveX < 0) {
                    index++;
                } else if (moveX > 0) {
                    index--;
                }
            }
            setTransition();
            setTranslateX(index * screenWidth * -1);
            timer = setInterval(function () {
                index++;
                setTransition();
                setTranslateX(screenWidth * index * -1);
            }, that.options.interval);
        });
    },
    bind: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, handler);
        }
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
    resizeTimer: null,
    imageIndex: 0,
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            this.containerResize();
        } catch (e) {alert(e);
        }
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        this.bind(closeBtn, 'click', function () {
            this.sdk.onAdPlayEnd();
            lunbo.stop();
            this.stopEvent(this);
        }.proxy(this));
    },
    doClose: function () {
        this.sdk.onAdPlayEnd();
        lunbo.stop();
        this.stopEvent(this);
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
        if (sourceElement.id.indexOf('closeDiv') > -1) {
            this.doClose();
        }
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        if (sourceElement.tagName.toLowerCase() === 'body') {
            return false;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adindex');
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        this.sdk.handleClick(adInfo);
        lunbo.next();
        return this.stopEvent(event);
    },

    containerResize: function (event) {
        if (window.innerHeight > 0) {
            var conW = parseInt(window.innerWidth, 10);
            var conH = parseInt(window.innerHeight, 10);
            // 判断是否为iphone或者ipad，若是其中一个，就减去20px的顶部状态栏
            var topBar = 20;
            var m = navigator.userAgent.toLowerCase();
            var isIos = ((m.indexOf('iphone') > -1) || (m.indexOf('ipad') > -1));
            var conMarTop = conH / 2;
            conH = conH - (isIos ? topBar : 0);
            var con = document.getElementById('container');
            var itemUl = document.getElementById('itemUl');
            if (itemUl.childNodes.length > 1) {
                con.style.height = conH + 'px';
                con.style.marginTop = -conMarTop + (isIos ? topBar : 0) + 'px';
                con.style.marginLeft = -(conW / 2) + 'px';
            }
            else {
                con.style.marginTop = (isIos ? topBar : 0) + 'px';
                con.style.height = conH + 'px';
            }
            itemUl.style.height = conH + 'px';
            var liArray = itemUl.getElementsByTagName('li');
            if (liArray.length > 1) {
                new ImageSlider(itemUl);
            }
            else {
                // 添加winURL
                try {
                    for (var i = 0, len = winUrlArr[0].length; i < len; i++) {
                        var imageWin = new Image();
                        if (winUrlArr[0][i] !== 0) {
                            imageWin.src = winUrlArr[0][i];
                        }
                        else {
                            return;
                        }
                        winUrlArr[0][i] = 0;
                        imageWin.onload = imageWin.onerror = function () {};
                    }
                } catch (e) {}
            }
        } else {
            setTimeout(function () {
                this.containerResize();
            }.proxy(this), 50);
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
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    }
});

