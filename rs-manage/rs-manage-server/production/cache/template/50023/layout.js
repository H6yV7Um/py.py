/* global oojs */
/**
* @file 50023
* @author
*/
/* eslint-disable max-len */
oojs.define({
    name: '50023',
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

        item.childNodes.push(title);
        item.childNodes.push(a);
        items.push(item);

        // 填充各种数据
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '';
        title.innerHTML = ad.textTitle[0] || '';

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
        var itemWidth = containerWidth - 2;
        var itemHeight = containerHeight - 2;
        var pt = containerHeight / 188;

        var itemPB = 12 + 15 * pt + 6 * pt;// 广告logo的尺寸 + 广告log的定位高度 + 随机空余
        var titlePT = 32 * pt;
        var titlePL = 22 * pt;
        var titlePR = 12 * pt;
        var titleFS = 30 * pt;
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.left) {
            titlePL = styleConfigObj.padding.left * pt;
        }
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.right) {
            titlePR = styleConfigObj.padding.right * pt;
        }
        var titleW = itemWidth - titlePL - titlePR;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;
        var titleLength = (ad.textTitle[0] && ad.textTitle[0].length) ? ad.textTitle[0].length : 1;
        titleH = (titleFS * titleLength > titleW) ? titleH * 2 : titleH;
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'background-color': '#fff'
        };
        style['.item'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
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
            'width': titleW + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'font-size': titleFS + 'px',
            'padding': titlePT + 'px ' + titlePR + 'px 0 ' + titlePL + 'px',
            'overflow': 'hidden'
        };

        style['.feed-logo'] = {
            'left': titlePL + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': titlePL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': titlePL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['#fbIconDiv'] = {
            'left': titlePL + 'px',
            'bottom': 20 * pt + 'px'
        };
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
