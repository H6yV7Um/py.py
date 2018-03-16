/**
 * @file tuwen_image_text_fulllunbo_bc template layout
 * @author
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_image_text_fulllunbo_bc',
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
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },

    //  秋实Sdk所需信息
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
    //  下载按钮图片
    downloadIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_dl.png',
    //  普通按钮图片
    defaultIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_lp.png',
    drawTuWen: function (context, itemList, style, ad, adIndex) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        // 样式方案
        var adStyleA = {
            // 灰色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%);background: radial-gradient(circle at bottom right, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%)',
            txtCol: '#000',
            btnW: 95,
            btnBg: '#8dc153',
            btnCol: '#fff',
            btnIcon: false
        };
        var adStyleB = {
            // 灰色
            adBg: '#f8f8f8',
            txtCol: '#000',
            btnW: 95,
            btnBg: '#8dc153',
            btnCol: '#fff',
            btnIcon: false
        };
        var adStyleC = {
            // 蓝色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%);background: radial-gradient(circle at bottom right, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%)',
            txtCol: '#fff',
            btnW: 110,
            btnBg: '#fff',
            btnCol: '#000',
            btnIcon: true
        };
        var adStyleD = {
            // 红色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%);background: radial-gradient(circle at bottom right, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%)',
            txtCol: '#fff',
            btnW: 110,
            btnBg: '#fff',
            btnCol: '#000',
            btnIcon: true
        };
        var adBgStyle = {
            styleA: adStyleA,
            styleB: adStyleB,
            styleC: adStyleC,
            styleD: adStyleD
        };
        var downloadText = '\u7acb\u5373\u4e0b\u8f7d';// 立即下载
        var lpText = '\u5173\u6ce8\u8be6\u60c5';// 关注详情
        var telText = '\u62e8\u6253\u7535\u8bdd';// 拨打电话
        var smsText = '\u53d1\u9001\u77ed\u4fe1';// 发送短信
        var mapText = '\u663e\u793a\u5730\u56fe';// 显示地图
        var adStyle = adStyleA;
        var act = ad.actionType || 1;
        var actText = lpText;
        var bntIcon = '';
        var engine = this.basic;

        switch (act) {
            case 1: actText = lpText; bntIcon = this.defaultIcon; break;
            case 2: actText = downloadText; bntIcon = this.downloadIcon; break;
            case 4: actText = mapText; break;
            case 8: actText = smsText; break;
            case 32: actText = telText; break;
            default: actText = lpText; break;
        }

        if (ad.extention) {
            try {
                var sdkInfo = JSON.parse(ad.extention);
                if (sdkInfo['adbg_style'] && adBgStyle[sdkInfo['adbg_style']]) {
                    adStyle = adBgStyle[sdkInfo['adbg_style']];
                }
            } catch (e) {}
        }
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'liCon' + adIndex;
        liCon.id = 'liCon' + adIndex;

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item' + adIndex;
        // 广告索引，必须加
        a['data-adIndex'] = adIndex;
        // 广告推广类型
        a['data-adType'] = act;

        // 上半部分的内容区域
        var divUp = engine.getLayout(fullConfig);
        divUp.class = 'divUp' + adIndex;
        divUp.id = 'divUp' + adIndex;
        liCon.childNodes.push(divUp);

        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo' + adIndex;
        logo.class = 'logo';

        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        divUp.childNodes.push(logo);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        divUp.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        divUp.childNodes.push(desc);

        // 下部按钮区域
        var divDown = engine.getLayout(fullConfig);
        divDown.class = 'divDown' + adIndex;
        divDown.id = 'divDown' + adIndex;
        liCon.childNodes.push(divDown);
        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'btn';
        btn.id = 'btn' + adIndex;
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        var extention = JSON.parse(ad.extention);
        if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
            actText = '\u6253\u5f00\u624b\u767e\u67e5\u770b';
        }
        btnText.innerHTML = actText;
        // 按钮图标
        // var arrIcon = engine.getLayout(fullConfig);
        // arrIcon.tagName = 'img';
        // arrIcon.src = bntIcon;
        // if (adStyle.btnIcon && bntIcon) {
        //     btn.childNodes.push(arrIcon);
        // }
        btn.childNodes.push(btnText);
        divDown.childNodes.push(btn);

        // 填充广告数据
        logoImg.src = ad.stuffSrc;
        titleText.innerHTML = ad.title;
        descText.innerHTML = ad.desc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        liCon.childNodes.push(a);
        itemList.childNodes.push(liCon);

        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 相对尺寸
        var px = containerWidth / 320;
        var pt = px;
        var rem = containerWidth / 16;
        var vrem = containerHeight / 5;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        var itemBg = (userConfig['containerBackgroundColor'] === undefined || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
        var ItemBackground = itemBg === '' ? '#3399ff' : ('#' + itemBg);
        style['.itemList' + adIndex] = {
            background: '#fafafa'
        };
        style['.liCon' + adIndex] = {
            width: itemWidth,
            height: '100%',
            'position': 'relative',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_image_text_fulllunbo_bc.png) no-repeat',
            'background-size': '100% 100%'
        };
        // 移动广告全区域可点击
        style['.liCon' + adIndex + ' a'] = {
            'width': containerWidth,
            'height': containerHeight,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'text-decoration': 'none'
        };
        style['.liCon' + adIndex + ' a:hover'] = {};
        style['.liCon' + adIndex + ' div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };
        // 上部内容区域
        style['#divUp' + adIndex] = {
            'width': containerWidth,
            'height': 4 * vrem + 'px',
            'padding': 0.6 * vrem + 'px 0px',
            'box-sizing': 'border-box'
        };
        // logo单独一行
        var logoWidth = Math.round(3 * rem);
        style['.liCon' + adIndex + ' .logo'] = {
            'width': logoWidth,
            'height': logoWidth,
            'margin': '0px ' + 6.5 * rem + 'px',
            'text-align': 'center'
        };
        style['.liCon' + adIndex + ' .logo img'] = {
            'width': logoWidth,
            'height': logoWidth,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px 2px #777'
        };

        // 文本折行
        var textWidth = itemWidth - itemPadding * 2;
        style['.liCon' + adIndex + ' span'] = {
            'word-wrap': 'break-word'
        };
        style['.liCon' + adIndex + ' .title'] = {
            'width': textWidth - 1.5 * itemPadding,
            'height': Math.round(32 * pt) * 2,
            // 'margin': '0 ' + itemPadding + 'px',
            'margin': itemPadding + 'px ' + 1.5 * itemPadding + 'px',
            'text-align': 'center'
        };
        var titleFontSize = userConfig.titleFontSize || Math.round(22 * pt);
        var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
        var titleFontColor = userConfig.titleFontColor || 'ffffff'; // adStyle.txtCol;
        style['.liCon' + adIndex + ' .title span'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * pt) + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        var descTopSpace = Math.round(14 * px);
        style['.liCon' + adIndex + ' .desc'] = {
            'width': textWidth,
            'height': Math.round(26 * pt) * 2,
            'margin': itemPadding + 'px',
            'text-align': 'center'
        };
        var descFontSize = userConfig.descFontSize || Math.round(14 * pt);
        var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
        var descFontColor = userConfig.descFontColor || adStyle.txtCol;
        style['.liCon' + adIndex + ' .desc span'] = {
            font: 'normal ' + descFontSize + 'px/' + Math.round(24 * pt) + 'px ' + descFontFamily,
            color: descFontColor
        };

        // 下部按钮区域
        style['#divDown' + adIndex] = {
            'width': containerWidth,
            'height': 3.2 * vrem + 'px',
            'padding': 1.1 * vrem + 'px 0px',
            'background': '#fafafa',
            'box-sizing': 'border-box'
        };
        var btnWidth = Math.round(13 * rem);// Math.round(adStyle.btnW * px);
        var btnHeight = Math.round(1.1 * vrem);
        style['#btn' + adIndex] = {
            'text-align': 'center',
            'margin': '0px ' + 1.5 * rem + 'px',
            'width': btnWidth,
            'height': btnHeight,
            'line-height': btnHeight - 5,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px 5px ' + ItemBackground,
            'background': ItemBackground
        };
        style['.liCon' + adIndex + ' .btn img'] = {
            'vertical-align': 'middle',
            'height': btnHeight
        };
        style['.liCon' + adIndex + ' .btn span'] = {
            'font': 'normal ' + Math.round(14 * pt) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'line-height': btnHeight,
            'color': '#ffffff' // adStyle.btnCol
        };
        return {itemList: itemList, style: style};
    },
    drawText: function (context, itemList, style, ad, adIndex) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        // 样式方案
        var adStyleA = {
            // 灰色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%);background: radial-gradient(circle at bottom right, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%)',
            txtCol: '#000',
            btnW: 95,
            btnBg: '#8dc153',
            btnCol: '#fff',
            btnIcon: false
        };
        var adStyleB = {
            // 灰色
            adBg: '#f8f8f8',
            txtCol: '#000',
            btnW: 95,
            btnBg: '#8dc153',
            btnCol: '#fff',
            btnIcon: false
        };
        var adStyleC = {
            // 蓝色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%);background: radial-gradient(circle at bottom right, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%)',
            txtCol: '#fff',
            btnW: 110,
            btnBg: '#fff',
            btnCol: '#000',
            btnIcon: true
        };
        var adStyleD = {
            // 红色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%);background: radial-gradient(circle at bottom right, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%)',
            txtCol: '#fff',
            btnW: 110,
            btnBg: '#fff',
            btnCol: '#000',
            btnIcon: true
        };
        var adBgStyle = {
            styleA: adStyleA,
            styleB: adStyleB,
            styleC: adStyleC,
            styleD: adStyleD
        };
        var downloadText = '\u7acb\u5373\u4e0b\u8f7d';// 立即下载
        var lpText = '\u5173\u6ce8\u8be6\u60c5';// 关注详情
        var telText = '\u62e8\u6253\u7535\u8bdd';// 拨打电话
        var smsText = '\u53d1\u9001\u77ed\u4fe1';// 发送短信
        var mapText = '\u663e\u793a\u5730\u56fe';// 显示地图
        var adStyle = adStyleA;
        var act = ad.actionType || 1;
        var actText = lpText;
        var bntIcon = '';
        var engine = this.basic;

        switch (act) {
            case 1: actText = lpText; bntIcon = this.defaultIcon; break;
            case 2: actText = downloadText; bntIcon = this.downloadIcon; break;
            case 4: actText = mapText; break;
            case 8: actText = smsText; break;
            case 32: actText = telText; break;
            default: actText = lpText; break;
        }

        if (ad.extention) {
            try {
                var sdkInfo = JSON.parse(ad.extention);
                if (sdkInfo['adbg_style'] && adBgStyle[sdkInfo['adbg_style']]) {
                    adStyle = adBgStyle[sdkInfo['adbg_style']];
                }
            } catch (e) {}
        }
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'liCon' + adIndex;
        liCon.id = 'liCon' + adIndex;

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item' + adIndex;
        // 广告索引，必须加
        a['data-adIndex'] = adIndex;
        // 广告推广类型
        a['data-adType'] = act;

        // 上半部分的内容区域
        var divUp = engine.getLayout(fullConfig);
        divUp.class = 'divUp' + adIndex;
        divUp.id = 'divUp' + adIndex;
        liCon.childNodes.push(divUp);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        divUp.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        divUp.childNodes.push(desc);

        // 下部按钮区域
        var divDown = engine.getLayout(fullConfig);
        divDown.class = 'divDown' + adIndex;
        divDown.id = 'divDown' + adIndex;
        liCon.childNodes.push(divDown);
        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'btn';
        btn.id = 'btn' + adIndex;
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        var extention = JSON.parse(ad.extention);
        if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
            actText = '\u6253\u5f00\u624b\u767e\u67e5\u770b';
        }
        btnText.innerHTML = actText;
        // 按钮图标
        // var arrIcon = engine.getLayout(fullConfig);
        // arrIcon.tagName = 'img';
        // arrIcon.src = bntIcon;
        // if (adStyle.btnIcon && bntIcon) {
        //     btn.childNodes.push(arrIcon);
        // }
        btn.childNodes.push(btnText);
        divDown.childNodes.push(btn);

        // 填充广告数据
        titleText.innerHTML = ad.title;
        descText.innerHTML = ad.desc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        liCon.childNodes.push(a);
        itemList.childNodes.push(liCon);

        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 相对尺寸
        var px = containerWidth / 320;
        var pt = px;
        var rem = containerWidth / 16;
        var vrem = containerHeight / 16;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        var itemBg = (userConfig['containerBackgroundColor'] === undefined || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
        var ItemBackground = itemBg === '' ? '#3399ff' : ('#' + itemBg);
        style['.itemList' + adIndex] = {
            background: '#fafafa'
        };
        style['.liCon' + adIndex] = {
            width: itemWidth,
            height: '100%',
            'position': 'relative',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_image_text_fulllunbo_bc.png) no-repeat',
            'background-size': '100% 100%'
        };
        // 移动广告全区域可点击
        style['.liCon' + adIndex + ' a'] = {
            'width': containerWidth,
            'height': containerHeight,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'text-decoration': 'none'
        };
        style['.liCon' + adIndex + ' a:hover'] = {};
        style['.liCon' + adIndex + ' div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };
        // 上部内容区域
        style['#divUp' + adIndex] = {
            'width': containerWidth,
            'height': 12.8 * vrem + 'px',
            'padding': 0.9 * vrem + 'px 0px',
            'box-sizing': 'border-box'
        };

        // 文本折行
        var textWidth = itemWidth - itemPadding * 2;
        style['.liCon' + adIndex + ' span'] = {
            'word-wrap': 'break-word'
        };
        style['.liCon' + adIndex + ' .title'] = {
            'width': 10 * rem + 'px',
            'height': 2 * vrem + 'px',
            'margin': 1 * vrem + 1.5 * rem + 'px ' + 3 * rem + 'px',
            'text-align': 'center'
        };
        var titleFontSize = userConfig.titleFontSize || 0.7 * vrem;
        var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
        var titleFontColor = userConfig.titleFontColor || 'ffffff'; // adStyle.txtCol;
        style['.liCon' + adIndex + ' .title span'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + 1 * vrem + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        var descTopSpace = Math.round(14 * px);
        style['.liCon' + adIndex + ' .desc'] = {
            'width': 14 * rem + 'px',
            'height': 1.2 * vrem + 'px',
            'margin': 1 * vrem +'px ' + 1 * rem + 'px',
            'text-align': 'center'
        };
        var descFontSize = userConfig.descFontSize || 0.45 * vrem;
        var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
        var descFontColor = userConfig.descFontColor || adStyle.txtCol;
        style['.liCon' + adIndex + ' .desc span'] = {
            font: 'normal ' + descFontSize + 'px/' + 0.5 * vrem + 'px ' + descFontFamily,
            color: descFontColor
        };

        // 下部按钮区域
        style['#divDown' + adIndex] = {
            'width': containerWidth,
            'height': 3.2 * vrem + 'px',
            'padding': 1.1 * vrem + 'px 0px',
            'background': '#fafafa',
            'box-sizing': 'border-box'
        };

        var btnWidth = Math.round(13 * rem);// Math.round(adStyle.btnW * px);
        var btnHeight = Math.round(1.1 * vrem);
        style['#btn' + adIndex] = {
            'text-align': 'center',
            'margin': '0px ' + 1.5 * rem + 'px',
            'width': btnWidth,
            'height': btnHeight,
            'line-height': btnHeight - 5,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px 5px ' + ItemBackground,
            'background': ItemBackground
        };
        style['.liCon' + adIndex + ' .btn img'] = {
            'vertical-align': 'middle',
            'height': btnHeight
        };
        style['.liCon' + adIndex + ' .btn span'] = {
            'font': 'normal ' + Math.round(0.45 * vrem) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'line-height': btnHeight,
            'color': '#ffffff' // adStyle.btnCol
        };
        return {itemList: itemList, style: style};
    },
    drawImage: function (context, itemList, style, ad, adIndex) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;

        var act = ad.actionType || 1;
        var engine = this.basic;
        // 广告点击区域——item可点
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'liCon' + adIndex;
        liCon.id = 'liCon' + adIndex;

        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item' + adIndex;

        // 背景模糊的蒙板
        var imgBg = engine.getLayout(fullConfig);
        imgBg.tagName = 'div';
        imgBg.class = 'imgBg';
        imgBg.id = 'imgBg' + adIndex;
        liCon.childNodes.push(imgBg);

        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.class = 'imgAD' + adIndex;
        img.id = 'imgAD' + adIndex;
        liCon.childNodes.push(img);

        // btn下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.class = 'btn';
        btn.id = 'btn' + adIndex;
        var actText = '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';
        var extention = JSON.parse(ad.extention);
        if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
            actText = '\u6253\u5f00\u624b\u767e\u67e5\u770b';
        }
        btn.innerHTML = actText;
        liCon.childNodes.push(btn);

        // 广告索引，必须加
        a['data-adIndex'] = adIndex;
        // 广告推广类型
        a['data-adType'] = act;



        // 填充广告数据
        img.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        liCon.childNodes.push(a);
        itemList.childNodes.push(liCon);

        // if (act === 2) {
        //     // 下载按钮
        //     var downBtn = engine.getLayout(fullConfig);
        //     downBtn.tagName = 'img';
        //     downBtn.id = 'downBtn' + adIndex;
        //     downBtn.class = 'downBtn' + adIndex;
        //     liCon.childNodes.push(downBtn);
        //     downBtn.src = '{{dupDomain}}/adserv/img/click_ivn_3.gif';
        // }

        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var adBg = containerStyle.cbackground;
        var conBorB = (containerStyle['border-bottom-width']
        === undefined ? 0 : containerStyle['border-bottom-width']);
        var conBorL = (containerStyle['border-left-width']
        === undefined ? 0 : containerStyle['border-left-width']);
        var conBorR = (containerStyle['border-right-width']
        === undefined ? 0 : containerStyle['border-right-width']);
        var conBorT = (containerStyle['border-top-width']
        === undefined ? 0 : containerStyle['border-top-width']);
        var conBorStyle = (containerStyle['border-style']
        === undefined ? 'solid' : containerStyle['border-style']);
        var conBorColor = (containerStyle['border-color']
        === undefined ? '#c6c6c6' : containerStyle['border-color']);
        // var conMarTop = -(containerHeight / 2);

        // 相对尺寸
        var px = containerWidth / 300;
        var pt = px;


        var itemWidth = containerWidth - parseInt(conBorR, 10) * 2;
        var itemHeight = containerHeight - parseInt(conBorR, 10) * 2;
        style['.liCon' +  adIndex] = {
            'position': 'relative',
            'background': '#000'
        };
        // liCon['marginTop'] = conMarTop;
        var imgWidth = itemWidth;
        var imgHeight = imgWidth * ad.height / ad.width;
        var imgRatio = ad.height / ad.width;
        var conRatio = itemHeight / itemWidth;// height/width
        if (imgRatio > conRatio) {
            imgHeight = itemHeight - conBorB * 2;
            imgWidth = imgHeight / imgRatio;
        }
        else {
            imgWidth = itemWidth - conBorB * 2;
            imgHeight = imgRatio * imgWidth;
        }
        var imgMarginTop = (itemHeight - imgHeight) / 2;
        var imgMarginLeft = (itemWidth - imgWidth) / 2;
        img['data-imgBorder'] = conBorB;
        img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);

        // imgbg背景蒙板
        style['#imgBg' + adIndex] = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'background': '#000 url("' + ad.stuffSrc + '") no-repeat 0 0 / 300% 300%',
            '-webkit-filter': 'blur(20px)',
            '-ms-filter': 'blur(20px)',
            '-moz-filter': 'blur(20px)',
            'filter': 'blur(20px)',
            'opacity': 0.5
        };

        style['.imgAD' + adIndex] = {
            'width': imgWidth,
            'height': imgHeight,
            'margin': imgMarginTop + 'px ' + imgMarginLeft + 'px',
            'border': conBorB + 'px ' + conBorStyle + ' ' + conBorColor,
            '-webkit-box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
            '-moz-box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
            'box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
            'position': 'relative'
        };

        // 下载按钮
        var btnWidth = 120 * pt;
        var btnHeight = 20 * pt;
        var btnFontSize = 14 * pt;
        var btnMarginTop = (imgMarginTop - btnHeight) / 2;
        var btnMarginLeft = (containerWidth - btnWidth) / 2;
        style['#btn' + adIndex] = {
            'width': btnWidth + 'px',
            'height': btnHeight + 'px',
            'line-height': btnHeight + 'px',
            'font-size': btnFontSize + 'px',
            'color': '#fff',
            'font-family': '\u9ed1\u4f53',
            'border': '1px solid #fff',
            'text-align': 'center',
            'position': 'absolute',
            'top': imgMarginTop * 1.5 + imgHeight - btnHeight + 'px',
            'left': (itemWidth - btnWidth) / 2 + 'px'
        };

        style['#item' + adIndex] = {
            'width': containerWidth,
            'height': containerHeight,
            'position': 'absolute',
            'left': '0px',
            'top': '0px ',
            'text-decoration': 'none',
            'z-index': '2147483646'
        };
        style['a'] = {
            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
            '-webkit-tap-highlight-color': 'transparent',
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none'
        };
        // 下载按钮样式
        // if (act === 2) {
        //     // 下载按钮样式
        //     style['.downBtn' + adIndex] = {
        //         'cursor': 'pointer',
        //         'position': 'absolute',
        //         'z-index': '2147483640',
        //         'bottom': imgMarginTop + conBorB + 'px',
        //         'right': imgMarginLeft + 'px',
        //         'width': Math.ceil(56 * px) > 100 ? 100 : Math.ceil(56 * px),
        //         'height': Math.ceil(56 * px) > 100 ? 100 : Math.ceil(56 * px),
        //         'filter': 'alpha(opacity=80)',
        //         '-moz-opacity': '0.8',
        //         '-khtml-opacity': '0.8',
        //         'opacity': '0.8'
        //     };
        // }
        // 相对尺寸
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var px = containerWidth / 300;

        return {itemList: itemList, style: style};
    },
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var clientWidth = containerStyle.width;
        var clientHeight = containerStyle.height;

        // items
        var items = container.childNodes;

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';

        var itemCon = engine.getLayout(fullConfig);
        itemCon.tagName = 'div';
        itemCon.class = 'itemCon';
        itemCon.id = 'itemCon';

        var itemUl = engine.getLayout(fullConfig);
        itemUl.tagName = 'ul';
        itemUl.class = 'itemUl';
        itemUl.id = 'itemUl';

        // 添加样式部分
        var style = {};
        var rem = clientWidth / 16;
        for (var i = 0, len = ads.length; i < len; i++) {
            var ad = ads[i];
            var itemList = engine.getLayout(fullConfig);
            itemList.tagName = 'li';
            itemList.class = 'itemList' + i;
            itemList.id = 'itemList' + i;
            var itemListObj = {};
            switch (ad.stuffType) {
                case 600: itemListObj = this.drawTuWen(context, itemList, style, ad, i);break;
                case 500: itemListObj = this.drawText(context, itemList, style, ad, i);break;
                case 100: itemListObj = this.drawImage(context, itemList, style, ad, i); break;
                default: ;break;
            }
            itemUl.childNodes.push(itemListObj.itemList);
            style = itemListObj.style;
            if (itemListObj.length !== 0) {
                style['.itemList' + i] = {
                    'height': '100%',
                    'width': 16 * rem + 'px',
                    'position': 'absolute',
                    'display': 'block',
                    'top': '0',
                    'left': 16 * rem * i + 'px',
                    'float': 'left',
                    'overflow': 'hidden'
                };
            }
        }
        var itemCircle = engine.getLayout(fullConfig);
        itemCircle.id = 'itemCircle';
        itemCircle.class = 'itemCircle';
        for (var i = 0, len = ads.length; i < len; i++) {
            var circle = engine.getLayout(fullConfig);
            circle.tagName = 'span';
            circle.class = i === 0 ? 'circle circleNow' : 'circle';
            itemCircle.childNodes.push(circle);
        }
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';';
        item.childNodes.push(qiushiInfo);

        item.childNodes.push(itemCon);
        itemCon.childNodes.push(itemUl);
        itemCon.childNodes.push(itemCircle);

        items.push(item);
        style['.itemCon'] = {
            'width': clientWidth + 'px',
            'float': 'left',
            'overflow': 'hidden'
        };
        style['html'] = {
            'font-size': clientWidth / 16 + 'px'
        };
        style['.item'] = {

        };
        style['.itemUl'] = {
            'list-style': 'none',
            'position': 'relative',
            'height': clientHeight + 'px'
        };
        style['#container'] = {
            'position': 'absolute',
            'left': '50%',
            'Top': '50%',
            'margin-top': -fullConfig.templateHeight / 2,
            'margin-left': -fullConfig.templateWidth / 2,
            'z-index': 1,
            'overflow': 'hidden',
            'background-color': '#000000',
            'background-color': 'rgba(0,0,0,0.5)',
            'color': '#ffffff'
        };
        style['.itemCircle'] = {
            'width': '100%',
            'display': '-ms-flexbox',
            '-ms-flex-align': 'center',
            '-ms-flex-pack': 'center',
            'display': '-moz-box',
            '-moz-box-align': 'center',
            '-moz-box-pack': 'center',
            'display': '-webkit-box',
            '-webkit-box-align': 'center',
            '-webkit-box-pack': 'center',
            'text-align': 'center',
            'height': '0.6' * rem + 'px',
            'text-align': 'center',
            'position': 'absolute',
            'bottom': '5px'
        };
        style['.itemCircle span'] = {
            'display': 'block',
            'overflow': 'hidden',
            'width': '0.4' * rem + 'px',
            'height': '0.4' * rem + 'px',
            'margin': '0.15' * rem + 'px',
            'font-size': '0',
            'background-image': 'url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/solid.png)',
            'background-repeat': 'none'
        };
        style['.circle'] = {
            'background-size': '0.4' * rem + 'px ' + '0.8' * rem + 'px',
            'background-position': '0px 0px'
        };
        style['.circleNow'] = {
            'background-position': '0px ' + '0.4' * rem + 'px'
        };
        // 广告关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        itemCon.childNodes.push(closeBtn);

        // 关闭按钮样式
        var closeBtnRadius = 30;
        var closeBtnDivRadius = 50;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center',
            'color': '#fff',
            'top': '0px',
            'right': '0px'
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

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        // add logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4';
        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
