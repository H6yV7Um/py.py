/* global oojs */
/**
* @file text_sdk_banner_lunbo
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_sdk_banner_lunbo',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        bannerImgUrl: 'rs.common.model.bannerImgUrl',
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
    //  秋实Sdk所需信息
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                extention.curl = extention.curl || ad.clickUrl;
                extention.exp = '70543';
                extention.templateName = 'text_sdk_banner_lunbo';
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    // 飘红
    flush: function (str) {
        var regex = /{([^}]*)}/g;
        return str.replace(regex, function (match, subMatch, index, s) {
            return '<font color="#FF0000">' + subMatch + '</font>';
        });
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        // 移动只出一条广告
        var ad = ads[0];
        var act = ad.actionType || 1;
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;
        // item 移动只出一条广告
        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        var frame1 = engine.getLayout(fullConfig);
        frame1.class = 'frame';
        frame1.id = 'frame1';
        // title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';

        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        frame1.childNodes.push(title);

        // url
        var url = engine.getLayout(fullConfig);
        url.tagName = 'div';
        url.id = 'url0';
        url.class = 'url';

        // url
        var urlText = engine.getLayout(fullConfig);
        urlText.tagName = 'span';
        url.childNodes.push(urlText);
        frame1.childNodes.push(url);

        a.childNodes.push(frame1);

        var frame2 = engine.getLayout(fullConfig);
        frame2.class = 'frame';
        frame2.id = 'frame2';
        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        desc.childNodes.push(descText);
        frame2.childNodes.push(desc);
        a.childNodes.push(frame2);

        // icon
        var icon = engine.getLayout(fullConfig);
        icon.class = 'icon';
        a.childNodes.push(icon);

        // 填充广告数据
        // titleText.innerHTML = ad.title;
        // descText.innerHTML = ad.desc[0];
        urlText.innerHTML = ad.showUrl;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);

        // 关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
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
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var pt = containerHeight / 48;
        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        };
        style['.container'] = containerStyle;
        style['.item, .item a'] = {
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none'
        };
        var iconWidth = containerHeight;
        var textWidth = containerWidth  - iconWidth - Math.round(14 * pt);
        style['.frame'] = {
            position: 'absolute',
            height: '100%',
            width: textWidth,
            left: Math.round(14 * pt) + 'px'
        };
        style['#frame1'] = {
            top: 0
        };
        style['#frame2'] = {
            top: containerHeight + 'px'
        };
        style['.item a'] = {
            display: 'block'
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        // 文本折行
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        // title
        var titleHeight = Math.round(24 * pt);

        style['.item .title'] = {
            'width': textWidth + 'px',
            'height': titleHeight + 'px',
            'line-height': titleHeight + 'px'
        };
        var titleFontSize = userConfig.titleFontSize || Math.round(16 * pt);
        var titleFontFamily = userConfig.titleFontFamily || 'Microsoft YaHei,arial,sans-serif;';
        var titleFontColor = userConfig.titleFontColor || 'fff';
        var titleFontWeight = userConfig.titleFontWeight || 'bold';

        style['.item .title span'] = {
            font: 'normal ' + titleFontWeight + ' ' + titleFontSize + 'px/' + titleHeight + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        // url
        var urlHeight = Math.round(20 * pt);

        style['.item .url'] = {
            'width': textWidth  + 'px',
            'height': urlHeight  + 'px',
            'line-height': urlHeight  + 'px'
        };

        if (ad.title.replace(/[^\x00-\xff]/g, 'ci').length * titleFontSize / 2 > textWidth) {
            style['.item .title']['height'] = '100%';
            style['.item .url']['display'] = 'none';
        }

        var urlFontSize = userConfig.urlFontSize || Math.round(16 * pt);
        var urlFontFamily = userConfig.urlFontFamily || 'SimHei,arial,sans-serif;';
        var urlFontColor = userConfig.urlFontColor || '198edc';
        style['.item .url span'] = {
            font: 'normal ' + urlFontSize + 'px/' + urlHeight + 'px ' + urlFontFamily,
            color: '#' + urlFontColor
        };

        // desc
        var desclineHeight = Math.floor(containerHeight / 2);
        style['.item .desc'] = {
            'width': textWidth,
            'height': containerHeight + 'px',
            'line-height': desclineHeight + 'px'
        };

        var descFontSize = userConfig.descFontSize || Math.round(16 * pt);

        var descFontFamily = userConfig.descFontFamily || 'Microsoft YaHei,arial,sans-serif;';

        var descFontColor = userConfig.descFontColor || 'fff';
        style['.item .desc div'] = {
            font: 'normal ' + descFontSize + 'px/' + desclineHeight + 'px ' + descFontFamily,
            color: '#' + descFontColor
        };
        // icon
        var btnbackground = fullConfig.cbtnbackground || '2e83f7';
        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            // 'background': '#' + btnbackground,
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            'opacity': 0.9
        };
        if (act !== 2) {
            var iconSrc = this.bannerImgUrl.get(act);
            style['.icon'] = {
                'background': '#' + btnbackground
            };
            style['.icon::after'] = {
                'content': '\'\'',
                'background': '#fff',
                '-moz-mask-size': '100% 100%',
                '-webkit-mask-size': '100% 100%',
                '-o-mask-size': '100% 100%',
                '-ms-mask-size': '100% 100%',
                'mask-size': '100% 100%',
                '-moz-mask-image': 'url(' + iconSrc + ')',
                '-webkit-mask-image': 'url(' + iconSrc + ')',
                '-o-mask-image': 'url(' + iconSrc + ')',
                '-ms-mask-image': 'url(' + iconSrc + ')',
                'mask-image': 'url(' + iconSrc + ')'
            };
        }

        // 关闭按钮样式
        var closeBtnRadius = 18;
        var closeBtnDivRadius = 25;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center',
            'color': '#fff'
        };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };

        // 飘红
        titleText.innerHTML = this.flush(ad.title);
        descText.innerHTML = this.flush(ad.desc[0]);


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
                /* eslint-disable max-len */
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
        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});
