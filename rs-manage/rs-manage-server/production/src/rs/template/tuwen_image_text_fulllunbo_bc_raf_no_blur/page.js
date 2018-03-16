/**
 * @file tuwen_image_text_fulllunbo_bc_raf_no_blur template page event
 *@author nieyuxin
 */
/* eslint-disable max-len */
/* globals oojs */
/* globals rs */
/* globals winUrlArr */
/* eslint-disable */
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
                itemUl.style.transition = 'transform .5s ease-in';
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
                itemUl.style.transition = 'transform .5s ease-in';
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
                itemUl.style.transition = 'transform .5s ease-in';
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
                itemUl.style.transition = 'transform .5s ease-in';
                num--;
            }
            currentNum = num;
        }
        var rem = parseInt(document.getElementById('itemList0').clientWidth, 10) / 16;
        itemCircleChildren[num].className = 'circle circleNow';// '0px  ' + '0.4' * rem + 'px';
        itemUl.style.transition = 'transform .5s ease-in';
        interval = setTimeout(function () {lunbo.doCircle(num, true); }, 5000);
        this.sendWin(currentNum);
    }
};
oojs.define({
    name: 'page',
    namespace: 'rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur',
    deps: {},
    //  Sdk js 接口
    sdk: {},
    //  广告扩展字段
    adsExtention: [],
    resizeTimer: null,
    $page: function () {
        try {
            this.containerResize();
            lunbo.sendWin(0);
            interval = setTimeout(function () {lunbo.doCircle(0, true); }, 5000);
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
            this.bind(window, 'resize', function () {
                // if (this.resizeTimer) {
                   // clearTimeout(this.resizeTimer);
                // }
                // this.resizeTimer = setTimeout(function () {
                rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.containerResize();
               // }, 100);
            });
        } catch (e) {
        }
    },
    // 绑定下载按钮事件
    bindCloseHandler: function () {
        // var liArray = document.getElementById('itemUl').children;
        // for (var i = 0; i < liArray.length; i++) {
            // var closeBtn = document.getElementById('closeBtn' + i);
            var closeBtn = document.getElementById('closeBtn');
            this.bind(closeBtn, 'click', function () {
                rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.sdk.onAdPlayEnd();
                lunbo.stop();
                rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.stopEvent(this);
            });
        // }

    },
    doClose: function () {
        rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.sdk.onAdPlayEnd();
        lunbo.stop();
        rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.stopEvent(this);
    },
    onNextClick: function (event) {
        lunbo.next();
        this.stopEvent(event);
    },
    onPreClick: function (event) {
        lunbo.pre();
        this.stopEvent(event);
    },
    onAdTouchStart: function (event) {
        lunbo.stop();
        var touches = event.touches[0];
        start = {
            x: touches.pageX,
            y: touches.pageY
        };
        delta = {};
        // this.stopEvent(event);
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
        itemUl.style.transition = 'transform 0s ease-in';
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
            conH = ((m.indexOf('iphone') > -1) || (m.indexOf('ipad') > -1)) ? conH - topBar : conH;
            var conMarTop = ((m.indexOf('iphone') > -1) || (m.indexOf('ipad') > -1)) ? ((conH - topBar) / 2) : conH / 2;
            var con = document.getElementById('container');
            // con.style.marginTop = -(conH / 2 - topBar / 2) + 'px';
            con.style.marginTop = -conMarTop + 'px';
            con.style.marginLeft = -(conW / 2) + 'px';
            var itemUl = document.getElementById('itemUl');
            var itemCon = document.getElementById('itemCon');
            itemUl.style.height = conH + 'px';
            itemCon.style.width = conW + 'px';
            var liArray = con.getElementsByTagName('li');
            var index = 0;
            for (var i = 0; i < liArray.length; i++) {
                var imgADS = liArray[i];
                // if (imgADS.id.indexOf('imgAD') > -1) {
                    // var conMarTop = parseInt(this.getAttr(con, 'marginTop'), 10);
                    var imgAD = document.getElementById('imgAD' + index);
                    var itemList = document.getElementById('itemList' + index);
                    var downBtn = document.getElementById('btn' + index);
                    var itemA = document.getElementById('item' + index);
                    var divUp = document.getElementById('divUp' + index);
                    itemList.style.width = conW + 'px';
                    itemList.style.left = conW * index + 'px';
                    var liCon = document.getElementById('liCon' + index);
                    liCon.style.width = conW + 'px';
                    // liCon.style.left = conW * index + 'px';
                    // 图片部分的resize
                    if (imgAD) {
                        var borW = parseInt(this.getAttr(imgAD, 'data-imgBorder'), 10);
                        var imgRatio = parseFloat(this.getAttr(imgAD, 'data-imgRatio'));
                        var conRatio = (conH - borW * 2) / (conW - borW * 2);// height/width
                        var imgADW = 0;// conW - borW * 2;
                        var imgADH = 0;// imgRatio * imgADW;
                        if (imgRatio > conRatio) {
                            imgADH = conH - borW * 2;
                            imgADW = imgADH / imgRatio;
                        }
                        else {
                            imgADW = conW - borW * 2;
                            imgADH = imgRatio * imgADW;
                        }
                        imgAD.style.width = imgADW + 'px';
                        imgAD.style.height = imgADH + 'px';
                        imgAD.style.margin = (conH - borW * 2 - imgADH) / 2 + 'px ' + (conW - borW * 2 - imgADW) / 2 + 'px';
                        // 获得下载按钮的宽度
                        var downBtnW = parseInt(getComputedStyle(document.getElementById('btn0'))['width'], 10);
                        var downBtnH = parseInt(getComputedStyle(document.getElementById('btn0'))['height'], 10);
                        // 做判断，当imgAD 的margin值 不足以容纳btn时，就让btn不显示
                        var btnDistance = (conH - imgADH) / 2 - downBtnH;
                        if (btnDistance < downBtnH * 2) {
                            downBtn.style.display = 'none';
                        } else {
                            downBtn.style.top = ((conH - borW * 2 - imgADH) / 2  + (conW - borW * 2 - imgADW) / 2) * 1.4 + imgADH + 'px';
                            downBtn.style.left = (conW - downBtnW) / 2 + 'px';
                        }
                    }
                    if (divUp) {
                        var rem = conW / 16;
                        var vrem = conH / 16;
                        // 定义系列变量
                        if (conW < conH) {
                            var tuwenLogoWidth = 3 * rem;
                            var tuwenLogoMargin = 6.5 * rem;
                            var titleWidth = 10 * rem;
                            var titleHeight = 2 * vrem;
                            var titleMargin =  0.5 * vrem + 'px ' + 3 * rem;
                            var titleFontSize = 0.7 * vrem;
                            var titleLineHeight = 1 * vrem;
                            var descWidth = 14 * rem;
                            var descHeight = 1.1 * vrem;
                            var descMargin = 1 * vrem + 'px ' + 1 * rem;
                            var descFontSize = 0.45 * vrem;
                            var descLineHeight = 0.55 * vrem;
                            var btnWidth = 13 * rem;
                            var btnHeight = 1.1 * vrem;
                            var btnMargin = 1.5 * rem;
                            var btnFontSize = 0.45 * vrem;
                            var btnLineHeight = 1.1 * vrem;
                        } else {
                            var tuwenLogoWidth = 3.2 * vrem;
                            var tuwenLogoMargin = (16 * rem - 3.2 * vrem) / 2;
                            var titleWidth = 8 * rem;
                            var titleHeight = 2 * vrem;
                            var titleMargin = 0.5 * vrem + 'px ' + 4 * rem;
                            var titleFontSize = 0.9 * vrem;
                            var titleLineHeight = 1 * vrem;
                            var descWidth = 14 * rem;
                            var descHeight = 1 * vrem;
                            var descMargin = 1 * vrem + 'px ' + 1 * rem;
                            var descFontSize = 0.7 * vrem;
                            var descLineHeight = 1 * vrem;
                            var btnWidth = 8 * rem;
                            var btnHeight = 1.1 * vrem;
                            var btnMargin = 4 * rem;
                            var btnFontSize = 0.7 * vrem;
                            var btnLineHeight = 1.1 * vrem;
                        }

                        // 图文模板部分的resize
                        var tuwenLogo = document.getElementById('logo' + index);
                        if (tuwenLogo) {
                            // logo部分的样式
                            var tuwenLogoImg = tuwenLogo.getElementsByTagName('img')[0];
                            var tuwenLogoCssText = 'width:' + tuwenLogoWidth+ 'px;height:' + tuwenLogoWidth + 'px;margin:0px ' + tuwenLogoMargin + 'px; ';
                            tuwenLogo.style.cssText = tuwenLogoCssText;
                            tuwenLogoImg.style.cssText ='width:' + tuwenLogoWidth + 'px;height:' + tuwenLogoWidth + 'px';
                        } else {
                            if (conW < conH) {
                                titleMargin =  0.5 * vrem + 3 * rem + 'px ' + 3 * rem + 'px ' + 0.5 * vrem;
                            } else {
                                titleMargin = 0.5 * vrem + 3.2 * vrem + 'px ' + 4 * rem + 'px ' + 0.5 * vrem;
                            }
                        }
                        // title 部分的样式
                        var title = document.getElementById('title' + index);
                        var titleSpan = title.getElementsByTagName('span')[0];
                        var titleCssText = 'width:' + titleWidth + 'px;height:' + titleHeight + 'px;margin:'
            + titleMargin + 'px';
                        title.style.cssText = titleCssText;
                        titleSpan.style.fontSize = titleFontSize + 'px';
                        titleSpan.style.lineHeight = titleLineHeight + 'px';
                        titleSpan.style.display = 'block';
                        // desc 部分的样式
                        var desc = document.getElementById('desc' + index);
                        var descSpan = desc.getElementsByTagName('span')[0];
                        var descCssText = 'width:' + descWidth + 'px;height:' + descHeight + 'px;margin:'
            + descMargin + 'px';
                        desc.style.cssText = descCssText;
                        descSpan.style.fontSize = descFontSize + 'px';
                        descSpan.style.lineHeight = descLineHeight + 'px';
                        descSpan.style.display = 'block';
                        // btn 的样式
                        var btn = document.getElementById('btn' + index);
                        var divDown = document.getElementById('divDown' + index);
                        var btnSpan = btn.getElementsByTagName('span')[0];
                        var btnCssText = 'width:' + btnWidth + 'px;height:' + btnHeight + 'px;line-height:' + btnHeight + 'px;margin:0px ' + btnMargin + 'px;border-radius:' + 0.75 * rem + 'px;';
                        btn.style.cssText = btnCssText;
                        btnSpan.style.fontSize = btnFontSize + 'px';
                        btnSpan.style.lineHeight = btnLineHeight + 'px';
                        btnSpan.style.display = 'block';
                        divUp.style.width = conW + 'px';
                        divUp.style.height = 12.8 * vrem + 'px';
                        divUp.style.padding = 0.9 * vrem + 'px 0';
                        divDown.style.width = conW + 'px';
                        divDown.style.height = 3.2 * vrem + 'px';
                        divDown.style.padding = 1.1 * vrem + 'px 0';
                    }

                    index += 1;
                    // itemA  a 链接的尺寸
                    itemA.style.width = conW + 'px';
                    itemA.style.height = conH + 'px';
                }
            // }
            var cloDiv = document.getElementById('closeDiv');
            var cloBtn = document.getElementById('closeBtn');
            if (cloDiv) {
                cloBtn.style.top = '5px';
                cloDiv.style.top = 0 + 'px';
                cloBtn.style.right = '5px';
                cloDiv.style.right = 0 + 'px'; // cloDiv.style.top;
            }

            // 网盟推广的样式
            var bdLogo = document.getElementById('bd-logo4');
            bdLogo.style.bottom = '5px';
        } else {
            window.requestAnimationFrame(function () {
                rs.template.tuwen_image_text_fulllunbo_bc_raf_no_blur.page.containerResize();
            });
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

