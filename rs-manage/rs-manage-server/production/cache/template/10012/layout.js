/**
 * @file 文字模板
 */
/* global oojs */
oojs.define({
    name: '10012',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

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
        var ad = ads.mainCreatives[0];
        var style = {};

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

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        // logo
        var adRightA = engine.getLayout(fullConfig);
        adRightA.tagName = 'a';
        adRightA.id = 'ad_right_a_0';
        adRightA.class = 'ad_right_a';
        adRightA.target = '_blank';

        var adLogoCon = engine.getLayout(fullConfig);
        adLogoCon.tagName = 'div';
        adLogoCon.class = 'ad_logo_con';

        var adLogoImg = engine.getLayout(fullConfig);
        adLogoImg.tagName = 'img';
        adLogoImg.id = 'ad_logo_img';
        adLogoImg.class = 'ad_logo_img';

        var adLeftA = engine.getLayout(fullConfig);
        adLeftA.tagName = 'a';
        adLeftA.id = 'ad_left_a_0';
        adLeftA.class = 'ad_left_a';
        adLeftA.target = '_blank';

        var frame1 = engine.getLayout(fullConfig);
        frame1.class = 'frame';
        frame1.id = 'frame1';
        // title
        var adTitle = engine.getLayout(fullConfig);
        adTitle.tagName = 'div';
        adTitle.id = 'ad_title';
        adTitle.class = 'ad_title';

        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        adTitle.childNodes.push(titleText);
        frame1.childNodes.push(adTitle);

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
        adLeftA.childNodes.push(frame1);

        var frame2 = engine.getLayout(fullConfig);
        frame2.class = 'frame';
        frame2.id = 'frame2';
        // 广告desc
        var adDesc = engine.getLayout(fullConfig);
        adDesc.tagName = 'div';
        adDesc.id = 'ad_desc';
        adDesc.class = 'ad_desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        adDesc.childNodes.push(descText);
        frame2.childNodes.push(adDesc);
        adLeftA.childNodes.push(frame2);

        urlText.innerHTML = ad.text.action.forward.title || '';
        titleText.innerHTML = ad.text.material.creativeTitle;
        descText.innerHTML = ad.text.material.creativeDesc1
        + (ad.text.material.creativeDesc2 === undefined
        ? '' : ad.text.material.creativeDesc2);

        if (ad.text.additionalAction[0].phone && ad.text.additionalAction[0].phone.phoneNumber) {
            /* eslint-disable max-len */
            var telIcon = 'data:image/png;base64,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';
            var clicklink = ad.text.action.forward.clickLink.clickLink;
            var traceUrl = ad.text.additionalAction[0].phone.traceUrl;
            adLeftA.href = clicklink;
            adLeftA['date-href'] = clicklink;
            adRightA['data-tel'] = 'tel:' + (ad.text.additionalAction[0].phone.phoneNumber
            ? ad.text.additionalAction[0].phone.phoneNumber : '');
            adRightA['date-href'] = traceUrl;
            adRightA.type = 'phone';
            adLogoImg.src = telIcon;
        } else if (ad.text.additionalAction[0] && ad.text.additionalAction[0].forward && ad.text.additionalAction[0].forward.clickLink.clickLink) {
            var clicklink = ad.text.action.forward.clickLink.clickLink;
            var traceUrl = ad.text.additionalAction[0].forward.clickLink.clickLink;
            adLeftA.href = clicklink;
            adLeftA['date-href'] = clicklink;
            adRightA.href = traceUrl;
            adRightA['date-href'] = traceUrl;
            adRightA.type = 'forward';
            adLogoImg.src = '{{dupDomain}}/cpro/ui/noexpire/img/xst/xst_message.png';
        }
        adLogoCon.childNodes.push(adLogoImg);
        adRightA.childNodes.push(adLogoCon);
        item.childNodes.push(adRightA, adLeftA);
        items.push(item);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var ext = {};
        if (requestInfo.styleConfig && requestInfo.styleConfig.ext) {
            ext = (requestInfo.styleConfig.ext).replace(/(^\s*)|(\s*$)/g, '')
            ? JSON.parse(requestInfo.styleConfig.ext) : {};
        }
        var pt = containerHeight / 48;

        // icon
        var imgW = ext.pictureWidth || 25;
        var imgH = ext.pictureHeight || 25;

        // left area
        var textPadding = Math.round(5 * pt);
        var textWidth = containerWidth - containerWidth * 0.25 - textPadding * 2;
        var textBC = userConfig.containerBackgroundColor || 'EEEEEE';

        // title
        var titleC = userConfig.titleFontColor || '585858';
        var titleFM = userConfig.fontName || '微软雅黑';
        var fontFontSize = Math.round(10 * pt);
        var titleFS = userConfig.titleFontSize || fontFontSize;
        titleFS = Math.min(titleFS, 26);
        var titleHeight = titleFS + 6;

        // url
        var urlHeight = Math.round(12 * pt);
        var urlFontSize = Math.round(8 * pt);
        var urlFontFamily = 'SimHei,arial,sans-serif;';
        var urlFontColor = '0000EE';

        // desc
        var descC = userConfig.descFontColor || '585858';
        var descFontSize = Math.round(8 * pt);
        var descFS = userConfig.descFontSize || descFontSize;
        descFS = Math.min(descFS, 20);
        var descFontFamily = userConfig.descFontFamily || 'Microsoft YaHei,arial,sans-serif;';
        var desclineHeight = descFS + 4;
        var descLen = (textWidth / descFS) * 2;
        descText.innerHTML = ad.text.material.creativeTitle;

        style['.container'] = containerStyle;


        style['.container a'] = {
            'position': 'absolute',
            'overflow': 'hidden',
            'text-decoration': 'none'
        };
        // 文本折行
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        style['.item div'] = {
            'overflow': 'hidden'
        };

        style['.ad_right_a'] = {
            'width': containerWidth * 0.25 + 'px',
            'height': containerHeight + 'px',
            'display': 'block',
            'background': '#EEEEEE',
            'top': 0,
            'right': 0,
            'z-index': '2147483649'
        };
        style['.ad_logo_con'] = {
            'width': '100%',
            'height': imgH + 25 + 'px',
            'width': imgH + 25 + 'px',
            'margin-top': (containerHeight - imgH - 25) / 2 + 'px',
            'margin-left': (containerWidth * 0.25 - imgH - 25) / 2 + 'px',
            'background': '#2976de',
            'border-radius': imgW + 15 + 'px',
            'text-align': 'center'
        };
        style['.ad_right_a img'] = {
            'margin-top': '13px',
            'width': imgW + 'px',
            'height': imgH + 'px'
        };
        style['.ad_left_a'] = {
            'width': textWidth  + 'px',
            'height': containerHeight + 'px',
            'padding': '0 ' + textPadding + 'px',
            'background': '#' + textBC
        };
        style['.frame'] = {
            position: 'absolute',
            height: '100%',
            width: textWidth + 'px'
        };
        style['#frame1'] = {
            top: 0
        };
        style['#frame2'] = {
            top: containerHeight + 'px'
        };

        // title
        style['.ad_title'] = {
            'width': textWidth + 'px',
            'height': titleHeight + 'px',
            'line-height': titleHeight + 'px',
            'font-size': titleFS,
            'font-family': titleFM,
            'color': '#' + titleC,
            'font-weight': 'bold',
            'margin-top': (containerHeight - titleHeight - urlHeight) / 2 + 'px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
        };
        style['.ad_title span'] = {
            font: 'normal ' + titleFS + 'px/' + titleHeight + 'px ' + titleFM,
            color: '#' + titleC
        };

        // url
        style['.item .url'] = {
            'width': textWidth  + 'px',
            'height': urlHeight  + 'px',
            'line-height': urlHeight  + 'px',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap'
        };

        style['.item .url span'] = {
            font: 'normal ' + urlFontSize + 'px/' + urlHeight + 'px ' + urlFontFamily,
            color: '#' + urlFontColor
        };

        // desc
        style['.ad_desc'] = {
            'width': textWidth + 'px',
            'line-height': desclineHeight + 'px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'display': '-webkit-box',
            '-webkit-line-clamp': 3,
            '-webkit-box-orient': 'vertical',
            'margin-top': (containerHeight - desclineHeight * 3) / 2 + 'px'
        };
        style['.ad_desc span'] = {
            font: 'normal ' + descFS + 'px/' + desclineHeight + 'px ' + descFontFamily,
            color: '#' + descC
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});