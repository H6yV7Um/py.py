/* global oojs */
/**
* @file 20012 image_wap_banner_lunbo
* @author
*/
/* eslint-disable max-len */
oojs.define({
    name: '20012',
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
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
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

        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'div';
        res.id = 'res';
        res.class = 'res';

        var resImg = engine.getLayout(fullConfig);
        resImg.tagName = 'img';
        resImg.id = 'resImg';
        resImg.class = 'resImg';

        // 填充广告数据
        var ext = {};
        if (ad.wapAppInfo) {
            ext = JSON.parse(ad.wapAppInfo);
        }
        // 扩展字段
        ext.appinfo = ext.appinfo || {};
        a['data-title'] = (ad.textTitle[0] ? ad.textTitle[0] : ext.appinfo.appname) || '';
        a['data-href'] = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        resImg.src = ad.imgFileSrc[0] || '';

        item.childNodes.push(a);
        res.childNodes.push(resImg);
        item.childNodes.push(res);
        items.push(item);

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

        var pt = containerHeight / 48;
        // 图片的宽度 = 容器的宽度
        var imgWidth = containerWidth;
        var imgHeight = containerHeight;
        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        };
        style['.container'] = containerStyle;

        style['.item, .item a'] = {
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none',
            'position': 'absolute'
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        style['.res'] = {
            width: '100%',
            height: '100%',
        };

        style['.resImg'] = {
            width: imgWidth + 'px',
            height: imgHeight + 'px'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
