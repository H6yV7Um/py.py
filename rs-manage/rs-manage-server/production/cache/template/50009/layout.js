/**
 * @file tuwen_image_text_lunbo_6_5 template layout
 * @author qianxiaoli
 */
/* eslint-disable max-len */
/* globals oojs */
oojs.define({
    name: '50009',
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
        containerPaddingLeft: 0,
        titleFontFamily: 'Microsoft YaHei,SimHei,arial,sans-serif;'
    },
    //  下载按钮图片
    downloadIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_dl.png',
    //  普通按钮图片
    defaultIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_lp.png',
    //  秋实Sdk所需信息
    adsExtention: function (requestInfo) {
        var adsExtention = [];
        if (requestInfo.adElements && requestInfo.adElements.length) {
            for (var i = 0, count = requestInfo.adElements.length; i < count; i++) {
                var ad = requestInfo.adElements[i];
                var extention = ad.sdkInteractionInfo && JSON.parse(ad.sdkInteractionInfo);
                adsExtention.push(extention || '');
            }
        }
        return JSON.stringify(adsExtention);
    },
    drawTuWen: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
       /* if (requestInfo.adElements.length === 1) {
            style['#container'] = {
                'position': 'absolute',
                'left': '50%',
                'Top': '50%',
                'margin-top': -fullConfig.templateHeight / 2,
                'margin-left': -fullConfig.templateWidth / 2,
                'z-index': 1
            };
        }*/
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
        var act = parseInt(ad.action[0].actionType, 10) || 4;
        var actText = lpText;
        var bntIcon = '';
        var engine = this.basic;

        switch (act) {
            case 4: actText = lpText;
                bntIcon = this.defaultIcon;
                break;
            case 5: actText = downloadText; bntIcon = this.downloadIcon;
                break;
            case 3: actText = mapText;
                break;
            case 1: actText = smsText;
                break;
            case 6: actText = telText;
                break;
            default: actText = lpText;
                break;
        }

        if (ad.sdkInteractionInfo) {
            try {
                var sdkInfo = JSON.parse(ad.sdkInteractionInfo);
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

        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo' + adIndex;
        logo.class = 'logo';
        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        liCon.childNodes.push(logo);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        liCon.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        liCon.childNodes.push(desc);

        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'btn';
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText + ' >';
        // 按钮图标
        var arrIcon = engine.getLayout(fullConfig);
        arrIcon.tagName = 'img';
        arrIcon.src = bntIcon;
        if (adStyle.btnIcon && bntIcon) {
            btn.childNodes.push(arrIcon);
        }
        btn.childNodes.push(btnText);
        liCon.childNodes.push(btn);

        // 填充广告数据
        logoImg.src = ad.iconFileSrc[0];
        titleText.innerHTML = ad.textTitle[0];
        descText.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        liCon.childNodes.push(a);
        itemList.childNodes.push(liCon);

        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var isVertical = containerStyle.width > containerStyle.height ? true : false;
        var containerWidth = containerStyle.width;// containerStyle.width * 7 / 8;
        var containerHeight = containerWidth * 5 / 6;
        if (isVertical) {
            var ua = requestInfo.device.userAgent.toLowerCase();
            var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
            var tabHeight = isIOS ? 0 : 15;
            containerHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
            containerWidth = containerHeight * 1.2;
        }

        // 相对尺寸
        var px = containerWidth / 320;
        var pt = px;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth;// - (itemPadding * 2);
        var itemHeight = containerHeight;// - (itemPadding * 2);
        var itemBg = (userConfig['containerBackgroundColor'] === undefined || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
        // var ItemBackground = itemBg === '' ? adStyle.adBg : ('#' + itemBg);
        var ItemBackground = itemBg === '' ? '#3a99fe' : ('#' + itemBg);
        style['.itemList' + adIndex] = {
            background: ItemBackground
        };
        style['.liCon' + adIndex] = {
            width: itemWidth,
            height: itemHeight,
            'position': 'relative',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_bc.png) no-repeat',
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

       // logo单独一行
        var logoWidth = Math.round(60 * px);
        style['.liCon' + adIndex + ' .logo'] = {
            'width': itemWidth - itemPadding * 2,
            'height': logoWidth,
            'margin': itemPadding / 2 + 'px ' + itemPadding + 'px',
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
        var titleFontSize = userConfig.titleFontSize || Math.round(22 * pt);
        var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
        var titleFontColor = userConfig.titleFontColor || 'ffffff'; // adStyle.txtCol;

        style['.liCon' + adIndex + ' .title'] = {
            width: textWidth,
            'height': Math.round(32 * pt) * 2,
            'margin': '0 ' + itemPadding + 'px',
            'text-align': 'center',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'color': '#' + titleFontColor
        };
        style['.liCon' + adIndex + ' .title span'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * pt) + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        var descTopSpace = Math.round(14 * px);
        style['.liCon' + adIndex + ' .desc'] = {
            'width': textWidth,
            'height': Math.round(26 * pt) * 2,
            'margin': itemPadding / 2 + 'px ' + itemPadding + 'px',
            'text-align': 'center'
        };
        var descFontSize = userConfig.descFontSize || Math.round(14 * pt);
        var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
        var descFontColor = userConfig.descFontColor || adStyle.txtCol;
        style['.liCon' + adIndex + ' .desc span'] = {
            font: 'normal ' + descFontSize + 'px/' + Math.round(24 * pt) + 'px ' + descFontFamily,
            color: descFontColor
        };

        var btnWidth = Math.round(itemWidth * 0.8);// Math.round(adStyle.btnW * px);
        var btnHeight = Math.round(30 * px);
        style['.liCon' + adIndex + ' .btn'] = {
            'text-align': 'center',
            'margin': '0 0 0 ' + (itemWidth - btnWidth) / 2 + 'px',
            'width': btnWidth,
            'height': btnHeight,
            'line-height': btnHeight - 5,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px ' + Math.floor(px) + 'px' + ItemBackground,
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
    drawImage: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;

        var act = parseInt(ad.action[0].actionType, 10) || 4;
        var engine = this.basic;
        // 广告点击区域——item可点
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'liCon' + adIndex;
        liCon.id = 'liCon' + adIndex;
        var imgRadio = parseInt(ad.imgWidth[0], 10) / parseInt(ad.imgHeight[0], 10);
        var adsLength = requestInfo.adElements.length;
        if ((adsLength > 1) || imgRadio !== 2) {
            /*if (requestInfo.adElements.length === 1) {
                style['#container'] = {
                    'position': 'absolute',
                    'left': '50%',
                    'Top': '50%',
                    'margin-top': -fullConfig.templateHeight / 2,
                    'margin-left': -fullConfig.templateWidth / 2,
                    'z-index': 1
                };
            }*/
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.id = 'item' + adIndex;
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.class = 'imgAD' + adIndex;
            img.id = 'imgAD';
            liCon.childNodes.push(img);
            // 广告索引，必须加
            a['data-adIndex'] = adIndex;
            // 广告推广类型
            a['data-adType'] = act;

            // 填充广告数据
            img.src = ad.imgFileSrc[0];
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            liCon.childNodes.push(a);
            itemList.childNodes.push(liCon);

            // 添加样式部分
            var containerStyle = engine.getContainerStyle(fullConfig);
            var isVertical = containerStyle.width > containerStyle.height ? true : false;
            var containerWidth = containerStyle.width;// containerStyle.width * 7 / 8;
            var containerHeight = containerWidth * 5 / 6;
            var clientWidth = containerWidth;
            var clientHeight = containerStyle.height;
            if (isVertical) {
                var ua = requestInfo.device.userAgent.toLowerCase();
                var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
                var tabHeight = isIOS ? 0 : 15;
                containerHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
                containerWidth = containerHeight * 1.2;
            }
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
            var conMarTop = -(containerHeight + parseInt(conBorB, 10) + parseInt(conBorT, 10)) / 2;

            // 相对尺寸
            var px = containerWidth / 300;
            var pt = px;


            var itemWidth = containerWidth - parseInt(conBorR, 10) * 2;
            var itemHeight = containerHeight - parseInt(conBorR, 10) * 2;
            style['.liCon' +  adIndex] = {
                'position': 'relative',
                'margin-top': '-3px'
            };
            style['.liCon' + adIndex + ' a'] = {
                display: 'block'
            };
            var imgWidth = itemWidth;
            var imgHeight = imgWidth * parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
            var imgRatio = parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
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
            style['.imgAD' + adIndex] = {
                width: imgWidth,
                height: imgHeight,
                margin: imgMarginTop + 'px ' + imgMarginLeft + 'px',
                border: conBorB + 'px ' + conBorStyle + ' ' + conBorColor
            };
            style['.liCon' + adIndex + ' a'] = {
                'width': imgWidth + conBorB * 2,
                'height': imgHeight + conBorB * 2,
                'position': 'absolute',
                'left': imgMarginLeft + 'px',
                'top': imgMarginTop + 'px',
                'z-index': '2147483646'
            };
            img['data-imgBorder'] = conBorB;
            img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);
            // 下载按钮样式
            if (act === 5) {
                // 下载按钮样式
                style['.downBtn' + adIndex] = {
                    'cursor': 'pointer',
                    'position': 'absolute',
                    'z-index': '2147483640',
                    'bottom': conBorB + 5 + 'px',
                    'right': '-1px',
                    'width': Math.ceil(56 * px),
                    'height': Math.ceil(56 * px),
                    'filter': 'alpha(opacity=80)',
                    '-moz-opacity': '0.8',
                    '-khtml-opacity': '0.8',
                    'opacity': '0.8'
                };
            }
        }
        else if (adsLength === 1 && imgRadio === 2 && act === 5) { // 图片类模板如果为下载类，且图片比例为2:1，那么使用模板IMAGE_SDK_1,否则使用IMAGE_SDK_2_1;
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
            var topImg = engine.getLayout(fullConfig);
            topImg.tagName = 'img';
            topImg.class = 'topImg';
            itemList.childNodes.push(topImg);

            // 广告logo
            var tuwensubItem = engine.getLayout(fullConfig);
            tuwensubItem.class = 'tuwensubItem';

            // 广告logo
            var logo = engine.getLayout(fullConfig);
            logo.tagName = 'div';
            logo.id = 'logo0';
            logo.class = 'logo';
            // logo图片
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'img';
            logo.childNodes.push(logoImg);

            // 下载按钮
            var btn = engine.getLayout(fullConfig);
            btn.tagName = 'img';
            btn.class = 'btn';
            logo.childNodes.push(btn);
            tuwensubItem.childNodes.push(logo);

            // 广告title
            var content = engine.getLayout(fullConfig);
            content.tagName = 'div';
            content.id = 'content0';
            content.class = 'content';
            // title内容
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.class = 'title';
             // desc内容
            var descText = engine.getLayout(fullConfig);
            descText.class = 'desc';
            content.childNodes.push(titleText);
            content.childNodes.push(descText);
            tuwensubItem.childNodes.push(content);
            itemList.childNodes.push(tuwensubItem);

            // 填充广告数据
            var sdkInfo = {};
            if (ad.sdkInteractionInfo) {
                try {
                    sdkInfo = JSON.parse(ad.sdkInteractionInfo);
                } catch (e) {}
            }

            logoImg.src = ad.iconFileSrc[0];
            topImg.src = ad.imgFileSrc[0];
            titleText.innerHTML = ad.appName;
            descText.innerHTML = ad.appDescription;
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            btn.src = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/image_sdk_1_dl.jpg';
            itemList.childNodes.push(a);
            var containerStyle = engine.getContainerStyle(fullConfig);
            var isVertical = containerStyle.width > containerStyle.height ? true : false;
            var containerWidth = containerStyle.width;// containerStyle.width * 7 / 8;
            var containerHeight = containerWidth * 5 / 6;
            if (isVertical) {
                var ua = requestInfo.device.userAgent.toLowerCase();
                var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
                var tabHeight = isIOS ? 0 : 15;
                containerHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
                containerWidth = containerHeight * 1.2;
            }
            var pt = containerWidth / 300;

            // container居中
            /*style['#container.container'] = {
                'position': 'absolute',
                'left': '50%',
                'Top': '50%',
                'margin-top': -fullConfig.templateHeight / 2,
                'margin-left': -fullConfig.templateWidth / 2,
                'z-index': 1
            };

            style['.container'] = containerStyle;*/
            var ItemBackground = fullConfig['containerBackgroundColor'];
            /*style['.item'] = {
                width: '100%',
                height: '100%',
                position: 'relative'
            };*/
            style['#container.container'] = {
                'position': 'absolute',
                'left': '50%',
                'Top': '50%',
                'margin-top': -fullConfig.templateHeight / 2,
                'margin-left': -fullConfig.templateWidth / 2,
                'z-index': 1
            };
            // 移动广告全区域可点击
            style['.item a'] = {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0
            };
            style['.item a:hover'] = {
                'text-decoration': 'none'
            };
            style['.item div'] = {
                overflow: 'hidden'
            };

            // 顶部图片
            var topImgHeight = containerWidth / 2;
            style['.item .topImg'] = {
                width: '100%',
                height: topImgHeight + 'px',
                position: 'absolute',
                top: 0,
                left: 0
            };

            var tuwensubItemPaddingTop = 10 * pt;
            var tuwensubItemHeight = containerHeight - topImgHeight - 2 * tuwensubItemPaddingTop;
            var tuwensubItemWidth  = containerWidth - 2 * tuwensubItemPaddingTop;
            style['.item .tuwensubItem'] = {
                width: tuwensubItemWidth + 'px',
                height: tuwensubItemHeight + 'px',
                padding: tuwensubItemPaddingTop + 'px',
                position: 'absolute',
                top: topImgHeight + 'px',
                left: 0
            };
            // logo单独一列
            var logoWidth = 80 * pt;
            var logoMraginRight = 10 * pt;
            style['.item .logo'] = {
                'width': logoWidth + 'px',
                'height': tuwensubItemHeight + 'px',
                'margin': '0 ' + logoMraginRight + 'px 0 0',
                'float': 'left',
                'text-align': 'center'
            };
            var logoImgWidth = 50 * pt;
            style['.item .logo img'] = {
                'width': logoImgWidth + 'px',
                'height': logoImgWidth + 'px',
                'border-radius': '10px'
            };

            var downloadBtnWidth = 62 * pt;
            var downloadBtnHeight = 20 * pt;
            style['.item .logo .btn'] = {
                'width': downloadBtnWidth + 'px',
                'height': downloadBtnHeight + 'px',
                'border-radius': '0',
                'margin-top': '5px'
            };

            // 文本折行
            var textWidth = tuwensubItemWidth - logoWidth - logoMraginRight;
            style['.item span'] = {
                'word-wrap': 'break-word'
            };
            var contentHeight = tuwensubItemHeight - 5;
            style['.item .content'] = {
                width: textWidth + 'px',
                height: contentHeight + 'px',
                margin: '5px 0 0 0'
            };

            var titleFontSize =  14 * pt;
            var titleFontFamily = fullConfig.titleFontFamily;
            var titleFontColor = fullConfig.titleFontColor;
            var titleLineHeight = 24 * pt;
            var titleSource = String(ad.appName);
            var titleLenght = textWidth * 2 / titleFontSize;
            if (titleLenght < titleSource.replace(/[^x00-xff]/g, 'ci').length / 2) {
                titleText.innerHTML = titleSource.replace(/([^\x00-\xff])/g, '\x241 ')
                .substr(0, titleLenght * 2 - 4)
                .replace(/[^\x00-\xff]$/, '')
                .replace(/([^\x00-\xff]) /g, '\x241') + '…';
            }
            var titleHeight = titleLineHeight *  Math.min(Math.ceil((titleLenght - 2) * titleFontSize / (2 * textWidth)), 2);
            style['.item .title'] = {
                font: 'normal bold ' + titleFontSize + 'px/' + titleLineHeight + 'px ' + titleFontFamily,
                color: '#' + titleFontColor,
                display: 'block',
                // height: titleHeight + 'px',
                overflow: 'hidden'
            };

            var descMarginTop = 6;
            var descHeight = tuwensubItemHeight - titleHeight - descMarginTop;

            var descFontSize = 14 * pt;
            var descFontFamily = fullConfig.titleFontFamily;
            var descFontColor = fullConfig.descFontColor;
            var descLineHeight = 20 * pt;
            descHeight = Math.floor(descHeight / descLineHeight) * descLineHeight;
            style['.item .desc'] = {
                'font': 'normal ' + descFontSize + 'px/' + descLineHeight + 'px ' + descFontFamily,
                'color': '#' + descFontColor,
                'height': descHeight + 'px',
                'margin': descMarginTop + 'px 0 0 0',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis'
            };
        }
        else if (adsLength === 1 && imgRadio === 2) {
            var downloadText = '\u7acb\u5373\u4e0b\u8f7d';// 立即下载
            var lpText = '\u5173\u6ce8\u8be6\u60c5';// 关注详情
            var telText = '\u62e8\u6253\u7535\u8bdd';// 拨打电话
            var smsText = '\u53d1\u9001\u77ed\u4fe1';// 发送短信
            var mapText = '\u663e\u793a\u5730\u56fe';// 显示地图
            var act = parseInt(ad.action[0].actionType, 10) || 4;
            var actText = lpText;
            var bntIcon = '';
            switch (act) {
                case 4: actText = lpText;
                    bntIcon = this.defaultIcon;
                    break;
                case 5: actText = downloadText;
                    bntIcon = this.downloadIcon;
                    break;
                case 3: actText = mapText;
                    break;
                case 1: actText = smsText;
                    break;
                case 6: actText = telText;
                    break;
                default: actText = lpText;
                    break;
            }
            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.class = 'item0';
            a.id = 'item0';

            // 6/5的背景
            var itemBg = engine.getLayout(fullConfig);
            itemBg.tagName = 'div';
            itemBg.class = 'itemBg';
            itemBg.id = 'itemBg';
            a.childNodes.push(itemBg);

            // img
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.class = 'imgAD';
            img.id = 'imgAD';
            itemBg.childNodes.push(img);

            // btn按钮
            var btn = engine.getLayout(fullConfig);
            btn.tagName = 'div';
            btn.class = 'btn';
            btn.id = 'btn';
            itemBg.childNodes.push(btn);

            // btnText的信息
            var btnText = engine.getLayout(fullConfig);
            btnText.tagName = 'span';
            btnText.class = 'btnText';
            btnText.id = 'btnText';
            btnText.innerHTML = actText;
            btn.childNodes.push(btnText);

            // 广告索引，必须加
            a['data-adIndex'] = '0';
            // 广告推广类型
            a['data-adType'] = act;

            // 填充广告数据
            img.src = ad.imgFileSrc[0];
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            itemList.childNodes.push(a);
            var containerStyle = engine.getContainerStyle(fullConfig);
            var isVertical = containerStyle.width > containerStyle.height ? true : false;
            var containerWidth = containerStyle.width;// containerStyle.width * 7 / 8;
            var containerHeight = containerWidth * 5 / 6;
            if (isVertical) {
                var ua = requestInfo.device.userAgent.toLowerCase();
                var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
                var tabHeight = isIOS ? 0 : 15;
                containerHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
                containerWidth = containerHeight * 1.2;
            }
            var itemBg = (userConfig['containerBackgroundColor'] === undefined
            || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
            var ItemBackground = itemBg === '' ? '#FAC623' : ('#' + itemBg);
            var adBg = ItemBackground;
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
            var conMarTop = -(containerHeight + parseInt(conBorB, 10) + parseInt(conBorT, 10)) / 2;

            /*style['#container.container'] = {
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
                'top': '0px',
                'left': '0px',
                'z-index': 1,
                'overflow': 'hidden',
                'background-color': '#000000',
                'background-color': 'rgba(0,0,0,0.5)'
            };*/
            // container['marginTop'] = conMarTop;
            // 相对尺寸
            var px = containerWidth / 300;
            var pt = px;

            var itemWidth = containerWidth;
            var itemHeight = containerHeight;

            // 6/5模板的样式
            var imgBgWidth = itemWidth;
            var imgBgHeight = imgBgWidth * 5 / 6;
            var imgBgMarginTop = (itemHeight - imgBgHeight) / 2;
            var imgBgPaddingTop = 113 / 625 * imgBgHeight;
            var imgBgPaddingLeft = 60 / 750 * imgBgWidth;
            /*style['.item0'] = {
                position: 'relative',
                'width': itemWidth,
                'height': imgBgHeight,
                'margin': imgBgMarginTop + 'px 0px'
            };*/
            /* eslint-disable fecs-max-statements */
            style['.itemBg'] = {
                'width': itemWidth,
                'height': imgBgHeight,
                'margin': imgBgMarginTop + 'px 0px',
                'padding': imgBgPaddingTop + 'px ' + imgBgPaddingLeft + 'px',
                'background': adBg + ' url("{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/image_sdk_2_1_bg.png") no-repeat',
                'background-size': 'cover',
                'box-sizing': 'border-box',
                'position': 'relative'
            };
            /* eslint-enable fecs-max-statements */
            // 图片样式
            var imgWidth = imgBgWidth - imgBgPaddingLeft * 2;
            var imgHeight = imgWidth / 2;
            style['.imgAD'] = {
                width: imgWidth,
                height: imgHeight
            };
            img['data-imgBorder'] = conBorB;
            img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);

            var btnWidth = Math.round(251 / 750 * imgBgWidth);
            var btnHeight = btnWidth / 5;

            style['.btn'] = {
                'width': btnWidth + 'px',
                'height': btnHeight + 'px',
                'line-height': btnHeight + 'px',
                'text-align': 'center',
                'color': ItemBackground,
                'position': 'absolute',
                'background': '#45280D',
                'bottom': 56 / 750 * imgBgHeight + 'px',
                'left': (itemWidth - btnWidth) / 2 + 'px'
            };
        }
        return {itemList: itemList, style: style};
    },
    drawText: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        /*if (requestInfo.adElements.length === 1) {
            style['#container'] = {
                'position': 'absolute',
                'left': '50%',
                'Top': '50%',
                'margin-top': -fullConfig.templateHeight / 2,
                'margin-left': -fullConfig.templateWidth / 2,
                'z-index': 1
            };
        }*/
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
        var act = parseInt(ad.action[0].actionType, 10) || 4;

        var actText = lpText;
        var bntIcon = '';
        switch (act) {
            case 4: actText = lpText;
                bntIcon = this.defaultIcon;
                break;
            case 5: actText = downloadText;
                bntIcon = this.downloadIcon;
                break;
            case 3: actText = mapText;
                break;
            case 1: actText = smsText;
                break;
            case 6: actText = telText;
                break;
            default: actText = lpText;
                break;
        }
        if (ad.sdkInteractionInfo) {
            try {
                var sdkInfo = JSON.parse(ad.sdkInteractionInfo);
                if (sdkInfo['adbg_style'] && adBgStyle[sdkInfo['adbg_style']]) {
                    adStyle = adBgStyle[sdkInfo['adbg_style']];
                }
            } catch (e) {}
        }

        var engine = this.basic;
        // 广告点击区域——item可点
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'liCon' + adIndex;
        liCon.id = 'liCon' + adIndex;
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item' + adIndex;
        a.class = 'item' + adIndex;
        // 广告索引，必须加
        a['data-adIndex'] = adIndex;
        // 广告推广类型
        a['data-adType'] = act;

        // 填充广告数据
        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'title' + adIndex;
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        liCon.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'desc' + adIndex;
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        liCon.childNodes.push(desc);

        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'btn';
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText + ' >';
        // 按钮图标
        var arrIcon = engine.getLayout(fullConfig);
        arrIcon.tagName = 'img';
        arrIcon.src = bntIcon;
        if (adStyle.btnIcon && bntIcon) {
            btn.childNodes.push(arrIcon);
        }
        btn.childNodes.push(btnText);
        liCon.childNodes.push(btn);

        // 填充广告数据
        // 填充广告数据
        titleText.innerHTML = ad.textTitle[0];
        descText.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        // a.childNodes.push(a);
        liCon.childNodes.push(a);
        itemList.childNodes.push(liCon);

        // 添加样式部分
        var containerStyle = engine.getContainerStyle(fullConfig);
        var isVertical = containerStyle.width > containerStyle.height ? true : false;
        var containerWidth = containerStyle.width;// containerStyle.width * 7 / 8;
        var containerHeight = containerWidth * 5 / 6;
        if (isVertical) {
            var ua = requestInfo.device.userAgent.toLowerCase();
            var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
            var tabHeight = isIOS ? 0 : 15;
            containerHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
            containerWidth = containerHeight * 1.2;
        }
        // 相对尺寸
        var px = containerWidth / 300;
        var pt = px;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth - (itemPadding * 2);
        var itemHeight = containerHeight - (itemPadding * 2);
        var itemBg = (userConfig['containerBackgroundColor'] === undefined || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
        // var ItemBackground = itemBg === '' ? adStyle.adBg : ('#' + itemBg);
        var ItemBackground = itemBg === '' ? '#3a99fe' : ('#' + itemBg);
        style['.liCon' +  adIndex] = {
            'width': itemWidth,
            'height': itemHeight,
            'padding': itemPadding + 'px',
            'position': 'relative',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/text_sdk_bc.png) no-repeat',
            'background-size': '100% 100%'
        };
        // 移动广告全区域可点击
        style['.liCon' + adIndex + ' a'] = {
            'width': containerWidth,
            'height': containerHeight,
            'text-decoration': 'none',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };
        style['.liCon' + adIndex + ' a:hover'] = {};
        style['.liCon' + adIndex + ' div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };

        // 文本折行
        var textWidth = itemWidth  - itemPadding * 2;
        style['.liCon' + adIndex + ' span'] = {
            'word-wrap': 'break-word'
        };
        style['.liCon' + adIndex + ' .title' + adIndex] = {
            'width': textWidth + 'px',
            'height': Math.round(32 * pt) * 2,
            'margin': Math.round(5 * pt) * 2 + 'px ' + (itemWidth - textWidth) / 2 + 'px 0',
            'text-align': 'center'
        };
        var titleFontSize = Math.round(22 * pt);
        var titleFontFamily = fullConfig.titleFontFamily;
        var titleFontColor = userConfig.titleFontColor || 'ffffff';// adStyle.txtCol;
        style['.liCon' + adIndex + ' .title' + adIndex + ' span'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * pt) + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        var descTopSpace = Math.round(14 * px);
        style['.liCon' + adIndex + ' .desc' + adIndex] = {
            'width': textWidth + 'px',
            // 'margin-top': Math.round(14 * px),
            'margin': Math.round(14 * px) + 'px ' + (itemWidth - textWidth) / 2 + 'px 0',
            'height': Math.round(26 * pt) * 2 + 'px',
            'padding': descTopSpace + 'px 0 0 0',
            'text-align': 'center'
            // 'line-height': Math.round(30 * pt) + 'px',
        };
        var descFontSize = userConfig.descFontSize || Math.round(14 * pt);
        var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
        var descFontColor = userConfig.descFontColor || '747474';// adStyle.txtCol;
        style['.liCon' + adIndex + ' .desc' + adIndex + ' span'] = {
            font: 'normal ' + descFontSize + 'px/' + Math.round(24 * pt) + 'px ' + descFontFamily,
            color: '#' + descFontColor
        };

        var btnWidth = Math.round(itemWidth * 0.8);// Math.round(adStyle.btnW * px);
        var btnHeight = Math.round(30 * px);
        // var btnBackground = userConfig.cbtnbackground || adStyle.btnBg;
        var btnBackground = userConfig.cbtnbackground || '#3a99fe';
        style['.liCon' + adIndex + ' .btn'] = {
            'text-align': 'center',
            'margin': Math.floor(15 * px) + 'px ' + (itemWidth - btnWidth) / 2 + 'px 0',
            'width': btnWidth,
            'height': btnHeight,
            'border-radius': Math.floor(px * 15) + 'px',
            'box-shadow': '2px 2px ' + Math.floor(2 * px) + 'px' +  btnBackground,
            'background': btnBackground
        };
        style['.liCon' + adIndex + ' .btn img'] = {
            'vertical-align': 'middle',
            'line-height': btnHeight,
            'height': btnHeight
        };
        style['.liCon' + adIndex + ' .btn span'] = {
            'font': 'normal ' + Math.round(14 * pt) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'color': '#ffffff'
        };
        return {itemList: itemList, style: style};
    },
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var engine = this.basic;
        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        var containerStyle = engine.getContainerStyle(fullConfig);
        var isVertical = containerStyle.width > containerStyle.height ? true : false;
        var clientWidth = containerStyle.width;
        var clientHeight = containerStyle.height;
        if (isVertical) {
            var ua = requestInfo.device.userAgent.toLowerCase();
            var isIOS = ((ua.indexOf('iphone') > -1) || (ua.indexOf('ipad') > -1));
            var tabHeight = isIOS ? 0 : 15;
            clientHeight = Math.min(containerStyle.width, containerStyle.height) - tabHeight;
            clientWidth = clientHeight * 1.2;
        }
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
            var stuffType = 0;
            if (ad.imgFileSrc.length > 0 && ad.imgFileSrc[0].length > 0) {
                stuffType = 100;
            }
            else if ((ad.textTitle > 0 || ad.textDesc1.length > 0)
            && ad.iconFileSrc.length > 0 && ad.iconFileSrc[0].length > 0) {
                stuffType = 600;
            }
            else if (ad.textTitle > 0 || ad.textDesc1.length > 0) {
                stuffType = 500;
            }
            switch (stuffType) {
                case 600: itemListObj = this.drawTuWen(requestInfo, itemList, style, ad, i);
                    break;
                case 500: itemListObj = this.drawText(requestInfo, itemList, style, ad, i);
                    break;//
                case 100: itemListObj = this.drawImage(requestInfo, itemList, style, ad, i);
                    break;//
                default: ;break;
            }
            itemUl.childNodes.push(itemListObj.itemList);
            style = itemListObj.style;
            if (itemListObj.length !== 0 && ads.length > 1) {
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

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        item.childNodes.push(qiushiInfo);
        var itemWidth = clientWidth;
        var itemHeight = Math.round(itemWidth * 5 / 6);

        if (ads.length > 1) {
            var itemCircle = engine.getLayout(fullConfig);
            itemCircle.id = 'itemCircle';
            itemCircle.class = 'itemCircle';
            for (var i = 0, len = ads.length; i < len; i++) {
                var circle = engine.getLayout(fullConfig);
                circle.tagName = 'span';
                circle.class = i === 0 ? 'circle circleNow' : 'circle';
                itemCircle.childNodes.push(circle);
            }
        }

        style['#container'] = {
            'position': 'absolute',
            'left': '50%',
            'Top': '50%',
            'margin-top': -fullConfig.templateHeight / 2,
            'margin-left': -fullConfig.templateWidth / 2,
            'z-index': 1
        };
        style['#item'] = {
            'position': 'relative',
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'margin-top': (clientHeight - itemHeight) / 2 + 'px',
            'margin-left': (containerStyle.width - itemWidth) / 2 + 'px',
            'z-index': 1
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
        item.childNodes.push(itemCon);
        itemCon.childNodes.push(itemUl);
        if (ads.length > 1) {
            itemCon.childNodes.push(itemCircle);
            style['.itemCon'] = {
                'width': 16 * rem + 'px',
                'float': 'left',
                'overflow': 'hidden'
            };
        }
        // item.childNodes.push(arrowR);
        items.push(item);


        style['html'] = {
            'font-size': clientWidth / 16 + 'px'
        };
        style['.itemUl'] = {
            'list-style': 'none',
            'position': 'relative',
            'margin': '0px',
            'height': 13.33 * rem + 'px'
        };
        if (ads.length > 1) {
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
        }

        style['a'] = {
            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
            '-webkit-tap-highlight-color': 'transparent',
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none'
        };

        // 相对尺寸
        //  var containerStyle = engine.getContainerStyle(fullConfig);
        // var containerWidth = containerStyle.width * 3 / 4;
        // var px = containerWidth / 300;
        // 关闭按钮样式
        var closeBtnRadius = 20;
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
            'top': '15px',
            'right': '15px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };
        style['.feedbackCon'] = {
            'display': 'none'
        };
        style['#fbIcon'] = {
            'display': 'none'
        };
        style['.fbTipDiv'] = {
            'display': 'none'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
