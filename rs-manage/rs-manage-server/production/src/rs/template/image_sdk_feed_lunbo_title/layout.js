/**
 * @file Template业务逻辑对象
 * @author liguangyi@baidu.com
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_feed_lunbo_title',
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
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var baselineRootFontSize = 16;
        var baselineContainerWidth = 600;
        var rootFontSize = (baselineRootFontSize / baselineContainerWidth) * containerWidth;
        var baselineLogoWidth = 100;
        var curLogoWidth = ((containerWidth / baselineContainerWidth) * baselineLogoWidth) / rootFontSize;


        var styleCfg = {
            small: {
                imageListWidth: (containerWidth / rootFontSize) * ads.length,
                controlContainerHeight: 74 / baselineRootFontSize + 'rem',
                controlContainerPadding: 12 / baselineRootFontSize + 'rem ' + 18 / baselineRootFontSize + 'rem',
                controlContainerPaddingVertical: 12 / baselineRootFontSize,
                controlContainerPaddingHorizon: 18 / baselineRootFontSize,
                adDescriptionWidth: 325 / baselineRootFontSize + 'rem',
                adDescriptionTitle: {
                    fontSize: 20 / baselineRootFontSize + 'rem',
                    paddingBottom: 7 / baselineRootFontSize + 'rem',
                    marginBottom: 7 / baselineRootFontSize + 'rem'
                },
                adDescriptionDetail: {
                    fontSize: 14 / baselineRootFontSize + 'rem'
                },
                adController: {
                    top: 0
                },
                baiduLogo: {
                    fontSize: 14 / baselineRootFontSize + 'rem',
                    // padding: 6 / baselineRootFontSize + 'rem ' + 17 / baselineRootFontSize + 'rem',
                    padding: 6 / baselineRootFontSize + 'rem 0',
                    borderRadius: 10 / baselineRootFontSize + 'rem',
                    // right: 40 / baselineRootFontSize + 'rem',
                    right: 40 / baselineRootFontSize,
                    bottom: 10 / baselineRootFontSize + 'rem'
                }
            },
            big: {
                imageListWidth: (containerWidth / rootFontSize) * ads.length,
                controlContainerPadding: 21 / baselineRootFontSize + 'rem ' + 26 / baselineRootFontSize + 'rem',
                controlContainerPaddingVertical: 21 / baselineRootFontSize,
                controlContainerPaddingHorizon: 26 / baselineRootFontSize,
                adDescriptionWidth: 500 / baselineRootFontSize + 'rem',
                adDescriptionTitle: {
                    fontSize: 30 / baselineRootFontSize + 'rem',
                    paddingBottom: 15 / baselineRootFontSize + 'rem',
                    marginBottom: 11 / baselineRootFontSize + 'rem'
                },
                adDescriptionDetail: {
                    fontSize: 22 / baselineRootFontSize + 'rem'
                },
                adController: {
                    top: 15 / baselineRootFontSize
                },
                baiduLogo: {
                    fontSize: 18 / baselineRootFontSize + 'rem',
                    // padding: 6 / baselineRootFontSize + 'rem ' + 22 / baselineRootFontSize + 'rem',
                    padding: 6 / baselineRootFontSize + 'rem 0',
                    borderRadius: 18 / baselineRootFontSize + 'rem',
                    // right: 42 / baselineRootFontSize + 'rem',
                    right: 42 / baselineRootFontSize,
                    bottom: 30 / baselineRootFontSize + 'rem'
                }
            }
        };
        // var selectedStyle = containerWidth === 960? styleCfg['big']: styleCfg['small'];
        var selectedStyle = styleCfg.small;

        // var imageContainer = engine.getLayout();
        // imageContainer.class = 'image-container';
        // container.childNodes.push(imageContainer);

        var controllerListItemWidth = 6 / baselineRootFontSize;
        var controllerListItemHeight = 6 / baselineRootFontSize;
        var controllerListItemMarginHor = 4 / baselineRootFontSize;
        var dotsTotalWidth = (controllerListItemWidth + controllerListItemMarginHor * 2) * ads.length
                                - controllerListItemMarginHor * 2;
        var controllerListMarginRight = (curLogoWidth - dotsTotalWidth) / 2;

        var imageList = engine.getLayout();
        imageList.class = 'image-list';
        imageList.tagName = 'ul';
        container.childNodes.push(imageList);

        for (var i = 0; i < ads.length; i++) {

            var imageListItem = engine.getLayout();
            imageListItem.tagName = 'li';
            imageListItem.class = 'image-list-item item';
            imageListItem.id = 'item' + i;
            imageList.childNodes.push(imageListItem);

            var itemContentWrap = engine.getLayout();
            itemContentWrap.tagName = 'a';
            itemContentWrap.id = 'id' + i;
            itemContentWrap.class = 'item-content-wrap';
            itemContentWrap.href = ads[i].clickUrl;
            itemContentWrap['data-adindex'] = i;
            imageListItem.childNodes.push(itemContentWrap);

            var img = engine.getLayout();
            img.tagName = 'img';
            img['data-src'] = ads[i].stuffSrc;
            itemContentWrap.childNodes.push(img);

            var ctrlContainer = engine.getLayout();
            ctrlContainer.class = 'control-container';
            itemContentWrap.childNodes.push(ctrlContainer);

            var adDescription = engine.getLayout();
            adDescription.class = 'ad-description';
            ctrlContainer.childNodes.push(adDescription);

            if (ads[i].title) {
                var title = engine.getLayout();
                title.class = 'title truncate';
                title.tagName = 'h3';
                title.id = 'title' + i;
                title.innerHTML = ads[i].title;
                adDescription.childNodes.push(title);
            }

            if (ads[i].desc) {
                var desc = engine.getLayout();
                desc.class = 'desc truncate';
                desc.tagName = 'p';
                desc.id = 'desc' + i;
                desc.innerHTML = ads[i].desc;
                adDescription.childNodes.push(desc);
            }

            var adController = engine.getLayout();
            adController.class = 'ad-controller';
            ctrlContainer.childNodes.push(adController);

            var adControllerList = engine.getLayout();
            adControllerList.class = 'ad-controller-list';
            adControllerList.tagName = 'ul';
            adController.childNodes.push(adControllerList);

            if (ads.length > 1) {
                for (var j = 0; j < ads.length; j++) {
                    var ctrlListItem = engine.getLayout();
                    ctrlListItem.tagName = 'li';
                    ctrlListItem['data-selectIndex'] = j;
                    ctrlListItem.class = 'controller-list-item ' + (j === i ? 'active' : '');
                    adControllerList.childNodes.push(ctrlListItem);
                }
            }

            // Bug
            var customBaiduLogo = engine.getLayout();
            customBaiduLogo.tagName = 'a';
            customBaiduLogo.class = 'baidu-logo';
            customBaiduLogo.innerHTML = '百度推广';
            customBaiduLogo.href = 'https://wangmeng.baidu.com/';
            customBaiduLogo.target = '_blank';
            imageListItem.childNodes.push(customBaiduLogo);
        }

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

        style['*'] = {
            margin: 0,
            padding: 0
        };
        style.a = {
            'text-decoration': 'none',
            'outline': 'none'
        };
        style.html = {
            'font-size': rootFontSize + 'px'
        };
        style['.truncate'] = {
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis'
        };
        containerStyle.position = 'relative';
        containerStyle.overflow = 'hidden';
        style['.container'] = containerStyle;

        style['.image-container'] = {
            width: containerWidth / rootFontSize +  'rem',
            height: containerHeight / rootFontSize + 'rem',
            position: 'relative'
        };

        style['.image-list'] = {
            position: 'absolute',
            left: '0',
            top: '0',
            width: (containerWidth / rootFontSize) * ads.length + 'rem',
            height: (containerHeight / rootFontSize) + 'rem'
        };

        style['.image-list-item'] = {
            'float': 'left',
            'position': 'relative',
            'list-style-type': 'none'
        };

        style['.item-content-wrap'] = {
            display: 'block',
            position: 'relative',
            width: (containerWidth / rootFontSize) + 'rem',
            height: (containerHeight / rootFontSize) +  'rem'
        };

        style['.image-list-item img'] = {
            width: (containerWidth / rootFontSize) + 'rem',
            height: (containerHeight / rootFontSize) +  'rem'
        };

        style['.control-container'] = {
            'width': containerWidth / rootFontSize + 'rem',
            'box-sizing': 'border-box',
            'padding': selectedStyle.controlContainerPadding,
            'position': 'absolute',
            'bottom': 0,
            'left': 0,
            'background': 'rgba(0, 0, 0, 0.6)',
            'color': 'white'
        };

        if (!ads[0].title) {
            style['.control-container'].height = selectedStyle.controlContainerHeight;
        }

        style['.control-container:after'] = {
            content: '',
            clear: 'both'
        };
        style['.ad-description'] = {
            'width': selectedStyle.adDescriptionWidth,
            'float': 'left'
        };
        style['.title'] = {
            'font-size': selectedStyle.adDescriptionTitle.fontSize,
            'font-family': '方正兰亭中黑简',
            'padding-bottom': selectedStyle.adDescriptionTitle.paddingBottom,
            'margin-bottom': selectedStyle.adDescriptionTitle.marginBottom,
            'border-bottom': 1 / rootFontSize + 'rem solid #bab9b7'
        };
        // style['.title:first-of-type'] = {
        //  'display': 'block'
        // }
        style['.desc'] = {
            'font-size': selectedStyle.adDescriptionDetail.fontSize,
            'font-family': '微软雅黑',
            'display': 'none'
        };
        style['.desc:first-of-type'] = {
            display: 'block'
        };
        style['.ad-controller'] = {
            position: 'absolute',
            // right: (36 / baselineRootFontSize) + selectedStyle.controlContainerPaddingHorizon + 'rem',
            right: selectedStyle.baiduLogo.right + controllerListMarginRight + 'rem',
            top: selectedStyle.controlContainerPaddingVertical + selectedStyle.adController.top + 'rem'
        };
        style['.controller-list-item'] = {
            'list-style-type': 'none',
            'width': (6 / baselineRootFontSize) + 'rem',
            'height': (6 / baselineRootFontSize) + 'rem',
            'border': (1 / rootFontSize) + 'rem solid white',
            'border-radius': (3 / rootFontSize) + 'rem',
            'float': 'left',
            'margin': (4 /  baselineRootFontSize) + 'rem ' + controllerListItemMarginHor + 'rem 0',
            'cursor': 'pointer'
        };
        style['.controller-list-item:first-of-type'] = {
            'margin-left': 0
        };
        style['.controller-list-item:last-of-type'] = {
            'margin-right': 0
        };
        style['.controller-list-item.active'] = {
            background: 'white'
        };
        style['.baidu-logo'] = {
            'text-decoration': 'none',
            'font-size': selectedStyle.baiduLogo.fontSize,
            'color': 'rgba(255,255,255,0.6)',
            'border': (1 / rootFontSize) + 'rem solid rgba(255,255,255,0.21)',
            'padding': selectedStyle.baiduLogo.padding,
            'border-radius': selectedStyle.baiduLogo.borderRadius,
            'position': 'absolute',
            'right': selectedStyle.baiduLogo.right + 'rem',
            'bottom': selectedStyle.baiduLogo.bottom,
            'width': curLogoWidth + 'rem',
            'text-align': 'center'
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
