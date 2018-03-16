/**
 * @file 20006
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: 'image_base_dspauto',
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
        containerPaddingLeft: 0
    },

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = JSON.parse(requestInfo.ads);
        // 根据传递的deviceType的值来判断模板的显示类型，是pc还是移动，1是pc，2是移动
        var adIconType = (ads.mainCreatives[0].deviceType === 1) ? 1 : 0;
        fullConfig['adIconType'] = adIconType;

        var engine = this.basic;

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
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'img_' + adIndex;
                a.childNodes.push(img);

                // 填充广告数据
                img.src = ad.image.material.file.fileSrc || '';
                a.title = ad.image.action.forward.targetPage || '';
                a.href = ad.image.action.forward.clickLink.clickLink;
                a.id = 'res' + i;
                item.childNodes.push(a);
                items.push(item);

                if (j < columnCount - 1) {
                    items.push(columnSpace);
                }
                else if (i < rowCount - 1) {
                    items.push(rowSpace);
                }
            }
        }

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
            'width': itemWidth,
            'height': itemHeight,
            'text-align': 'center'
        };
        style['.item a'] = {
            width: itemWidth,
            height: itemHeight,
            display: 'block'
        };
        style['.item a:hover'] = {};
        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                // item
                var adIndex = i * j + j;
                var ad = ads.mainCreatives[adIndex];

                var imgWidth = ad.image.material.width;
                var imgHeight = ad.image.material.height;
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
                var marginTop = 0;
                if (itemHeight > imgHeight) {
                    marginTop = (itemHeight - imgHeight) / 2;
                }
                style['.img_' + adIndex] = {
                    'width': imgWidth,
                    'height': imgHeight,
                    'margin-top': marginTop + 'px'
                };
            }
        }

        style['.column-space'] = {
            width: itemColumnSpace,
            height: '0px'
        };
        style['.row-space'] = {
            width: '100%',
            height: '0px'
        };

        // add promotion
        /*if (fullConfig.promotionIsShow) {
            container.childNodes.push(this.promotion.getPromotion(fullConfig));
        }*/

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});