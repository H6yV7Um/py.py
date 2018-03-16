/**
 * @file 图文基础移动模板
 * @author qianixaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'tuwen_mobile_layout_arrow',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        logoType: 'bd-logo4',
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

        var ads = requestInfo.adElements;

        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        container['adsLen'] =  ads.length;

        var arrowSrcUrl = [
            'https://ubmcmm.baidustatic.com/media/v1/0f00050jJdvgJQJW7K6aff.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f0000-Gph3q51mK_VTKR6.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f00050jJdvgJQJW7K6aff.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f000QvoV4T5mzchAA37i6.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f0005fO9zSv_nc1POdRf0.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f000QNpZZd7YebB4Qu456.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f000jlhjyFu7fkCPvRHw6.jpg',
            'https://ubmcmm.baidustatic.com/media/v1/0f000Zt6ORy8XiPFKBdll6.jpg'
        ];
        var mobileSkin = [{}, {rss0: '#ebebeb', rss1: '#ffffff', rss2: '#780000', rss3: '#999999'},
        {rss0: '#e70012', rss1: '#f5f5f5', rss2: '#1e1e1e', rss3: '#7d7d7d'},
        {rss0: '#ebebeb', rss1: '#ffffff', rss2: '#003399', rss3: '#999999'},
        {rss0: '#e70012', rss1: '#333333', rss2: '#ffffff', rss3: '#b4b4b4'},
        {rss0: '#ebebeb', rss1: '#ffe320', rss2: '#007c9b', rss3: '#7fb59b'},
        {rss0: '#ffdc0a', rss1: '#72a429', rss2: '#ffffff', rss3: '#b8d294'},
        {rss0: '#ffdc0a', rss1: '#0956ae', rss2: '#ffffff', rss3: '#84abd6'},
        {rss0: '#b80506', rss1: '#f5f5f5', rss2: '#1e1e1e', rss3: '#7d7d7d'}];
        var ext = {};
        if (requestInfo.styleConfig && requestInfo.styleConfig.ext) {
            ext = (requestInfo.styleConfig.ext).replace(/(^\s*)|(\s*$)/g, '')
            ? JSON.parse(requestInfo.styleConfig.ext) : {};
        }
        var curMobileSkin = (ext.txt && ext.txt.txtSkin) ? mobileSkin[ext.txt.txtSkin] : {};
        var arrowSrc = (ext.txt && ext.txt.txtSkin) ? arrowSrcUrl[ext.txt.txtSkin] : 'https://ubmcmm.baidustatic.com/media/v1/0f00050jJdvgJQJW7K6aff.jpg';


        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 根据广告位比例计算尺寸
        // 20.3 - 6.66
        // 20.5 - 4
        // 6.5  - 1.2
        var scale = parseFloat(containerStyle['outer-width']) / parseFloat(containerStyle['outer-height']);

        // items
        var items = container.childNodes;
        for (var i = 0; i < ads.length; i++) {
            // item 移动只出一条广告
            var ad = ads[i];
            var act = parseInt(ad.action[0].actionType, 10) || 4;
            var item = engine.getLayout(fullConfig);
            item.class = 'item';
            item.id = 'item' + i;

            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            if (act === 4) {
                a.target = '_blank';
            }
            a.id = 'itemA' + i;
            a['data-adtype'] = act;

            // 广告logo
            var logo = engine.getLayout(fullConfig);
            logo.tagName = 'div';
            logo.id = 'logo' + i;
            logo.class = 'logo';
            // logo图片
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'img';
            logo.childNodes.push(logoImg);

            // 广告title
            var title = engine.getLayout(fullConfig);
            title.tagName = 'div';
            title.id = 'title' + i;
            title.class = 'title';
            // title内容
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            title.childNodes.push(titleText);
            // 广告desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'div';
            desc.id = 'desc' + i;
            desc.class = 'desc';
            // desc内容
            var descText = engine.getLayout(fullConfig);
            descText.tagName = 'span';
            desc.childNodes.push(descText);

            // 广告desc
            var arrow = engine.getLayout(fullConfig);
            arrow.tagName = 'div';
            arrow.id = 'arrow' + i;
            arrow.class = 'arrow';

            var arrowImg = engine.getLayout(fullConfig);
            arrowImg.tagName = 'img';
            arrowImg.id = 'arrowImg' + i;
            arrowImg.src = arrowSrc;
            arrowImg.class = 'arrowImg';
            arrow.childNodes.push(arrowImg);
            if (scale > 3.2) {
                item.childNodes.push(logo);
                item.childNodes.push(title);
                item.childNodes.push(desc);
                item.childNodes.push(arrow);
            }
            else {
                item.childNodes.push(title);
                item.childNodes.push(logo);
                item.childNodes.push(desc);
                item.childNodes.push(arrow);
            }


            // 填充广告数据
            logoImg.src = ad.iconFileSrc[0] || '';
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '') {
                a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink || '';
            }
            titleText.innerHTML = ad.textTitle[0];
            descText.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];

            item.childNodes.push(a);
            items.push(item);
        }

        var data;
        if (scale > 6.5) {
            data = this.calculate20T3(containerWidth, containerHeight);
        } else if (scale > 3.2) {
            data = this.calculate20T5(containerWidth, containerHeight);
        } else {
            data = this.calculate6T5(containerWidth, containerHeight);
        }

        // item居中
        var paddingTop = Math.floor((containerHeight - data.itemHeight) / 2);
        paddingTop = paddingTop > 0 ? paddingTop : 0;
        var paddingLeft = Math.floor((containerWidth - data.itemWidth) / 2);
        paddingLeft = paddingLeft > 0 ? paddingLeft : 0;
        style['.container'] = containerStyle;
        style['.item'] = {
                width: data.itemWidth,
                height: data.itemHeight,
                padding: paddingTop + 'px ' + paddingLeft + 'px'
            };
        for (var i = 0; i < ads.length; i++) {
            style['#item' + i] = {
                width: data.itemWidth,
                height: data.itemHeight,
                padding: paddingTop + 'px ' + paddingLeft + 'px',
                position: 'absolute',
                top: containerHeight * i + 'px',
                left: '0'
            };
        }

        // 移动广告全区域可点击
        style['.item a'] = {
            width: containerWidth,
            height: containerHeight,
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };


        style['.item .logo img'] = {
            width: data.logoWidth,
            height: data.logoHeight
        };
        // 文本折行
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        var titleStyle = engine.getTitleStyle(fullConfig);
        var titleColor = titleStyle['color'] !== '#0000ff' ? titleStyle['color'] : data.titleFontColor;
        var titleFS = titleStyle['font-size'] !== 14 ? titleStyle['font-size'] : data.titleFontSize;
        var titleFF = titleStyle['font-family'] !== 'arial,simsun,sans-serif'
        ? titleStyle['font-family'] : 'arial,sans-serif';
        var descStyle = engine.getDescStyle(fullConfig);
        var descColor = descStyle['color'] !== '#444444' ? descStyle['color'] : data.descFontColor;
        var descFS = descStyle['font-size'] !== 14 ? descStyle['font-size'] : data.descFontSize;
        var descFF = descStyle['font-family'] !== 'arial,simsun,sans-serif'
        ? descStyle['font-family'] : 'arial,sans-serif';
        if (curMobileSkin) {
            style['#container'] = {
                'width': containerStyle.width - 1 + 'px',
                'border-color': curMobileSkin.rss0,
                'background-color': curMobileSkin.rss1
            };
            titleColor = curMobileSkin.rss2;
            descColor = curMobileSkin.rss3;
        }
        else {
            style['#container'] = {
                width: containerStyle.width - 1 + 'px'
            };
        }
        style['.item .title'] = {
            'width': data.titleWidth,
            'height': data.titleHeight,
            'padding-top': data.logoPadding + 'px',
            'overflow': 'hidden',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'color': titleColor
        };
        style['.item .title span'] = {
            font: 'normal bold ' + titleFS + 'px/' + data.titleLineHeight + 'px ' + titleFF + ';'
        };

        if (data.descRowCount > 1) {
            style['.item .desc'] = {
                'width': data.descWidth,
                'height': data.descHeight,
                'padding-top': data.descPaddingTop,
                'line-height': data.descLineHeight + 'px',
                'color': descColor
            };
        }
        else {
            style['.item .desc'] = {
                'width': data.descWidth,
                'height': data.descHeight,
                'padding-top': data.descPaddingTop,
                'line-height': data.descLineHeight + 'px',
                'overflow': 'hidden',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'color': descColor
            };
        }
        style['.item .desc span'] = {
            font: 'normal ' + descFS + 'px/' + (data.descLineHeight - 2) + 'px ' + titleFF + ';'
        };
        if (scale > 3.2) {
            style['.item .logo'] = {
                width: data.logoWidth,
                height: data.logoHeight,
                padding: data.logoPadding + 'px' + ' ' + (data.logoPaddingR ? data.logoPaddingR
                : data.logoPadding) + 'px' + ' '
                + data.logoPadding + 'px' + ' ' + data.logoPadding + 'px'
            };
            var arrowHeight = data.arrowWidth / 2 > 42 ? data.arrowWidth / 2 : 42;
            if (arrowHeight <= 42) {
                style['.arrowImg'] = {
                    'height': arrowHeight - 10  + 'px',
                    'margin-top': '5px'
                };
            }
            style['.arrow'] = {
                'width': data.arrowWidth + 'px',
                'height': arrowHeight  + 'px',
                'margin-top': -data.titleHeight - data.logoPadding + (data.itemHeight - arrowHeight) / 2 + 1 + 'px',
                'line-height': (arrowHeight + (data.itemHeight - arrowHeight) / 4) + 'px',
                'overflow': 'hidden',
                'border-radius': Math.floor(data.arrowWidth / 10) + 'px',
                'background-color': curMobileSkin.rss2 || '#003399',
                'text-align': 'center',
                'margin-left': '10px'
            };
        }
        else {
            style['.item .logo'] = {
                'width': data.logoWidth,
                'height': data.logoHeight,
                'margin-right': data.logoPadding + 'px',
                'clear': 'both'
            };
            style['.arrowImg'] = {
                'margin-top': (data.arrowWidth / 3 * 2 - 42) / 2 + 'px'
            };
            style['.arrow'] = {
                'width': data.arrowWidth + 'px',
                'height': data.arrowWidth / 3 * 2  + 'px',
                'overflow': 'hidden',
                'border-radius': Math.floor(data.arrowWidth / 10) + 'px',
                'background-color': curMobileSkin.rss2 || '#003399',
                'text-align': 'center',
                'margin-left': '10px'
            };
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },

    /**
    * 根据广告位尺寸计算组件尺寸，调整布局
    * @param {number} containerWidth  广告位宽，单位px
    * @param {number} containerHeight 广告位高，单位px
    * @return {Object} result data组件尺寸
    */
    calculate20T3: function (containerWidth, containerHeight) {
        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;

        // 广告位比例20.3时组件尺寸
        var result = {
            itemWidth: containerWidth - 23,
            itemHeight: containerHeight,
            logoWidth: Math.round(110 * px) > containerWidth ? containerWidth : Math.round(110 * px),
            logoHeight: Math.round(110 * px) > containerWidth ? containerWidth : Math.round(110 * px),
            logoPadding: 0,
            titleFontSize: Math.round(52 * px),
            titleLineHeight: Math.round(70 * px) - 2,
            titleRowCount: 1,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#0000ff',
            descFontSize: Math.round(40 * px),
            descLineHeight: Math.round(46 * px),
            descRowCount: 1,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#444444',
            descPaddingTop: 0,
            arrowWidth: 0
        };

        // 动态计算部分属性
        result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
        result.titleWidth = (result.itemWidth - result.logoWidth - (result.logoPadding * 2)) * 2 / 3;
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.titleWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;
        result.arrowWidth = result.titleWidth / 2 - 20;
        return result;
    },
    calculate20T5: function (containerWidth, containerHeight) {

        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;

        // 广告位比例20.5时组件尺寸
        var result = {
            itemWidth: containerWidth - 23,
            itemHeight: containerHeight,
            logoHeight: Math.round(188 * px) > containerHeight ? containerHeight : Math.round(188 * px),
            logoPadding: 0,
            logoPaddingR: 0,
            titleFontSize: Math.round(50 * px),
            titleLineHeight: Math.round(72 * px),
            titleRowCount: 1,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#0000ff',
            descFontSize: Math.round(38 * px),
            descLineHeight: Math.round(38 * px) + 3,
            descRowCount: 2,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#444444',
            descPaddingTop: 0,
            arrowWidth: 0
        };

        // 动态计算部分属性
        result.logoWidth = result.logoHeight;
        result.logoPadding = Math.floor((result.itemHeight - result.logoHeight) / 2);
        result.logoPaddingR = result.logoPadding + 3;
        result.titleWidth = (result.itemWidth - result.logoWidth - (result.logoPadding * 2) - 3) * 2 / 3;
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.titleWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;
        result.arrowWidth = result.titleWidth / 2 - 20;
        return result;
    },
    calculate6T5: function (containerWidth, containerHeight) {
        // 广告相对像素
        // 以广告宽840px作为参照
        var px = containerWidth / 840;

        // 广告位比例20.5时组件尺寸
        var result = {
            itemWidth: containerWidth - 23,
            itemHeight: containerHeight,
            logoHeight: containerHeight - Math.round(72 * px) - 10,
            logoPadding: 0,
            logoPaddingR: 0,
            titleFontSize: Math.round(50 * px),
            titleLineHeight: Math.round(72 * px),
            titleRowCount: 1,
            titleWidth: 0,
            titleHeight: 0,
            titleFontColor: '#0000ff',
            descFontSize: Math.round(42 * px),
            descLineHeight: Math.round(42 * px) + 3,
            descRowCount: 3,
            descWidth: 0,
            descHeight: 0,
            descFontColor: '#444444',
            descPaddingTop: 0,
            arrowWidth: 0
        };

        // 动态计算部分属性
        result.logoWidth = result.logoHeight;
        result.logoPadding = Math.floor((result.itemHeight - result.logoHeight - result.titleLineHeight) / 2);
        result.logoPaddingR = result.logoPadding + 3;
        result.titleWidth = (result.itemWidth) * 3 / 4;
        result.titleHeight = result.titleLineHeight * result.titleRowCount;
        result.descWidth = result.titleWidth - result.logoWidth;
        result.descHeight = result.descLineHeight * result.descRowCount;
        result.arrowWidth = result.titleWidth / 3 - 20;
        return result;
    }
});