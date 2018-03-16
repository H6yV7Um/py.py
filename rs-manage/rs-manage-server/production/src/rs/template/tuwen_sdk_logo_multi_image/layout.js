/* global oojs */

/**
* @file tuwen_sdk_logo_multi_image
* @author liguangyi
*/
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_sdk_logo_multi_image',
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
        var comparedWidth = 900;
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
        var logoImageSrc = ad.stuffSrc;
        var extention = JSON.parse(ad.extention);
        var maxLogoTitleLength = 20;
        var logoTitle = extention.appinfo ? extention.appinfo.name : 'logo';
        logoTitle = logoTitle.length > maxLogoTitleLength ? logoTitle.slice(0, maxLogoTitleLength) : logoTitle;
        var maxTitleLength = 20;
        var title = ad.title.length > maxTitleLength ? (ad.title.slice(0, maxTitleLength) + '...') : ad.title;

        a.innerHTML = '<div class="logo">'
                + '<img src="' + logoImageSrc + '" class="logo__icon" />'
                + '<div class="logo__title">' + logoTitle + '</div>'
            + '</div>'
            + '<p class="title">不花钱能变美的气质修炼法，你需要学一学</p>'
            + '<div class="gallery">'
                + '<img src="' +  ad.customizedContent.image[0] + '" class="gallery__item">'
                + '<img src="' +  ad.customizedContent.image[1] + '" class="gallery__item">'
                + '<img src="' +  ad.customizedContent.image[2] + '" class="gallery__item">'
            + '</div>';

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        // console.log(containerStyle);

        var containerWidth = containerStyle['outer-width'];
        var containerHeight = containerStyle['outer-height'];

        var specifiedContainerPaddingTop = containerStyle['padding-top'];
        var specifiedContainerPaddingBottom = containerStyle['padding-bottom'];
        var specifiedContainerPaddingLeft = containerStyle['padding-left'];
        var specifiedContainerPaddingRight = containerStyle['padding-right'];
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
