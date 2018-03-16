/**
 * @file 50006
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: '50006',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
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
        containerPaddingLeft: 0,
        adIconType: 1
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
        adTopA.target = '_blank';

        var adLogoImg = engine.getLayout(fullConfig);
        adLogoImg.tagName = 'img';
        adLogoImg.id = 'ad_logo_img';
        adLogoImg.class = 'ad_logo_img';

        var adMiddleA = engine.getLayout(fullConfig);
        adMiddleA.tagName = 'a';
        adMiddleA.id = 'ad_middle_a';
        adMiddleA.class = 'ad_middle_a';
        adMiddleA.target = '_blank';

        var adBottomA = engine.getLayout(fullConfig);
        adBottomA.tagName = 'a';
        adBottomA.id = 'ad_bottom_a';
        adBottomA.class = 'ad_bottom_a';
        adBottomA.target = '_blank';

        var adTitle = engine.getLayout(fullConfig);
        adTitle.tagName = 'div';
        adTitle.id = 'ad_title';
        adTitle.class = 'ad_title';

        var adDesc = engine.getLayout(fullConfig);
        adDesc.tagName = 'div';
        adDesc.id = 'ad_desc';
        adDesc.class = 'ad_desc';

        adTitle.innerHTML = ad.textWithIcon.material.creativeTitle;
        adDesc.innerHTML = ad.textWithIcon.material.creativeDesc1
        + (ad.textWithIcon.material.creativeDesc2 === undefined
        ? '' : ad.textWithIcon.material.creativeDesc2);
        adLogoImg.src = ad.textWithIcon.material.file.fileSrc || '';
        adTopA.title = ad.textWithIcon.action.forward.targetPage || '';
        adBottomA.title = ad.textWithIcon.action.forward.targetPage || '';
        adMiddleA.title = ad.textWithIcon.action.forward.targetPage || '';
        if (ad.textWithIcon.action.forward.clickLink.clickLink) {
            adTopA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
            adMiddleA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
            adBottomA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
        }
        adTopA.childNodes.push(adTitle);
        adBottomA.childNodes.push(adDesc);
        adMiddleA.childNodes.push(adLogoImg);
        items.push(adTopA);
        items.push(adMiddleA);
        items.push(adBottomA);
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
       // var positionLR = (ext.itemRightImage || 0) ? 'right' : 'left';
        var titleMTop = ext.paddingTitleTop || 5;
        var titleC = (ext.txt && ext.txt.ctitle) ? ext.txt.ctitle : '#000000';
        var titleFM = (ext.txt && ext.txt.fontName) ? ext.txt.fontName : '微软雅黑';
        var titleFS = (ext.txt && ext.txt.fontSize) ? ext.txt.fontSize : 16;
        var descMTop = ext.marginDescriptionPicture || 5;
        var descC = (ext.txt && ext.txt.cdesc) ? ext.txt.cdesc : '#000000';
        var descFS = (ext.txt && ext.txt.descFontSize) ? ext.txt.descFontSize : 14;
        var conBColor = ext.backgroundColor || '#ffffff';

        var adAW = containerWidth - 5;
        var titleLen = (adAW / titleFS) * 2;
        var descLen = (adAW / descFS) * 2;
       // containerStyle.cborder = conBorderC;
        var imgW = ext.pictureWidth || containerWidth;
        var imgH = ext.pictureWidth || containerHeight - titleFS - titleMTop - 20
        - descFS - descMTop;
        var imgTitleDis = ext.marginTitlePicture || 5;
        /*var sourceT = String(ad.textWithIcon.material.creativeTitle);
        if (sourceT.replace(/[^\x00-\xff]/g, 'ci').length / 2 > titleLen) {
            sourceT = sourceT.substr(0, titleLen).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, titleLen * 2 - 2).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            adTitle.innerHTML = sourceT;
        }
        var sourceD = String(ad.textWithIcon.material.creativeDesc1 + ad.textWithIcon.material.creativeDesc2);
        if (sourceD.replace(/[^\x00-\xff]/g, 'ci').length / 2 > descLen) {
            sourceD = sourceD.substr(0, descLen).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, descLen * 2 - 2).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            adDesc.innerHTML = sourceD;
        }*/

        style['.container'] = containerStyle;

        style['.container a'] = {
            // 'float': positionLR,
            'overflow': 'hidden',
            'text-decoration': 'none'
        };

        style['.ad_top_a'] = {
            'width': containerWidth + 'px',
            'height': titleFS + titleMTop + 10 + 'px',
            'padding': '0px ' + imgTitleDis + 'px',
            'display': 'block'
        };
        style['.ad_middle_a'] = {
            'width': imgW + 'px',
            'height': imgH + 'px',
            'display': 'block'
        };
        style['.ad_middle_a img'] = {
            'width': imgW + 'px',
            'height': imgH + 'px'
        };
        style['.ad_bottom_a'] = {
            'width': adAW + 'px',
            'height': descFS + descMTop + 10 + 'px',
            'display': 'block'
        };
        style['.ad_title'] = {
            'font-size': titleFS,
            'font-family': titleFM,
            'color': titleC,
            'margin-top': titleMTop + 'px',
            'font-weight': 'bold',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
            'white-space': 'nowrap'

        };
        style['.ad_desc'] = {
            'font-size': descFS,
            'font-family': titleFM,
            'color': descC,
            'margin-top': descMTop + 'px',
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