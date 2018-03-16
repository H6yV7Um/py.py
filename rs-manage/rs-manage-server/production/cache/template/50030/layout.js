/* global oojs */

/**
* @file image_splash
* @author fanwenjuan
*/
/* eslint-disable */
oojs.define({
    name: '50030',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,

    defaultValue: {
        logoType: 'feed-logo',
        adIconType: 'feed-adIcon',
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
    recomputeRootFontSize: function (viewportWidth) {
        var comparedWidth = 500;
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        this.currentRootFontSize = currentRootFontSize;
        return currentRootFontSize;
    },    
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        
        var ads = requestInfo.adElements;

        // 移动只出一条广告
        var ad = ads[0];
        var engine = this.basic;
        var logoSrc = ad.iconFileSrc[0];
        var name = ad.textAdditionalName[0] || '';
        var title = ad.textAdditionalTitle[0] || '';
        var stuffSrc = ad.imgFileSrc[0];


        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        container.childNodes.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        a['data-adindex'] = 0;
        item.childNodes.push(a);

        var imageWidth = ad.imgWidth[0];
        var imageHeight = ad.imgHeight[0];
        var imageRatio = imageWidth / imageHeight;
        var logoImageSrc = logoSrc;
        var logoTitle = name;
        logoTitle = logoTitle.length > 15 ? (logoTitle.slice(0, 15) + '...') : logoTitle;
        
        var maxTitleLength = 30;
        var title = title.length > maxTitleLength ? (title.slice(0, maxTitleLength) + '...') : title;

        a.innerHTML = 
            '<div class="logo-wrapper">' 
                + '<img class="logo" src="' + logoImageSrc + '">' 
            + '</div>'
            + '<div class="content-wrapper">'
                + '<div class="title">' + logoTitle + '</div>'
                + '<div class="desc">' + title + '</div>'
                + '<img class="material" src="' + stuffSrc + '">'
            +'</div>';
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        container.childNodes.push(qiushiInfo);
        // 添加样式部分
        var style = {};
        var styleConfigObj = null;
        var styleConfig = requestInfo.styleConfig && requestInfo.styleConfig.ext;
        // 判断是否设置默认值
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        };
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerStyle = engine.getContainerStyle(fullConfig);

        var containerWidth = containerStyle['outer-width'];
        var containerHeight = containerStyle['outer-height'];

        // var contentWidth = containerStyle.width;
        // var contentHeight = containerStyle.height;

        var containerPaddingTop = containerStyle['padding-top'] ? (containerStyle['padding-top'] + 'px') : '0.625rem';
        var containerPaddingLeft = containerStyle['padding-left'] ? (containerStyle['padding-left'] + 'px') : '0.625rem';
        var containerPaddingRight = containerStyle['padding-right'] ? (containerStyle['padding-right'] + 'px') : '0.625rem';
        var containerPaddingBottom = containerStyle['padding-bottom'] ? ( containerStyle['padding-bottom'] + 'px') : '1.25rem';
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.left) {
            containerPaddingLeft = styleConfigObj.padding.left ? (styleConfigObj.padding.left + 'px') : '0.625rem';
        }
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.right) {
            containerPaddingRight = styleConfigObj.padding.right ? (styleConfigObj.padding.right + 'px') : '0.625rem';
        }

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
            'padding-bottom': containerPaddingBottom,
            'position': 'relative'
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
        style['.feed-logo'] = {
            'left': '2.5rem' ,
            'bottom': containerPaddingBottom 
        };
        style['.container .feed-adIcon'] = {
            'left': '3.75rem' ,
            'bottom': containerPaddingBottom 
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': '3.75rem',
            'bottom': containerPaddingBottom
        };
        style['#fbIconDiv'] = {
            'left': '4rem',
            'bottom': containerPaddingBottom
        };
        // 隐藏关闭反馈功能
        style['.feedbackCon'] = {
            'display': 'none'
        };
        style['#fbIcon'] = {
            'display': 'none'
        };
        style['.fbTipDiv'] = {
            'display': 'none'
        };
        var result = {
            layoutObj: container,
            style: style
        };

        return result;
    }
});
