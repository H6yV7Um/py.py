/* global oojs */
/**
* @file text_wap_mdsp
* @author nieyuxin
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_wap_mdsp',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        bannerImgUrl: 'rs.common.model.bannerImgUrl',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        cbackground: 'fff'
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

        var ad = ads[0];
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        items.push(item);

        for (var i = 0, len = ads.length; i < len; i++) {
            // 获取链接的下载类型
            var act = ads[i].actionType || 1;

            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.id = 'item_' + i;
            // 广告索引，必须加
            a['data-adindex'] = i;
            // 广告推广类型
            a['data-adtype'] = act;


            var divA = engine.getLayout(fullConfig);
            divA.tagName = 'div';
            divA.id = 'divA_' + i;
            divA.class = 'divA';

            // content
            var content = engine.getLayout(fullConfig);
            content.tagName = 'div';
            content.id = 'content_' + i;
            content.class = 'content';

            // title
            var title = engine.getLayout(fullConfig);
            title.tagName = 'div';
            title.id = 'title_' + i;
            title.class = 'title';

            // title内容
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.id = 'tspan_' + i;
            titleText.class = 'tspan';

            // 广告desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'div';
            desc.id = 'desc_' + i;
            desc.class = 'desc';
            // desc内容
            var descText = engine.getLayout(fullConfig);
            descText.tagName = 'span';
            descText.id = 'dspan_' + i;
            descText.class = 'dspan';

            // 填充广告数据
            title.childNodes.push(titleText);
            desc.childNodes.push(descText);
            content.childNodes.push(title);
            content.childNodes.push(desc);
            divA.childNodes.push(content);
            item.childNodes.push(a);
            item.childNodes.push(divA);


            a.title = ads[i].showUrl || '';
            a.href = ads[i].clickUrl;
            // 文本数据
            titleText.innerHTML = ads[i].title;
            descText.innerHTML = ads[i].desc[0];
        }

        // 添加样式部分
        var style = {};
        for (var i = 0, len = ads.length; i < len; i++) {
            var containerStyle = engine.getContainerStyle(fullConfig);
            var containerWidth = containerStyle.width;
            var containerHeight = containerStyle.height;
            var cbackground = userConfig.cbackground || 'fff';

            var adLen = ads.length;
            // 内容的宽高
            var contentWidth = containerWidth;
            var contentHeight = containerHeight / adLen;

            var pt = containerHeight / adLen / 48;
            style['#container.container'] = {
                position: 'relative',
                width: containerWidth + 'px',
                height: containerHeight + 'px',
                background: cbackground
            };
            style['.container'] = containerStyle;

            style['.item'] = {
                'width': '100%',
                'height': '100%',
                'position': 'relative'
            };
            style['#item_' + i] = {
                'width': '100%',
                'height': containerHeight / adLen + 'px',
                'display': 'block',
                'overflow': 'hidden',
                'text-decoration': 'none',
                'position': 'absolute',
                'top': containerHeight / adLen * i + 'px',
                'left': '0'
            };
            style['.item .divA'] = {
                'width': '100%',
                'height': containerHeight / adLen + 'px',
                'display': 'block',
                'overflow': 'hidden',
                'text-decoration': 'none'
            };

            style['.item div'] = {
                overflow: 'hidden'
            };

            style['#content_' + i] = {
                'width': contentWidth + 'px',
                'height': contentHeight + 'px'
            };
            // 文本折行
            var textWidth = contentWidth;
            style['.item span'] = {
                'word-wrap': 'break-word'
            };
            // title
            var titleHeight = Math.round(26 * pt);
            style['#title_' + i] = {
                'width': textWidth + 'px',
                'height': titleHeight  + 'px',
                'line-height': titleHeight  + 'px'

            };
            var titleFontSize = userConfig.titleFontSize || Math.round(14 * pt);
            var fontName = userConfig.fontname || 'SimSun,arial,sans-serif;';
            var titleFontColor = userConfig.titleFontColor || '000';
            var titleFontWeight = (userConfig.titleFontWeight && JSON.parse(userConfig.titleFontWeight) === 1) ? 'bold' : 'normal';
            style['#tspan_' + i] = {
                'font': 'normal ' + titleFontWeight + ' ' + titleFontSize + 'px/' + titleHeight + 'px ' + fontName,
                'color': '#' + titleFontColor,
                'width': '100%',
                'height': '100%',
                'display': 'block',
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis'
            };

            // desc
            var descHeight = Math.round(20 * pt);
            style['#desc_' + i] = {
                'width': textWidth  + 'px',
                'height': descHeight  + 'px',
                'line-height': descHeight  + 'px'
            };
            var fontSize = userConfig.fontsize || Math.round(14 * pt);
            var descFontFamily = userConfig.descFontFamily || 'SimSun,arial,sans-serif;';
            var descFontColor = userConfig.descFontColor || '000';
            style['#dspan_' + i] = {
                'font': 'normal ' + fontSize + 'px/' + descHeight + 'px ' + descFontFamily,
                'color': '#' + descFontColor,
                'width': '100%',
                'height': '100%',
                'display': 'block',
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis'
            };
        }

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ads[0].actionTypeInfo) {
            ads[0].actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': '18px',
        //     'height': '18px',
        //     'background-size': 'contain'
        // };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
