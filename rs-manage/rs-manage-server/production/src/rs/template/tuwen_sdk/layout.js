/* global oojs */
/**
* @file tuwen_sdk
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_sdk',
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
        titleFontFamily: 'Microsoft YaHei,SimHei,arial,sans-serif;'
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
    //  下载按钮图片
    downloadIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_dl.png',
    //  普通按钮图片
    defaultIcon: '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/tuwen_sdk_lp.png',

    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        // 接收一个是否让关闭按钮显示的变量
        var closeBtnIsShow = fullConfig['closeBtnIsShow'];
        if (typeof closeBtnIsShow !== 'undefined') {
            closeBtnIsShow = parseInt(closeBtnIsShow, 10) === 4 ? false : true;
        } else {
            closeBtnIsShow = true;
        }
        // 样式方案
        var adStyleA = {
            // 灰色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%);background: radial-gradient(circle at bottom right, #e8e6e9 0%, #fafafa 78%, #f8f8f8 100%)',
            txtCol: '000',
            btnW: 95,
            btnBg: '8dc153',
            btnCol: 'fff',
            btnIcon: false
        };
        var adStyleB = {
            // 灰色
            adBg: 'f8f8f8',
            txtCol: '000',
            btnW: 95,
            btnBg: '8dc153',
            btnCol: 'fff',
            btnIcon: false
        };
        var adStyleC = {
            // 蓝色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%);background: radial-gradient(circle at bottom right, #a2adda 0%, #b7ceed 78%, #d4e4f4 100%)',
            txtCol: 'fff',
            btnW: 110,
            btnBg: 'fff',
            btnCol: '000',
            btnIcon: true
        };
        var adStyleD = {
            // 红色渐变
            adBg: '-webkit-radial-gradient(bottom right, circle, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%);background: radial-gradient(circle at bottom right, #e8acb4 0%, #ead3cb 78%, #eccbbc 100%)',
            txtCol: 'fff',
            btnW: 110,
            btnBg: 'fff',
            btnCol: '000',
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
        var secondCheckText = '\u786e\u8ba4\u6253\u5f00';// 确认打开
        var APOText = '\u67e5\u770b\u8be6\u60c5';// 确认唤醒
        var adStyle = adStyleA;
        var act = ad.actionType || 1;
        var actText = lpText;
        var bntIcon = '';
        switch (act) {
            case 1: actText = lpText; bntIcon = this.defaultIcon; break;
            case 2: actText = downloadText; bntIcon = this.downloadIcon; secondCheckText = '\u786e\u8ba4\u4e0b\u8f7d'; break;
            case 4: actText = mapText; break;
            case 8: actText = smsText; secondCheckText = '\u786e\u8ba4\u53d1\u9001'; break;
            case 32: actText = telText; secondCheckText = '\u786e\u8ba4\u53d1\u9001'; break;
            case 512: actText = APOText; break;
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

        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo0';
        logo.class = 'logo';
        // logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        item.childNodes.push(logo);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        // title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        item.childNodes.push(title);

        // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        // desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        item.childNodes.push(desc);

        // 下载按钮
        var btn = engine.getLayout(fullConfig);
        btn.tagName = 'div';
        btn.class = 'btn';
        var btnText = engine.getLayout(fullConfig);
        btnText.tagName = 'span';
        btnText.innerHTML = actText;
        // 按钮图标
        var arrIcon = engine.getLayout(fullConfig);
        arrIcon.tagName = 'img';
        arrIcon.src = bntIcon;
        if (adStyle.btnIcon && bntIcon) {
            btn.childNodes.push(arrIcon);
        }
        btn.childNodes.push(btnText);
        item.childNodes.push(btn);

        // 填充广告数据
        logoImg.src = ad.stuffSrc;
        titleText.innerHTML = ad.title;
        descText.innerHTML = ad.desc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);

        // 当参数closeBtnIsShow不为4时，创建关闭按钮
        if (closeBtnIsShow) {
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
        }

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
        secondCheckInfo.innerHTML = secondCheckText;
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
        // container居中
        style['#container.container'] = {
            'position': 'absolute',
            'left': '50%',
            'Top': '50%',
            'margin-top': -fullConfig.templateHeight / 2,
            'margin-left': -fullConfig.templateWidth / 2,
            'z-index': 1
        };

        // 相对尺寸
        var px = containerWidth / 300;
        var pt = px;

        style['.container'] = containerStyle;
        var itemPadding = Math.round(20 * px);
        var itemWidth = containerWidth - (itemPadding * 2);
        var itemHeight = containerHeight - (itemPadding * 2);
        var ItemBackground = userConfig['containerBackgroundColor'] || adStyle.adBg;
        style['.item'] = {
            background: ItemBackground,
            width: itemWidth,
            height: itemHeight,
            padding: itemPadding + 'px',
            position: 'relative'
        };
        // 移动广告全区域可点击
        style['.item a'] = {
            width: containerWidth,
            height: containerHeight,
            position: 'absolute',
            top: 0,
            left: 0
        };
        style['.item a:hover'] = {};
        style['.item div'] = {
            'float': 'left',
            'overflow': 'hidden'
        };

        // logo单独一列
        var logoWidth = Math.round(80 * px);
        style['.item .logo'] = {
            width: logoWidth + itemPadding,
            height: itemHeight
        };
        style['.item .logo img'] = {
            'width': logoWidth,
            'height': logoWidth,
            'border-radius': Math.floor(15 * px) + 'px',
            'box-shadow': '1px 1px 2px #777'
        };

        // 文本折行
        var textWidth = itemWidth - logoWidth - itemPadding;
        style['.item span'] = {
            'word-wrap': 'break-word'
        };
        style['.item .title'] = {
            width: textWidth,
            height: Math.round(32 * pt) * 2
        };
        var titleFontSize =  Math.round(22 * pt);
        var titleFontFamily = fullConfig.titleFontFamily;
        var titleFontColor = userConfig.titleFontColor || adStyle.txtCol;
        style['.item .title span'] = {
            font: 'normal bold ' + titleFontSize + 'px/' + Math.round(32 * pt) + 'px ' + titleFontFamily,
            color: '#' + titleFontColor
        };

        var descTopSpace = Math.round(14 * px);
        style['.item .desc'] = {
            width: textWidth,
            height: Math.round(24 * pt) * 2,
            padding: descTopSpace + 'px 0 0 0'
        };
        var descFontSize =  Math.round(14 * pt);
        var descFontFamily = fullConfig.titleFontFamily;
        var descFontColor = userConfig.descFontColor || adStyle.txtCol;
        style['.item .desc span'] = {
            font: 'normal ' + descFontSize + 'px/' + Math.round(24 * pt) + 'px ' + descFontFamily,
            color: '#' + descFontColor
        };

        var btnWidth = Math.round(adStyle.btnW * px);
        var btnHeight = Math.round(30 * px);
        var btnBackground = userConfig.cbtnbackground || adStyle.btnBg;
        style['.item .btn'] = {
            'text-align': 'center',
            'margin': Math.floor(40 * px) + 'px 0 0 0',
            'width': btnWidth,
            'height': btnHeight,
            'border-radius': Math.floor(px) + 'px',
            'box-shadow': '1px 1px ' + Math.floor(px) + 'px #aaa',
            'background': '#' + btnBackground
        };
        style['.item .btn img'] = {
            'vertical-align': 'middle',
            'line-height': btnHeight,
            'height': btnHeight
        };
        style['.item .btn span'] = {
            'font': 'normal ' + Math.round(14 * pt) + 'px/' + btnHeight + 'px SimHei,arial,sans-serif;',
            'line-height': btnHeight,
            'color': '#' + adStyle.btnCol
        };

        if (closeBtnIsShow) {
            // 关闭按钮样式
            var closeBtnRadius = 30;
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
                style['div#closeBtn'].top = Math.ceil(0 * px) + 'px';
            } else {
                style['div#closeBtn'].bottom = Math.ceil(3 * px) + 'px';
            }
            if (clobpArray[1] === 'left') {
                style['div#closeBtn'].left = Math.ceil(3 * px) + 'px';
            } else {
                style['div#closeBtn'].right = Math.ceil(0 * px) + 'px';
            }
        }
        // logo标识的统一化，不需要有单独的尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': Math.round(12 * pt),
        //     'height': Math.round(12 * pt),
        //     'background-size': 'contain'
        // };
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
