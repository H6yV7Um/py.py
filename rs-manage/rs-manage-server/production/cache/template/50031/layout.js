/* global oojs */

/**
* @file tuwen_sdk_logo_multi_image
* @author liguangyi
*/
/* eslint-disable */
oojs.define({
    name: '50031',
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
        var comparedWidth = 900;
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

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
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
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        a['data-adindex'] = 0;
        item.childNodes.push(a);

        var imageWidth = ad.imgWidth[0];
        var imageHeight = ad.imgHeight[0];
        var imageRatio = imageWidth / imageHeight;
        var logoImageSrc = logoSrc;
        // var extention = JSON.parse(ad.extention);
        var maxLogoTitleLength = 20;
        var logoTitle = name;
        logoTitle = logoTitle.length > maxLogoTitleLength ? logoTitle.slice(0, maxLogoTitleLength) : logoTitle;
        var maxTitleLength = 20;
        title = title.length > maxTitleLength ? (title.slice(0, maxTitleLength) + '...') : title;

        a.innerHTML = '<div class="logo">'
                + '<img src="' + logoImageSrc + '" class="logo__icon" />'
                + '<div class="logo__title">' + logoTitle + '</div>'
            + '</div>'
            + '<p class="title">' + title + '</p>'
            + '<div class="gallery">'
                + '<img src="' +  ad.imgFileSrc[0] + '" class="gallery__item">'
                + '<img src="' +  ad.imgFileSrc[1] + '" class="gallery__item">'
                + '<img src="' +  ad.imgFileSrc[2] + '" class="gallery__item">'
            + '</div>';
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);
        // 添加样式部分
        var style = {};
        var styleConfigObj = null;
        var styleConfig = requestInfo.styleConfig && requestInfo.styleConfig.ext;
        // 判断是否设置默认值
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        };
        var containerStyle = engine.getContainerStyle(fullConfig);
        // console.log(containerStyle);

        var containerWidth = containerStyle['outer-width'];
        var containerHeight = containerStyle['outer-height'];

        var specifiedContainerPaddingTop = containerStyle['padding-top'];
        var specifiedContainerPaddingBottom = containerStyle['padding-bottom'];
        var specifiedContainerPaddingLeft = containerStyle['padding-left'];
        var specifiedContainerPaddingRight = containerStyle['padding-right'];
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.left) {
            specifiedContainerPaddingLeft = styleConfigObj.padding.left ? (styleConfigObj.padding.left + 'px') : '0.625rem';
        }
        if (styleConfigObj && styleConfigObj.padding && styleConfigObj.padding.right) {
            specifiedContainerPaddingRight = styleConfigObj.padding.right ? (styleConfigObj.padding.right + 'px') : '0.625rem';
        }

        var specifiedImageGapSpace = userConfig.imagePaddingLeft || 0; // 60
        container['data-gap'] = specifiedImageGapSpace;

        var containerPaddingTop = specifiedContainerPaddingTop
                                    ? (specifiedContainerPaddingTop + 'px')
                                    : '0.625rem';
        var containerPaddingLeft = specifiedContainerPaddingLeft
                                    ? (specifiedContainerPaddingLeft + 'px')
                                    : '0.625rem';
        var containerPaddingRight = specifiedContainerPaddingRight
                                        ? (specifiedContainerPaddingRight + 'px')
                                        : '0.625rem';
        var containerPaddingBottom = specifiedContainerPaddingBottom
                                        ? (specifiedContainerPaddingBottom + 'px')
                                        : '1.25rem';

        var rootFontSize = this.recomputeRootFontSize(containerWidth);

        style['*'] = {
            margin: 0,
            padding: 0
        };

        style.html = {
            'font-size': rootFontSize + 'px'
        };

        style['.container'] = {
            'background': '#ffffff',
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
            width: '100%',
            height: '100%'
        };

        /* LOGO BLOCK */
        style['.logo'] = {
            height: '4rem'
        };
        style['.logo__icon'] = {
            'width': '4rem',
            'height': '4rem',
            'border-radius': '2rem',
            'float': 'left'
        };
        style['.logo__title'] = {
            'float': 'left',
            'line-height': '4rem',
            'margin-left': '0.9375rem',
            'font-size': '1.5rem'
        };
        /* TITLE BLOCK */
        style['.title'] = {
            'font-weight': 'bold',
            'text-align': 'left',
            // 'margin': '0.625rem 1rem',
            'margin': '0.625rem 0',
            'font-size': '1.75rem'
        };
        /* GALLERY */
        style['.gallery'] = {
            width: '100%'
        };
        style['.gallery:after'] = {
            content: '\"\"',
            display: 'block',
            clear: 'both'
        };
        style['.gallery__item'] = {
            'float': 'left',
            'display': 'block',
            // 'width': '17rem',
            // 'height': '11.3rem',
            'width': 17 * rootFontSize + 'px',
            'height': 11.3 * rootFontSize + 'px'
        };
        style['.gallery__item:first-child'] = {
            'margin-left': 0
        };
        style['.gallery__item:last-child'] = {
            'margin-right': 0,
            'float': 'right'
        };
        style['.feed-logo'] = {
            'left': 0,
            'bottom': 0 
        };
        style['.container .feed-adIcon'] = {
            'left': '2rem',
            'bottom': 0 
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': '2rem',
            'bottom': 0
        };
        style['#fbIconDiv'] = {
            'left': '2rem',
            'bottom': 0 
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
