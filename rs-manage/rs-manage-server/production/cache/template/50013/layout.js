/**
 * @file 50013
 * @author
 */
/* global oojs */
oojs.define({
    name: '50013',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
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

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = JSON.parse(requestInfo.ads);
        var ad = ads.mainCreatives[0];
        var act = requestInfo.styleConfig.actionType || 1;

        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;

        // item 移动只出一条广告
        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';

        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo0';
        logo.class = 'logo';
        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        item.childNodes.push(logo);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        item.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        item.childNodes.push(desc);

        // 填充广告数据
        logoImg.src = ad.textWithIcon.material.file.fileSrc;
        titleText.innerHTML = ad.textWithIcon.material.creativeTitle;
        descText.innerHTML = ad.textWithIcon.material.creativeDesc1 + ad.textWithIcon.material.creativeDesc2;
        a.title = ad.textWithIcon.action.forward.targetPage || '';
        a.href = ad.textWithIcon.action.forward.clickLink.clickLink;
        item.childNodes.push(a);
        items.push(item);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 根据广告位比例计算尺寸
        //  20.3 - 6.66
        //  20.5 - 4
        //  6.5  - 1.2
        var scale = containerWidth / containerHeight;
        var data;
        if (scale > 6.5) {
            data = this.calculate20T3(containerWidth, containerHeight);
        } else if (scale > 3.5) {
            data = this.calculate20T5(containerWidth, containerHeight);
        } else {
            data = this.calculate6T5(containerWidth, containerHeight);
        }

        // item居中
        var paddingTop = Math.floor((containerHeight - data.itemHeight) / 2);
        var paddingLeft = Math.floor((containerWidth - data.itemWidth) / 2);

        style['.container'] = containerStyle;
        style['.item'] = {
            width: data.itemWidth,
            height: data.itemHeight,
            padding: paddingTop + 'px ' + paddingLeft + 'px',
            position: 'relative'
        };
        // 移动广告全区域可点击
        style['.item a'] = {
            width: data.itemWidth + (paddingLeft * 2),
            height: data.itemHeight + (paddingTop * 2),
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            float: 'left',
            overflow: 'hidden'
        };
        style['.item .logo'] = {
            width: data.logoWidth,
            height: data.logoHeight,
            padding: data.logoPadding + 'px'
        };
        style['.item .logo img'] = {
            width: data.logoWidth,
            height: data.logoHeight
        };
        // 文本折行
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        style['.item .title'] = {
            width: data.titleWidth,
            height: data.titleHeight
        };
        style['.item .title span'] = {
            font: 'normal bold ' + data.titleFontSize + 'px/' + data.titleLineHeight + 'px arial,sans-serif;',
            color: data.titleFontColor
        };
        style['.item .desc'] = {
            width: data.descWidth,
            height: data.descHeight,
            'padding-top': data.descPaddingTop
        };
        style['.item .desc span'] = {
            font: 'normal ' + data.descFontSize + 'px/' + data.descLineHeight + 'px arial,sans-serif;',
            color: data.descFontColor
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },
    calculate20T3: function (containerWidth, containerHeight) {
        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;
        // 广告位比例20.3时组件尺寸
        var result = {
            itemWidth: containerWidth,
            itemHeight: containerHeight,
            logoWidth: Math.round(110 * px),
            logoHeight: Math.round(110 * px),
            logoPadding: 0,
            titleFontSize: Math.round(52 * px),
            titleLineHeight: Math.round(70 * px),
            titleRowCount: 1,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#003399',
            descFontSize: Math.round(40 * px),
            descLineHeight: Math.round(46 * px),
            descRowCount: 1,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#999999',
            descPaddingTop: 0
        };

        // 动态计算部分属性
        result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
        result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.titleWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;

        return result;
    },
    calculate20T5: function (containerWidth, containerHeight) {
        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;

        // 广告位比例20.3时组件尺寸
        var result = {
            itemWidth: containerWidth,
            itemHeight: containerHeight,
            logoWidth: Math.round(188 * px),
            logoHeight: Math.round(188 * px),
            logoPadding: 0,
            titleFontSize: Math.round(50 * px),
            titleLineHeight: Math.round(72 * px),
            titleRowCount: 1,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#003399',
            descFontSize: Math.round(38 * px),
            descLineHeight: Math.round(48 * px),
            descRowCount: 2,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#999999',
            descPaddingTop: Math.round(10 * px)
        };
        // 动态计算部分属性
        result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
        result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.titleWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;

        return result;
    },
    calculate6T5: function (containerWidth, containerHeight) {
        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;

        // 广告位比例20.3时组件尺寸
        var result = {
            itemWidth: Math.round(600 * px),
            itemHeight: Math.round(310 * px),
            logoWidth: Math.round(144 * px),
            logoHeight: Math.round(144 * px),
            logoPadding: 0,
            titleFontSize: Math.round(50 * px),
            titleLineHeight: Math.round(72 * px),
            titleRowCount: 2,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#003399',
            descFontSize: Math.round(38 * px),
            descLineHeight: Math.round(48 * px),
            descRowCount: 3,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#999999',
            descPaddingTop: Math.round(15 * px)
        };

        // 动态计算部分属性
        result.titleWidth = result.itemWidth - result.logoWidth - (result.logoPadding * 2);
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.itemWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;

        return result;
    }
});