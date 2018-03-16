/* global oojs */

/**
* @file tuwen_sdk_banner_base_extended
* @author yuxinxiao
*/

/* eslint-disable */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_sdk_banner_base_extended',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
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
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000'
    },
    // 秋实Sdk所需信息
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
    getIcon: function (actionType) {
        var result;
        switch (actionType) {
            case 2: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-download.png'; break;
            case 8: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-sms.png'; break;
            case 32: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-phone.png'; break;
            case 1: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png'; break;
            default: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png';
        }
        return result;
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        var act = ad.actionType || 1;
        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;
        // item 移动只出一条广告
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        items.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引， 必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        // 创建inTop
        var intop = engine.getLayout(fullConfig);
        intop.tagName = 'div';
        intop.class = 'intop';
        a.childNodes.push(intop);

        // 创建img
        var image = engine.getLayout(fullConfig);
        image.tagName = 'img';
        image.class = 'pic';
        image.src = ad.stuffSrc;
        intop.childNodes.push(image);

        // content
        var content= engine.getLayout(fullConfig);
        content.tagName = 'div';
        content.class = 'content';
        a.childNodes.push(content);

        var withImage = false;
        var withScale = false;
        if (act === 2) {
            // imageLabeler
            withImage = true;
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.class = 'imgLabeler';
            img.src = ad.customizedContent.image[0] || '';
            content.childNodes.push(img);
        }
        // textWrap
        var textWrap = engine.getLayout(fullConfig);
        textWrap.tagName = 'div';
        textWrap.class = 'text';
        content.childNodes.push(textWrap);

        // title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'p';
        title.id = 'title0';
        title.class = 'title'
        //title.innerHTML = ad.title;
        var ext = {};
        if (ad.extention) {
            ext = JSON.parse(ad.extention);
        }
        ext.appinfo = ext.appinfo || {};
        var apptitle = ext.appinfo.appIntro || '';
        var appdesc = ext.appinfo.appDesc || '';
        if (act === 2 ) {
            title.innerHTML = apptitle || '';
        } else{
            title.innerHTML = '\u66f4\u591a\u7cbe\u5f69\u5185\u5bb9\uff0c\u5c3d\u5728\u4e00\u6307\u4e4b\u95f4';
        };
        textWrap.childNodes.push(title);

        if (act === 2) {
            // decs
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = appdesc;
            textWrap.childNodes.push(desc);
        }
        // icon
        var icon = engine.getLayout(fullConfig);
        icon.tagName = 'div';
        icon.class = 'icon';
        a.childNodes.push(icon);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var styleConfig = context.requestInfo.styleConfig;
        var pt = containerHeight / 500;
        var defaultBorderW = 0;
        var borderWidth = defaultBorderW * 2 * pt;

        var itemWidth = containerWidth - borderWidth;
        var itemHeight = containerHeight - borderWidth;

        var itemPT = 11 * pt;
        var itemPL = 11 * pt;
        var imgPT = 16 * pt;
        var intopW = itemWidth - 2 * itemPL;
        var intopH = (intopW * 1) / 2;
        var imageWidth = intopW;
        var imageHeight = imageWidth * ad.height / ad.width;
        // 图片的高度
        if (imageHeight > intopH) {
            imageHeight = intopH;
            imageWidth  = imageHeight * ad.width / ad.height;
        };
        var imageTop = (intopH > imageHeight) ? (intopH - imageHeight) / 2 : 0;
        var imageLeft = (intopW > imageWidth) ? (intopW - imageWidth) / 2 : 0;
        var aspectRatio = ad.width / ad.height;
        var scale = 7 / 3;
        if (aspectRatio%scale == 0) {
             withScale = true;
             var imgLabelerTop = (containerHeight - intopH -imageTop - pt * 90) / 2;
        };
        var contentH = itemHeight - itemPT - intopH;
        var imgLabelerH = 90 * pt;
        var imgLabelerBR = 15 * pt;

        var titleMT = (contentH - imgLabelerH) / 2;
        var titleS = 30 * pt;
        var titleH =  withScale ? (46 * pt + titleMT / 2) : 46 * pt;
        var titleLH = withScale ? (46 * pt + titleMT / 2) : 46 * pt;

        var length = (apptitle && apptitle.length) ? apptitle.length : 1;
        var iconH = 70 * pt;
        var iconMTS = contentH - iconH - 14;
        var iconMT = (contentH - 70 * pt) / 2;
        iconMT = iconMT > 14 ? iconMT : iconMTS;
        var iconMR = 22 * pt;
        var desMT = 12 * pt;
        var desFS = 24 * pt;

        var theTitle = 2 * itemPL + iconMR + iconH;
        var titH = (titleS * length > itemWidth - 2 * itemPL - iconMR - iconH) ? titleH * 2 : titleH;
        var titleW = itemWidth - theTitle - imgLabelerH;

        var styleConfigObj = null;
        // 判断是否设置默认值
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        };

        var defaultBackgroundColor = '#01a0eb';
        var defualtTextColor = '#fff';
        var defualtTextFF = 'Microsoft YaHei';
        var defaultBorderColor = '#fff';
        var backgroundColor = defaultBackgroundColor;
        var titleColor = defualtTextColor;
        var borderColor = defaultBorderColor;
        var titleFontFamily = defualtTextFF;
        if (styleConfigObj && styleConfigObj.cbackground) {
            backgroundColor = styleConfigObj.cbackground.indexOf('#') > -1
                ? styleConfigObj.cbackground
                : ('#' + styleConfigObj.cbackground);
        }
        if (styleConfigObj && styleConfigObj.ctitle) {
            titleColor = styleConfigObj.ctitle.indexOf('#') > -1
                ? styleConfigObj.ctitle
                : ('#' + styleConfigObj.ctitle);
        }
        if (styleConfigObj && styleConfigObj.cborder) {
            borderColor = styleConfigObj.cborder.indexOf('#') > -1
                ? styleConfigObj.cborder
                : ('#' + styleConfigObj.cborder);
        }
        if (styleConfigObj && styleConfigObj.fontName) {
            titleFontFamily = styleConfigObj.fontName;
        }
        if (styleConfigObj && styleConfigObj.bborder) {
            borderWidth = styleConfigObj.bborder;
        }
        style['*'] = {
            padding: 0,
            margin: 0
        };

        style['.container'] = {
            'position': 'relative',
            'width': containerWidth - borderWidth + 'px',
            'height': containerHeight - borderWidth + 'px',
            'background': backgroundColor,
            'border-width': borderWidth + 'px',
            'border-style': 'solid',
            'border-color': borderColor,
            'margin': '0 auto'
        };
        // 如果没有自定义颜色
        // 添加渐变色背景颜色
        // 只能这么覆盖，不能使用style['.container']['background']
        if (backgroundColor === defaultBackgroundColor) {
            style['.container'] = {
                'position': 'relative',
                'width': containerWidth - borderWidth + 'px',
                'height': containerHeight - borderWidth + 'px',
                'border-width': borderWidth + 'px',
                'border-style': 'solid',
                'border-color': borderColor,
                'background': defaultBackgroundColor,
                'background': '-moz-linear-gradient(left,  #01a0eb 0%, #063994 100%, #2989d8 100%, #207cca 100%)',
                'background': '-webkit-linear-gradient(left,  #01a0eb 0%,#063994 100%,#2989d8 100%,#207cca 100%)',
                'background': 'linear-gradient(to right,  #01a0eb 0%,#063994 100%,#2989d8 100%,#207cca 100%)'
            };
        }
        style['.item'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'overflow': 'hidden'
        };
        style['.item a'] = {
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'box-sizing': 'border-box',
            'text-decoration': 'none',
            'overflow': 'hidden'
        };
        style['.intop'] = {
            'width': intopW + 'px',
            'height': intopH + 'px',
            'overflow': 'hidden',
            'padding-top': withScale ? 0: itemPL + 'px',
            'padding-left': itemPL + 'px'
        };
        style['.intop .pic'] = {
            'width': imageWidth + 'px',
            'height': imageHeight + 'px',
            'margin-top': imageTop + 'px',
            'margin-left': imageLeft + 'px',
            'overflow': 'hidden'
        };
        style['.content , .text'] = {
            float: 'left'
        };
         style['.content'] = {
            'padding-bottom': withScale ? imageTop : 0 + 'px',
            'margin-top': withScale ? 0 : titleMT + 'px'
        };

        if (act === 2) {
            style['.imgLabeler'] = {
                'width': imgLabelerH + 'px',
                'height': imgLabelerH + 'px',
                'margin-left': itemPL + 'px',
                'margin-top': withScale ? imgLabelerTop : 0 + 'px',
                'border-radius': parseInt(imgLabelerBR) + '%',
                'float': 'left'
            };
            style['.desc'] = {
                'width': titleW + 'px',
                'height': titleH + 'px',
                'overflow': 'hidden',
                'line-height': titleLH + 'px',
                'font-size': desFS + 'px',
                'font-family': 'Microsoft YaHei'
            };
        };

        style['.text'] = {
            'float': 'left',
            'color': '#fff',
            'margin-left': withImage ? itemPL : 2 * itemPL  + 'px'
        };
        style['.text p'] = {
            'color': '#fff'
        };
        style['p.title'] = {
            'width': withImage ? titleW : (itemWidth - theTitle) + 'px',
            'height': withImage ? titleH : titH + 'px',
            'overflow': 'hidden',
            'line-height': withImage ? titleH : titH + 'px',
            'font-size': titleS + 'px',
            'font-family' : titleFontFamily,
            'color': titleColor
        };

        style['.icon'] = {
            'float': 'right',
            'width': iconH + 'px',
            'height': iconH + 'px',
            'border-radius': '50%',
            'margin-top': iconMT + 'px',
            'margin-right': iconMR + 'px',
            'background-image': 'url(' + this.getIcon(parseInt(ad.actionType, 10)) + ')',
            'background-repeat': 'no-repeat',
            'background-size': '100% 100%'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
