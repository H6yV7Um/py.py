/**
 * @file tuwen_base template layout
 * @author qianxiaoli
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_base',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        containerShowLogo: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconType: 1
    },

    // 秋实Sdk所需信息
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
        var styleConfigStr = context.requestInfo.styleConfig;
        var adsLen = ads.length;
        var engine = this.basic;
        var cTitle = '#0066ff';
        var cDesc = '#333333';
        var cBackgroundColor = '#fff';
        var cBorder = '#c6c6c6';

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        if (styleConfigStr) {
            var styleConfig = JSON.parse(styleConfigStr);
            cTitle = (styleConfig.ctitle === false) ? '#0066ff' : styleConfig.ctitle;
            cDesc = (styleConfig.cDesc === false) ? '#333333' : styleConfig.cdesc;
            cBackgroundColor = (styleConfig.cbackground === false) ? '#fff' : styleConfig.cbackground;
            cBorder = (styleConfig.cborder === false) ? '#c6c6c6' : styleConfig.cborder;
        }
        // items
        var items = container.childNodes;

        for (var i = 0; i < adsLen; i++) {
            var item = engine.getLayout(fullConfig);
            item.class = 'item item' + i;
            item.id = 'item' + i;

            var titDes = engine.getLayout(fullConfig);
            titDes.class = 'titdes titdes' + i;
            titDes.id = 'titDes' + i;

            var titA = engine.getLayout(fullConfig);
            titA.tagName = 'a';
            titA.class = 'tita' + i;
            titA.id = 'titA' + i;
            titA.target = '_blank';
            titA.href = ads[i].clickUrl;

            var tit = engine.getLayout(fullConfig);
            tit.class = 'tit tit' + i;
            tit.id = 'tit' + i;
            tit.innerHTML = ads[i].title;

            var desA = engine.getLayout(fullConfig);
            desA.tagName = 'a';
            desA.class = 'desa' + i;
            desA.id = 'desA' + i;
            desA.target = '_blank';
            desA.href = ads[i].clickUrl;

            var des = engine.getLayout(fullConfig);
            des.class = 'des des' + i;
            des.id = 'des' + i;
            des.innerHTML = ads[i].desc;

            var imageD = engine.getLayout(fullConfig);
            imageD.class = 'imaged imaged' + i;
            imageD.id = 'imageD' + i;

            var imageA = engine.getLayout(fullConfig);
            imageA.tagName = 'a';
            imageA.class = 'imagea' + i;
            imageA.id = 'imageA' + i;
            imageA.target = '_blank';
            imageA.href = ads[i].clickUrl;

            var image = engine.getLayout(fullConfig);
            image.tagName = 'image';
            image.class = 'image' + i;
            image.id = 'image' + i;
            /* eslint-disable max-len */
            image.src = ads[i].stuffSrc !== null && ads[i].stuffSrc !== '' ? ads[i].stuffSrc : '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/dspArrow.png';
            /* eslint-enable max-len */
            titA.childNodes.push(tit);
            desA.childNodes.push(des);
            imageA.childNodes.push(image);
            imageD.childNodes.push(imageA);
            titDes.childNodes.push(titA);
            titDes.childNodes.push(desA);
            item.childNodes.push(titDes);
            item.childNodes.push(imageD);
            items.push(item);
        }

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width - 2;
        var containerHeight = containerStyle.height - 2;

        style['.container'] = {
            'width': containerWidth,
            'height': containerHeight,
            'border': '1px solid ' + cBorder,
            'font-family': '黑体',
            'overflow': 'hidden',
            'position': 'relative',
            'background-color': cBackgroundColor
        };
        var paddingTB = 0;
        var paddingLR = 0;
        var itemW = 0;
        var itemH = 0;
        var titDesW = 0;
        var titDesH = 0;
        var titDesMr = 0;
        var titH = 0;
        var titW = 0;
        var titLineH = 0;
        var titFontS = 0;
        var titMb = 0;
        var desH = 0;
        var desW = 0;
        var desLineH = 0;
        var desFontS = 0;
        var imgDH = 0;
        var imgDW = 0;
        var imgMarT = 0;
        var imgMarL = 0;
        var titFontSW = 0;
        var titFontSH = 0;
        var desFontSW = 0;
        var desFontSH = 0;
        var titRow = 2;
        var desRow = 3;
        if (adsLen === 1) {
            if (containerHeight / containerWidth > 0.67) {
                // 样式a
                if (containerHeight === 123 && containerWidth === 123) {
                    titRow = 1;
                    desRow = 1;
                }
                paddingTB = containerHeight / 11;
                paddingLR = containerWidth / 15;
                itemW = paddingLR * 13;
                itemH = paddingTB * 9;
                titDesW = itemW;
                titDesH = itemH - 70;
                titH = titDesH / 2;
                titW = titDesW;
                titLineH = titH / titRow < 12 ? 12 : (titH / titRow);
                titFontSW = (titW / 7) > 26 ? 26 : ((titW / 7) < 12 ? 12 : (titW / 7));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH;
                desW = titW;
                desLineH = desH / desRow < 12 ? 12 : (desH / desRow);
                desFontSW = (desW / 11) > 26 ? 26 : ((desW / 11) < 12 ? 12 : (desW / 11));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDH = 70;
                imgDW = titDesW;
                imgMarT = 5;
            }
            else {
                // 样式b
                paddingTB = (containerHeight - 80) / 4 > 0 ? (containerHeight - 80) / 4 : 0;
                paddingLR = ((containerWidth - 80 - 15) / 14 > 26) ? (containerWidth - 26 * 14 - 80 - 15) / 2 :
                (((containerWidth - 80 - 15) / 14 < 14) ? (containerWidth - 12 * 14 - 80 - 15) / 2 :
                (containerWidth - ((containerWidth - 80 - 15) / 14 - 2) * 14) / 2);
                paddingLR = paddingLR > 0 ? paddingLR : 0;
                itemW = containerWidth - paddingLR * 2;
                itemH = containerHeight - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 2;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarT = (itemH - 60) > 0 ? (itemH - 60) / 2 : 0;
                imgMarL = 10;
            }
        }
        else  if (adsLen === 2) {
            if (containerHeight  > 180 && (containerHeight / (containerWidth * 2) < 0.67
            || containerHeight / (containerWidth * 2) === 0.67)) {
                // 样式a
                // if (containerHeight > 180) {// 上下排列
                paddingTB = ((containerHeight - 1) / 2 - 80) / 4;
                paddingLR = ((containerWidth - 80 - 15) / 14 > 26) ? (containerWidth - 26 * 14 - 80
                - 15) / 4 : ((containerWidth - 80 - 15) / 14 < 14) ? (containerWidth - 12 * 14 - 80
                - 15) / 4 : (containerWidth - ((containerWidth - 80 - 15) / 14 - 2) * 14) / 4;
                paddingLR = paddingLR > 0 ? paddingLR : 0;
                itemW = containerWidth - paddingLR * 2;
                itemH = (containerHeight - 1) / 2 - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = 10;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
            }
            else if (containerHeight / (containerWidth / 2) < 0.67
            || containerHeight / (containerWidth / 2) === 0.67) {// b左右排列
                paddingTB = (containerHeight - 80) / 4;
                paddingLR = (((containerWidth - 1) / 2 - 80 - 15) / 14 > 26) ? ((containerWidth - 1)
                / 2 - 26 * 14 - 80 - 15) / 4 : (((containerWidth - 1) / 2 - 80 - 15) / 14 < 14)
                ? ((containerWidth - 1) / 2 - 12 * 14 - 80 - 15) / 4
                : ((containerWidth - 1) / 2 - (((containerWidth - 1) / 2 - 80 - 15)
                / 14 - 2) * 14) / 4;
                paddingTB = paddingTB > 0 ? paddingTB : 0;
                itemW = (containerWidth - 1) / 2 - paddingLR * 2;
                itemH = containerHeight - paddingTB * 2;
                paddingLR = Math.floor(paddingLR);
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = 10;
                if (imgDH < 80) {
                    imgMarT = 0;
                }
                style['.item0'] = {
                    'border-right': '1px solid ' + cBorder
                };
            }
            else {
                // 样式a上下
                paddingTB = (containerHeight - 1) / 22;// ontainerHeight / 11 / 2
                paddingLR = containerWidth / 15;
                itemW = paddingLR * 13;
                itemH = paddingTB * 9;
                titDesW = itemW;
                titDesH = itemH - 80;
                titH = titDesH / 2;
                titW = titDesW;
                titLineH = titH / 2;
                titFontSW = (titW / 7) > 26 ? 26 : ((titW / 7) < 12 ? 12 : (titW / 7));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH;
                desW = titW;
                desLineH = desH / 3;
                desFontSW = (desW / 11) > 26 ? 26 : ((desW / 11) < 12 ? 12 : (desW / 11));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDH = 80;
                imgDW = titDesW;
                imgMarT = 10;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
            }
        }
        else if (adsLen === 3) {
            if (containerWidth < 200) { // a型 上下
                paddingTB = (containerHeight - 2)  / 3 / 11;// ontainerHeight / 11 / 2
                paddingLR = containerWidth / 15;
                itemW = paddingLR * 13;
                itemH = paddingTB * 9;
                titDesW = itemW;
                titDesH = itemH - 80;
                titH = titDesH / 2;
                titW = titDesW;
                titLineH = titH / 2;
                titFontSW = (titW / 7) > 26 ? 26 : ((titW / 7) < 12 ? 12 : (titW / 7));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH;
                desW = titW;
                desLineH = desH / 3;
                desFontSW = (desW / 11) > 26 ? 26 : ((desW / 11) < 12 ? 12 : (desW / 11));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDH = 80;
                imgDW = titDesW;
                imgMarT = 10;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
            }
            else if (containerHeight / 3 > 60) {// b型 上下
                paddingTB = ((containerHeight - 2) / 3 - 60) / 4;
                paddingLR = ((containerWidth - 80 - 15) / 14 > 26) ? (containerWidth - 26 * 14 - 80 - 15)
                / 4 : ((containerWidth - 80 - 15) / 14 < 14 ? (containerWidth - 12 * 14 - 80 - 15) / 4
                : (containerWidth - ((containerWidth - 80 - 15) / 14 - 2) * 14) / 4);
                itemW = containerWidth - paddingLR * 2;
                itemH = (containerHeight - 2) / 3 - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = (titDesH - 60) / 2;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
            }
            else {// b型 左右排列
                paddingTB = (containerHeight - 60) / 4;
                paddingLR = (((containerWidth - 2) / 3 - 80 - 15) / 14 > 26) ? ((containerWidth - 2)
                / 3 - 26 * 14 - 80 - 15) / 4 : ((((containerWidth - 2) / 3 - 80 - 15) / 14 < 14)
                ? ((containerWidth - 2) / 3 - 12 * 14 - 80 - 15) / 4 : ((containerWidth - 2) / 3
                - (((containerWidth - 2) / 3 - 80 - 15) / 14 - 2) * 14) / 4);
                paddingLR = paddingLR > 0 ? paddingLR : 0;
                itemW = (containerWidth - 2) / 3 - paddingLR * 2;
                itemH = containerHeight - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = 10;
                style['.item0'] = {
                    'border-right': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-right': '1px solid ' + cBorder
                };
            }
        }
        else if (adsLen === 4) {
            if (containerHeight / 4 > 70) {// b型上下
                paddingTB = ((containerHeight - 3) / 4 - 60) / 4;
                paddingLR = ((containerWidth - 80 - 15) / 14 > 26) ? (containerWidth - 26 * 14 - 80 - 15)
                / 4 : (((containerWidth - 80 - 15) / 14 < 14) ? (containerWidth - 12 * 14 - 80 - 15)
                / 4 : (containerWidth - ((containerWidth - 80 - 15) / 14 - 2) * 14) / 4);
                itemW = containerWidth - paddingLR * 2;
                itemH = (containerHeight - 3) / 4 - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = (titDesH - 60) / 2;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item2'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
            }
            else {// b型 左右2*2
                paddingTB = ((containerHeight - 1) / 2 - 60) / 4;
                paddingLR = (((containerWidth - 1) / 2 - 80 - 15) / 14 > 26) ? ((containerWidth - 1)
                / 2 - 26 * 14 - 80 - 15) / 4 : (((containerWidth - 1) / 2 - 80 - 15) / 14 < 14
                ? ((containerWidth - 1) / 2 - 12 * 14 - 80 - 15) / 4
                : ((containerWidth - 1) / 2 - (((containerWidth - 1) / 2 - 80 - 15) / 14
                - 2) * 14) / 4);
                itemW = (containerWidth - 2) / 2 - paddingLR * 2;
                itemH = (containerHeight - 1) / 2 - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = (itemH - 60) / 2;
                style['.item0'] = {
                    'border-right': '1px solid ' + cBorder,
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item2'] = {
                    'border-right': '1px solid ' + cBorder
                };
            }
        }
        else if (adsLen === 6) {
            if ((containerHeight / 2) / (containerWidth / 3) > 0.67) {// a型 左右3*2
                paddingTB = (containerHeight - 2) / 2 / 11;// ontainerHeight / 11 / 2
                paddingLR = (containerWidth - 3) / 3 / 15;
                itemW = paddingLR * 13;
                itemH = paddingTB * 9;
                titDesW = itemW;
                titDesH = itemH - 80;
                titH = titDesH / 2;
                titW = titDesW;
                titLineH = titH / 2;
                titFontSW = (titW / 7) > 26 ? 26 : ((titW / 7) < 12 ? 12 : (titW / 7));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH;
                desW = titW;
                desLineH = desH / 3;
                desFontSW = (desW / 11) > 26 ? 26 : ((desW / 11) < 12 ? 12 : (desW / 11));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDH = 80;
                imgDW = titDesW;
                imgMarT = 10;
                style['.item0'] = {
                    'border-bottom': '1px solid ' + cBorder,
                    'border-right': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-bottom': '1px solid ' + cBorder,
                    'border-right': '1px solid ' + cBorder
                };
                style['.item2'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item3'] = {
                    'border-right': '1px solid ' + cBorder
                };
                style['.item4'] = {
                    'border-right': '1px solid ' + cBorder
                };
            }
            else {// b型
                paddingTB = ((containerHeight - 1) / 2 - 80) / 4;
                paddingLR = (((containerWidth - 2) / 3 - 80 - 15) / 14 > 26) ? ((containerWidth - 2)
                / 3 - 26 * 14 - 80 - 15) / 4 : (((containerWidth - 2) / 3 - 80 - 15) / 14 < 14)
                ? ((containerWidth - 2) / 3 - 12 * 14 - 80 - 15) / 4
                : ((containerWidth - 2) / 3 - (((containerWidth - 2) / 3 - 80 - 15)
                / 14 - 1) * 14) / 4;
                paddingLR = paddingLR > 0 ? paddingLR : 0;
                itemW = (containerWidth - 2) / 3 - paddingLR * 2;
                itemH = (containerHeight - 1) / 2 - paddingTB * 2;
                titDesW = itemW - 80;
                titDesH = itemH;
                titH = titDesH / 3;
                titW = titDesW;
                titLineH = titH;
                titFontSW = (titW / 14) > 26 ? 26 : ((titW / 14) < 12 ? 12 : (titW / 14));
                titFontSH = (titLineH - 2) > 26 ? 26 : ((titLineH - 2) < 12 ? 12 : (titLineH - 2));
                titFontS = Math.min(titFontSH, titFontSW);
                desH = titH * 2;
                desW = titW;
                desLineH = desH / 2;
                desFontSW = (desW / 20) > 26 ? 26 : ((desW / 20) < 12 ? 12 : (desW / 20));
                desFontSH = (desLineH - 2) > 26 ? 26 : ((desLineH - 2) < 12 ? 12 : (desLineH - 2));
                desFontS = Math.min(desFontSH, desFontSW);
                imgDW = 80;
                imgDH = titDesH;
                imgMarL = 10;
                imgMarT = 10;
                style['.item0'] = {
                    'border-right': '1px solid ' + cBorder,
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item1'] = {
                    'border-right': '1px solid ' + cBorder,
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item2'] = {
                    'border-bottom': '1px solid ' + cBorder
                };
                style['.item3'] = {
                    'border-right': '1px solid ' + cBorder
                };
                style['.item4'] = {
                    'border-right': '1px solid ' + cBorder
                };
            }
        }

        style['.item'] = {
            'padding': paddingTB + 'px ' + paddingLR + 'px',
            'height': itemH + 'px',
            'width': itemW + 'px',
            'float': 'left'
        };
        style['.item a'] = {
            'text-decoration': 'none'
        };
        style['.item img'] = {
            border: 'none',
            width: '60px',
            height: '60px',
            margin: imgMarT + 'px ' + imgMarL + 'px'
        };
        style['.titdes'] = {
            'width': titDesW + 'px',
            'height': titDesH + 'px',
            'float': 'left',
            'margin-right': titDesMr + 'px'
        };
        style['.tit'] = {
            'height': titH + 'px',
            'width': titW + 'px',
            'line-height': titLineH + 'px',
            'font-size': titFontS + 'px',
            'color': cTitle,
            'text-align': 'center',
            'overflow': 'hidden',
            'margin-bottom': titMb + 'px'
        };
        style['.des'] = {
            'height': desH + 'px',
            'width': desW + 'px',
            'line-height': desLineH + 'px',
            'font-size': desFontS + 'px',
            'color': cDesc,
            'overflow': 'hidden'
        };
        style['.imaged'] = {
            'height': imgDH + 'px',
            'width': imgDW + 'px',
            'text-align': 'center',
            'float': 'left'
        };

        // add logo
        var logo = this.logo.getLogo(fullConfig);
        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }
        // add adIcon
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
