/* global oojs */
/**
* @file tuwen_sdk
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_2',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
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
        titleFontFamily: 'Microsoft YaHei,SimHei,arial,sans-serif;',
        containerBackgroundColor: 'fff',
        titleFontColor: '000',
        descFontColor: '5e5e5e',
        containerBorderColor: 'ccc',
        containerBorderWidth: 0
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

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        // 上部图片
        var topSubItem = engine.getLayout(fullConfig);
        topSubItem.class = 'topSubItem';

        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logoImg.class = 'logoImg';
        topSubItem.childNodes.push(logoImg);

        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        titleText.class = 'title';
         // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.class = 'desc';
        topSubItem.childNodes.push(titleText);
        topSubItem.childNodes.push(descText);
        item.childNodes.push(topSubItem);

        // 分割线
        var hrline = engine.getLayout(fullConfig);
        hrline.class = 'hrline';
        item.childNodes.push(hrline);
        // 下面内容
        var bottomSubItem = engine.getLayout(fullConfig);
        bottomSubItem.class = 'bottomSubItem';

        // 内容
        var staticText = engine.getLayout(fullConfig);
        staticText.class = 'staticText';
        bottomSubItem.childNodes.push(staticText);
        // 应用介绍
        var appinfo = engine.getLayout(fullConfig);
        appinfo.class = 'appinfo';
        bottomSubItem.childNodes.push(appinfo);

        // 图片
        var bottomImg = engine.getLayout(fullConfig);
        bottomImg.tagName = 'img';
        bottomImg.class = 'bottomImg';
        bottomSubItem.childNodes.push(bottomImg);

        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'img';
        btn.class = 'btn';
        bottomSubItem.childNodes.push(btn);
        item.childNodes.push(bottomSubItem);

        // 填充广告数据
        var sdkInfo = {};
        if (ad.extention) {
            try {
                var sdkInfo = JSON.parse(ad.extention);
            } catch (e) {}
        }
        logoImg.src = ad.customizedContent.image[0] || '';
        titleText.innerHTML = sdkInfo.appinfo.name || '';

        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var itemPadding = 20;
        var itemWidth = containerWidth - 2 * itemPadding;
        var sourceTitle = String(sdkInfo.appinfo.name);
        var desCount = parseInt(itemWidth * 0.7 / (containerWidth / 20), 10) * 2;
        if (sourceTitle.replace(/([^\x00-\xff])/g, 'ci').length / 2 > desCount) {
            titleText.innerHTML = sourceTitle.replace(/([^\x00-\xff])/g, '\x241 ')
            .substr(0, desCount * 2 - 6)
            .replace(/[^\x00-\xff]$/, '')
            .replace(/([^\x00-\xff]) /g, '\x241') + '…';
        }
        var descTxt = sdkInfo.appinfo.appDesc || '';
        descText.innerHTML = descTxt || '';
        staticText.innerHTML = '应用介绍';

        var source = String(sdkInfo.appinfo.appIntro);
        var desIntro = parseInt(itemWidth / 14, 10) * 2;
        if (source.replace(/([^\x00-\xff])/g, 'ci').length / 2 > desIntro) {
            source = source.replace(/([^\x00-\xff])/g, '\x241 ')
            .substr(0, desIntro * 2 - 4)
            .replace(/[^\x00-\xff]$/, '')
            .replace(/([^\x00-\xff]) /g, '\x241') + '…';
        }
        appinfo.innerHTML = source || '';
        bottomImg.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        btn.src = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/image_sdk_2_dl.jpg';
        item.childNodes.push(a);
        items.push(item);

        // 广告关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);

        // 二次确认
        var secondCheck = engine.getLayout(fullConfig);
        secondCheck.id = 'secondCheck';
        secondCheck.class = 'second-check hide';
        var secondCheckButton = engine.getLayout(fullConfig);
        secondCheckButton.tagName = 'p';

        secondCheckButton.class = 'button';
        secondCheckButton.id = 'secondCheckButton';
        var secondCheckInfo = engine.getLayout(fullConfig);
        secondCheckInfo.tagName = 'span';
        secondCheckInfo.innerHTML = '\u786e\u8ba4\u6253\u5f00';// 确认打开
        secondCheckButton.childNodes.push(secondCheckInfo);
        secondCheck.childNodes.push(secondCheckButton);
        item.childNodes.push(secondCheck);
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo) + ';var adWidth=' + fullConfig.templateWidth + ';var adHeight=' + fullConfig.templateHeight;
        items.push(qiushiInfo);

        // 添加logo
        var logoX = this.logo.getLogo({logoType: 'bd-logo4'});
        logoX.id = 'bd-logo4';
        if (fullConfig.logoIsShow) {
            items.push(logoX);
        }
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     width: '16px',
        //     height: '16px',
        //     position: 'absolute',
        //     bottom: '0px',
        //     left: '0px'
        // };
        // 添加样式部分


        var pt = containerWidth / 320;

        style['.container'] = containerStyle;
        style['.container']['background-image'] = 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/image_sdk_2_bg.jpg)';
        style['.container']['background-repeat'] = 'no-repeat';
        style['.container']['background-size'] = 'contain';
        var ItemBackground = fullConfig['containerBackgroundColor'];

        style['.item'] = {
            width: itemWidth + 'px',
            height: '100%',
            position: 'relative',
            padding: '0 ' + itemPadding + 'px'
        };
        // 移动广告全区域可点击
        style['.item a'] = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            overflow: 'hidden'
        };

        // 顶部
        var topSubItemHeight = 190 * pt;
        style['.item .topSubItem'] = {
            width: '70%',
            height: topSubItemHeight + 'px',
            padding: ' 0 15%'
        };
        var logoImgWidth = 60 * pt;
        var logoMarginLeft = (itemWidth * 0.7 - logoImgWidth) / 2;
        style['.logoImg'] = {
            'width': logoImgWidth + 'px',
            'height': logoImgWidth + 'px',
            'border-radius': '10px',
            'margin-top': 40 * pt + 'px',
            'margin-left': logoMarginLeft + 'px',
            'margin-bottom': '10px'
        };

         // 文本折行
        var textWidth = itemWidth * 0.7;
        style['.item span'] = {
            'word-wrap': 'break-word'
        };

        var titleFontSize =  18 * pt;
        var titleFontFamily = fullConfig.titleFontFamily;
        var titleFontColor = fullConfig.titleFontColor;
        var titleLineHeight = 20 * pt;
        var tilteCount =  Math.min(Math.ceil(sdkInfo.appinfo.name.replace(/([^\x00-\xff])/g, '\x241 ').length * titleFontSize / (2 * textWidth)), 2);
        var titleHeight = titleLineHeight * tilteCount;
        style[' .title'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + titleLineHeight + 'px ' + titleFontFamily,
            color: '#' + titleFontColor,
            display: 'block',
            height: titleHeight + 'px',
            width: textWidth + 'px',
            overflow: 'hidden'
        };

        var descMarginTop = 6 * pt;
        var descFontSize = 16 * pt;
        var descFontFamily = fullConfig.titleFontFamily;
        var descFontColor = fullConfig.descFontColor;
        var descLineHeight = 18 * pt;
        var descHeight = tilteCount === 2 ? descLineHeight : descLineHeight * 2;
        descHeight = Math.floor(descHeight / descLineHeight) * descLineHeight;
        style['.item .desc'] = {
            'font': 'normal ' + descFontSize + 'px/' + descLineHeight + 'px ' + descFontFamily,
            'color': '#' + descFontColor,
            'height': descHeight + 'px',
            'margin': descMarginTop + 'px 0 0 0',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis'
        };

        // 分隔线
        style['.hrline'] = {
            height: '1px',
            width: '100%',
            background: '#ccc'
        };

        // 应用介绍
        var staticTextFontSize = 20;
        var staticTextHeight = 25;
        style['.staticText'] = {
            font: 'normal ' + staticTextFontSize + 'px/' + staticTextHeight + 'px ' + descFontFamily,
            color: '#5e5e5e',
            height: staticTextHeight + 'px',
            margin: '10px 0 0 0'
        };
        var appInfoFontSize = 14;
        var staticTextHeight = 40;
        var staticTextLineHeight = 20;
        style['.appinfo'] = {
            font: 'normal ' + appInfoFontSize + 'px/' + staticTextLineHeight + 'px ' + descFontFamily,
            color: '#828282',
            height: staticTextHeight + 'px',
            margin: '5px 0 0 0'
        };

        // 图片
        var bottomImgHeight = itemWidth / 2;
        style['.bottomImg'] = {
            'width': '100%',
            'height': bottomImgHeight + 'px',
            'border-radius': '0',
            'margin-top': '5px'
        };

        // 图片
        var downloadBtnHeight = 28 * pt;
        style['.item .btn'] = {
            'width': itemWidth + 'px',
            'height': downloadBtnHeight + 'px',
            'border-radius': '0',
            'margin-top': '5px'
        };


        // 关闭按钮样式
        var closeBtnRadius = 20;
        var closeBtnDivRadius = 50;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnDivRadius,
            'height': closeBtnDivRadius,
            'text-align': 'center',
            'color': '#fff'
        };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '5px',
            'right': '5px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };

        var clobp = userConfig['clobp'] || 'top_right';
        var clobpArray = clobp.split('_');
        if (clobpArray[0] === 'top') {
            style['div#closeBtn'].top = Math.ceil(0 * pt) + 'px';
        } else {
            style['div#closeBtn'].bottom = Math.ceil(3 * pt) + 'px';
        }
        if (clobpArray[1] === 'left') {
            style['div#closeBtn'].left = Math.ceil(3 * pt) + 'px';
        } else {
            style['div#closeBtn'].right = Math.ceil(0 * pt) + 'px';
        }

         // 二次确认
        style['.second-check'] = {
            'background': 'rgba(0,0,0,0.8);',
            'color': '#fff',
            'height': containerHeight,
            'width': containerWidth,
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': 999
        };
        style['.second-check.hide'] = {
            display: 'none'
        };
        style['.second-check.show'] = {
            display: 'block'
        };
        var secondCheckFontSize = Math.ceil(17 * containerWidth / 320);

        style['.second-check .button'] = {
            'display': 'inline-block',
            'height': 1.85 * secondCheckFontSize,
            'line-height': 1.85 * secondCheckFontSize,
            'background': '-webkit-gradient(linear,left top,left bottom,color-stop(0%,#faa400),color-stop(100%,#ff7500))',
            'vertical-align': 'middle',
            '-webkit-border-radius': .2 + 'em',
            'position': 'absolute',
            'right': '0',
            'top': '50%',
            'padding': '0 .647em 0 3.089em',
            'font-size': secondCheckFontSize + 'px',
            'border': 0,
            'word-break': 'break-all',
            'overflow': 'hidden',
            '-webkit-transition': 'right .5s ease-in-out',
            'transition': 'right .5s ease-in-out',
            'margin': 0
        };
        style['.second-check .button::before'] = {
            'content': '\'\'',
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/download_icon.png) no-repeat',
            'width': 1.265 * secondCheckFontSize,
            'height': 1.265 * secondCheckFontSize,
            'position': 'absolute',
            'top': .324 + 'em',
            'left': .588 + 'em',
            '-moz-background-size': 'cover',
            '-webkit-background-size': 'cover',
            '-o-background-size': 'cover',
            '-ms-background-size': 'cover',
            'background-size': 'cover'
        };
        style['.second-check .button::after'] = {
            'content': '\'\'',
            'width': .058 * secondCheckFontSize,
            'min-width': '1px',
            'height': 1.165 * secondCheckFontSize,
            'position': 'absolute',
            'left': 2.5 + 'em',
            'top': .374 + 'em',
            'background': '#FFF',
            'opacity': '.5'
        };
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
