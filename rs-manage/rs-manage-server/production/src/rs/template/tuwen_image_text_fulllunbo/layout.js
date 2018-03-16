/**
 * @file tuwen_image_text_fulllunbo template layout
 * @author qianxiaoli
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_image_text_fulllunbo',
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
        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.class = 'imgAD' + adIndex;
        img.id = 'imgAD' + adIndex;
        liCon.childNodes.push(img);
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

        if (act === 2) {
            // 下载按钮
            var downBtn = engine.getLayout(fullConfig);
            downBtn.tagName = 'img';
            downBtn.id = 'downBtn' + adIndex;
            downBtn.class = 'downBtn' + adIndex;
            liCon.childNodes.push(downBtn);
            downBtn.src = '{{dupDomain}}/adserv/img/click_ivn_3.gif';
        }

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
            position: 'relative'
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
        style['.imgAD' + adIndex] = {
            width: imgWidth,
            height: imgHeight,
            margin: imgMarginTop + 'px ' + imgMarginLeft + 'px',
            border: conBorB + 'px ' + conBorStyle + ' ' + conBorColor
        };
        style['#item' + adIndex] = {
            'width': imgWidth + conBorB * 2,
            'height': imgHeight + conBorB * 2,
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
        if (act === 2) {
            // 下载按钮样式
            style['.downBtn' + adIndex] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483640',
                'bottom': imgMarginTop + conBorB + 'px',
                'right': imgMarginLeft + 'px',
                'width': Math.ceil(56 * px) > 100 ? 100 : Math.ceil(56 * px),
                'height': Math.ceil(56 * px) > 100 ? 100 : Math.ceil(56 * px),
                'filter': 'alpha(opacity=80)',
                '-moz-opacity': '0.8',
                '-khtml-opacity': '0.8',
                'opacity': '0.8'
            };
        }
         // 广告关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn' + adIndex;
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv' + adIndex;
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        liCon.childNodes.push(closeBtn);

        // 相对尺寸
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var px = containerWidth / 300;
        // 关闭按钮样式
        var closeBtnRadius = 30;
        var closeBtnDivRadius = 50;
        style['div#closeBtn' + adIndex] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center'
        };
        style['div#closeDiv' + adIndex] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };
        var clobp = 'top_right';
        closeBtn['data-btnbp'] = clobp;
        var clobp = 'top_right'; // userConfig['clobp'] ||
        var clobpArray = clobp.split('_');
        if (clobpArray[0] === 'top') {
            style['div#closeBtn' + adIndex].top = Math.ceil(3 * px) + imgMarginTop + 'px';
        } else {
            style['div#closeBtn' + adIndex].bottom = Math.ceil(3 * px) + imgMarginTop + 'px';
        }
        if (clobpArray[1] === 'left') {
            style['div#closeBtn' + adIndex].left = Math.ceil(3 * px) + 'px';
        } else {
            style['div#closeBtn' + adIndex].right = Math.ceil(3 * px) + 'px';
        }
        // add logo
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4' + adIndex;
        if (fullConfig.logoIsShow) {
            liCon.childNodes.push(logo);
        }
        // 添加广告标识
        var bdIcon = this.adIcon.getAdIcon(fullConfig);
        bdIcon.id = 'mob-bd-adIcon' + adIndex;
        if (fullConfig.adIconIsShow) {
            liCon.childNodes.push(bdIcon);
        }
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
        for (var i = 0, len = ads.length; i < len; i++) {
            var ad = ads[i];
            var itemList = engine.getLayout(fullConfig);
            itemList.tagName = 'li';
            itemList.class = 'itemList' + i;
            itemList.id = 'itemList' + i;
            var itemListObj = {};
            switch (ad.stuffType) {
                // case 600: itemListObj = this.drawTuWen(context, itemList, style, ad, i);break;
                // case 500: itemListObj = this.drawText(context, itemList, style, ad, i);break;
                case 100: itemListObj = this.drawImage(context, itemList, style, ad, i); break;
                default: ;break;
            }
            itemUl.childNodes.push(itemListObj.itemList);
            style = itemListObj.style;
            style['.itemList' + i] = {
                'height': '100%',
                'width': clientWidth + 'px',
                'position': 'absolute',
                'display': 'block',
                'top': '0',
                'left': clientWidth * i + 'px',
                'float': 'left',
                'overflow': 'hidden'
            };
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

        var rem = clientWidth / 16;
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

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
