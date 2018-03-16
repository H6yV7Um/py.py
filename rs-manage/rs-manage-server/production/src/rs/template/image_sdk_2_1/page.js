/**
 * @file image_sdk_2_1 template page event
 */
/* eslint-disable max-len */
/* globals rs */
/* globals oojs */
oojs.define({
    name: 'page',
    namespace: 'rs.template.image_sdk_2_1',
    deps: {},
    // Sdk js 接口
    sdk: {},
    // 广告扩展字段
    adsExtention: [],
    resizeTimer: null,
    $page: function () {
        try {
            this.sdk = (window.baidu && window.baidu.mobads && window.baidu.mobads.Sdk) || (parent && parent.baidu && parent.baidu.mobads && parent.baidu.mobads.Sdk);
            this.bindCloseHandler();
            // this.bindActionHandler();

            if (window.adsExtention && document.getElementById('container')) {
                this.adClick('container', window.adsExtention);
            }
			// this.bindImgLoaded();
            this.containerResize();
            this.bind(window, 'resize', function () {
                /* if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
                this.resizeTimer = setTimeout(function () {
                    rs.template.image_sdk_2_1.page.containerResize();
                }, 400); */
                rs.template.image_sdk_2_1.page.containerResize();
            });
        } catch (e) {
        }
    },
	/*bindImgLoaded: function () {
		var imgAD = document.getElementById('imgAD');
		this.bind(imgAD, 'load', function () {
			var linkItem = document.getElementById('item0');
			linkItem.style.height = this.style.height;
			linkItem.style.width = this.style.width;
			linkItem.style.margin = this.style.margin;
			linkItem.style.zIndex = '15';
			linkItem.style.position = 'absolute';
			linkItem.style.top = '0';
			linkItem.style.left = '0';
		});
	},*/
    bindActionHandler: function () {
        // var actionBtn=document.getElementById('actBtn');
    },
    // 绑定关闭按钮事件
    bindCloseHandler: function () {
        var closeBtn = document.getElementById('closeBtn');
        var isBtnClose = this.getAttr(closeBtn, 'data-isbtn');
        if (isBtnClose === 'true') {
            this.bind(closeBtn, 'click', function () {rs.template.image_sdk_2_1.page.sdk.onAdPlayEnd(); rs.template.image_sdk_2_1.page.stopEvent(this); });
        }
        else {
            var interval = setInterval(function () {
                var closeBtn = document.getElementById('closeBtn');
                if (parseInt(closeBtn.innerHTML, 10) - 1 === 0) {
                    clearInterval(interval);
                    this.sdk.onAdPlayEnd();
                }
                else {
                    closeBtn.innerHTML = parseInt(closeBtn.innerHTML, 10) - 1 + 's';
                }
            }, 1000);
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
                if (tempClassName === 'gylogo' || tempClassName === 'bdlogo' || tempClassName.substring(0, 7)
                === 'bd-logo') {
                    continue;
                }
            }
            this.bind(linkArray[i], 'click', this.onAdClick.proxy(this));
        }
    },
    // 广告被点击
    onAdClick: function (event) {
        /* globals e */
        e = this.formatEventObj(event);
        var sourceElement = e.target;
        while (sourceElement.tagName.toLowerCase() !== 'a' && sourceElement.tagName.toLowerCase() !== 'body') {
            sourceElement = sourceElement.parentNode;
        }
        var adIndex = this.getAttr(sourceElement, 'data-adIndex');
        adIndex = parseInt(adIndex, 10);
        var adInfo = this.adsExtention[adIndex];
        adInfo.curl = sourceElement.href || adInfo.curl;
        this.sdk.handleClick(adInfo);

        return this.stopEvent(event);
    },
    containerResize: function () {
        var con = document.getElementById('container');
        if (con.clientWidth === 0 || con.clientHeight === 0) {
            return;
        }
        var conW = parseInt(window.innerWidth, 10);
        var conH = parseInt(window.innerHeight, 10);
        var itemBg = document.getElementById('itemBg');
        var imgAD = document.getElementById('imgAD');
        var borW = parseInt(this.getAttr(imgAD, 'data-imgBorder'), 10);
        var imgRatio = parseFloat(this.getAttr(imgAD, 'data-imgRatio'));
        var conRatio = (conH - borW * 2) / (conW - borW * 2);// height/width

        // 根据ui图计算的背景的样式
        var itemBgW = 0; // conW;
        var itemBgH = 0; // itemBgW * 5 / 6;

        if (conRatio >= 1) {
            // 竖屏的情况
            itemBgW = conW;
            itemBgH = itemBgW * 5 / 6;
        } else {
            // 横屏的情况
            itemBgW = conH * 6 / 5;
            itemBgH = conH;
        }
        var itemBgPaddingLeft =  60 / 750 * itemBgW;
        var itemBgPaddingTop =  113 / 625 * itemBgH;


        var imgADW = 0;// conW - borW * 2;
        var imgADH = 0;// imgRatio * imgADW;
        if (imgRatio > conRatio) {
            imgADH = itemBgH - itemBgPaddingTop * 2;
            imgADW = imgADH * 2;
        }
        else {
            imgADW = itemBgW - itemBgPaddingLeft * 2;
            imgADH = imgADW / 2;
        }

        // 图片的样式
        var centerCssTxt = 'width:' + imgADW + 'px;height:' + imgADH + 'px;';
        imgAD.style.cssText = centerCssTxt;

        // 背景图的样式
        var itemBgCssText =  'width:' + itemBgW + 'px;height:' + itemBgH + 'px;margin:'
            + (conH - borW * 2 - itemBgH) / 2 + 'px ' + (conW - borW * 2 - itemBgW) / 2 + 'px;padding:' + itemBgPaddingTop + 'px ' + itemBgPaddingLeft + 'px';
        itemBg.style.cssText = itemBgCssText;

        // 按钮的样式
        var cloDiv = document.getElementById('closeDiv');
        var cloBtn = document.getElementById('closeBtn');
        if (cloDiv) {
            cloBtn.style.top = (conH - itemBgH - borW * 2) / 2 + 'px';
            cloDiv.style.top = (parseInt(cloBtn.clientHeight, 10) - parseInt(cloDiv.clientHeight, 10)) / 2 + 'px';
            cloBtn.style.right = (conW - itemBgW - borW * 2) / 2 + 'px';
            cloDiv.style.right = cloDiv.style.top;
        }

        // 信息按钮的样式
        var btn = document.getElementById('btn');
        var btnStyle = 'width:' + itemBgW / 3 + 'px;height:' + itemBgW / 15 + 'px;line-height:' + itemBgW / 15 + 'px;font-size:' + itemBgW / 30 + 'px;position:absolute;left:' + (itemBgW - itemBgW / 3) / 2 + 'px;bottom:' + itemBgH / 15 + 'px;';
        if (btn) {
            btn.style.cssText = btnStyle;
        }

        var linkItem = document.getElementById('item0');
        // linkItem.style.cssText = 'width:' + conW + 'px;height:' + conH + 'px;position:absolute;z-index:15;left:0px;top:' + (borW * 2 + itemBgH - conH) / 2 + 'px;';
        linkItem.style.cssText = 'width:' + itemBgW + 'px;height:' + itemBgH + 'px;position:absolute;z-index:15;left:' + (conW - borW * 2 - itemBgW) / 2 + 'px;top:0px;';
        var logo = document.getElementById('bd-logo4');
        var adMark = document.getElementById('mob-bd-adIcon');
        if (logo) {
            logo.style.bottom = (conH - itemBgH) / 2 + 'px';
            logo.style.right = (conW - itemBgW) / 2 + 26 + 'px';
            logo.style.display = '';
        }
        if (adMark) {
            adMark.style.bottom = (conH - itemBgH) / 2 + 'px';
            adMark.style.right = (conW - itemBgW) / 2 + 'px';
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