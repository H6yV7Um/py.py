/* global oojs */

/**
* @file image_splash
* @author fanwenjuan
*/
/* eslint-disable */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_sdk_logo_single_image',
    deps: {
        basic: 'rs.template.basic',
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
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
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
    recomputeRootFontSize: function (viewportWidth) {
        var comparedWidth = 500;
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        this.currentRootFontSize = currentRootFontSize;
        return currentRootFontSize;
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

        qiushiInfo.innerHTML = 'var adsExtention = '
                                + this.adsExtention(context) + ';'
                                + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
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

        var imageWidth = ad.width;
        var imageHeight = ad.height;
        var imageRatio = imageWidth / imageHeight;
        var logoImageSrc = ad.customizedContent.image[0];
        var extention = JSON.parse(ad.extention);
        var logoTitle = extention.appinfo ? extention.appinfo.name : 'logo';
        logoTitle = logoTitle.length > 15 ? (logoTitle.slice(0, 15) + '...') : logoTitle;
        
        var maxTitleLength = 30;
        var title = ad.title.length > maxTitleLength ? (ad.title.slice(0, maxTitleLength) + '...') : ad.title;

        a.innerHTML = 
            '<div class="logo-wrapper">' 
                + '<img class="logo" src="' + logoImageSrc + '">' 
            + '</div>'
            + '<div class="content-wrapper">'
                + '<div class="title">' + logoTitle + '</div>'
                + '<div class="desc">' + title + '</div>'
                + '<img class="material" src="' + ad.stuffSrc + '">'
            +'</div>';

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);

        var containerWidth = containerStyle['outer-width'];
        var containerHeight = containerStyle['outer-height'];

        // var contentWidth = containerStyle.width;
        // var contentHeight = containerStyle.height;

        var containerPaddingTop = containerStyle['padding-top'] ? (containerStyle['padding-top'] + 'px') : '0.625rem';
        var containerPaddingLeft = containerStyle['padding-left'] ? (containerStyle['padding-left'] + 'px') : '0.625rem';
        var containerPaddingRight = containerStyle['padding-right'] ? (containerStyle['padding-right'] + 'px') : '0.625rem';
        var containerPaddingBottom = containerStyle['padding-bottom'] ? ( containerStyle['padding-bottom'] + 'px') : '1.25rem';

        var rootFontSize = this.recomputeRootFontSize(containerWidth);
        var contentWidth = 25;

        style['*'] = {
            margin: 0,
            padding: 0
        };

        style.html = {
            'font-size': rootFontSize + 'px',
            'background': 'white'
        };

        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'box-sizing': 'border-box',
            'overflow': 'hidden',
            'padding-top': containerPaddingTop,
            'padding-right': containerPaddingRight,
            'padding-left': containerPaddingLeft,
            'padding-bottom': containerPaddingBottom
        };
        style['#item0'] = {
            'text-decoration': 'none',
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'color': 'black'
        };
        style['.item'] = {
            'width': '100%',
            'height': '100%'
        };
        style['.logo-wrapper'] = {
            'width': '3.75rem',
            'height': '100%',
            'float': 'left'
        };
        style['.content-wrapper'] = {
            'position': 'relative',
            'float': 'right',
            'height': '100%',
            'width': contentWidth + 'rem'
        };
        style['.logo'] = {
            'width': '3.75rem',
            'height': '3.75rem',
            'border-radius': '1.875rem',
            'background': 'red'
        };
        style['.title'] = {
            'font-size': '1rem',
            'margin-bottom': '0.625rem'
        };
        style['.desc'] = {
            'font-size': '1.5rem'
        };
        style['.material'] = {
            'position': 'absolute',
            'bottom': '1rem',
            'width': imageRatio === 2 ? '100%' : '80%',
            'height': imageRatio === 2 
                        ? (contentWidth * 1 / 2 + 'rem')
                        : (contentWidth * 0.8 / 3 * 2 + 'rem')
        };

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        
        // 添加logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }

        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});
