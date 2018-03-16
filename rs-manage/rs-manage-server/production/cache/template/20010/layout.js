/* global oojs */
/**
* @file 20010 image_sdk_banner_base
* @author qianxiaoli
*/
/* eslint-disable max-len */
oojs.define({
    name: '20010',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
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
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 4;
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
        var isPause = requestInfo.flowInfo && requestInfo.flowInfo.isPause || false;
        if (isPause) {
            a['data-ispause'] = isPause;
        };
        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.id = 'res';
        res.class = 'res';
        a.childNodes.push(res);
        if (act === 5) {
            var icon = engine.getLayout(fullConfig);
            icon.class = 'icon';

             // 广告点击区域——item可点
            var aIcon = engine.getLayout(fullConfig);
            aIcon.tagName = 'a';
            aIcon.id = 'item_btn_0';
            // 广告索引，必须加
            aIcon['data-adindex'] = '0';
            // 广告推广类型
            aIcon['data-adtype'] = act;
            aIcon.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink) {
                a['mcurl-val'] = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink;
                a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink;
            }
            else {
                a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            }
            aIcon.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            aIcon.childNodes.push(icon);
            item.childNodes.push(aIcon);

        }
        else {
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        }

        // 填充广告数据
        res.src = ad.imgFileSrc[0];
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
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
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        // 动态创意适配实验开始，一期只做320*48,320*50这两个尺寸，适配728*90和468*60，固定宽，高度垂直居中
        var adContainerWidth = containerWidth;
        var adContainerHeight = containerHeight;
        var adWidth = parseInt(ad.imgWidth[0], 10);
        var adHeight = parseInt(ad.imgHeight[0], 10);
        if (adContainerWidth === 320 && (adContainerHeight === 48 || adContainerHeight === 50) && ((adWidth === 728 && adHeight === 90) || (adWidth === 468 && adHeight === 60))) {
            fullConfig.containerBackgroundColor = '#4A3D5C';
            fullConfig.containerPaddingTop = fullConfig.containerPaddingBottom = (adContainerHeight - adHeight * (adContainerWidth / adWidth)) / 2;
        }
        // 动态创意适配实验结束

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
        style['.item a'] = {
            display: 'block'
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        style['.res'] = {
            display: 'block',
            width: '100%',
            height: '100%'
        };
        // icon
        var btnbackground = fullConfig.cbtnbackground || '2e83f7';
        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            'opacity': 0.9
        };
        style['#item_btn_0'] = {
            'position': 'absolute',
            'right': 0,
            'top': fullConfig.containerPaddingTop + 'px',
            'z-index': '2147483647',
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            // 'background': '#2e83f7',
            'opacity': 0.9,
            'text-align': 'center',
            'color': '#fff',
            'font-size': '15px',
            'font-family': '微软雅黑',
            'font-weight': 'bold',
            'line-height': containerHeight + 'px'
        };

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
        style['#fbIconDiv'] = {
            'height': '16px',
            'width': '40px',
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'cursor': 'pointer',
            'z-index': '2147483648'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
