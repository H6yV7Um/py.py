/**
 * @file tuwen_app_fulllunbo template page event
 * @author qianxiaoli
 */
/* eslint-disable max-len */
/* globals oojs */
/* globals rs */
/* globals winUrlArr */
/* eslint-disable max-len */
/* globals oojs */
/* globals rs */
/* globals winUrlArr */
/* globals start */
/* globals delta */
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_app_fulllunbo',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    resizeTimer: null,
    dis: 0,
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu  && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.containerResize();
            this.bind(window, 'resize', function () {
                rs.template.tuwen_app_fulllunbo.page.containerResize();
            });
            this.bindCloseHandler();
            this.adClick('container', window.adsExtention);
        } catch (e) {
        }
    },
    // 绑定关闭按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        this.bind(closeBtn, 'click', function () {
            rs.template.tuwen_app_fulllunbo.page.sdk.onAdPlayEnd();
            rs.template.tuwen_app_fulllunbo.page.stopEvent(this);
        });
    },
    onNextClick: function (event) {
        this.stopEvent(event);
    },
    onPreClick: function (event) {
        this.stopEvent(event);
    },
    onAdTouchStart: function (event) {
        var touches = event.touches[0];
        /* globals start */
        start = {
            x: touches.pageX,
            y: touches.pageY
        };
        /* globals delta */
        delta = {};
    },
    onAdTouchMove: function (event) {
        var touches = event.touches[0];
        if (this.dis === touches.pageX) {
            return;
        }
        delta = {
            x: touches.pageX - start.x,
            y: touches.pageY - start.y
        };
        start.x = touches.pageX;
        var itemUl = document.getElementById('item_ul');
        var ulChildren = itemUl.children;
        try {
            var currentNum = this.formatEventObj(event).target.id.split('_')[2];
            var leftValue = parseInt(itemUl.offsetLeft, 10);
            var itemUlLeftL = parseInt(itemUl.style.left, 10);
            var ulChildrenLen = ulChildren.length;
            var leftValueL = (itemUl.offsetWidth / 16 + itemUl.children[0].offsetWidth) * ulChildrenLen + itemUl.offsetWidth / 16 - itemUl.offsetWidth;
            if (delta.x > 0 &&  itemUlLeftL >= 0) {
                itemUl.style.left = '0px';
                return;
            }
            else if (delta.x < 0 && itemUlLeftL <= -leftValueL) {
                itemUl.style.left = -leftValueL + 'px';
                return;
            }
            itemUl.style.left = leftValue + delta.x + 'px';
            this.dis = touches.pageX;
        }
        catch (e) {

        }
        this.stopEvent(event);
    },
    onAdTouchEnd: function (event) {
        if (Math.abs(delta.x) < 10 || delta.x === undefined) {
            return;
        }
        var itemUl = document.getElementById('item_ul');
        var ulChildrenLen = itemUl.children.length;
        var itemUlLeft = parseInt(itemUl.style.left, 10);
        var leftValue = (itemUl.offsetWidth / 16 + itemUl.children[0].offsetWidth) * ulChildrenLen + itemUl.offsetWidth / 16 - itemUl.offsetWidth;

        if (delta.x > 0 &&  itemUlLeft > 0) {
            itemUl.style.left = '0px';
        }
        else if (itemUlLeft < -leftValue) {
            itemUl.style.left = -leftValue + 'px';
        }
        this.stopEvent(event);
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
        if (sourceElement.tagName.toLowerCase() === 'body') {
            return false;
        }
        var adInfo = this.adsExtention[0];
        adInfo.curl = sourceElement.href || adInfo.curl;
        this.sdk.handleClick(adInfo);
        return this.stopEvent(event);
    },
    containerResize: function (event) {
        try {
            if (window.innerHeight > 0) {
                clearTimeout(this.resizeTimer);
                var conW = parseInt(window.innerWidth, 10);
                var conH = parseInt(window.innerHeight, 10);
                var con = document.getElementById('container');
                var item = document.getElementById('item');
                con.style.marginTop = -(conH / 2) + 'px';
                con.style.marginLeft = -(conW / 2) + 'px';
                item.style.height = conH + 'px';
                var itemUl = document.getElementById('item_ul');
                var itemCon = document.getElementById('item_con');
                itemUl.style.height = conH / conW * 16 - 13.8 + 'rem';
                var imgArray = itemUl.getElementsByTagName('img');
                var imgH = conH / conW * 16 - 14;
                var imgW = (conH / conW * 16 - 14) * 0.6;
                for (var i = 0; i < imgArray.length; i++) {
                    var imgADS = imgArray[i];
                    if (imgADS.id.indexOf('app_img_') > -1) {
                        var imgAD = document.getElementById('app_img_' + i);
                        var itemList = document.getElementById('item_list_' + i);
                        itemList.style.width = imgW + 'rem';
                        itemList.style.marginLeft = '1rem';
                        itemList.style.left = (imgW + 1) * i + 'rem';
                        imgAD.style.height = imgH + 'rem';
                        imgAD.style.width = imgW + 'rem';
                    }
                }
                document.addEventListener('touchmove', function (event) {
                    this.stopEvent(event);
                }, false);
                if ((imgW * imgArray.length + imgArray.length - 1) > 16) {
                    var liArray = con.getElementsByTagName('li');
                    for (var i = 0; i < liArray.length; i++) {
                        var tempClassName = liArray[i].className;
                        if (tempClassName) {
                            tempClassName = tempClassName.toLowerCase();
                            if (tempClassName.indexOf('item_list') < 0) {
                                continue;
                            }
                        }
                        this.bind(liArray[i], 'touchstart', this.onAdTouchStart.proxy(this));
                        this.bind(liArray[i], 'touchmove', this.onAdTouchMove.proxy(this));
                        this.bind(liArray[i], 'touchend', this.onAdTouchEnd.proxy(this));
                    }
                }
                else {
                    itemUl.style.marginLeft = (16 - imgW * imgArray.length - (imgArray.length - 1)) / 2 - 1 + 'rem';
                }
            }
            else {
                this.resizeTimer = setTimeout(function () {
                    rs.template.tuwen_app_fulllunbo.page.containerResize();
                }, 50);
            }
        } catch (e) {}
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