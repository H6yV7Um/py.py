/**
 * @file tuwen_wap_feed_banner_1 template layout
 * @author nieyuxin
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_wap_feed_banner_1',
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
                extention.curl = extention.curl || ad.clickUrl;
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
        var divLeft = engine.getLayout(fullConfig);
        divLeft.tagName = 'div';
        divLeft.class = 'divLeft';
        divLeft.id = 'divLeft';

        var resDiv = engine.getLayout(fullConfig);
        resDiv.tagName = 'div';
        resDiv.class = 'resDiv';
        resDiv.id = 'resDiv';
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.class = 'res';
        res.id = 'res';

        var divRight = engine.getLayout(fullConfig);
        divRight.tagName = 'div';
        divRight.class = 'divRight';
        divRight.id = 'divRight';
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.class = 'title';
        title.id = 'title';

        resDiv.childNodes.push(res);
        divLeft.childNodes.push(resDiv);
        divRight.childNodes.push(title);
        item.childNodes.push(divLeft);
        item.childNodes.push(divRight);
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
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        title.innerHTML = ad.title;
        res.src = ad.stuffSrc;

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
        var pt = containerHeight / 188;
        var positionLR = 'left';

        var itemPT = 12 * pt;
        var itemPL = (positionLR === 'left') ? 12 * pt : 0;
        var itemPR = (positionLR === 'left') ? 0 : 12 * pt;
        var itemPB = 12 + 15 * pt + 6 * pt;// 广告logo的尺寸 + 广告log的定位高度 + 随机空余
        var titlePT = 26 * pt;
        var titlePL = (positionLR === 'left') ? 22 * pt : 12 * pt;
        var titlePR = (positionLR === 'left') ? 12 * pt : 22 * pt;
        var titleFS = 30 * pt;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;

        if (styleConfigObj && styleConfigObj.containerPaddingLeft) {
            itemPL = styleConfigObj.containerPaddingLeft * pt;
        }
        if (styleConfigObj && styleConfigObj.containerPaddingRight) {
            titlePR = styleConfigObj.containerPaddingRight * pt;
        }
        if (styleConfigObj && styleConfigObj.logoPaddingRight) {
            titlePL = styleConfigObj.logoPaddingRight * pt;
        }
        var divLeftW = itemWidth / 3 - itemPL - itemPR;
        var divLeftH = itemHeight - itemPT * 2;
        var divRightW = itemWidth * 2 / 3 - titlePL - titlePR;
        var divRightH = itemHeight;

        var titleLength = (ad.title && ad.title.length) ? ad.title.length : 1;
        titleH = (titleFS * titleLength > divRightW) ? titleH * 2 : titleH;

        var imgW = divLeftW;
        var imgH = imgW * ad.height / ad.width;

        if (imgH > divLeftH) {
            imgH = divLeftH;
            imgW = imgH * ad.width / ad.height;
        }

        var imgPT = (divLeftH > imgH) ? (divLeftH - imgH) / 2 : 0;
        var imgPL = (divLeftW > imgW) ? (divLeftW - imgW) / 2 : 0;

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
        style['.divLeft'] = {
            'width': itemWidth / 3 + 'px',
            'height': itemHeight + 'px',
            'padding': itemPT + 'px ' + itemPR + 'px ' + itemPT + 'px ' + itemPL + 'px',
            'box-sizing': 'border-box',
            'float': positionLR
        };
        style['.resDiv'] = {
            'width': divLeftW + 'px',
            'height': divLeftH + 'px'
        };
        style['.res'] = {
            'width': imgW + 'px',
            'height': imgH + 'px',
            'padding': imgPT + 'px ' + imgPL + 'px'
        };
        style['.divRight'] = {
            'width': itemWidth * 2 / 3 + 'px',
            'height': itemHeight + 'px',
            'float': positionLR
        };
        style['.title'] = {
            'width': divRightW + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'font-size': titleFS + 'px',
            'padding': titlePT + 'px ' + titlePR + 'px 0 ' + titlePL + 'px',
            'overflow': 'hidden'
        };
        var logo = this.logo.getLogo({logoType: 'feed-logo'});
        container.childNodes.push(logo);

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({adIconType: 'feed-adIcon'}));
        }
        var feedLogoL = (positionLR === 'left') ? itemWidth / 3 : 0;
        style['.feed-logo'] = {
            'left': feedLogoL + titlePL + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': feedLogoL + titlePL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': feedLogoL + titlePL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
