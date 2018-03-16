/**
 * @file 50001
 * @author fanwenjuan@baidu.com
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: '50001',
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
        // res
        var resHeight = Math.min(itemStyle.height, 61); // 61为图片大小55，padding为2，border为1
        var resWidth = resHeight + 5;

        // icon
        var iconHeight = 22;
        var iconWidth = 24;

        // subItem && desc
        var subItemWidth = itemStyle.width;
        var subItemHeight = itemStyle.height;
        if (itemStyle.height < 80) {
            fullConfig.descHeight = subItemHeight - fullConfig.titleHeight;
            fullConfig.descWidth = subItemWidth - resWidth - iconWidth;
            titleStyle.width = fullConfig.descWidth;
        } else {
            if (fullConfig.templateWidth < 200) {
                iconHeight = 26;
                subItemHeight = itemStyle.height - fullConfig.titleHeight - iconHeight;
                resHeight = Math.min(subItemHeight, resHeight);
                resWidth = resHeight + 5;
                fullConfig.descWidth = subItemWidth - resWidth;
                fullConfig.descHeight = subItemHeight;
            } else {
                subItemHeight = itemStyle.height - fullConfig.titleHeight;
                resHeight = Math.min(subItemHeight, resHeight);
                resWidth = resHeight + 5;
                fullConfig.descWidth = subItemWidth - resWidth - iconWidth;
                fullConfig.descHeight = subItemHeight;
            }
        }
        // desc
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

                    // 至少包含desc和image的subItem
                    var subItem = engine.getLayout(fullConfig);
                    subItem.class = 'subItem';
                    subItem.id = 'subItem' + adIndex;

                    // title
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
                        if (itemStyle.height < 80) {
                            var currentDescHeight = descStyle.height + titleStyle['height'] / 2;
                        } else {
                            var currentSubItemHeight = subItemHeight + titleStyle['height'] / 2;
                            style['#subItem' + adIndex] = {
                                height: currentSubItemHeight
                            };
                        }
                    }

                    title.childNodes.push(a);
                    if (itemStyle.height >= 80) {
                        item.childNodes.push(title);
                    }
                    // image
                    var resDiv = engine.getLayout(fullConfig);
                    resDiv.id = 'resDiv' + adIndex;
                    resDiv.class = 'res';
                    var a = engine.getLayout(fullConfig);
                    a.tagName = 'a';
                    a.target = 'blank';
                    a.id = 'res_' + adIndex;
                    a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                    a.href = clickLink;
                    var res = engine.getLayout(fullConfig);
                    res.tagName = 'img';
                    res.src = ad.iconFileSrc[0];
                    a.childNodes.push(res);
                    resDiv.childNodes.push(a);
                    subItem.childNodes.push(resDiv);
                    if (itemStyle.height < 80) {
                        subItem.childNodes.push(title);
                    }
                    // desc
                    var desc = engine.getLayout(fullConfig);
                    desc.id = 'descDiv' + adIndex;
                    desc.class = 'desc';
                    var a = engine.getLayout(fullConfig);
                    a.tagName = 'a';
                    a.target = 'blank';
                    a.id = 'desc_' + adIndex;
                    a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                    a.href = clickLink;
                    a.innerHTML = ad.textDesc1[0] + ',' + ad.textDesc2[0];
                    var descLen = a.innerHTML.length * descStyle['font-size'];
                    var tempHeight = Math.ceil(descLen / descStyle.width) * descStyle['line-height'];
                    currentDescHeight = currentDescHeight || descStyle.height;
                    var maxDescHeight = itemStyle.height < 80 ? resHeight - fullConfig.titleHeight : resHeight;

                    currentDescHeight = Math.min(currentDescHeight, maxDescHeight);
                    if (currentDescHeight  <  tempHeight) {
                        currentDescHeight = Math.floor(currentDescHeight / descStyle['line-height']) * descStyle['line-height'];
                    } else {
                        currentDescHeight = Math.min(currentDescHeight, Math.ceil(tempHeight / descStyle['line-height']) * descStyle['line-height']);
                    }
                    style['#descDiv' + adIndex] = {};
                    if (currentDescHeight <= maxDescHeight) {
                        style['#descDiv' + adIndex]['line-height'] = maxDescHeight / (currentDescHeight / descStyle['line-height']);

                        currentDescHeight = maxDescHeight;
                    }
                    style['#descDiv' + adIndex]['height'] = currentDescHeight;
                    if (itemStyle.height >= 80) {
                        subItemHeight = currentDescHeight;
                        style['#subItem' + adIndex] = {
                            height: subItemHeight
                        };
                    } else {
                        subItemHeight = currentDescHeight + fullConfig.titleHeight;
                        style['#subItem' + adIndex] = {
                            height: subItemHeight
                        };
                    }

                    desc.childNodes.push(a);
                    subItem.childNodes.push(desc);
                    currentDescHeight = 0;

                    // 右侧引导icon
                    var iconA = engine.getLayout(fullConfig);
                    iconA.tagName = 'a';
                    iconA.target = 'blank';
                    iconA.class = 'icon';
                    iconA.id = 'icon_' + adIndex;
                    iconA.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                    iconA.href = clickLink;
                    if (fullConfig.templateWidth >= 200) {
                        subItem.childNodes.push(iconA);
                        item.childNodes.push(subItem);
                    } else {
                        item.childNodes.push(subItem);
                        item.childNodes.push(iconA);
                    }
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
        // 添加样式部分
        style['.container'] = containerStyle;
        // 如果只有一条广告，则让广告默认垂直居中
        if (adLength === 1 && fullConfig.templateHeight > 90) {
            if (itemStyle.templateHeight >= 200) {
                itemStyle['height'] =  fullConfig.titleHeight + subItemHeight;
            } else {
                itemStyle['height'] =  fullConfig.titleHeight + subItemHeight + iconHeight;
            }
            itemStyle['height'] =  fullConfig.titleHeight + subItemHeight + iconHeight;
            itemStyle['padding-top'] = (containerStyle['height'] - itemStyle['height']) / 2;
        }
        itemStyle.position = 'relative';
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
        style['.desc']['float'] = 'left';
        style['.desc a'] = {
            'text-decoration': 'none',
            'color': descStyle['color']
        };
        style['.desc a:hover'] = descHoverStyle;
        style['.column-space'] = columnSpaceStyle;
        style['.row-space'] = rowSpaceStyle;
        style['.res'] = {
            'width': resWidth - 11,
            'height': resHeight - 6,
            'float': 'left',
            'padding': '2px',
            'border': '1px solid #e6e6e6',
            'margin-right': '5px'
        };
        style['.res a, .res img'] = {
            width: resWidth - 11,
            height: resHeight - 6,
            display: 'block'
        };
        style['.icon'] = {
            width: iconWidth - 2,
            height: iconHeight,
            background: 'transparent url("{{dupDomain}}/cpro/ui/noexpire/img/2.0.1/arrowui.png") no-repeat scroll 0 0',
            display: 'block'
        };
        style['.icon:hover'] = {
            'background-position': '0 -22px'
        };

        // icon垂直居中
        if (fullConfig.templateWidth >= 200) {
            style['.icon']['position'] = 'absolute';
            style['.icon']['right'] = 0;
            style['.icon']['margin-left'] = '2px';
            if (itemStyle.height >= 80) {
                style['.icon']['top'] = (subItemHeight + fullConfig.titleHeight - iconHeight) / 2 + 'px';
            } else {
                style['.icon']['top'] = (subItemHeight - iconHeight) / 2 + 'px';
            }
            if (adLength === 1 && fullConfig.templateHeight > 90) {
                style['.icon']['top'] = (fullConfig.templateHeight - iconHeight) / 2 + 'px';
            }
        } else {
            style['.icon']['height'] = '22px';
            style['.icon']['margin-left'] = (itemStyle.width - iconWidth) / 2 + 'px';
            style['.icon']['margin-top'] = '4px';
        }
        style['.subItem'] = {
            width: subItemWidth,
            height: subItemHeight
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});