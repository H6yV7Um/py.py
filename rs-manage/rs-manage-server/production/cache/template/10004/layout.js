/**
 * @file 10004
 * @author fanwenjuan@baidu.com
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: '10004',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,

    defaultValue: {
        containerBorderTop: 4,
        containerBorderRight: 4,
        containerBorderBottom: 4,
        containerBorderLeft: 4,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconType: 1
    },

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var adLength = ads.length;
        var style = {};
        if (fullConfig.templateWidth < 460) {
            fullConfig.adColumnCount = 1;
        } else if (fullConfig.templateWidth >= 460 && fullConfig.templateWidth < 728) {
            fullConfig.adColumnCount = 2;
        } else {
            fullConfig.adColumnCount = 3;
        }
        fullConfig.adRowCount = Math.ceil(adLength / fullConfig.adColumnCount);

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
        var itemWidth = Math.floor((containerWidth - fullConfig.itemColumnSpace * (fullConfig.adColumnCount - 1)) / fullConfig.adColumnCount);
        var itemHeight = Math.floor((containerHeight - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
        while (itemHeight < fullConfig.titleFontSize + 4) {
            fullConfig.adRowCount = fullConfig.adRowCount - 1;
            itemHeight = Math.floor((containerHeight - fullConfig.itemRowSpace * (fullConfig.adRowCount - 1)) / fullConfig.adRowCount);
        }
        fullConfig.itemWidth = itemWidth;
        fullConfig.itemHeight = itemHeight;
        var itemStyle = engine.getItemStyle(fullConfig);
        // columnSpace&&rowSpace
        var columnSpace = engine.getLayout(fullConfig);
        columnSpace.class = 'column-space';
        fullConfig.columnSpaceWidth = fullConfig.itemColumnSpace;
        fullConfig.columnSpaceHeight = fullConfig.itemHeight;
        var columnSpaceStyle = engine.getColumnSpaceStyle(fullConfig);
        var rowSpace = engine.getLayout(fullConfig);
        rowSpace.class = 'row-space';
        fullConfig.rowSpaceWidth = fullConfig.itemWidth;
        fullConfig.rowSpaceHeight = fullConfig.itemRowSpace;
        fullConfig.titlePaddingBottom = 0;
        var rowSpaceStyle = engine.getRowSpaceStyle(fullConfig);
        // title
        var titleLayout = engine.calculateTitle(itemStyle.width, itemStyle.height, fullConfig);
        fullConfig.titleWidth = titleLayout.width;
        fullConfig.titleHeight = fullConfig.titleFontSize + 4;
        fullConfig.titleLineHeight = fullConfig.titleHeight;
        var titleStyle = engine.getTitleStyle(fullConfig);
        var titleHoverStyle = engine.getTitleHoverStyle(fullConfig);

        var rowCount = fullConfig.adRowCount;
        var columnCount = fullConfig.adColumnCount;
        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                // item
                var adIndex = i * columnCount + j;
                if (adIndex < adLength) {
                    var ad = ads[adIndex];
                    var item = engine.getLayout(fullConfig);
                    item.class = 'item';
                    var clickLink = '';
                    if (ad.action[0] && ad.action[0].clickLink) {
                        clickLink = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
                    }

                    var title = engine.getLayout(fullConfig);
                    title.id = 'titleDiv' + adIndex;
                    title.class = 'title';
                    var a = engine.getLayout(fullConfig);
                    a.tagName = 'a';
                    a.target = 'blank';
                    a.id = 'title_' + adIndex;
                    a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                    a.href = clickLink;
                    var icon = engine.getLayout(fullConfig);
                    icon.tagName = 'i';
                    icon.id = 'icon_' + adIndex;
                    icon.innerHTML = adIndex + 1;
                    icon.class = 'icon';
                    var span = engine.getLayout(fullConfig);
                    span.tagName = 'span';
                    span.innerHTML = ad.textTitle[0];
                    a.childNodes.push(icon);
                    a.childNodes.push(span);
                    title.childNodes.push(a);
                    item.childNodes.push(title);
                    items.push(item);

                    if (j < columnCount - 1) {
                        items.push(columnSpace);
                    }
                    else if (i < rowCount - 1) {
                        items.push(rowSpace);
                    }
                }
            }
        }

        // 添加样式部分
        style['.container'] = containerStyle;
        style['.item'] = itemStyle;

        // 修复title显示一半的问题
        if (titleStyle['color'] === '#0000ff') {
            titleStyle['color'] = '#333';
        }
        titleStyle['text-decoration'] = 'none';
        style['.title'] = titleStyle;
        style['#titleDiv' + (fullConfig.adColumnCount * fullConfig.adRowCount - 1)] = {
            width: titleStyle['width'] - 14
        };
        style['a'] = {
            'text-decoration': 'none',
            'color': titleStyle['color']
        };
        style['.title a span'] = {
            padding: '0 8px 0 4px'
        };
        style['.title a:hover'] = titleHoverStyle;
        style['.icon'] = {
            'color': '#FFFFFF',
            'cursor': 'pointer',
            'display': 'inline-block',
            'font-size': '12px',
            'font-style': 'normal',
            'height': fullConfig.titleHeight + 'px',
            'line-height': fullConfig.titleHeight + 'px',
            'margin': '0 2px 0 0',
            'text-align': 'center',
            'width': '16px',
            'padding-top': '1px',
            'background-color': '#858585'
        };
        style['#icon_0,#icon_1,#icon_2'] = {
            'background-color': '#f2405b'
        };
        style['.column-space'] = columnSpaceStyle;
        style['.row-space'] = rowSpaceStyle;

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});