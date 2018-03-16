/**
 * @file 50005-原生PC图文
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
/* eslint-disable max-len */
oojs.define({
    name: '50005',
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
        var adLeftA = engine.getLayout(fullConfig);
        adLeftA.tagName = 'a';
        adLeftA.id = 'ad_left_a';
        adLeftA.class = 'ad_left_a';
        adLeftA.target = '_blank';

        var adLogoImg = engine.getLayout(fullConfig);
        adLogoImg.tagName = 'img';
        adLogoImg.id = 'ad_logo_img';
        adLogoImg.class = 'ad_logo_img';

        var adRightA = engine.getLayout(fullConfig);
        adRightA.tagName = 'a';
        adRightA.id = 'ad_right_a';
        adRightA.class = 'ad_right_a';
        adRightA.target = '_blank';

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
        adLeftA.title = ad.textWithIcon.action.forward.targetPage || '';
        adRightA.title = ad.textWithIcon.action.forward.targetPage || '';
        if (ad.textWithIcon.action.forward.clickLink.clickLink) {
            adLeftA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
            adRightA.href = ad.textWithIcon.action.forward.clickLink.clickLink;
        }
        adRightA.childNodes.push(adTitle);
        adRightA.childNodes.push(adDesc);
        adLeftA.childNodes.push(adLogoImg);
        items.push(adLeftA);
        items.push(adRightA);

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
        var positionLR = (ext.pdp && ext.pdp === 3) ? 'right' : 'left';
        var imgW = ext.pictureWidth || 135;
        var imgH = ext.pictureHeight || 90;
        var imgTitleDis = ext.marginTitlePicture || 5;
        var titleMTop = ext.paddingTitleTop || 5;
        var titleC = ext.ctitle || '#000000';
        var titleFM = (ext.txt && ext.txt.fontName) ? ext.txt.fontName : '微软雅黑';
        var titleFS = (ext.txt && ext.txt.fontSize) ? ext.txt.fontSize : 16;
        var descMTop = ext.marginTitleDescription || 5;
        var descC = (ext.txt && ext.txt.cdesc) ? ext.txt.cdesc : '#000000';
        var descFS = (ext.txt && ext.txt.descFontSize) ? ext.txt.descFontSize : 14;
        var conBColor = ext.backgroundColor || '#ffffff';
        // var conBorderC = ext.cborder;
        // var conBorderW = ext.bborder;
        var adRightAW = containerWidth - imgTitleDis - imgW - 5;
        var titleLen = (adRightAW / titleFS) * 2;
        var descLen = (adRightAW / descFS) * 2;

        var sourceT = String(ad.textWithIcon.material.creativeTitle);
        if (sourceT.replace(/[^\x00-\xff]/g, 'ci').length / 2 > titleLen) {
            sourceT = sourceT.substr(0, titleLen).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, titleLen * 2 - 4).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            adTitle.innerHTML = sourceT;
        }
        var sourceD = String(ad.textWithIcon.material.creativeDesc1 + ad.textWithIcon.material.creativeDesc2);
        if (sourceD.replace(/[^\x00-\xff]/g, 'ci').length / 2 > descLen) {
            sourceD = sourceD.substr(0, descLen).replace(/([^\x00-\xff])/g, '\x241 ').substr(0, descLen * 2 - 4).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            adDesc.innerHTML = sourceD;
        }

        var adLeftPadding = positionLR === 'right' ? ('0px 0px 0px' + imgTitleDis + 'px') : ('0px ' + imgTitleDis + 'px 0px 0px');

        style['.container'] = containerStyle;

        style['.container a'] = {
            'float': positionLR,
            'overflow': 'hidden',
            'text-decoration': 'none'
        };

        style['.ad_left_a'] = {
            width: imgW + 'px',
            height: imgH + 'px',
            padding: adLeftPadding,
            display: 'block'
        };

        style['.ad_left_a img'] = {
            width: imgW + 'px',
            height: imgH + 'px'
        };
        style['.ad_right_a'] = {
            width: adRightAW + 'px',
            height: containerHeight + 'px'
        };
        style['.ad_title'] = {
            'font-size': titleFS,
            'font-family': titleFM,
            'color': titleC,
            'margin-top': titleMTop + 'px',
            'font-weight': 'bold'
        };
        style['.ad_desc'] = {
            'font-size': descFS,
            'font-family': titleFM,
            'color': descC,
            'margin-top': descMTop + 'px'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});