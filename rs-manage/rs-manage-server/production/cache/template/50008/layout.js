/**
 * @file 图文基础移动模板-原生wap2
 * @author qianixaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'tuwen_base_mobile_layout_50008',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
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

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = JSON.parse(requestInfo.ads);
        var ad = ads.mainCreatives[0];
        var style = {};


        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        // items
        var items = container.childNodes;

        // logo
        var adTopA = engine.getLayout(fullConfig);
        adTopA.tagName = 'a';
        adTopA.id = 'ad_top_a';
        adTopA.class = 'ad_top_a';

        var adMiddleA = engine.getLayout(fullConfig);
        adMiddleA.tagName = 'a';
        adMiddleA.id = 'ad_middle_a';
        adMiddleA.class = 'ad_middle_a';

        var adTitle = engine.getLayout(fullConfig);
        adTitle.tagName = 'div';
        adTitle.id = 'ad_title';
        adTitle.class = 'ad_title';

        adTitle.innerHTML = ad.textWithIcon.material.creativeTitle;

        var imgArr = ad.textWithIcon.material.file.fileSrc ? ad.textWithIcon.material.file.fileSrc.split(',') : [];
        for (var i = 0; i < imgArr.length; i++) {
            var adLogoImg = engine.getLayout(fullConfig);
            adLogoImg.tagName = 'img';
            adLogoImg.id = 'ad_logo_img' + i;
            adLogoImg.class = 'ad_logo_img' + i;
            adLogoImg.src = imgArr[i] || '';
            adMiddleA.childNodes.push(adLogoImg);
        }


        adTopA.title = ad.textWithIcon.action.forward.targetPage || '';

        adMiddleA.title = ad.textWithIcon.action.forward.targetPage || '';
        if (ad.textWithIcon.action.forward.clickLink.clickLink) {
            adTopA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
            adMiddleA.href = ad.textWithIcon.action.forward.clickLink.clickLink;

        }
        adTopA.childNodes.push(adTitle);

        items.push(adTopA);
        items.push(adMiddleA);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var ext = {};
        if (requestInfo.styleConfig && requestInfo.styleConfig.ext) {
            ext = (requestInfo.styleConfig.ext).replace(/(^\s*)|(\s*$)/g, '')
            ? JSON.parse(requestInfo.styleConfig.ext) : {};
        }

        var titleC = ext.txt.ctitle || '#000000';
        var titleFM = ext.txt.fontName;
        var titleFS = ext.txt.fontSize || 16;
        // var descMTop = ext.descPaddingTop || 5;
        // var descC = ext.cdesc || '#000000';
        // var descFS = ext.fontsize || 14;
        var conBColor = ext.backgroundColor || '#ffffff';

        // var conBorderC = ext.cborder;
        // var conBorderW = ext.bborder;
        var adAW = containerWidth - 5;

        containerStyle.cborder = conBorderC;
        var imgW = containerWidth * ext.pictureWidth || containerWidth * 0.32;
        var imgTitleDis = containerHeight * ext.marginTitlePicture || 0;
        var imgH = ext.pictureHeight || containerHeight - titleFS - 10 - imgTitleDis;
        var imgMR = (containerWidth - 3 * imgW) / 2;

        style['.container'] = containerStyle;

        style['.container a'] = {
            'overflow': 'hidden',
            'text-decoration': 'none'
        };

        style['.ad_top_a'] = {
            width: containerWidth + 'px',
            height: titleFS + 10 + 'px',
            display: 'block'
        };
        style['.ad_middle_a'] = {
            'width': containerWidth + 'px',
            'height': imgH + 'px',
            'display': 'block',
            'margin-top': imgTitleDis + 'px'
        };

        style['.ad_logo_img0'] = {
            'width': imgW + 'px',
            'height': imgH + 'px',
            'margin-right': imgMR + 'px',
            'float': 'left'
        };
        style['.ad_logo_img1'] = {
            'width': imgW + 'px',
            'height': imgH + 'px',
            'margin-right': imgMR + 'px',
            'float': 'left'
        };
        style['.ad_logo_img2'] = {
            'width': imgW + 'px',
            'height': imgH + 'px',
            'float': 'left'
        };
        style['.ad_title'] = {
            'font-size': titleFS,
            'font-family': titleFM,
            'color': titleC,
            'font-weight': 'bold',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap'

        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});