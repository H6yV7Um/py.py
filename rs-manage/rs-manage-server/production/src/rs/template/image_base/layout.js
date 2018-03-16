/**
 * @file image_base
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        promotion: 'rs.business.promotion',
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
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconType: 1
    },

    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

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
                img.src = ad.stuffSrc;
                a.title = ad.showUrl || '';
                a.href = ad.clickUrl;
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

        try {
            if (fullConfig.isShowCloseFeedBack) {
                var mobileStr = ['iPad', 'iPhone', 'Android', 'MIDP', 'Opera Mobi',
                'Opera Mini', 'BlackBerry', 'HP iPAQ', 'IEMobile',
                'MSIEMobile', 'Windows Phone', 'HTC', 'LG',
                'MOT', 'Nokia', 'Symbian', 'Fennec',
                'Maemo', 'Tear', 'Midori', 'armv',
                'Windows CE', 'WindowsCE', 'Smartphone', '240x320',
                '176x220', '320x320', '160x160', 'webOS',
                'Palm', 'Sagem', 'Samsung', 'SGH',
                'SIE', 'SonyEricsson', 'MMP', 'UCWEB'];
                var isM = false;
                for (var i = 0; i < mobileStr.length; i++) {
                    if (context.requestInfo.userAgent && context.requestInfo.userAgent.toLowerCase().indexOf(
                    mobileStr[i].toLowerCase()) > -1) {
                        isM = true;
                    }
                }
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
                var flowType = isM ? '1' : '2';
                dspDiv.innerHTML = context.requestInfo.account;// dspId:发送日志参数
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');// s:发送日志参数-反馈日志md5加密字符串
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': flowType}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': flowType}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': flowType}, style));// 添加反馈内容
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