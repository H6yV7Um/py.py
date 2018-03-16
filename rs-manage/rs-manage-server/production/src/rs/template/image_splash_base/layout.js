/* global oojs */

/**
* @file image_splash
* @author fanwenjuan
*/
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_splash_base',
    deps: {
        basic: 'rs.template.basic',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
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
        containerPaddingLeft: 0,
        adIconIsShow: 1
    },
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                adsExtention.push(extention || '');
            }
        }

        return JSON.stringify(adsExtention);
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        // 移动只出一条广告
        var ad = ads[0];
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }

        qiushiInfo.innerHTML = 'var stuffSrc = "' + ad.stuffSrc + '";'
                                + 'var adsExtention = '
                                + this.adsExtention(context) + ';'
                                + 'var actionTypeInfo='
                                + JSON.stringify(ad.actionTypeInfo);
        container.childNodes.push(qiushiInfo);

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        container.childNodes.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        a.href = ad.clickUrl;
        a['data-adindex'] = 0;
        item.childNodes.push(a);

        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        // img.src = ad.stuffSrc;
        a.childNodes.push(img);

        // add logo
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

        var originImageWidth = ad.width;
        var originImageHeight = ad.height;

        var adRatio = containerHeight / containerWidth;
        var imageRatio = Math.round(originImageHeight / originImageWidth * 100) / 100;

        // // 1.6: 500x800/400x640
        // if (adRatio >= 1.59 && adRatio <= 1.84 && imageRatio === 1.5) {
        //     layoutTypeWithBtn = true;
        // }
        // // 1.5: 500x750/400x600
        // else if (adRatio >= 1.41 && adRatio <= 1.57 && imageRatio === 1.67) {
        //     layoutTypeWithBtn = false;
        // }
        // // 1.8 500x900/400x720
        // else if (adRatio >= 1.73 && adRatio <= 1.84 && imageRatio === 1.67) {
        //     layoutTypeWithBtn = true;
        // }
        // // 1.5: 500x750/400x600
        // else if (adRatio >= 1.41 && adRatio <= 1.71 && imageRatio === 1.78) {
        //     layoutTypeWithBtn = false;
        // }
        style['.container'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            overflow: 'hidden',
            position: 'relative'
        };
        style['.item'] = {
            'width': '100%',
            'height': '100%',
            'background-size': 'cover',
            'position': 'relative'
        };
        style['.item a'] = {
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'position': 'relative',
            'text-decoration': 'none'
        };

        style['.item a img'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            position: 'absolute',
            left: 0,
            top: 0
        };

        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});
