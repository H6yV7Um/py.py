/**
 * @file 10001
 * @author fanwenjuan@baidu.com
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: '10001',
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
        if ((!fullConfig.hn || !fullConfig.wn) && (!fullConfig.column || !fullConfig.row)) {
            if (fullConfig.templateHeight > 90) {
                if (fullConfig.templateWidth >= 450) {
                    fullConfig.adColumnCount = Math.min(Math.round(fullConfig.templateWidth / 250), adLength);
                    fullConfig.adRowCount = Math.ceil(adLength / fullConfig.adColumnCount);
                } else {
                    fullConfig.adColumnCount = 1;
                    fullConfig.adRowCount = adLength;
                }
            }
            else {
                fullConfig.adColumnCount = adLength;
                fullConfig.adRowCount = 1;
            }
        }

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
        var rowSpaceStyle = engine.getRowSpaceStyle(fullConfig);
        // title
        fullConfig.titleLineHeight = fullConfig.titleFontSize + 4;
        var titleLayout = engine.calculateTitle(itemStyle.width, itemStyle.height, fullConfig);
        fullConfig.titleWidth = titleLayout.width;
        fullConfig.titleHeight = titleLayout.height;
        var titleStyle = engine.getTitleStyle(fullConfig);
        var titleHoverStyle = engine.getTitleHoverStyle(fullConfig);

        // desc
        fullConfig.descWidth = itemStyle.width;
        fullConfig.descHeight = itemStyle.height - fullConfig.titleHeight;
        var descStyle = engine.getDescStyle(fullConfig);
        var descHoverStyle = engine.getDescHoverStyle(fullConfig);

        var rowCount = fullConfig.adRowCount;
        var columnCount = fullConfig.adColumnCount;
        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                // item
                var adIndex = i * columnCount + j;
                if (adLength > adIndex) {
                    var ad = ads[adIndex];
                    var item = engine.getLayout(fullConfig);
                    item.class = 'item';
                    var clickLink = '';
                    if (ad.action[0] && ad.action[0].clickLink) {
                        clickLink = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
                    }
                    if (fullConfig.titleIsShow) {
                        var title = engine.getLayout(fullConfig);
                        title.id = 'titleDiv' + adIndex;
                        title.class = 'title';
                        var a = engine.getLayout(fullConfig);
                        a.tagName = 'a';
                        a.target = 'blank';
                        a.id = 'title_' + adIndex;
                        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                        a.href = clickLink;
                        a.innerHTML = ad.textTitle[0];
                        // titleRowCount为2时，当某条广告的tilte比较短，则需要修改当条广告的tilte高度
                        if ((a.innerHTML.replace(/([^\x00-\xff])/g, '\x241 ').length * titleStyle['font-size']) / 2 <= titleStyle['width'] && fullConfig.titleRowCount !== 1) {
                            style['#titleDiv' + adIndex] = {
                                height: titleStyle['height'] / 2
                            };
                            var currentDescHeight = descStyle.height + titleStyle['height'] / 2;
                            style['#descDiv' + adIndex] = {
                                height: currentDescHeight
                            };
                        }
                        title.childNodes.push(a);
                        item.childNodes.push(title);
                    }
                    if (fullConfig.descIsShow) {
                        var desc = engine.getLayout(fullConfig);
                        desc.id = 'descDiv' + adIndex;
                        desc.class = 'desc';
                        var a = engine.getLayout(fullConfig);
                        a.tagName = 'a';
                        a.target = 'blank';
                        a.id = 'desc_' + adIndex;
                        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                        a.href = clickLink;
                        a.innerHTML = ad.textDesc1[0] + '&nbsp' + ad.textDesc2[0];
                        var descLen = a.innerHTML.length * descStyle['font-size'];
                        var tempHeight = Math.ceil(descLen / descStyle.width) * descStyle['line-height'];
                        currentDescHeight = currentDescHeight || descStyle.height;
                        if (currentDescHeight  <  tempHeight) {
                            currentDescHeight = Math.floor(currentDescHeight / descStyle['line-height']) * descStyle['line-height'];
                        } else {
                            currentDescHeight = Math.min(currentDescHeight, Math.ceil(tempHeight / descStyle['line-height']) * descStyle['line-height']);
                        }
                        style['#descDiv' + adIndex] = {
                            height: currentDescHeight
                        };
                        desc.childNodes.push(a);
                        item.childNodes.push(desc);
                    }
                    currentDescHeight = 0;
                    items.push(item);
                    if (j < columnCount - 1 && adLength > 1) {
                        items.push(columnSpace);
                    }
                    else if (i < rowCount - 1 && adLength > 1) {
                        items.push(rowSpace);
                    }
                }
            }
        }

        // 修复最后一条广告太长时遮挡Logo的问题
        var width = fullConfig.templateWidth;
        var height = fullConfig.templateHeight;
        var count = 1;
        if (width < 200) {
            count =  Math.round(height / 150);
        } else if (330 > width && width >= 200) {
            count =  Math.round(height / 100);
        } else if (450 > width && width >= 330) {
            count =  Math.round(height / 70);
        } else if (960 > width && width >= 450) {
            count = Math.round(width / 200) * Math.round(height / 90);
        } else {
            count = Math.floor(width / 200) * Math.round(height / 90);
        }
        var lastIndex = adLength - 1;
        var lastDescDivHeight = descStyle.height;
        if (style['#descDiv' + lastIndex]) {
            lastDescDivHeight = style['#descDiv' + lastIndex].height || lastDescDivHeight;
        }

        var lastAd = ads[lastIndex];
        if (count <= adLength && (lastAd.textDesc1[0] + ' ' + lastAd.textDesc2[0]).length * descStyle['font-size'] >= descStyle['width'] * Math.floor(lastDescDivHeight / descStyle['line-height'])) {
            style['#descDiv' + lastIndex] = style['#descDiv' + lastIndex] || {};
            style['#descDiv' + lastIndex].width = descStyle.width - 14;
        }
        // 修复最后一条广告太长时遮挡Logo的问题 End
        // 添加样式部分
        style['.container'] = containerStyle;
        // 如果只有一条广告，则让广告默认水平居中
        if (adLength === 1) {
            if (fullConfig.adRowCount === 1) {
                titleStyle['text-align'] = 'center';
                descStyle['text-align'] = 'center';
            }
            if (fullConfig.adColumnCount === 1) {
                var descHeight = descStyle.height;
                if (style['#descDiv0']) {
                    descHeight = style['#descDiv0'].height;
                }
                itemStyle['height'] =  fullConfig.titleHeight + descHeight;
                itemStyle['padding-top'] = (containerStyle['height'] - itemStyle['height']) / 2;
            }
        }
        style['.item'] = itemStyle;

        // 修复title显示一半的问题
        titleStyle['margin-bottom'] = titleStyle['padding-bottom'];
        delete titleStyle['padding-bottom'];
        style['.title'] = titleStyle;
        style['.title a'] = {
            color: titleStyle['color']
        };
        style['.title a:hover'] = titleHoverStyle;
        style['.desc'] = descStyle;
        style['.desc a'] = {
            'text-decoration': 'none',
            'color': descStyle['color']
        };
        style['.desc a:hover'] = descHoverStyle;
        style['.column-space'] = columnSpaceStyle;
        style['.row-space'] = rowSpaceStyle;

        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});