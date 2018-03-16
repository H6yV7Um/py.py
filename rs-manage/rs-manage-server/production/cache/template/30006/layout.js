/**
 * @file 30006
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: 'flash_base_dspauto',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
        flash: 'TemplateServer.Common.Utility.Flash'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,

    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconType: 1
    },

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = JSON.parse(requestInfo.ads);

        var engine = this.basic;
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var columnCount = fullConfig.adColumnCount;
        var rowCount = fullConfig.adRowCount;

        var itemColumnSpace = fullConfig.itemColumnSpace;
        var itemRowSpace = fullConfig.itemRowSpace;

        var itemWidth = (containerWidth - (columnCount - 1) * itemColumnSpace) / fullConfig.adColumnCount;
        var itemHeight = (containerHeight - (rowCount - 1) * itemRowSpace) / fullConfig.adRowCount;

        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        style['.item a'] = {
            'width': itemWidth,
            'height': itemHeight,
            'position': 'absolute',
            'opacity': 0,
            'top': 0,
            'left': 0,
            'display': 'block',
            'z-index': '9',
            'background-color': '#ffffff'
        };

        if (requestInfo.device.userAgent && requestInfo.device.userAgent.indexOf('MSIE') > -1) {
            style['.item a'].filter = 'alpha(opacity=0);';

        }

        style['.item a:hover'] = {};
        style['.item div'] = {
            'text-align': 'center'
        };

        style['.column-space'] = {
            width: itemColumnSpace,
            height: '0px'
        };
        style['.row-space'] = {
            width: '100%',
            height: '0px'
        };

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;
        var columnSpace = engine.getLayout(fullConfig);
        columnSpace.class = 'column-space';
        var rowSpace = engine.getLayout(fullConfig);
        columnSpace.class = 'row-space';
        var rowCount = fullConfig.adColumnCount;
        var columnCount = fullConfig.adRowCount;
        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                // item
                var adIndex = i * j + j;
                var ad = ads.mainCreatives[adIndex];
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = 'blank';
                var flashDiv = engine.getLayout(fullConfig);
                flashDiv.tagName = 'div';
                flashDiv.id = 'flashDiv_' + adIndex;

                var flashOption = {};
                var imgWidth = ad.flash.material.width;
                var imgHeight = ad.flash.material.height;
                var imgRatio = imgWidth / imgHeight;
                var itemRatio = itemWidth / itemHeight;

                if ((imgWidth === itemWidth || imgWidth < itemWidth) && (imgHeight === itemHeight
                 || imgHeight < itemHeight)) {
                    if (imgRatio < itemRatio) {
                        imgHeight = itemHeight;
                        imgWidth = imgRatio * imgHeight;
                    }
                    else {
                        imgWidth =  itemWidth;
                        imgHeight = imgWidth / imgRatio;
                    }
                }
                else {
                    if (imgRatio < itemRatio) {
                        imgHeight = itemHeight;
                        imgWidth = imgRatio * imgHeight;
                    }
                    else {
                        imgWidth =  itemWidth;
                        imgHeight = imgWidth / imgRatio;
                    }
                }
                flashOption.width = imgWidth;
                flashOption.height = imgHeight;
                flashOption.url = ad.flash.material.file.fileSrc || '';
                flashOption.browser = requestInfo.device.browser;
                flashDiv.innerHTML = this.flash.getFlashHtml(flashOption);


                // 填充广告数据
                a.title = ad.flash.action.forward.targetPage || '';
                a.href = ad.flash.action.forward.clickLink.clickLink;
                a.id = 'res' + i;
                item.childNodes.push(a);
                item.childNodes.push(flashDiv);
                items.push(item);

                if (j < columnCount - 1) {
                    items.push(columnSpace);
                }
                else if (i < rowCount - 1) {
                    items.push(rowSpace);
                }

                style['#flashDiv_' + adIndex] = {
                    'margin-top': (itemHeight > imgHeight ? (itemHeight - imgHeight) / 2 : 0) + 'px'
                };
            }
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});