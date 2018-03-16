/**
 * @file tuwen_image_text_fulllunbo_bc template layout
 * @author
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: '50010',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据
    imageArr: [],
    firstImgIndex: -1,
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
        titleFontFamily: 'Microsoft YaHei,SimHei,arial,sans-serif;',
        isShowCloseFeedBack: false
    },

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
    //  下载按钮图片
    downloadIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_dl.png',
    //  普通按钮图片
    defaultIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_lp.png',
    drawTuWen: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
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
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'li-con text-li-con';
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
        divUp.class = 'tuwen-div-up';
        divUp.id = 'divUp' + adIndex;
        liCon.childNodes.push(divUp);

        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo' + adIndex;
        logo.class = 'tuwen-li-logo';

        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        divUp.childNodes.push(logo);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'tuwen-title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        divUp.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'tuwen-desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        divUp.childNodes.push(desc);

        // 下部按钮区域
        var divDown = engine.getLayout(fullConfig);
        divDown.class = 'btn-div-down';
        divDown.id = 'divDown' + adIndex;
        liCon.childNodes.push(divDown);
        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'text-btn';
        btn.id = 'btn' + adIndex;
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText + ' >';
        btn.childNodes.push(btnText);
        divDown.childNodes.push(btn);

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
        return {itemList: itemList, style: style};
    },
    drawText: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
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
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'li-con text-li-con';
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
        divUp.class = 'text-div-up';
        divUp.id = 'divUp' + adIndex;
        liCon.childNodes.push(divUp);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title' + adIndex;
        title.class = 'text-title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        divUp.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc' + adIndex;
        desc.class = 'text-desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        divUp.childNodes.push(desc);

        // 下部按钮区域
        var divDown = engine.getLayout(fullConfig);
        divDown.class = 'btn-div-down';
        divDown.id = 'divDown' + adIndex;
        liCon.childNodes.push(divDown);
        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'text-btn';
        btn.id = 'btn' + adIndex;
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText + ' >';
        btn.childNodes.push(btnText);
        divDown.childNodes.push(btn);

        // 填充广告数据
        titleText.innerHTML = ad.textTitle[0];
        descText.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
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
        return {itemList: itemList, style: style};
    },
    drawImage: function (requestInfo, itemList, style, ad, adIndex) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var act = parseInt(ad.action[0].actionType, 10) || 4;
        var engine = this.basic;
        // 广告点击区域——item可点
        var liCon = engine.getLayout(fullConfig);
        liCon.class = 'img-li-con';
        liCon.id = 'liCon' + adIndex;


        if (requestInfo.adElements.length > 1) {
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.class = 'img-item';
            a.id = 'item' + adIndex;

            // 背景模糊的蒙板
            var imgBg = engine.getLayout(fullConfig);
            imgBg.tagName = 'div';
            imgBg.class = 'img-bg';
            imgBg.id = 'imgBg' + adIndex;
            liCon.childNodes.push(imgBg);

            var spanAd = engine.getLayout(fullConfig);
            spanAd.tagName = 'span';
            spanAd.class = 'span-ad';
            spanAd.id = 'spanAd' + adIndex;
            liCon.childNodes.push(spanAd);

            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.id = 'imgAD' + adIndex;
            liCon.childNodes.push(img);
            // 填充图片地址
            img.src = ad.imgFileSrc[0];

            // 广告索引，必须加
            a['data-adIndex'] = adIndex;
            // 广告推广类型
            a['data-adType'] = act;
            // 填充广告数据
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            liCon.childNodes.push(a);
            itemList.childNodes.push(liCon);

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
            // 相对尺寸
            var px = containerWidth / 300;
            var pt = px;


            var itemWidth = containerWidth - parseInt(conBorR, 10) * 2;
            var itemHeight = containerHeight - parseInt(conBorB, 10) * 2;
            var imgWidth = itemWidth;
            var imgHeight = imgWidth * parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
            var imgRatio = parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
            var conRatio = itemHeight / itemWidth;// height/width
            if (imgRatio > conRatio) {
                imgHeight = itemHeight;
                imgWidth = imgHeight / imgRatio;
                img.class = 'img-ad img-height';
                style['.img-height'] = {
                    'height': '100%',
                    'text-align': 'center'
                };
            }
            else {
                imgWidth = itemWidth - conBorB * 2;
                imgHeight = imgRatio * imgWidth;
                img.class = 'img-ad img-width';
                style['.img-width'] = {
                    'width': imgWidth + 'px'
                };
            }
            img['data-imgBorder'] = conBorB;
            img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);
            // imgbg背景蒙板
            style['#imgBg' + adIndex] = {
                'background': '#000 url("' + ad.imgFileSrc[0] + '") no-repeat 0 0 / 300% 300%'
            };
            if (imgRatio < 1) {
                // btn下载按钮
                var btn = engine.getLayout(fullConfig);
                btn.class = 'img-btn';
                btn.id = 'btn' + adIndex;
                btn.innerHTML = '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';        // button提示信息
                liCon.childNodes.push(btn);
            }
        }
        else {
            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.id = 'item0';
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.class = 'img-ad';
            img.id = 'imgAD' + adIndex;
            a.childNodes.push(img);
            // 广告索引，必须加
            a['data-adIndex'] = '0';
            // 广告推广类型
            a['data-adType'] = act;

            // 填充广告数据
            img.src = ad.imgFileSrc[0];
            a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            liCon.childNodes.push(a);
            itemList.childNodes.push(liCon);

            // 添加样式部分
            var style = {};
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
            var conMarTop = -(containerHeight + parseInt(conBorB, 10) + parseInt(conBorT, 10)) / 2;

            style['#container.container'] = {
                'position': 'absolute',
                'width': '100%',
                'height': '100%',
                'top': '0px',
                'left': '0px',
                'z-index': 1,
                'overflow': 'hidden',
                'background-color': '#000000',
                'background-color': 'rgba(0,0,0,0.5)'
            };
            // 相对尺寸
            var px = containerWidth / 300;
            var pt = px;

            var itemWidth = containerWidth;
            var itemHeight = containerHeight;
            style['.item'] = {
                position: 'relative'
            };

            var imgWidth = itemWidth;
            var imgHeight = imgWidth * parseInt(ad.imgHeight, 10) / parseInt(ad.imgWidth[0], 10);
            var imgMarginTop = (itemHeight - imgHeight) / 2;
            style['.img-ad'] = {
                width: imgWidth + 'px',
                height: imgHeight + 'px',
                margin: imgMarginTop + 'px 0px',
                border: conBorB + 'px ' + conBorStyle + ' ' + conBorColor
            };
            img['data-imgBorder'] = conBorB;
            img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);

        }

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
        var clientWidth = containerStyle.width;
        var clientHeight = containerStyle.height;

        // items
        var items = container.childNodes;

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';

        var itemCon = engine.getLayout(fullConfig);
        itemCon.tagName = 'div';
        itemCon.class = 'item-con';
        itemCon.id = 'itemCon';

        var itemUl = engine.getLayout(fullConfig);
        itemUl.tagName = 'ul';
        itemUl.class = 'item-ul';
        itemUl.id = 'itemUl';

        // 添加样式部分
        var style = {};
        var rem = clientWidth / 16;
        this.imageArr = [];
        this.firstImgIndex = -1;
        var isHasText = false;
        var isHasTuwen = false;
        var isHasImg = false;
        for (var i = 0, len = ads.length; i < len; i++) {
            var ad = ads[i];
            var itemList = engine.getLayout(fullConfig);
            itemList.tagName = 'li';
            itemList.class = 'item-list';
            itemList.id = 'itemList' + i;
            var itemListObj = {};
            var stuffType = 0;
            if (ad.imgFileSrc.length > 0 && ad.imgFileSrc[0].length > 0) {
                stuffType = 100;
            }
            else if ((ad.textTitle > 0 || ad.textDesc1.length > 0) && ad.iconFileSrc.length > 0
            && ad.iconFileSrc[0].length > 0) {
                stuffType = 600;
            }
            else if (ad.textTitle > 0 || ad.textDesc1.length > 0) {
                stuffType = 500;
            }
            switch (stuffType) {
                case 600: itemListObj = this.drawTuWen(requestInfo, itemList, style, ad, i);break;
                case 500: itemListObj = this.drawText(requestInfo, itemList, style, ad, i);break;
                case 100: itemListObj = this.drawImage(requestInfo, itemList, style, ad, i); break;
                default: ;break;
            }
            itemUl.childNodes.push(itemListObj.itemList);
            style = itemListObj.style;

            if (ads.length > 1) {
                // 如果有图文，文本，加载图文文本下方按钮样式
                // 下部按钮区域
                var px = clientWidth / 320;
                var rem = clientWidth / 16;
                var vrem = clientHeight / 5;
                var itemPadding = Math.round(20 * px);
                var btnWidth = Math.round(13 * rem);// Math.round(adStyle.btnW * px);
                var btnHeight = Math.round(0.9 * vrem);
                var itemBg = (userConfig['containerBackgroundColor'] === undefined || userConfig['containerBackgroundColor'] === '') ? '' : userConfig['containerBackgroundColor'];
                var ItemBackground = itemBg === '' ? '#3399ff' : ('#' + itemBg);
                var textWidth = clientWidth - itemPadding * 2;

                if (stuffType === 600 && !isHasTuwen) {
                    // logo单独一行（图文LOGO样式）
                    var logoWidth = Math.round(3 * rem);
                    style['.tuwen-li-logo'] = {
                        'width': logoWidth,
                        'height': logoWidth,
                        'margin': '0px ' + 6.5 * rem + 'px',
                        'text-align': 'center'
                    };
                    style['.tuwen-li-logo img'] = {
                        'width': logoWidth,
                        'height': logoWidth,
                        'border-radius': Math.floor(15 * px) + 'px',
                        'box-shadow': '1px 1px 2px #777'
                    };
                    style['.tuwen-div-up'] = {
                        'width': clientWidth,
                        'height': '55%',
                        'padding': '10% 0',
                        'box-sizing': 'border-box'
                    };
                    style['.text-li-con .tuwen-title'] = {
                        'width': textWidth - 1.5 * itemPadding,
                        'height': Math.round(32 * px) * 2,
                        'margin': itemPadding + 'px ' + 1.5 * itemPadding + 'px',
                        'text-align': 'center'
                    };
                    var titleFontSize = userConfig.titleFontSize || Math.round(22 * px);
                    var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
                    var titleFontColor = userConfig.titleFontColor || 'ffffff'; // adStyle.txtCol;
                    style['.text-li-con .tuwen-title span'] = {
                        font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * px) + 'px ' + titleFontFamily,
                        color: '#' + titleFontColor
                    };
                    style['.text-li-con .tuwen-desc'] = {
                        'width': textWidth,
                        'height': Math.round(26 * px) * 2,
                        'margin': itemPadding + 'px',
                        'text-align': 'center'
                    };
                    var descFontSize = userConfig.descFontSize || Math.round(14 * px);
                    var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
                    var descFontColor = userConfig.descFontColor ||  'ffffff';
                    style['.text-li-con .tuwen-desc span'] = {
                        font: 'normal ' + descFontSize + 'px/' + Math.round(24 * px) + 'px ' + descFontFamily,
                        color: descFontColor
                    };
                    isHasTuwen = true;
                }

                // 文本
                if (stuffType === 500 && !isHasText) {
                    // 上部内容区域
                    style['.text-div-up'] = {
                        'width': clientWidth,
                        'height': '85%',
                        'padding': '5% 0',
                        'box-sizing': 'border-box'
                    };
                    style['.text-title'] = {
                        'width': textWidth - 1.5 * itemPadding,
                        'height': Math.round(32 * px) * 2,
                        'margin': itemPadding + 'px ' + 1.5 * itemPadding + 'px',
                        'margin-top': Math.round(3 * rem) + itemPadding + 'px',
                        'text-align': 'center'
                    };
                    var titleFontSize = userConfig.titleFontSize || 22 * px;
                    var titleFontFamily = userConfig.titleFontFamily || 'SimHei,arial,sans-serif;';
                    var titleFontColor = userConfig.titleFontColor || 'ffffff'; // adStyle.txtCol;
                    style['.text-title span'] = {
                        font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * px) + 'px ' + titleFontFamily,
                        color: '#' + titleFontColor
                    };
                    style['.text-desc'] = {
                        'width': 14 * rem + 'px',
                        'height': Math.round(26 * px) * 2,
                        'margin': itemPadding + 'px',
                        'text-align': 'center'
                    };
                    var descFontSize = userConfig.descFontSize || 14 * px;
                    var descFontFamily = userConfig.descFontFamily || 'SimHei,arial,sans-serif;';
                    var descFontColor = userConfig.descFontColor;
                    style['.text-desc span'] = {
                        font: 'normal ' + descFontSize + 'px/' + 0.5 * vrem + 'px ' + descFontFamily,
                        color: descFontColor
                    };
                    isHasText = true;
                }
                if (stuffType === 100 && !isHasImg) {
                    style['.img-li-con'] = {
                        width: clientWidth,
                        height: '100%',
                        'position': 'relative',
                        'background': '#000',
                        'text-align': 'center'
                    };
                    style['.img-bg'] = {
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'width': '100%',
                        'height': '100%',
                        '-webkit-filter': 'blur(20px)',
                        '-ms-filter': 'blur(20px)',
                        '-moz-filter': 'blur(20px)',
                        'filter': 'blur(20px)',
                        'opacity': 0.5
                    };
                    style['.span-ad'] = {
                        'height': '100%',
                        'display': 'inline-block',
                        'vertical-align': 'middle'
                    };


                    style['.img-ad'] = {
                        '-webkit-box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
                        '-moz-box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
                        'box-shadow': '0 30px 20px rgba(0, 0, 0, 0.2)',
                        'position': 'relative',
                        'vertical-align': 'middle'
                    };
                    // 下载按钮
                    var btnWidth = 120 * px;
                    var btnHeight = 20 * px;
                    var btnFontSize = 14 * px;
                    style['.img-btn'] = {
                        'width': btnWidth + 'px',
                        'height': btnHeight + 'px',
                        'line-height': btnHeight + 'px',
                        'font-size': btnFontSize + 'px',
                        'color': '#fff',
                        'font-family': '\u9ed1\u4f53',
                        'border': '2px solid #fff',
                        'text-align': 'center',
                        'position': 'absolute',
                        'bottom': '10%',
                        'left': (clientWidth - btnWidth) / 2 + 'px'
                    };

                    style['.img-item'] = {
                        'width': clientWidth,
                        'height': '100%',
                        'position': 'absolute',
                        'top': 0,
                        'left': 0,
                        'text-decoration': 'none',
                        'z-index': '2147483646'
                    };
                    style['img-item a'] = {
                        '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                        '-webkit-tap-highlight-color': 'transparent',
                        '-webkit-touch-callout': 'none',
                        '-webkit-user-select': 'none'
                    };
                    isHasImg = true;
                }
                if (stuffType === 500 || stuffType === 600 && (!isHasText && isHasTuwen)) {
                    style['.text-li-con'] = {
                        width: clientWidth,
                        height: '100%',
                        'position': 'relative',
                        'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_image_text_fulllunbo_bc.png) no-repeat',
                        'background-size': '100% 100%'
                    };
                    // 文本折行
                    style['.text-li-con span'] = {
                        'word-wrap': 'break-word'
                    };
                    style['.text-li-con div'] = {
                        'float': 'left',
                        'overflow': 'hidden'
                    };
                    style['.btn-div-down'] = {
                        'width': clientWidth,
                        'height': '17%',
                        'padding': '9% 0',
                        'background': '#fafafa',
                        'box-sizing': 'border-box',
                        'position': 'absolute',
                        'bottom': '0px'
                    };

                    style['.text-btn'] = {
                        'text-align': 'center',
                        'margin': '0px ' + 1.5 * rem + 'px',
                        'width': btnWidth,
                        'height': '100%',
                        'line-height': '100%',
                        'border-radius': Math.floor(15 * px) + 'px',
                        'box-shadow': '1px 1px 5px ' + ItemBackground,
                        'background': ItemBackground
                    };
                    style['.text-btn span'] = {
                        'font': 'normal ' + Math.round(14 * px) + 'px SimHei,arial,sans-serif;',
                        'display': 'inline-block',
                        'vertical-align': 'middle',
                        'margin-top': '8px',
                        'color': '#ffffff' // adStyle.btnCol
                    };
                }
            }
        }
        itemUl.imageArr = this.imageArr.join(' ');

        item.childNodes.push(itemCon);
        itemCon.childNodes.push(itemUl);
        if (ads.length > 1) {
            style['#container'] = {
                'position': 'absolute',
                'left': '50%',
                'Top': '50%',
                'z-index': 1,
                'overflow': 'hidden',
                'background-color': '#000000',
                'background-color': 'rgba(0,0,0,0.5)',
                'color': '#ffffff'
            };
        }

        style['.item-list'] = {
            'height': '100%',
            'width': 16 * rem,
            'overflow': 'hidden',
            'background': '#fafafa'
        };
        items.push(item);
        style['.item-con'] = {
            'width': clientWidth + 'px',
            'float': 'left',
            'overflow': 'hidden'
        };

        style['html'] = {
            'font-size': clientWidth / 16 + 'px'
        };
        style['.item-ul'] = {
            'list-style': 'none',
            'position': 'relative',
            'height': '100%',
            'width': (ads.length + 2) * 100 + '%'
        };

        style['.li-con a'] = {
            'width': clientWidth,
            'height': clientHeight,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'text-decoration': 'none'
        };
        style['.li-con a:hover'] = {};



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

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);

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
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
