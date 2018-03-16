/**
* @file text_sdk_banner_base_extended_1
* @author yuxinxiao
*/
/* global oojs */
oojs.define({
    name: '50036',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
        bannerImgUrl: 'TemplateServer.Common.Model.bannerImgUrl'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0
    },
    //  秋实Sdk所需信息
    adsExtention: function (requestInfo) {
        var adsExtention = [];
        if (requestInfo.adElements && requestInfo.adElements.length) {
            for (var i = 0, count = requestInfo.adElements.length; i < count; i++) {
                var ad = requestInfo.adElements[i];
                var extention = ad.sdkInteractionInfo && JSON.parse(ad.sdkInteractionInfo);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    getText: function (actionType) {
        var result;
        switch (actionType) {
            case 5: result = '\u7acb\u5373\u4e0b\u8f7d\u0020\u0020\u0026\u0067\u0074\u003b';
            break;
            case 1: result = '\u53d1\u9001\u77ed\u4fe1\u0020\u0020\u0026\u0067\u0074\u003b';
            break;
            case 6: result = '\u62e8\u6253\u7535\u8bdd\u0020\u0020\u0026\u0067\u0074\u003b';
            break;
            case 4: result = '\u67e5\u770b\u8be6\u60c5\u0020\u0020\u0026\u0067\u0074\u003b';
            break;
            default: result = '\u67e5\u770b\u8be6\u60c5\u0020\u0020\u0026\u0067\u0074\u003b';
        }
        return result;
    },
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var engine = this.basic;
        // 移动只出一条广告
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 4;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';
        items.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adIndex'] = 0;
        // 广告推广类型
        a['data-adType'] = act;

        // 上半部分区域内容
        var itemCon = engine.getLayout(fullConfig);
        itemCon.tagName = 'div';
        itemCon.class = 'itemCon';
        itemCon.id = 'itemCon0';
        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.class = 'logo';
        itemCon.childNodes.push(logo);

        // logo图片
        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.class = 'icon';
        img.src = ad.iconFileSrc[0];
        logo.childNodes.push(img);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        itemCon.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        itemCon.childNodes.push(desc);
        // btn
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.id = 'btn0';
        btn.class = 'btn';
        btn.innerHTML = this.getText(parseInt(ad.action[0].actionType, 10));
        itemCon.childNodes.push(btn);

        // 填充广告数据
        a.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        title.innerHTML = ad.textTitle[0];
        desc.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
        itemCon.childNodes.push(a);
        item.childNodes.push(itemCon);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';

        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);
        // 添加样式部分
        var style = {};
        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var clientWidth = containerStyle.width;
        var clientHeight = containerStyle.height;
        var containerWidth = containerStyle.width;

        var rem = clientWidth / 16;
        var containerHeight = clientHeight;
        var ItemBackground = '#3d96fc';

        // 相对尺寸
        var px = containerWidth / 320;
        var pt = px;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        style['html'] = {
            'font-size': clientWidth / 16 + 'px'
        };
        style['.container'] = {
            width: itemWidth,
            height: clientHeight,
            'position': 'relative'
        };
        style['.itemCon'] = {
            width: itemWidth,
            height: itemHeight,
            'position': 'relative',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_bc.png) no-repeat',
            'background-size': '100% 100%'
        };
        style['.item'] = {
            width: '100%',
            height: '100%',
            'box-sizing': 'border-box'
        };
        // 移动广告全区域可点击
        style['.itemCon a'] = {
            'width': containerWidth,
            'height': containerHeight,
            'text-decoration': 'none',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };

       // logo单独一行
        var logoWidth = Math.round(60 * px);
        style['.itemCon .logo'] = {
            'width': itemWidth - itemPadding * 2,
            'height': logoWidth,
            'padding': itemPadding / 4 + 'px ' + itemPadding + 'px',
            'text-align': 'center'
        };
        style['.itemCon img'] = {
            'width': logoWidth,
            'height': logoWidth,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px 2px #777'
        };
        // 文本折行
        var textWidth = itemWidth - itemPadding * 2;
        style['.itemCon div'] = {
            'word-wrap': 'break-word'
        };

        var titleFontSize =  Math.round(14 * pt);
        var titleFontFamily = 'SimHei,arial,sans-serif;';
        var titleFontColor = 'fff';
        style['#title0'] = {
            'width': textWidth,
            'height': Math.round(25 * pt) * 2,
            'margin': '0 ' + itemPadding + 'px',
            'text-align': 'center',
            'overflow': 'hidden',
            font: 'normal normal ' + titleFontSize + 'px/' + Math.round(24 * pt) + 'px ' + titleFontFamily,
            color: '#' + titleFontColor,
            'display': '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': 3,
            'overflow': 'hidden'
        };
        var descTopSpace = Math.round(14 * px);

        var descFontSize = Math.round(12 * pt);
        var descFontFamily = 'SimHei,arial,sans-serif;';
        var descFontColor = '747474';
        style['#desc0'] = {
            'width': textWidth,
            'height': Math.round(16 * pt) * 2,
            'overflow': 'hidden',
            'margin': itemPadding / 4 + 'px ' + itemPadding + 'px',
            'text-align': 'center',
            font: 'normal ' + descFontSize + 'px/' + Math.round(16 * pt) + 'px ' + descFontFamily,
            color: '#' + descFontColor,
            'display': '-webkit-box',
            '-webkit-box-orient': 'vertical',
            '-webkit-line-clamp': 3,
            'overflow': 'hidden'
        };
        var btnWidth = Math.round(itemWidth * 0.8);
        var btnHeight = Math.round(30 * px);
        style['.btn'] = {
            'text-align': 'center',
            'margin': '0 0 0 ' + (itemWidth - btnWidth) / 2 + 'px',
            'width': btnWidth,
            'height': btnHeight,
            'line-height': btnHeight - 5,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px ' + Math.floor(px) + 'px' + ItemBackground,
            'background': ItemBackground,
            'font': 'normal ' + Math.round(14 * pt) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'line-height': btnHeight,
            'color': '#ffffff'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
