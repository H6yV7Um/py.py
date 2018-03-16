/**
 * @file image_sdk template layout
 */
/* globals oojs */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk',
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
        // 移动只出一条广告
        var ad = ads[0];
        // var isCloBtn = true;// ad.closeType || false;
        // 接收一个是否让关闭按钮显示的变量
        var closeBtnIsShow = fullConfig['closeBtnIsShow'];
        if (typeof closeBtnIsShow !== 'undefined') {
            closeBtnIsShow = parseInt(closeBtnIsShow, 10) === 4 ? false : true;
        } else {
            closeBtnIsShow = true;
        }
        var closeTime = 0;// ;ad.closeTime || 5;
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
        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.class = 'imgAD';
        img.id = 'imgAD';
        item.childNodes.push(img);
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

        // 当参数closeBtnIsShow的值是false时，不显示关闭按钮，true时显示
        if (closeBtnIsShow) {
            // 广告关闭按钮
            var closeBtn = engine.getLayout(fullConfig);
            closeBtn.tagName = 'div';
            closeBtn.id = 'closeBtn';
            closeBtn['data-isbtn'] = closeBtnIsShow;
            closeBtn['data-btnbp'] = userConfig['clobp'] || 'top_right';
            var closeDiv = engine.getLayout(fullConfig);
            closeDiv.tagName = 'div';
            closeDiv.id = 'closeDiv';
            // closeDiv.innerHTML = isCloBtn ? '\u0026\u0023\u0032\u0031\u0035\u003b' : closeTime + 's';
            closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b',
                closeBtn.childNodes.push(closeDiv);
            items.push(closeBtn);
        }

        if (act === 2) {
            // 下载按钮
            var downBtn = engine.getLayout(fullConfig);
            downBtn.tagName = 'img';
            downBtn.id = 'downBtn';
            downBtn.class = 'downBtn';
            items.push(downBtn);
            downBtn.src = '{{dupDomain}}/adserv/img/click_ivn_3.gif';
        }

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
        // container['marginTop'] = conMarTop;
        // 相对尺寸
        var px = containerWidth / 300;
        var pt = px;

        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        style['.item'] = {
            position: 'relative'
        };

        var imgWidth = itemWidth;
        var imgHeight = imgWidth * ad.height / ad.width;
        var imgMarginTop = (itemHeight - imgHeight) / 2;
        style['.imgAD'] = {
            width: imgWidth,
            height: imgHeight,
            margin: imgMarginTop + 'px 0px',
            border: conBorB + 'px ' + conBorStyle + ' ' + conBorColor
        };
        img['data-imgBorder'] = conBorB;
        img['data-imgRatio'] = parseInt(imgHeight, 10) / parseInt(imgWidth, 10);
        if (act === 2) {
            // 下载按钮样式
            style['.downBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '10',
                'bottom': '0px',
                'right': '0px',
                'width': Math.ceil(56 * px),
                'height': Math.ceil(56 * px),
                'filter': 'alpha(opacity=80)',
                '-moz-opacity': '0.8',
                '-khtml-opacity': '0.8',
                'opacity': '0.8',
                'display': 'none'
            };
        }
        // 关闭按钮样式
        var closeBtnRadius = Math.ceil(16 * px);
        var closeBtnDivRadius = Math.ceil(21 * px);
        // if (isCloBtn) {
        if (closeBtnIsShow) {
            style['div#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': 50,
                'height': 50,
                'text-align': 'center'
            };
            style['div#closeDiv'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': 30,
                'height': 30,
                'border-radius': 15 + 'px',
                'font': 'normal ' + 30 + 'px/' + 30 + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#888',
                'color': '#fff'
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
            style['div#closeBtn'].top = Math.ceil(3 * px) + imgMarginTop + 'px';
        } else {
            style['div#closeBtn'].bottom = Math.ceil(3 * px) + imgMarginTop + 'px';
        }
        if (clobpArray[1] === 'left') {
            style['div#closeBtn'].left = Math.ceil(3 * px) + 'px';
        } else {
            style['div#closeBtn'].right = Math.ceil(3 * px) + 'px';
        }


        // add logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        var adMark = this.adIcon.getAdIcon({adIconType: 'mob-bd-adIcon'});
        logo.id = 'bd-logo4';
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