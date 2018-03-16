/**
 * @file flash_base
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.flash_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        promotion: 'rs.business.promotion',
        flash: 'rs.common.utility.flash',
        adIcon: 'rs.business.adIcon'
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

    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

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

        if (context.browser && context.browser.type === 'ie') {
            style['.item a'].filter = 'alpha(opacity=0);';

        }

        style['.item a:hover'] = {};
        style['.item div'] = {
            width: itemWidth,
            height: itemHeight
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
                var ad = ads[adIndex];
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = 'blank';
                var flashDiv = engine.getLayout(fullConfig);
                flashDiv.tagName = 'div';

                var flashOption = {};
                flashOption.width = itemWidth;
                flashOption.height = itemHeight;
                flashOption.url = ad.stuffSrc;
                flashOption.browser = context.browser;
                flashDiv.innerHTML = this.flash.getFlashHtml(flashOption);

                // 填充广告数据
                a.title = ad.showUrl || '';
                a.href = ad.clickUrl;
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
            }
        }


        // add logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add promotion
        if (fullConfig.promotionIsShow) {
            container.childNodes.push(this.promotion.getPromotion(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});