/* global oojs */
/**
* @file text_sdk_banner_rank
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_sdk_banner_rank',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000'
    },
    // 秋实Sdk所需信息
    adsExtention: function (context) {
        var adsToPageObject = {};
        var adsExtention = [];
        var actionTypeInfo = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                adsExtention.push(context.requestInfo.adElements[i].extention || '');
                actionTypeInfo.push(context.requestInfo.adElements[i].actionTypeInfo || {});
            }
        }
        adsToPageObject.adsExtention = adsExtention;
        adsToPageObject.actionTypeInfo = actionTypeInfo;
        return adsToPageObject;
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告

        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var rejectHeight = (containerStyle['padding-top'] + containerStyle['padding-bottom'] + containerStyle['border-top-width'] + containerStyle['border-bottom-width']);
        var contentHeight = containerHeight - rejectHeight;

        var itemNum = Math.round(contentHeight / 24);
        // items
        var items = container.childNodes;
        // item 移动只出一条广告

        for (var i = 0; i < itemNum; i++) {
            if (ads[i]) {
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var act = ads[i].actionType || 1;
                // 广告点击区域——item可点
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = '_blank';
                a.id = 'item' + i;
                // 广告索引，必须加
                a['data-adindex'] = i;
                // 广告推广类型
                a['data-adtype'] = act;

                // title
                var title = engine.getLayout(fullConfig);
                title.tagName = 'div';
                title.id = 'title' + i;
                title.class = 'title';

                // adIndex
                var adIndex = engine.getLayout(fullConfig);
                adIndex.tagName = 'div';
                adIndex.id = 'adIndex' + i;
                adIndex.class = 'ad-index';
                a.childNodes.push(adIndex);

                // title内容
                var titleText = engine.getLayout(fullConfig);
                titleText.tagName = 'span';
                title.childNodes.push(titleText);
                a.childNodes.push(title);

                // 填充广告数据
                adIndex.innerHTML = i + 1;
                titleText.innerHTML = ads[i].title;
                a.title = ads[i].showUrl || '';
                a.href = ads[i].clickUrl;
                item.childNodes.push(a);
                items.push(item);
            }

        }

        // 广告关闭按钮
        if (fullConfig['closeBtnIsShow']) {
            var closeBtn = engine.getLayout(fullConfig);
            closeBtn.tagName = 'div';
            closeBtn.id = 'closeBtn';
            closeBtn.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
            items.push(closeBtn);
        }

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        var adsToPageObject = this.adsExtention(context);
        qiushiInfo.innerHTML = 'var adsExtention = ' + JSON.stringify(adsToPageObject.adsExtention) + ';' + 'var actionTypeInfo=' + JSON.stringify(adsToPageObject.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        // 添加样式部分
        var style = {};

        var pt = containerHeight / 48;

        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        };
        style['.container'] = containerStyle;

        var itemHeight = contentHeight / itemNum;
        style['.item, .item a'] = {
            'width': '100%',
            'height': itemHeight + 'px',
            'text-decoration': 'none'
        };
        style['.item a'] = {
            'display': 'block',
            'padding-left': Math.round(14 * pt)
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        // 文本折行
        var textWidth = containerWidth  -  Math.round(14 * pt);
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        // title
        var titleHeight = itemHeight;
        style['.item .title'] = {
            'width': textWidth,
            'height': titleHeight,
            'line-height': titleHeight
        };
        var titleFontSize = userConfig.titleFontSize || Math.round(16 * itemHeight / 24);
        var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
        var titleFontColor = userConfig.titleFontColor || 'fff';
        var titleFontWeight = userConfig.titleFontWeight || '700';

        style['.item .title span'] = {
            font: 'normal ' + titleFontWeight + ' ' + titleFontSize + 'px/' + titleHeight + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        // adIndex
        style['.ad-index'] = {
            'height': titleHeight,
            'padding-right': '5px',
            'font': 'normal ' + titleFontWeight + ' ' + titleFontSize + 'px/' + titleHeight + 'px ' + titleFontFamily,
            'float': 'left',
            'color': '#' + titleFontColor
        };


        if (fullConfig['closeBtnIsShow']) {
            var closeBtnRadius = Math.ceil(6 * pt);
            style['#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnRadius * 2,
                'height': closeBtnRadius * 2,
                'border-radius': closeBtnRadius + 'px',
                'font': 'normal ' + (closeBtnRadius * 2) + 'px/' + (closeBtnRadius * 2) + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#888',
                'color': '#fff'
            };
            var closeBtnPosition = fullConfig['closeBtnPosition'] || 'top_right';
            var clobpArray = closeBtnPosition.split('_');
            if (clobpArray[0] === 'top') {
                style['#closeBtn'].top = Math.ceil(3 * pt) + 'px';
            } else {
                style['#closeBtn'].bottom = Math.ceil(3 * pt) + 'px';
            }
            if (clobpArray[1] === 'left') {
                style['#closeBtn'].left = Math.ceil(3 * pt) + 'px';
            } else {
                style['#closeBtn'].right = Math.ceil(3 * pt) + 'px';
            }
        }

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
                dspDiv.innerHTML = context.requestInfo.account;// dspId:发送日志参数
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');// s:发送日志参数-反馈日志md5加密字符串
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加反馈内容
            }
        }
        catch (e) {

        }
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': Math.round(12 * pt),
        //     'height': Math.round(12 * pt),
        //     'background-size': 'contain'
        // };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
