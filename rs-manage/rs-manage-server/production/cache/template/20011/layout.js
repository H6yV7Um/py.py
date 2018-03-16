/**
 * @file image_wap_banner_base
 */
/* globals oojs */
/* globals encodeURIComponent */
/* eslint-disable max-len */
oojs.define({
    name: '20011',
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
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 17,
        containerPaddingBottom: 0,
        containerPaddingLeft: 17,
        containerBackgroundColor: 'f5f5f5',
        resBorderWidth: 0.3,
        resBorderColor: 'e0e0e0'
    },
    initAds: function (userAgent, ad) {
        var ua = userAgent;
        var oldUrl = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        try {
            if (/(iPhone|iPod|iPad)/.test(ua) && / baiduboxapp\//i.test(ua)) {
                var cmd = 'baiduboxapp://easybrowse?';
                var option = {
                    openurl: encodeURIComponent(oldUrl),
                    minver: '5.3.0.0',
                    isla: '0',
                    opentype: '1',
                    append: '0',
                    rbtnstyle: '2',
                    toolbaricons: encodeURIComponent(JSON.stringify({
                        'toolids': []
                    })),
                    menumode: '2',
                    newbrowser: '1'
                };
                var d = [];
                for (var i in option) {
                    d.push(i + '=' + option[i]);
                }
                cmd += d.join('&');
                return oldUrl = cmd;
            } else {
                return oldUrl;
            }
        } catch (e) {
        }
    },
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var userAgent = requestInfo.device.userAgent;

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
                var ad = ads[adIndex];
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = '_blank';
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                a.childNodes.push(img);
                // 填充广告数据
                img.src = ad.imgFileSrc[0];
                a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
                a.href = this.initAds(userAgent, ad);
                a.id = 'res' + i;
                a['data-adtype'] = parseInt(ad.action[0].actionType, 10) || 4;
                var ext = JSON.parse(ad.wapAppInfo);
                var tu = (ext && ext.tu) ? ext.tu : 0;
                a['data-tu'] = tu;
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

        var resbw = fullConfig.resBorderWidth;
        var resbc = fullConfig.resBorderColor;

        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        style['.item a'] = {
            width: itemWidth,
            height: itemHeight,
            display: 'block'
        };
        style['.item a:hover'] = {};
        style['.item img'] = {
            width: itemWidth - 2 * resbw,
            height: itemHeight - 2 * resbw,
            'border': resbw + 'px solid #' + resbc
        };

        style['.column-space'] = {
            width: itemColumnSpace,
            height: '0px'
        };
        style['.row-space'] = {
            width: '100%',
            height: '0px'
        };
        var conpr = fullConfig.containerPaddingRight || 0;
        style['.bd-logo4'] = {
            right: conpr + 26 + 'px',
            display: 'none'
        };
        style['#mob-bd-adIcon'] = {
            right: conpr + 'px'
        };
        style['#fbIconDiv'] = {
            right: conpr + 'px'
        };
        style['#feedbackCon'] = {
            left: conpr + 'px'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});