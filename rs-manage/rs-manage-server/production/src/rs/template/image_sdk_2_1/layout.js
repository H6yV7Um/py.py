/**
 * @file image_sdk_2_1 template layout
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_2_1',
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
        containerPaddingLeft: 0
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

        var downloadText = '\u7acb\u5373\u4e0b\u8f7d';// 立即下载
        var lpText = '\u5173\u6ce8\u8be6\u60c5';// 关注详情
        var telText = '\u62e8\u6253\u7535\u8bdd';// 拨打电话
        var smsText = '\u53d1\u9001\u77ed\u4fe1';// 发送短信
        var mapText = '\u663e\u793a\u5730\u56fe';// 显示地图
        var act = ads[0].actionType || 1;
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
        // 移动只出一条广告
        var ad = ads[0];
        var isCloBtn = true;// ad.closeType || false;
        var closeTime = 0;// ;ad.closeTime || 5;
        var act = ad.actionType || 1;


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
        a.class = 'item0';
        a.id = 'item0';

        // 6/5的背景
        var itemBg = engine.getLayout(fullConfig);
        itemBg.tagName = 'div';
        itemBg.class = 'itemBg';
        itemBg.id = 'itemBg';
        item.childNodes.push(itemBg);

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
        img.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);

        // 广告关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        closeBtn['data-isbtn'] = isCloBtn;
        closeBtn['data-btnbp'] = userConfig['clobp'] || 'top_right';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = isCloBtn ? '\u0026\u0023\u0032\u0031\u0035\u003b' : closeTime + 's';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';';
        items.push(qiushiInfo);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
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
        // container['marginTop'] = conMarTop;
        // 相对尺寸
        var px = containerWidth / 300;
        var pt = px;

        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        style['.item'] = {
            position: 'relative'
        };

        // 6/5模板的样式
        var imgBgWidth = itemWidth;
        var imgBgHeight = imgBgWidth * 5 / 6;
        var imgBgMarginTop = (itemHeight - imgBgHeight) / 2;
        var imgBgPaddingTop = 113 / 625 * imgBgHeight;
        var imgBgPaddingLeft = 60 / 750 * imgBgWidth;
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
        // 关闭按钮样式
        // var closeBtnRadius = Math.ceil(16 * px);
        // var closeBtnDivRadius = Math.ceil(21 * px);
        var closeBtnRadius = 20;
        var closeBtnDivRadius = 50;
        if (isCloBtn) {
            style['div#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnDivRadius + 'px',
                'height': closeBtnDivRadius + 'px',
                'text-align': 'center'
            };
            style['div#closeDiv'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnRadius,
                'height': closeBtnRadius,
                'border-radius': closeBtnRadius / 2 + 'px',
                'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#45280D',
                'color': ItemBackground
            };
        }
        else {
            style['div#closeBtn'] = {
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnRadius * 2,
                'height': closeBtnRadius * 2,
                'font': 'normal ' + (closeBtnRadius * 2) + 'px/' + (closeBtnRadius * 2) + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#888',
                'color': '#fff'
            };
        }

        var clobp = userConfig['clobp'] || 'top_right';
        var clobpArray = clobp.split('_');
        if (clobpArray[0] === 'top') {
            style['div#closeBtn'].top = Math.ceil(3 * px) + imgBgMarginTop + 'px';
        } else {
            style['div#closeBtn'].bottom = Math.ceil(3 * px) + imgBgMarginTop +  'px';
        }
        if (clobpArray[1] === 'left') {
            style['div#closeBtn'].left = Math.ceil(3 * px) + 'px';
        } else {
            style['div#closeBtn'].right = Math.ceil(3 * px) + 'px';
        }


        // add logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4';
        var adMark = this.adIcon.getAdIcon({adIconType: 'mob-bd-adIcon'});
        adMark.id = 'mob-bd-adIcon';
        if (fullConfig.logoIsShow) {
            container.childNodes.push(logo);
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(adMark);
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});