/* global oojs */
/* global actionTypeInfo */
/**
 * @file 20010
 * @author qianxiaoli
 */
/* eslint-disable max-len */
oojs.define({
    name: 'page',
    namespace: '20010',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    // 轮播暂停 接口
    mobInterface: {},
    // 定时器字段
    downloadingIntervel: null,
    //  广告扩展字段
    adsExtention: [],
    $page: function () {
        var adInfos = this.getAttr(this.getEleById('item0'), 'data-mcurl');
        var admcurl = this.getAttr(this.getEleById('item0'), 'mcurl-val');
        var adInfoHref = this.getEleById('item0').href;
        var isPause = this.getAttr(this.getEleById('item0'), 'data-ispause');
        var adTypes = this.getAttr(this.getEleById('item0'), 'data-adtype');

        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            // 获取轮播
            this.mobInterface = (window.baidu && window.baidu.mobads && window.baidu.mobads.Interface) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Interface);
            // 支持sdk下载暂停且点击左边跳转lp
            if (isPause && typeof admcurl === 'string' && admcurl !== 'null') {
                // 页面初始化调用sdkgetDownloadStatus
                this.sdk && this.sdk.getDownloadStatus && this.handlePkgStatus(false);
                // logo 广告标识的位置移至左边
                this.changeStyle();
                this.leftClick();
                this.rightClick();
            // 支持sdk下载暂停不支持分区实验
            } else if (isPause && typeof admcurl === 'object') {
                // 页面初始化调用sdk getDownloadStatus
                this.sdk && this.sdk.getDownloadStatus && this.handlePkgStatus(false);
                this.leftClick();
                this.rightClick();
            // 基线
            } else if (!isPause && admcurl !== 'null') {
                if (window.adsExtention && document.getElementById('container')) {
                    this.adClick('container', window.adsExtention);
                }
            // 支持分区实验
            } else if (typeof admcurl === 'string'  && admcurl !== 'null') {
                this.adClick('container', window.adsExtention);
                this.changeStyle();
                this.bindLpHandler();
                this.bindDownHandler(adInfoHref);
            } else {
                return;
            }
        } catch (err) {
            var clickLpLog = 'http://mobads-logs.baidu.com/dz.zb?' + 'type=' + 536 + '&qk=' + this.getQueryString(adInfoHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 1 + '&chg_tp=' + this.getQueryString(adInfoHref, 'chg_tp') + '&tpl_id=' + this.getQueryString(adInfoHref, 'tpl_id') + '&adid=' + this.getQueryString(adInfoHref, 'adid') + '&appsid=' + this.getQueryString(adInfoHref, 'appsid') + '&emsg=' + err.message + '&T=' + new Date().getTime();
            this.sendByImage(clickLpLog);
        }
    },
    getEleById: function (id) {
        return document.getElementById(id);
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
        var adType = this.getAttr(sourceElement, 'data-adtype');
        var getId = this.getAttr(sourceElement, 'id');
        adIndex = parseInt(adIndex, 10);
        adType = parseInt(adType, 10);
        var isPause = this.getAttr(this.getEleById('item0'), 'data-ispause');
        var admcurl = this.getAttr(this.getEleById('item0'), 'mcurl-val');
        var adInfo = window.adsExtention[adIndex];
        if (admcurl && admcurl !== 'null') {
            if (adType === 5) {
                // 因为二次点击下载，左右两边的act值不一样，左边act修改为lp类型
                if (getId === 'item0') {
                    adInfo.act = 4;
                    // document.getElementById('item0').setAttribute('href', admcurl);
                }
                // 因为二次点击下载，左右两边的act值不一样，右边act修改为5
                if (getId === 'item_btn_0') {
                    adInfo.act = 2;
                }
            }
        };
        adInfo.curl = sourceElement.href || adInfo.curl;
        this.sdk.handleClick(adInfo);
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
        } else {
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
        } else {
            window.event.cancelBubble = true;
        }
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        return false;
    },
    sendByImage: function (url, win) {
        var img = new Image();
        var key = 'cpro_log_' + Math.floor(Math.random() * 2147483648).toString(36);
        win = win || window;
        win[key] = img;

        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
            win[key] = null;
            img = null;
        };
        img.src = url;
    },
    getQueryString: function (url, keyName) {
        var reg = new RegExp('(^|&)' + keyName + '=([^&]*)(&|$)', 'i');
        if (url.indexOf('?') > -1) {
            var str = url.substr(url.indexOf('?') + 1);
            var r = str.match(reg);
            if (r !== null) {
                return unescape(r[2]);
            }
        }
        return null;
    },
    addEvent: function (element, eventType, eventHandler) {
        eventType = eventType.replace(/^on/i, '').toLowerCase();
        if (element.addEventListener) {
            element.addEventListener(eventType, eventHandler, false);
        } else {
            element.attachEvent('on' + eventType, function () {
                eventHandler(window.event);
            });
        }
    },
    resTag: function (element) {
        var element = element.parentNode;
        if (element.tagName.toLowerCase() !== 'a' && element.tagName.toLowerCase() !== 'body') {
            return this.resTag(element);
        }
        return element;
    },
    bindLpHandler: function () {
        var aThis = this;
        var base = 'http://mobads-logs.baidu.com/dz.zb?';
        var itemLp = document.getElementById('item0');
        aThis.bind(itemLp, 'click', function (ev) {
            try {
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if (target.tagName.toLowerCase() !== 'a') {
                    target = aThis.resTag(target);
                }
                var targetHref = target.href;
                var clickLpLog = base + 'type=' + 534 + '&qk=' + aThis.getQueryString(targetHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 1 + '&chg_tp=' + aThis.getQueryString(targetHref, 'chg_tp') + '&tpl_id=' + aThis.getQueryString(targetHref, 'tpl_id') + '&adid=' + aThis.getQueryString(targetHref, 'adid') + '&appsid=' + aThis.getQueryString(targetHref, 'appsid') + '&T=' + new Date().getTime();

                aThis.sendByImage(clickLpLog);
            } catch (err) {
                var clickLpLog = base + 'type=' + 536 + '&qk=' + aThis.getQueryString(targetHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 1 + '&chg_tp=' + aThis.getQueryString(targetHref, 'chg_tp') + '&tpl_id=' + aThis.getQueryString(targetHref, 'tpl_id') + '&adid=' + aThis.getQueryString(targetHref, 'adid') + '&appsid=' + aThis.getQueryString(targetHref, 'appsid') + '&emsg=' + err.message + '&T=' + new Date().getTime();
                aThis.sendByImage(clickLpLog);
            }
        });
    },
    bindDownHandler: function (url) {
        var adInfoHref = url;
        var aThis = this;
        var base = 'http://mobads-logs.baidu.com/dz.zb?';
        var itemDown = document.getElementById('item_btn_0');
        aThis.bind(itemDown, 'click', function (ev) {
            try {
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                var clickDownLog = base + 'type=' + 535 + '&qk=' + aThis.getQueryString(adInfoHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 2 + '&chg_tp=' + aThis.getQueryString(adInfoHref, 'chg_tp') + '&tpl_id=' + aThis.getQueryString(adInfoHref, 'tpl_id') + '&adid=' + aThis.getQueryString(adInfoHref, 'adid') + '&appsid=' + aThis.getQueryString(adInfoHref, 'appsid') + '&T=' + new Date().getTime();
                aThis.sendByImage(clickDownLog);
            } catch (err) {
                var clickDownLog = base + 'type=' + 536 + '&qk=' + aThis.getQueryString(adInfoHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 2 + '&chg_tp=' + aThis.getQueryString(adInfoHref, 'chg_tp') + '&tpl_id=' + aThis.getQueryString(adInfoHref, 'tpl_id') + '&adid=' + aThis.getQueryString(adInfoHref, 'adid') + '&appsid=' + aThis.getQueryString(adInfoHref, 'appsid') + '&emsg=' + err.message + '&T=' + new Date().getTime();
                aThis.sendByImage(clickDownLog);
            }
        });
    },
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
        var itemLp = aThis.getEleById('item0');
        var isPause = aThis.getAttr(aThis.getEleById('item0'), 'data-ispause');
        var admcurl = aThis.getAttr(aThis.getEleById('item0'), 'mcurl-val');
        aThis.bind(itemLp, 'click', function (ev) {
            // 停止轮播
            aThis.mobInterface && aThis.mobInterface.pause && aThis.mobInterface.pause();
            var target = ev.target || ev.srcElement;
            if (isPause) {
                // 支持下载暂停且分区
                if (typeof admcurl === 'string') {
                    aThis.download(ev);
                };
                // 支持下载暂停
                if (typeof admcurl === 'object') {
                    aThis.handleDownload(ev);
                };
            };
        });
    },
    rightClick: function () {
        var aThis = this;
        var itemDown = aThis.getEleById('item_btn_0');
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
            this.download();
        }
    },
    handlePkgStatus: function (clicking, ev) {
        var events = ev;
        var aThis = this;
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
                        aThis.download(events);
                    }
                    // 如果是101,未下载状态,调用download，开启轮询，更新进度
                    else if (status === 101) {
                        aThis.download(events);
                        // 发送带有isPause字段的日志
                        aThis.addLoadImg(data);
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
                            aThis.getEleById('item_btn_0').innerHTML = '\u7ee7\u7eed';
                            aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                        }
                        // 如果是没有在下载的状态，就调用download，同时开启轮询，更新进度
                        else if (data.isPaused === 1) {
                            aThis.download(events);
                            // 发送带有isPause字段的日志
                            aThis.addLoadImg(data);
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
                        aThis.getEleById('item_btn_0').innerHTML = '\u5b89\u88c5';
                        aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                    }
                    // 已经下载，已经安装
                    else if (status === 103) {
                        // 立即打开
                        aThis.getEleById('item_btn_0').innerHTML = '\u6253\u5f00';
                        aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                    }
                    // 下载到了一半
                    else if (status <= 100 && status >= 0) {
                        // 写入下载进度
                        aThis.getEleById('item_btn_0').innerHTML = status + '%';
                        aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                        // 正在下载中
                        if (data.isPaused === 0) {
                            // 清除定时器
                            clearInterval(aThis.downloadingIntervel);
                            // 开启定时器
                            aThis.downloadingIntervel = setInterval(aThis.updateDownloadingContent.proxy(aThis), 2000);
                        // 还未下载
                        } else if (data.isPaused === 1) {
                            aThis.getEleById('item_btn_0').innerHTML = '\u7ee7\u7eed';
                            aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                        }
                    }
                }
            }, pkg);
        }
    },
    updateDownloadingContent: function () {
        var aThis = this;
        for (var i = 0; i < window.adsExtention.length; i++) {
            var pkg = window.adsExtention[i].pk;
        };
        aThis.sdk && aThis.sdk.getDownloadStatus(function (jsonStatus) {
            var data = JSON.parse(jsonStatus);
            var status = data.status;
            // 如果正在下载中,写入进度
            if (status <= 100 && status >= 0) {
                aThis.getEleById('item_btn_0').innerHTML = status + '%';
                aThis.getEleById('item_btn_0').style.background = '#2e83f7';
                return;
            }
            // 如果状态大于等于100,直接清除轮询
            if (status === 102) {
                clearInterval(aThis.downloadingIntervel);
                aThis.getEleById('item_btn_0').innerHTML = '\u5b89\u88c5';
                aThis.getEleById('item_btn_0').style.background = '#2e83f7';
            }
        }, pkg);
    },
    download: function (events) {
        var aThis = this;
        var e = aThis.formatEventObj(events);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = aThis.getAttr(sourceElement, 'data-adindex');
        var getId = aThis.getAttr(sourceElement, 'id');

        var adType = aThis.getAttr(sourceElement, 'data-adtype');
        adType = parseInt(adType, 10);
        adIndex = parseInt(adIndex, 10);
        var adInfo = window.adsExtention[adIndex];
        var isPause = document.getElementById('item0').getAttribute('data-ispause');
        var admcurl = document.getElementById('item0').getAttribute('mcurl-val');
        if (isPause) {
            if (typeof admcurl === 'string'  && admcurl !== 'null') {
                if (adType === 5) {
                    if (getId === 'item0') {
                        adInfo.act = 1;
                        // document.getElementById('item0').setAttribute('href', admcurl);
                    }
                    if (getId === 'item_btn_0') {
                        adInfo.act = 2;
                    }
                }
            };
            if (typeof admcurl === 'object') {
                if (adType === 5) {
                    if (getId === 'item0') {
                        adInfo.act = 2;
                    }
                    if (getId === 'item_btn_0') {
                        adInfo.act = 2;
                    }
                }
            };
        };
        adInfo.curl = sourceElement.href || adInfo.curl;
        aThis.sdk.handleClick(adInfo);
        return aThis.stopEvent(events);
    },
    addLoadImg: function (datas) {
        var aThis = this;
        var adInfoHref = aThis.getEleById('item0').href;
        var url = 'http://mobads-logs.baidu.com/dz.zb?' + 'type=' + 535 + '&qk=' + aThis.getQueryString(adInfoHref, 'qk') + '&rs_tplid=' + 2004 + '&zone=' + 2 + '&chg_tp=' + aThis.getQueryString(adInfoHref, 'chg_tp') + '&tpl_id=' + aThis.getQueryString(adInfoHref, 'tpl_id') + '&adid=' + aThis.getQueryString(adInfoHref, 'adid') + '&appsid=' + aThis.getQueryString(adInfoHref, 'appsid') + '&isPaused=' + datas.isPaused + '&T=' + new Date().getTime();
        aThis.sendByImage(url);
    }
});