/* global oojs */
/**
* @file tuwen_wap_mobilebd
* @author qianxiaoli
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_wap_mobilebd',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        bannerImgUrl: 'rs.common.model.bannerImgUrl',
        logo: 'rs.business.logo'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        cbackground: 'fff'
    },
    //  秋实Sdk所需信息
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
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        var ad = ads[0];
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;

        /*var item = engine.getLayout(fullConfig);
        item.class = 'item';
        items.push(item);*/


        // 获取链接的下载类型
        var i = 0;
        var act = ad.actionType || 1;

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item_' + i;
        // 广告索引，必须加
        a['data-adindex'] = i;
        // 广告推广类型
        a['data-adtype'] = act;

        var ext = JSON.parse(ad.extention);
        var tu = (ext && ext.tu) ? ext.tu : 0;
        a['data-tu'] = tu;

        var divA = engine.getLayout(fullConfig);
        divA.tagName = 'div';
        divA.id = 'divA_' + i;
        divA.class = 'divA';

        // 添加标签
        /* var divTag = engine.getLayout(fullConfig);
        divTag.tagName = 'div';
        divTag.id = 'divTag_' + i;
        divTag.class = 'divTag'; */

        // tuwen_icon
        var divImg = engine.getLayout(fullConfig);
        divImg.tagName = 'div';
        divImg.id = 'divImg_' + i;
        divImg.class = 'divImg';

        var divImgCon = engine.getLayout(fullConfig);
        divImgCon.tagName = 'div';
        divImgCon.id = 'divImgCon_' + i;
        divImgCon.class = 'divImgCon';

        var tuwenLogo = engine.getLayout(fullConfig);
        tuwenLogo.tagName = 'img';
        tuwenLogo.id = 'tuwen_logo_img_' + i;
        tuwenLogo.class = 'tuwen_logo';

        // divRight
        var divRight = engine.getLayout(fullConfig);
        divRight.tagName = 'div';
        divRight.id = 'divRight_' + i;
        divRight.class = 'divRight';

        // 广告desc
        var divDesc = engine.getLayout(fullConfig);
        divDesc.tagName = 'div';
        divDesc.id = 'desc_' + i;
        divDesc.class = 'divDesc';

        // 广告Icon
        var divAdIcon = engine.getLayout(fullConfig);
        divAdIcon.tagName = 'div';
        divAdIcon.id = 'divAdIcon_' + i;
        divAdIcon.class = 'divAdIcon';

        // 填充广告数据
        divRight.childNodes.push(divDesc);
        divRight.childNodes.push(divAdIcon);
        // divA.childNodes.push(divTag);
        divImgCon.childNodes.push(tuwenLogo);
        divImg.childNodes.push(divImgCon);
        divA.childNodes.push(divImg);
        divA.childNodes.push(divRight);
        items.push(a);
        items.push(divA);
        // 填充图片链接
        tuwenLogo.src = ads[i].stuffSrc;
        a.title = ads[i].showUrl || '';
        a.href = ads[i].clickUrl;
        // 文本数据
        // div.innerHTML = ads[i].title;
        // divTag.innerHTML = '智能推荐';
        divAdIcon.innerHTML = '广告';
        divDesc.innerHTML = ads[i].desc[0];


        // 添加样式部分
        var style = {};

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width - 40; // 2 * 3 + 17 * 2
        var containerHeight = containerStyle.height - 26;// 2* 13
        var cbackground = userConfig.cbackground || 'fff';

        var adImgW = containerWidth / 3;
        var adImgH = containerHeight - 29;// 13+16
        var tagFS = 16;// containerHeight / 8 * 1.125;
        var desFS = 18;// tagFS * 1.06;
        var divAMTB = 13;// (adImgH - tagFS) / 3 - 2;
        var divAMLR = 17; // tagFS * 1.06;
        var divAH = containerHeight;
        var divAW = containerWidth;

        var divRightW = containerWidth - adImgW - 14;
        var divRightH = containerHeight - tagFS;
        var descH = 52;// 78/3*2
        var desLH = descH / 2;
        var adIconMT = 10;
        var iconFS = 13;

        if (containerStyle.width < 360) {
            iconFS = iconFS  * 0.9;
            desFS *= 0.9;
            descH = descH / 2 * 0.9;
            desLH = descH;
            adIconMT *= 0.9;
        }

        // 按比例计算图片的尺寸
        /*var tuwenLogoHeight = 90;
        var tuwenLogoWidth = 90;
        if (tuwenLogoHeight > adImgW / 3 * 2) {
            tuwenLogoHeight = adImgW / 3 * 2;
            tuwenLogoWidth = tuwenLogoHeight;
        }*/

        var tuwenLogoHeight = adImgW / 3 * 2;
        var tuwenLogoWidth = adImgW;
        if (ad.width === 90 && ad.height === 90) {
            tuwenLogoHeight = 90;
            tuwenLogoWidth = 90;
            if (tuwenLogoHeight > adImgW / 3 * 2) {
                tuwenLogoHeight = adImgW / 3 * 2;
                tuwenLogoWidth = tuwenLogoHeight;
            }
        }
        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            background: cbackground,
            padding: divAMTB + 'px ' + divAMLR + 'px'
        };
        style['.container'] = containerStyle;
        style['#item_' + i] = {
            'position': 'absolute',
            'width': containerStyle.width + 'px',
            'height': containerStyle.height + 'px',
            'top': 0,
            'left': 0
        };

        style['.divA'] = {
            // 'margin': divAMTB + 'px ' + divAMLR + 'px',
            'overflow': 'hidden',
            'height': divAH + 'px',
            'width': divAW + 'px',
            'font-family': '微软雅黑'
        };
        /*style['.divTag'] = {
            'font-size': tagFS + 'px',
            'line-height': tagFS + 'px',
            'margin-bottom': divAMTB + 'px',
            'color': '#999'
        };*/
        style['.divImg'] = {
            'width': adImgW + 'px',
            'height': adImgH + 'px',
            'float': 'left',
            'text-align': 'center',
            'vertical-align': 'middle'
        };
        var imgMT = (adImgH - adImgW / 3 * 2) / 2 + 'px';
        style['.divImgCon'] = {
            'width': adImgW + 'px',
            'height': adImgW / 3 * 2 + 'px',
            // 'margin-top': imgMT,
            'background-color': '#f7f7f7',
            'text-align': 'center',
            'vertical-align': 'middle'
        };
        style['.tuwen_logo'] = {
            'width': tuwenLogoWidth + 'px',
            'height': tuwenLogoHeight + 'px',
            'margin-top': (adImgW / 3 * 2 - tuwenLogoHeight) / 2 + 'px'
        };
        style['.divRight'] = {
            'width': divRightW + 'px',
            'height': divRightH + 'px',
            'margin-left': divAMTB + 'px',
            'float': 'left'
        };
        style['.divDesc'] = {
            // 'margin-top': imgMT,
            'font-size': desFS + 'px',
            'color': '#333',
            'height': descH + 'px',
            'overflow': 'hidden',
            'line-height': desLH + 'px'
        };
        style['.divAdIcon'] = {
            'font-size': iconFS + 'px',
            'line-height': iconFS + 'px',
            'margin-top': adIconMT + 'px', // 36/3-(78-54)/2/3
            'color': '#999'
        };

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ads[0].actionTypeInfo) {
            ads[0].actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        /*if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
            style['#container a.bd-logo4'] = {
                'width': '18px',
                'height': '18px',
                'background-size': 'contain'
            };
        }*/

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
