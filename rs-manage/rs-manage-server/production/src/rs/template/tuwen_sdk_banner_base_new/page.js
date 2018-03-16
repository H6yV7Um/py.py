/* global oojs */
/* global actionTypeInfo */
/**
* @file tuwen_sdk_banner_base_new
* @author liguangyi
*/
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_sdk_banner_base_new',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    makeIconAndPicVerticalCenter: function () {
        var icon = document.querySelector('.icon');
        var container = document.querySelector('.container');

        if (!icon || !container) {
            return;
        }

        var containerHeight = parseInt(window.getComputedStyle(container).height, 10);
        var iconHeight = parseInt(window.getComputedStyle(icon).height, 10);

        icon.style.marginTop = (containerHeight - iconHeight) / 2 + 'px';

        var pic = document.querySelector('.pic');
        if (pic) {
            var picHeight = parseInt(window.getComputedStyle(pic).height, 10);
            pic.style.marginTop = (containerHeight - picHeight) / 2 + 'px';
        }
    },
    makeTextVerticalCenter: function () {
        var title = document.querySelector('.title');
        var desc = document.querySelector('.desc');
        var container = document.querySelector('.container');

        var titleHeight = parseInt(window.getComputedStyle(title).height, 10);
        var descHeight = parseInt(window.getComputedStyle(desc).height, 10);
        var containerHeight = parseInt(window.getComputedStyle(container).height, 10);

        var titleMarginBottom = 3;
        title.style.marginBottom = titleMarginBottom + 'px';
        title.style.marginTop = (containerHeight - titleHeight - descHeight - titleMarginBottom) / 2 + 'px';
    },
    $page: function () {
        this.makeIconAndPicVerticalCenter();
        this.makeTextVerticalCenter();
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            // 获取轮播
            this.mobInterface = (window.baidu && window.baidu.mobads && window.baidu.mobads.Interface) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Interface);
            var item0 = document.getElementById('item0');
            var admcurl = parseInt(this.getAttr(item0, 'mcurl-val'), 10);
            var isPause = this.getAttr(item0, 'data-ispause');
            if (isPause) {
                // 页面初始化调用sdkgetDownloadStatus
                this.sdk && this.sdk.getDownloadStatus && this.handlePkgStatus(false);
                this.leftClick();
                this.rightClick();
            } else {
                if (window.adsExtention && document.getElementById('container')) {
                    this.adClick('container', window.adsExtention);
                }
            }
            if (admcurl) {
                this.changeStyle();
            }
        } catch (e) {
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
    // 绑定关闭按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        if (closeBtn && this.sdk && this.sdk.AdCloseAvailable && this.sdk.AdCloseAvailable()) {
            this.bind(closeBtn, 'click', this.sdk.onAdPlayEnd);
        } else {
            closeBtn.style.display = 'none';
        }
    },
    // 广告被点击
    onAdClick: function (event) {
        var e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = parseInt(this.getAttr(sourceElement, 'data-adindex'), 10);
        var adInfo = this.adsExtention[adIndex] || window.adsExtention[adIndex];
        var act = parseInt(this.getAttr(sourceElement, 'data-adtype'), 10);
        var clickUrl = this.getAttr(sourceElement, 'href');
        adInfo.curl = clickUrl || adInfo.curl;
        var admcurl = parseInt(this.getAttr(sourceElement, 'mcurl-val'), 10);
        adInfo.act = act;
        this.sdk.handleClick(adInfo);
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
        if (event && event.stopPropagation) {
            event.preventDefault();
        }
        return false;
    },
    // 模板支持分区的模式，广告标识会移动到左侧
    changeStyle: function () {
        var logo = document.getElementById('bd-logo');
        var bdIcon = document.getElementById('mob-bd-adIcon');
        var logoArea = document.getElementById('logoArea');
        if (logo) {
            logo.style.bottom = 0;
            logo.style.left = 0;
        }
        if (bdIcon) {
            bdIcon.style.bottom = 0;
            bdIcon.style.left = 14 + 'px';
        }
        if (logoArea) {
            logoArea.style.bottom = 0;
            logoArea.style.left = 14 + 'px';
        }
    },
    leftClick: function () {
        var aThis = this;
        var itemLp = document.getElementById('item0');
        var isPause = aThis.getAttr(itemLp, 'data-ispause');
        var admcurl = parseInt(aThis.getAttr(itemLp, 'mcurl-val'), 10);
        aThis.bind(itemLp, 'click', function (ev) {
            // 停止轮播
            aThis.mobInterface && aThis.mobInterface.pause && aThis.mobInterface.pause();
            var target = ev.target || ev.srcElement;
            if (isPause) {
                // 支持下载暂停且分区
                if (admcurl) {
                    aThis.onAdClick(ev);
                } else {
                    aThis.handleDownload(ev);
                }
            };
        });
    },
    rightClick: function () {
        var aThis = this;
        var itemDown = document.getElementById('item_btn0');
        aThis.bind(itemDown, 'click', function (ev) {
            // 暂停轮播
            aThis.mobInterface && aThis.mobInterface.pause && aThis.mobInterface.pause();
            aThis.handleDownload(ev);
        });
    },
    handleDownload: function (e) {
        e.preventDefault();
        e.stopPropagation();
        // 判断逻辑
        if (this.sdk && this.sdk.getDownloadStatus) {
            this.handlePkgStatus(true, e);
        } else {
            this.onAdClick();
        }
    },
    handlePkgStatus: function (clicking, ev) {
        var events = ev;
        var aThis = this;
        var itemBtn = document.getElementById('item_btn0');
        for (var i = 0; i < window.adsExtention.length; i++) {
            var pkg = window.adsExtention[i].pk;
        }
        if (typeof pkg === 'string') {
            aThis.sdk && aThis.sdk.getDownloadStatus(function (jsonStatus) {
                var data = JSON.parse(jsonStatus);
                var status = data.status;
                // 点击按钮之后的处理逻辑
                if (clicking) {
                    // 如果是已经下载还没安装 或 已经安装, 不用管, 直接调用download
                    if (status === 102 || status === 103) {
                        aThis.onAdClick(events);
                    }
                    // 如果是101,未下载状态,调用download，开启轮询，更新进度
                    else if (status === 101) {
                        aThis.onAdClick(events);
                        // 清除定时器
                        clearInterval(aThis.downloadingIntervel);
                        // 开启定时器
                        aThis.downloadingIntervel = setInterval(aThis.updateDownloadingContent.proxy(aThis), 2000);
                    } else if (status <= 100 && status >= 0) {
                        // 如果是正在下载中的状态,再次点击需要暂停下载
                        if (data.isPaused === 0) {
                            // 继续轮播
                            aThis.mobInterface && aThis.mobInterface.play && aThis.mobInterface.play();
                            // 暂停下载
                            aThis.sdk.pauseDownload(pkg);
                            // 清除定时器
                            clearInterval(aThis.downloadingIntervel);
                            // 继续下载
                            itemBtn.innerHTML = '\u7ee7\u7eed';
                        }
                        // 如果是没有在下载的状态，就调用download，同时开启轮询，更新进度
                        else if (data.isPaused === 1) {
                            aThis.onAdClick(events);
                            // 清除定时器
                            clearInterval(aThis.downloadingIntervel);
                            // 开启定时器
                            aThis.downloadingIntervel = setInterval(aThis.updateDownloadingContent.proxy(aThis), 2000);
                        }
                    }
                } else {
                    // 处理非点击事件 eg:refresh
                    // 已经下载，没有安装
                    if (status === 102) {
                        // 立即安装
                        itemBtn.innerHTML = '\u5b89\u88c5';

                    }
                    // 已经下载，已经安装
                    else if (status === 103) {
                        // 立即打开
                        itemBtn.innerHTML = '\u6253\u5f00';
                    }
                    // 下载到了一半
                    else if (status <= 100 && status >= 0) {
                        // 写入下载进度
                        itemBtn.innerHTML = status + '%';
                        // 正在下载中
                        if (data.isPaused === 0) {
                            // 清除定时器
                            clearInterval(aThis.downloadingIntervel);
                            // 开启定时器
                            aThis.downloadingIntervel = setInterval(aThis.updateDownloadingContent.proxy(aThis), 2000);
                        // 还未下载
                        } else if (data.isPaused === 1) {
                            itemBtn.innerHTML = '\u7ee7\u7eed';
                        }
                    }
                }
            }, pkg);
        }
    },
    updateDownloadingContent: function () {
        var aThis = this;
        var itemBtn = document.getElementById('item_btn0');
        for (var i = 0; i < window.adsExtention.length; i++) {
            var pkg = window.adsExtention[i].pk;
        };
        aThis.sdk && aThis.sdk.getDownloadStatus(function (jsonStatus) {
            var data = JSON.parse(jsonStatus);
            var status = data.status;
            // 如果正在下载中,写入进度
            if (status <= 100 && status >= 0) {
                itemBtn.innerHTML = status + '%';
                return;
            }
            // 如果状态大于等于100,直接清除轮询
            if (status === 102) {
                clearInterval(aThis.downloadingIntervel);
                itemBtn.innerHTML = '\u5b89\u88c5';
            }
        }, pkg);
    }
});