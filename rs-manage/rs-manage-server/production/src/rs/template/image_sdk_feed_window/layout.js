/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_feed_window',
    deps: {
        basic: 'rs.template.basic',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

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
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
                extention.curl = extention.curl || ad.clickUrl;
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },

    render: function (context) {

        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        var engine = this.basic;
        var style = {};

        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        var containerStyle = engine.getContainerStyle(fullConfig);

        var topDecorator = engine.getLayout();
        topDecorator.class = 'container-top_decorator';
        container.childNodes.push(topDecorator);

        var titleContainer = engine.getLayout();
        titleContainer.class = 'title-container';
        container.childNodes.push(titleContainer);

        var titleText = engine.getLayout();
        titleText.class = 'title-text';
        titleText.tagName = 'h3';
        titleText.innerHTML =  JSON.parse(ads[0].extention).foreword || '\u4e3a\u60a8\u63a8\u8350';
        titleContainer.childNodes.push(titleText);

        var titleLineWrap = engine.getLayout();
        titleLineWrap.class = 'title-line-wrap';
        titleContainer.childNodes.push(titleLineWrap);

        var titleLine = engine.getLayout();
        titleLine.class = 'title-line';
        titleLineWrap.childNodes.push(titleLine);

        var baidulogo = engine.getLayout();
        baidulogo.class = 'bdlogo';
        baidulogo.tagName = 'a';
        baidulogo.href = 'https://union.baidu.com';
        baidulogo.target = '_blank';
        container.childNodes.push(baidulogo);

        for (var i = 0; i < ads.length; i++) {

            var adListItem = engine.getLayout();
            adListItem.tagName = 'li';
            adListItem.class = 'ad-list-item item';
            adListItem.id = 'item' + i;
            container.childNodes.push(adListItem);

            var adItemImage = engine.getLayout();
            adItemImage.tagName = 'img';
            adItemImage['data-src'] = ads[i].stuffSrc;
            adItemImage.class = 'ad-item-image item';
            adListItem.childNodes.push(adItemImage);

            // adItemDescription
            var title = engine.getLayout();
            title.tagName = 'p';
            title.class = 'title inline-center truncate';
            title.id = 'title' + i;
            title.innerHTML = ads[i].title;
            adListItem.childNodes.push(title);

            var adItemBtnLink = engine.getLayout();
            adItemBtnLink.tagName = 'a';
            adItemBtnLink.id = 'id' + i;
            adItemBtnLink.class = 'ad-item-btn-wrapper block-center';
            adItemBtnLink.href = ads[i].clickUrl;
            adListItem.childNodes.push(adItemBtnLink);
            adItemBtnLink['data-adindex'] = i;

            var adItemBtn = engine.getLayout();
            adItemBtn.tagName = 'button';
            adItemBtn.class = 'ad-item-btn truncate';
            adItemBtn.innerHTML = ads[i].actionType
                                    ? parseInt(ads[i].actionType, 10) === 2
                                        ? '\u514d\u8d39\u4e0b\u8f7d'
                                        : '\u4e86\u89e3\u66f4\u591a'
                                    : '\u4e86\u89e3\u66f4\u591a';
            adItemBtnLink.childNodes.push(adItemBtn);

        }

        var textBg = engine.getLayout();
        textBg.class = 'text-bg';
        // container.childNodes.push(textBg);

        // 秋实Sdk所需数据
        var ad = ads[0];
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = '
                                + this.adsExtention(context)
                                + ';'
                                + 'var actionTypeInfo='
                                + JSON.stringify(ad.actionTypeInfo);
        container.childNodes.push(qiushiInfo);

        // 样式开始
        // 计算containerWidth时不应该自作主张把border宽度从width中减去，应该交给box-sizing抉择
        var containerWidth = containerStyle.width + containerStyle['border-top-width'] * 2;
        var containerHeight = containerStyle.height + containerStyle['border-top-width'] * 2;

        var baselineRootFontSize = 16;
        var baselineContainerWidth = 640;
        var rootFontSize = (baselineRootFontSize / baselineContainerWidth) * containerWidth;

        var containerPadding = 16 / baselineRootFontSize;
        var containerBorder = (containerStyle['border-top-width'] || 2) / rootFontSize;

        var titleAreaHeight = 35 / baselineRootFontSize;
        var extra = 5 / baselineRootFontSize; // 用户容错
        var adImageContainerMarginTop = 15 / baselineRootFontSize;

        var smallButtonHeight = 35 / baselineRootFontSize;
        var smallButtonWidth = 98 / baselineRootFontSize;
        var smallButtonMarginTop = 10 / baselineRootFontSize;

        var bigButtonHeight = 35 / baselineRootFontSize;
        var bigButtonWidth = 165 / baselineRootFontSize;
        var bigButtonMarginTop = 10 / baselineRootFontSize;

        var smallImageDescriptionHeight = 20 / baselineRootFontSize;
        var smallImageDescriptionMarginTop = 20 / baselineRootFontSize;

        var bigImageDescriptionHeight = 25 / baselineRootFontSize;
        var bigImageDescriptionMarginTop = 20 / baselineRootFontSize;


        if (ads.length === 2) {
            var adImageHeight = containerHeight / rootFontSize
                                - extra
                                - titleAreaHeight
                                - adImageContainerMarginTop
                                - bigButtonHeight
                                - bigButtonMarginTop
                                - bigImageDescriptionHeight
                                - bigImageDescriptionMarginTop
                                - containerPadding;

            var adImageWidth = (adImageHeight / 5) * 6;
            var adContainerInnerWidth = containerWidth / rootFontSize -  containerBorder * 2 - containerPadding * 2;
            var adContainerInnerHeight = containerHeight / rootFontSize -  containerBorder * 2 - containerPadding;
            var commonImageMargin = (adContainerInnerWidth - adImageWidth * 2) / 2;

            if (commonImageMargin < 0) {
                commonImageMargin = 10 / baselineRootFontSize;
                adImageWidth = (adContainerInnerWidth - commonImageMargin * 2) / 2;
                adImageHeight = (adImageWidth / 6) * 5;
            }

            var totalItemHeight = bigButtonHeight
                                + bigButtonMarginTop
                                + bigImageDescriptionHeight
                                + bigImageDescriptionMarginTop
                                + adImageHeight;

            var oldAdImageContainerMarginTop = adImageContainerMarginTop;
            adImageContainerMarginTop = (adContainerInnerHeight - totalItemHeight) / 2;

            if (adImageContainerMarginTop <= titleAreaHeight) {
                adImageContainerMarginTop = oldAdImageContainerMarginTop + titleAreaHeight;
            }

            var textBgHeight = (containerHeight / rootFontSize)
                                 - adImageContainerMarginTop
                                 - adImageHeight
                                 - (bigImageDescriptionMarginTop); // 为什么不用把bigImageDescriptionMargintop除以2

        } else if (ads.length === 3) {

            var adImageHeight = containerHeight / rootFontSize
                                - containerPadding
                                - extra
                                - titleAreaHeight
                                - adImageContainerMarginTop
                                - smallButtonHeight
                                - smallButtonMarginTop
                                - smallImageDescriptionHeight
                                - smallImageDescriptionMarginTop;

            var adImageWidth = (adImageHeight / 3) * 2;
            var adContainerInnerWidth = containerWidth / rootFontSize -  containerBorder * 2 - containerPadding * 2;
            var adContainerInnerHeight = containerHeight / rootFontSize -  containerBorder * 2 - containerPadding;
            var commonImageMargin = (adContainerInnerWidth - adImageWidth * 3) / 4;

            if (commonImageMargin < 0) {
                commonImageMargin = 10 / baselineRootFontSize;
                adImageWidth = (adContainerInnerWidth - commonImageMargin * 4) / 3;
                adImageHeight = (adImageWidth / 2) * 3;
            }

            var totalItemHeight = smallButtonHeight
                                + smallButtonMarginTop
                                + smallImageDescriptionHeight
                                + smallImageDescriptionMarginTop
                                + adImageHeight;

            var oldAdImageContainerMarginTop = adImageContainerMarginTop;
            adImageContainerMarginTop = (adContainerInnerHeight - totalItemHeight) / 2;

            if (adImageContainerMarginTop <= titleAreaHeight) {
                adImageContainerMarginTop = oldAdImageContainerMarginTop + titleAreaHeight;
            }

            var textBgHeight = containerHeight / rootFontSize
                                 - adImageContainerMarginTop
                                 - adImageHeight
                                 - smallImageDescriptionMarginTop;  // 为什么不用把bigImageDescriptionMargintop除以2
        }


        style['*'] = {
            margin: 0,
            padding: 0
        };
        style.html = {
            'font-size': rootFontSize + 'px'
        };
        style.a = {
            'text-decoration': 'none',
            'outline': 'none'
        };
        style['.truncate'] = {
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
        };

        if (!containerStyle['border-top-width']) {
            containerStyle['border-top-width'] = '2px';
            containerStyle['border-bottom-width'] = '2px';
            containerStyle['border-left-width'] = '2px';
            containerStyle['border-right-width'] = '2px';
        }

        if (!containerStyle['border-color'] || containerStyle['border-color'] === '#ffffff') {
            containerStyle['border-color'] = '#ccc';
        }
        containerStyle.width = containerWidth + 'px';
        containerStyle.height = containerHeight + 'px';
        containerStyle['box-sizing'] = 'border-box';
        containerStyle.padding = '0 ' + containerPadding + 'rem ' + containerPadding + 'rem';
        style['.container'] = containerStyle;
        style['.block-center'] = {
            display: 'block',
            margin: '0 auto'
        };
        style['.inline-center'] = {
            'text-align': 'center'
        };
        style['.container-top_decorator'] = {
            width: (77 / baselineRootFontSize) + 'rem',
            height: (4 / baselineRootFontSize) + 'rem',
            background: '#ff0b3e',
            position: 'absolute',
            top: '0',
            left: (16 / baselineRootFontSize) + 'rem'
        };
        style['.title-container'] = {
            // 'margin-top': '15rem',
            'height': (20 / baselineRootFontSize) + 'rem',
            'line-height': (20 / baselineRootFontSize) + 'rem',
            'position': 'absolute',
            'top': (15 / baselineRootFontSize) + 'rem',
            'left': (16 / baselineRootFontSize) + 'rem'
        };
        style['.title-container:after'] = {
            content: '',
            clear: 'both'
        };
        style['.title-text'] = {
            'font-family': fullConfig.forewordFontFamily + ', "Microsoft YaHei", "微软雅黑", "Source Han Sans"',
            'color': '#' + (fullConfig.forewordColor ? fullConfig.forewordColor : '000000'),
            'font-size': (18 / baselineRootFontSize) + 'rem',
            'float': 'left'
        };
        style['.title-line-wrap'] = {
            'float': 'left',
            'width': containerWidth / rootFontSize
                        - containerPadding * 2
                        - containerBorder * 2
                        - 100 / baselineRootFontSize
                        - 12 / baselineRootFontSize + 'rem',
            'height': '100%',
            'margin-left': (12 / baselineRootFontSize) + 'rem'
        };
        style['.title-line'] = {
            'height': (10 / baselineRootFontSize) + 'rem',
            'border-bottom': '1px solid #dbdbdb'
        };
        style['.ad-list-item'] = {
            'display': 'block',
            'width': adImageWidth + 'rem',
            'float': 'left',
            'list-style-type': 'none',
            'margin': adImageContainerMarginTop + 'rem ' + (commonImageMargin / 2) + 'rem 0',
            'position': 'relative',
            'z-index': 2
        };
        if (ads.length === 3) {
            style['.ad-list-item:last-of-type'] = {
                'float': 'right'
            };
            style['.ad-list-item:nth-of-type(2)'] = {
                'margin-left': (adContainerInnerWidth - adImageWidth * 3 - commonImageMargin * 2) / 2 + 'rem'
            };
        }
        style['.ad-item-image'] = {
            width: adImageWidth + 'rem',
            height: adImageHeight + 'rem'
        };
        style['.title'] = {
            'font-size': (ads.length === 2
                            ? (20 / baselineRootFontSize)
                            : (16 / baselineRootFontSize)) + 'rem',
            'color': '#' + (fullConfig.titleFontColor ? fullConfig.titleFontColor : '000000'),
            'font-family': fullConfig.fontname + ', "Microsoft YaHei", "微软雅黑"',
            'margin-top': (20 / baselineRootFontSize) + 'rem'
        };
        style['.ad-item-btn'] = {
            'font-family': '"Microsoft YaHei", "微软雅黑", "Source Han Sans"',
            // 'font-size': (ads.length === 2
            //                 ? (16 / baselineRootFontSize)
            //                 : (14 / baselineRootFontSize)) + 'rem',
            'font-size': '12px', // PM改主意说优先对齐
            'font-weight': 'bold',
            'border': 'none',
            'background': '#' + (fullConfig.cbtnbackground ? fullConfig.cbtnbackground : 'FF0000'),
            'box-sizing': 'border-box',
            // 'padding': (9 / baselineRootFontSize) + 'rem ' + (35 / baselineRootFontSize) + 'rem',
            'padding': (9 / baselineRootFontSize) + 'rem 0',
            'width': '100%',
            'text-align': 'center',
            'color': 'white',
            'display': 'inline-block', // 本来想使用margin:0 auto来居中的，但htc下不支持（HTC是个很恶心的手机！）
            'margin': '0 auto'
        };
        style['.ad-item-btn-wrapper'] = {
            'margin-top': (10 / baselineRootFontSize) + 'rem',
            'text-decoration': 'none',
            'text-align': 'center'
        };
        style['.text-bg'] = {
            'background': 'white',
            'width': '100%',
            'height': textBgHeight + 'rem',
            'position': 'absolute',
            'left': '0',
            'bottom': '0',
            'z-index': 1
        };
        style['.bdlogo'] = {
            'display': 'block',
            'border-top': (20 / baselineRootFontSize)
                            + 'rem solid #'
                            + (fullConfig.cornermarkColor ? fullConfig.cornermarkColor : '87CEEB')
                            + '',
            'border-left': (10 / baselineRootFontSize) + 'rem solid transparent',
            'border-right': '0 solid transparent',
            'height': 0,
            'width': (30 / baselineRootFontSize) + 'rem',
            'position': 'absolute',
            'right': 0,
            'top': 0
        };
        style['.bdlogo:after'] = {
            'content': '"AD"',
            'color': 'white',
            'position': 'absolute',
            'top': (-19 / baselineRootFontSize) + 'rem',
            'right': (5 / baselineRootFontSize) + 'rem',
            'box-sizing': 'border-box'
        };
        // add adIcon
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4';

        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }

        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
