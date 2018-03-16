/**
 * @file 文字模板
 */
/* global oojs */
oojs.define({
    name: '10011',
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

        var telText = '\u62e8\u6253\u7535\u8bdd';// 拨打电话
        var lpText = '\u5728\u7ebf\u54a8\u8be2';// 在线咨询
        var act = ad.text.additionalAction[0].actionType || 6;

        var actText = lpText;
        var bntIcon = '';
        switch (act) {
            case 6: actText = telText;
            break;
            case 4: actText = lpText;
            break;
            default: actText = telText;
            break;
        }
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

        // 广告title
        var adTitle = engine.getLayout(fullConfig);
        adTitle.tagName = 'div';
        adTitle.id = 'title0';
        adTitle.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        adTitle.childNodes.push(titleText);
        item.childNodes.push(adTitle);

        // 广告desc
        var adDesc = engine.getLayout(fullConfig);
        adDesc.tagName = 'div';
        adDesc.id = 'desc';
        adDesc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        adDesc.childNodes.push(descText);
        item.childNodes.push(adDesc);

        // 按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'a';
        btn.class = 'btn';
        btn.id = 'btn0';
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText;
        btn.childNodes.push(btnText);
        item.childNodes.push(btn);
        // 填充广告数据
        item.childNodes.push(a);
        items.push(item);
        if (ad.text.additionalAction[0].phone && ad.text.additionalAction[0].phone.phoneNumber) {
            var clicklink = ad.text.action.forward.clickLink.clickLink;
            var traceUrl = ad.text.additionalAction[0].phone.traceUrl;
            a.href = clicklink;
            a['date-href'] = clicklink;
            btn['date-href'] = traceUrl;
            btn['date-tel'] = 'tel:' + (ad.text.additionalAction[0].phone.phoneNumber
            ? ad.text.additionalAction[0].phone.phoneNumber : '');
            btn.type = 'phone';
        } else if (ad.text.additionalAction[0] && ad.text.additionalAction[0].forward && ad.text.additionalAction[0].forward.clickLink.clickLink) {
            var clicklink = ad.text.action.forward.clickLink.clickLink;
            var traceUrl = ad.text.additionalAction[0].forward.clickLink.clickLink;
            a.href = clicklink;
            a['date-href'] = clicklink;
            btn.href = traceUrl;
            btn['date-href'] = traceUrl;
            btn.type = 'forward';
        }

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

        // 相对尺寸
        var px = containerWidth / 300;
        var pt = containerHeight / 300;

        // item
        var itemPadding = Math.round(20 * pt);
        var itemWidth = containerWidth - itemPadding * 2;
        var itemHeight = containerHeight;
        var textWidth = itemWidth;

        // title
        var titleH = Math.round(50 * pt);
        var titleLH = Math.round(50 * pt);
        var titleC = userConfig.titleFontColor || '#616161';
        var titleFS = userConfig.titleFontSize || Math.round(26 * pt);
        var titleFM = userConfig.titleFontFamily || '微软雅黑';
        var titleFontColor = userConfig.titleFontColor || 'ffffff';
        var titleM = Math.round(35 * pt);
        var titleBC = userConfig.containerBackgroundColor || 'DADADA';
        var titleImage = '{{dupDomain}}/cpro/ui/noexpire/img/image_bc.png';
        // desc
        var descM = Math.round(15 * pt);
        var descH =  Math.round(30 * pt) * 2;
        var descC = userConfig.descFontColor || '#000000';
        var descFS = userConfig.descFontSize ||  Math.round(16 * pt);
        var descFM = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';

        // btn
        var btnWidth = Math.round(itemWidth * 0.8);
        var btnHeight = Math.round(30 * pt);
        var btnTop = (containerHeight - titleH - titleM * 2 - descH - descM - btnHeight) / 2;
        var btnL = (containerWidth - btnWidth) / 2;
        var descLen = (itemWidth / descFS) * 2;
        // 字符截断
        var sourceT = String(ad.text.material.creativeTitle);
        titleText.innerHTML = sourceT;
        var sourceD = String(ad.text.material.creativeDesc1
        + (ad.text.material.creativeDesc2 === undefined
        ? '' : ad.text.material.creativeDesc2));
        if (sourceD.replace(/[^\x00-\xff]/g, 'ci').length / 2 > descLen) {
            sourceD = sourceD.substr(0, descLen).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, descLen * 2 - 6).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
        }
        descText.innerHTML = sourceD;
        style['.container'] = containerStyle;

        style['.item'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'background': '#EEEEEE'
        };
        // 移动广告全区域可点击
        style['#item0'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };

        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        style['.item .title'] = {
            'width': textWidth + 'px',
            'padding': titleM + 'px ' + itemPadding + 'px',
            'height': titleH + 'px',
            'background': '#' + titleBC + ' url(" '+ titleImage + ' ")',
            'background-size': '100% 100%',
            'text-align': 'center',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap'
        };

        style['.item .title span'] = {
            font: 'normal bold ' + titleFS + 'px/' + titleLH + 'px ' + titleFM,
            color: titleC
        };

        style['.item .desc'] = {
            'width': textWidth,
            'height': descH + 'px',
            'padding': descM + 'px  ' + itemPadding + 'px 0 ' + itemPadding + 'px',
            'text-align': 'left'
        };

        style['.item .desc span'] = {
            font: 'normal ' + descFS + 'px/' + descH / 2 + 'px ' + descFM,
            color: descC
        };

        style['.item .btn'] = {
            'text-align': 'center',
            'width': btnWidth + 'px',
            'height': btnHeight + 'px',
            'border-radius': Math.floor(px * 15) + 'px',
            'background': '#F84E4E',
            'text-decoration': 'none',
            'position': 'absolute',
            'bottom': btnTop + 'px',
            'left': btnL + 'px',
            'z-index': '2147483649'
        };
        style['.item .btn span'] = {
            'font': 'normal ' + Math.round(14 * pt) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'line-height': btnHeight + 'px',
            'color': '#ffffff'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});