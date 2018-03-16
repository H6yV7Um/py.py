/**
 * @file image_wap_banner_base
 */
/*手百feed定制模板*/
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_wap_banner_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
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
        adIconType: 1,
        resBorderWidth: 0.3,
        resBorderColor: 'e0e0e0',
        logoIsShow: 0
    },
    initAds: function (userAgent, ad) {
                var ua = userAgent;
                var oldUrl = ad.clickUrl;
                try {
                    if (/(iPhone|iPod|iPad)/.test(ua) && / baiduboxapp\//i.test(ua)) {
                        var cmd = 'baiduboxapp://easybrowse?';
                        var url = ad.clickUrl;
                        var option = {
                            openurl: encodeURIComponent(url),
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
                        return ad.clickUrl = cmd;
                    } else {
                        return oldUrl;
                    }
                } catch (e) {
                    ad.clickUrl = oldUrl;
                }
            },
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        var userAgent = context.requestInfo.userAgent;

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
                a.target = 'blank';
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                a.childNodes.push(img);

                // 填充广告数据
                img.src = ad.stuffSrc;
                a.title = ad.showUrl || '';
                a.href = this.initAds(userAgent, ad);
                a.id = 'res' + i;
                var ext = JSON.parse(ad.extention);
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
      // 添加logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4';
        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }

        var bdIcon = this.adIcon.getAdIcon({logoType: 'mob-bd-adIcon'});
        bdIcon.id = 'mob-bd-adIcon0';
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(bdIcon);
        };

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
        style['#bd-logo4'] = {
            right: conpr + 26 + 'px'
        };
        style['#mob-bd-adIcon0'] = {
            right: conpr + 'px'
        };
        try {
            if (fullConfig.isShowCloseFeedBack) {
                var logInfoDiv = engine.getLayout(fullConfig);
                logInfoDiv.class = 'logInfoDiv';
                logInfoDiv.id = 'logInfoDiv';
                style['.logInfoDiv'] = {
                    'display': 'none'
                };
                var dspDiv = engine.getLayout(fullConfig);
                dspDiv.class = 'dspDiv';
                dspDiv.id = 'dspDiv';
                style['.dspDiv'] = {
                    'display': 'none'
                };
                dspDiv.innerHTML = context.requestInfo.account;
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// PC时添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));
            }

        }
        catch (e) {

        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});