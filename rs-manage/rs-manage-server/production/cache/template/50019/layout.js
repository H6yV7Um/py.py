/* global oojs */
/**
* @file 50019
* @author
*/
/* eslint-disable max-len */
oojs.define({
    name: '',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'feed-logo',
        adIconType: 'feed-adIcon',
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        isShowCloseFeedBack: 0
    },
    //  秋实Sdk所需信息
    adsExtention: function (requestInfo) {
        var adsExtention = [];
        if (requestInfo.adElements && requestInfo.adElements.length) {
            for (var i = 0, count = requestInfo.adElements.length; i < count; i++) {
                var ad = requestInfo.adElements[i];
                var extention = ad.sdkInteractionInfo && JSON.parse(ad.sdkInteractionInfo);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;

        var ads = requestInfo.adElements;
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 1;
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';
        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.class = 'title';
        title.id = 'title';
        var divRes = engine.getLayout(fullConfig);
        divRes.tagName = 'div';
        divRes.class = 'divRes';
        divRes.id = 'divRes';
        var divShadowOutset = engine.getLayout(fullConfig);
        divShadowOutset.tagName = 'div';
        divShadowOutset.class = 'divShadowOutset';
        divShadowOutset.id = 'divShadowOutset';

        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.id = 'res';
        res.class = 'res';
        res.src = ad.imgFileSrc[0];

        divRes.childNodes.push(divShadowOutset);
        divRes.childNodes.push(res);
        item.childNodes.push(title);
        item.childNodes.push(divRes);
        item.childNodes.push(a);
        items.push(item);

        // 填充各种数据
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '';
        title.innerHTML = ad.textTitle[0] || '';
        // 根据actionType的值判断，当act值为下载类，使用PromoteApp中的appDescription
        if (act === 4) {
            title.innerHTML = ad && ad.appIntroduction || '';
        }
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);

        // 添加样式部分
        var style = {};
        var styleConfigObj = null;
        var styleConfig = requestInfo.styleConfig && requestInfo.styleConfig.ext;
        // 判断是否设置默认值
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        };
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        var pt = containerHeight / 535;

        var itemPT = 21 * pt;
        var itemPL = 12 * pt;
        var itemPR = 12 * pt;
        var itemPB = 12 + 15 * pt + 6 * pt;
        // 广告logo的尺寸 + 广告log的定位高度 + 随机空余
        var titleFS = 30 * pt;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.left) {
            itemPL = styleConfigObj.padding.left * pt;
        }
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.right) {
            itemPR = styleConfigObj.padding.right * pt;
        }
        var length = (ad.textTitle[0] && ad.textTitle[0].length) ? ad.textTitle[0].length : 1;
        titleH = (titleFS * length > itemWidth - itemPL - itemPR) ? titleH * 2 : titleH;
        var divResH = itemHeight - titleH - itemPT - itemPT - itemPB;
        // 图片的宽度 = 容器的宽度 - 左右边距
        var imgPadding = 0;
        var imgWidth = itemWidth - itemPL - itemPR;
        var imgRatio =  parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
        var imgHeight = imgWidth * imgRatio;
        if (imgHeight > divResH) {
            imgHeight = divResH;
            imgWidth = imgHeight / imgRatio;
            imgPadding = (itemWidth - itemPL - itemPR - imgWidth) / 2;
        }
        var imgMT = (divResH > imgHeight) ? (divResH - imgHeight) / 2 : 0;
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'background-color': '#fff'
        };
        style['.item'] = {
            'width': itemWidth - itemPL - itemPR - 2 + 'px',
            'height': itemHeight - 2 + 'px',
            'padding-bottom': itemPB + 'px',
            'padding-left': itemPL + 'px',
            'padding-right': itemPR + 'px',
            'position': 'relative'
        };
        style['#item0'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };
        style['.title'] = {
            'width': itemWidth - itemPL - itemPR - 2 + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'padding-top': itemPT + 'px',
            'font-size': titleFS + 'px',
            'overflow': 'hidden'
        };
        style['.divRes'] = {
            'width': itemWidth - itemPL - itemPR - 2 + 'px',
            'height': divResH + 'px',
            'position': 'absolute',
            'top': itemPT * 2 + titleH + 'px',
            'left': itemPL + 'px',
            'overflow': 'hidden',
            'background': '#868484'
        };

        style['.divShadowOutset'] = {
            'width': itemWidth - itemPL - itemPR - 2 + 'px',
            'height': divResH + 'px',
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'background': '#000 url("' + ad.imgFileSrc[0] + '") no-repeat 0 0 / 100% 100%',
            '-webkit-filter': 'blur(10px)',
            '-ms-filter': 'blur(10px)',
            '-moz-filter': 'blur(10px)',
            'filter': 'blur(10px)',
            'opacity': '0.6'
        };
        style['.res'] = {
            'width': imgWidth + 'px',
            'height': imgHeight + 'px',
            'position': 'absolute',
            'top': imgMT + 'px',
            'left': imgPadding + 'px'
        };

        style['.feed-logo'] = {
            'left': itemPL + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['#fbIconDiv'] = {
            'left': itemPL + 'px',
            'bottom': 20 * pt + 'px'
        };
        // 隐藏关闭反馈功能
        style['.feedbackCon'] = {
            'display': 'none'
        };
        style['#fbIcon'] = {
            'display': 'none'
        };
        style['.fbTipDiv'] = {
            'display': 'none'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
