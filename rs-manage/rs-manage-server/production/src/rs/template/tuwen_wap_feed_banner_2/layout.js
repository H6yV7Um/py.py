/**
 * @file tuwen_wap_feed_banner_2 template layout
 * @author nieyuxin
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_wap_feed_banner_2',
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
        var divTop = engine.getLayout(fullConfig);
        divTop.tagName = 'div';
        divTop.class = 'divTop';
        divTop.id = 'divTop';

        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.class = 'title';
        title.id = 'title';

        var divBottom = engine.getLayout(fullConfig);
        divBottom.tagName = 'div';
        divBottom.class = 'divBottom';
        divBottom.id = 'divBottom';

        // res图片部分
        var itemUl = engine.getLayout(fullConfig);
        itemUl.tagName = 'ul';
        itemUl.class = 'itemUl';
        itemUl.id = 'itemUl';

        for (var i = 0, len = ad.customizedContent.image.length; i < len; i++) {
            var resDiv = engine.getLayout(fullConfig);
            resDiv.tagName = 'div';
            resDiv.class = 'resDiv' + i;
            resDiv.id = 'resDiv' + i;

            var res = engine.getLayout(fullConfig);
            res.tagName = 'img';
            res.class = 'res' + i;
            res.id = 'res' + i;

            var itemList = engine.getLayout(fullConfig);
            itemList.tagName = 'li';
            itemList.class = 'itemList' + i;
            itemList.id = 'itemList' + i;
            res.src = ad.customizedContent.image[i];
            resDiv.childNodes.push(res);
            itemList.childNodes.push(resDiv);
            itemUl.childNodes.push(itemList);
        }

        divTop.childNodes.push(title);
        item.childNodes.push(divTop);
        divBottom.childNodes.push(itemUl);
        item.childNodes.push(divBottom);
        items.push(item);
        items.push(a);

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

        // 添加样式部分
        var style = {};
        var styleConfigObj = null;
        var styleConfig = context.requestInfo.styleConfig;
        // 判断是否设置默认值
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        };
        var pt = containerHeight / 128;
        var resPT = 2 * pt;
        var resPR = 5 * pt;
        var resPB = 2 * pt;
        var resPL = 5 * pt;
        var resDivPR = 4 * pt;
        if (styleConfigObj && styleConfigObj.containerPaddingLeft) {
            resPL = styleConfigObj.containerPaddingLeft * pt;
        }
        if (styleConfigObj && styleConfigObj.containerPaddingRight) {
            resPR = styleConfigObj.containerPaddingRight * pt;
        }
        if (styleConfigObj && styleConfigObj.imagePaddingLeft) {
            resDivPR = styleConfigObj.imagePaddingLeft * pt;
        }
        var itemWidth = parseInt(containerWidth - resPL - resPL - 2 * pt, 10);
        var itemHeight = containerHeight;
        var itemPB = 12 + 10 * pt;// 广告logo的尺寸 + 广告log的定位高度
        var titlePT = userConfig.titlePaddintTop || 7 * pt;
        var titlePR = userConfig.titlePaddintRight || 5 * pt;
        var titlePB = userConfig.titlePaddintBottom || 7 * pt;
        var titlePL = userConfig.titlePaddintleft || 5 * pt;
        var titleFS = userConfig.titleFontSize || 16 * pt;
        var titleW = itemWidth - titlePR - titlePL;
        var titleH = 18 * pt;
        var titleLH = 18 * pt;
        var titleLength = (ad.title && ad.title.length) ? ad.title.length : 1;
        titleH = (titleFS * titleLength > titleW) ? titleH * 2 : titleH;
        var resW = parseInt((itemWidth - resDivPR * 2) / ad.customizedContent.image.length, 10);
        var resH = parseInt(itemHeight - itemPB - titleH - titlePT * 2 - resPT - resPB, 10);

        var imgW = resW;
        var imgH = resW * ad.height / ad.width;

        if (imgH > resH) {
            imgH = resH;
            imgW = imgH * ad.width / ad.height;
        }

        var imgPT = (resH > imgH) ? (resH - imgH) / 2 : 0;
        var imgPL = (resW > imgW) ? (resW - imgW) / 2 : 0;

        // 0夜间,1-日间,默认日间模式
        var userMode = (parseInt(userConfig.userMode, 10) === 0) ? 0 : 1;

        a['data-mode'] = userMode;
        if (userMode) {
            // 日间模式
            var itemBC =  '#ffffff';
            var titleC = '#000000';
        } else {
            // 夜间模式
            var itemBC =  '#1b1b1b';
            var titleC = '#c9c9c9';
        }
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative'
        };
        style['.item'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'padding-left': resPL + 'px',
            'padding-right': resPR + 'px',
            'padding-bottom': itemPB + 'px',
            'background': itemBC
        };
        style['#item0'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };
        style['.divTop'] = {
            'width': itemWidth + 'px'
        };
        style['.title'] = {
            'width': itemWidth + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'font-size': titleFS + 'px',
            'color': titleC,
            'margin-top': titlePT + 'px',
            'margin-bottom': titlePT + 'px',
            'overflow': 'hidden'
        };
        style['.divBottom'] = {
            'width': itemWidth + 'px',
            'height': resH + 'px',
            'padding': resPT + 'px 0px',
            'position': 'relative'
        };
        style['.itemUl'] = {
            'position': 'absolute',
            'left': 0,
            'top': 0,
            'width': itemWidth + 'px',
            'height': resH + 'px'
        };
        for (var i = 0, len = ad.customizedContent.image.length; i < len; i++) {
            style['.resDiv' + i] = {
                'width': resW + 'px',
                'height': resH  + 'px'
            };
            style['.res' + i] = {
                'width': imgW + 'px',
                'height': imgH  + 'px',
                'padding': imgPT + 'px ' + imgPL + 'px'
            };
            style['.itemList' + i] = {
                'height': resH + 'px',
                'width': resW + 'px',
                'position': 'absolute',
                'display': 'block',
                'top': '0',
                'left': (resW + resDivPR) * i + 'px',
                'float': 'left',
                'overflow': 'hidden'
            };
        }
        var logo = this.logo.getLogo({logoType: 'feed-logo'});
        container.childNodes.push(logo);

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({adIconType: 'feed-adIcon'}));
        }
        style['.feed-logo'] = {
            'left': resPL + 'px',
            'bottom': 8 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': resPL + 12 + 'px',
            'bottom': 8 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': resPL + 12 + 'px',
            'bottom': 8 * pt + 'px'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
