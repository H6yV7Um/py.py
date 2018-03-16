/**
 * @file tuwen_wap_feed_image_1 template layout
 * @author nieyuxin
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_wap_feed_image_1',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据
    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },
    //  秋实Sdk所需信息
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        var act = ad.actionType || 1;
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

        divRes.childNodes.push(divShadowOutset);
        divRes.childNodes.push(res);
        item.childNodes.push(title);
        item.childNodes.push(divRes);
        item.childNodes.push(a);
        items.push(item);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';'
        + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 填充各种数据
        res.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        title.innerHTML = ad.title;

        // 添加样式部分
        var style = {};
        var styleConfigObj = null;
        var styleConfig = context.requestInfo.styleConfig;
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
        var itemPB = 12 + 15 * pt + 6 * pt;// 广告logo的尺寸 + 广告log的定位高度 + 随机空余
        var titleFS = 30 * pt;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;
        if (styleConfigObj && styleConfigObj.containerPaddingLeft) {
            itemPL = styleConfigObj.containerPaddingLeft * pt;
        }
        if (styleConfigObj && styleConfigObj.containerPaddingRight) {
            itemPR = styleConfigObj.containerPaddingRight * pt;
        }
        var length = (ad.title && ad.title.length) ? ad.title.length : 1;
        titleH = (titleFS * length > itemWidth - itemPL - itemPR) ? titleH * 2 : titleH;
        var divResH = itemHeight - titleH - itemPT - itemPT - itemPB;
        // 图片的宽度 = 容器的宽度 - 左右边距
        var imgPadding = 0;
        var imgWidth = itemWidth - itemPL - itemPR;
        var imgHeight = imgWidth * ad.height / ad.width;
        if (imgHeight > divResH) {
            imgHeight = divResH;
            imgWidth = imgHeight * ad.width / ad.height;
            imgPadding = (itemWidth - itemPL - itemPR - imgWidth) / 2;
        }
        var imgMT = (divResH > imgHeight) ? (divResH - imgHeight) / 2 : 0;
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'box-sizing': 'border-box',
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
            'background': '#000 url("' + ad.stuffSrc + '") no-repeat 0 0 / 100% 100%',
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

        var logo = this.logo.getLogo({logoType: 'feed-logo'});
        container.childNodes.push(logo);

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({adIconType: 'feed-adIcon'}));
        }
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
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
