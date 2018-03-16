/**
 * @file tuwen_app_fulllunbo template layout
 * @author qianxiaoli
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_app_fulllunbo',
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

        var appIcon = engine.getLayout(fullConfig);
        appIcon.tagName = 'div';
        appIcon.class = 'app_icon';
        appIcon.id = 'app_icon';

        var appIconImg = engine.getLayout(fullConfig);
        appIconImg.tagName = 'img';
        appIconImg.class = 'app_icon_img';
        appIconImg.id = 'app_icon_img';

        var appTitle = engine.getLayout(fullConfig);
        appTitle.tagName = 'div';
        appTitle.class = 'app_title';
        appTitle.id = 'app_title';

        var textTitle = engine.getLayout(fullConfig);
        textTitle.tagName = 'div';
        textTitle.class = 'text_title';
        textTitle.id = 'text_title';

        var appDownBtn = engine.getLayout(fullConfig);
        appDownBtn.tagName = 'img';
        appDownBtn.class = 'app_down_btn';
        appDownBtn.id = 'app_down_btn';

        var appIntr = engine.getLayout(fullConfig);
        appIntr.tagName = 'div';
        appIntr.class = 'app_intr';
        appIntr.id = 'app_intr';

        var appIntrCon = engine.getLayout(fullConfig);
        appIntrCon.tagName = 'div';
        appIntrCon.class = 'app_intr_con';
        appIntrCon.id = 'app_intr_con';

        var itemCon = engine.getLayout(fullConfig);
        itemCon.tagName = 'a';
        itemCon.class = 'item_con';
        itemCon.id = 'item_con_0';
        itemCon.target = '_blank';

        var itemUl = engine.getLayout(fullConfig);
        itemUl.tagName = 'ul';
        itemUl.class = 'item_ul';
        itemUl.id = 'item_ul';

        // 添加样式部分
        var style = {};
        var extention = ads[0].extention ? JSON.parse(ads[0].extention) : {};
        var appImgArr = ads[0].customizedContent ? ads[0].customizedContent.image : [];

        for (var i = 0, len = appImgArr.length; i < len; i++) {
            var appImg = appImgArr[i];
            var itemList = engine.getLayout(fullConfig);
            itemList.tagName = 'li';
            itemList.class = 'item_list_' + i;
            itemList.id = 'item_list_' + i;

            var appImgA = engine.getLayout(fullConfig);
            appImgA.tagName = 'a';
            appImgA.class = 'app_img_a';
            appImgA.id = 'appImgA' + (i + 1);
            appImgA.target = '_blank';

            var itemImg = engine.getLayout(fullConfig);
            itemImg.tagName = 'img';
            itemImg.class = 'app_img_' + i;
            itemImg.id = 'app_img_' + i;

            itemImg.src = appImg;
            appImgA.childNodes.push(itemImg);
            itemList.childNodes.push(appImgA);
            itemUl.childNodes.push(itemList);
            style['.item_list_' + i] = {
                'position': 'absolute',
                'display': 'block',
                'top': '0',
                'float': 'left',
                'overflow': 'hidden'
            };
            style['.app_img_' + i] = {
                border: 'none'
            };
        }
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';';

        var appInfo = extention.appinfo ? extention.appinfo : {};
        appIconImg.src =  ads[0].stuffSrc;
        textTitle.innerHTML = ads[0].title;
        if (appInfo) {
            appTitle.innerHTML = appInfo.name;
            appIntr.innerHTML = '应用介绍';
            var source = String(appInfo.appDesc);
            if (source.replace(/[^\x00-\xff]/g, 'ci').length > 78) {
                source = source.substr(0, 78).replace(/([^\x00-\xff])/g, '\x241').substr(0, 78).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            }
            appIntrCon.innerHTML = source;
        }
        itemCon.href = ads[0].clickUrl;
        appDownBtn.src = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/app_down_btn.png';
        item.childNodes.push(qiushiInfo);
        appIcon.childNodes.push(appIconImg);
        itemCon.childNodes.push(appIcon);
        itemCon.childNodes.push(appTitle);
        itemCon.childNodes.push(textTitle);
        itemCon.childNodes.push(appDownBtn);
        itemCon.childNodes.push(appIntr);
        itemCon.childNodes.push(appIntrCon);
        item.childNodes.push(itemCon);
        item.childNodes.push(itemUl);
        items.push(item);
        style['.item_con'] = {
            'width': clientWidth + 'px',
            'overflow': 'hidden',
            'display': 'block',
            'text-decoration': 'none'
        };
        style['.app_icon'] = {
            'margin': '1rem',
            'width': '4rem',
            'height': '4rem',
            'overflow': 'hidden',
            'float': 'left'

        };
        style['.app_icon_img'] = {
            width: '4rem',
            height: '4rem'
        };
        style['.app_title'] = {
            'width': '9rem',
            'height': '2rem',
            'line-height': '1rem',
            'overflow': 'hidden',
            'float': 'left',
            'margin-top': '1rem',
            'margin-right': '1rem',
            'font-size': '0.8rem',
            'font-weight': 'bold',
            'text-decoration': 'none',
            'color': '#000'
        };
        style['.text_title'] = {
            'width': '9rem',
            'height': '1rem',
            'float': 'left',
            'overflow': 'hidden',
            'margin-right': '1rem',
            'font-size': '0.6rem',
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            'color': '#868686'
        };
        style['.app_down_btn'] = {
            height: '1rem'
        };
        style['.app_intr'] = {
            'clear': 'both',
            'padding-top': '0.7rem',
            'margin': '0 1rem 0.7rem 1rem',
            'height': '1.2rem',
            'float': 'left',
            'width': '14rem',
            'line-height': '1.2rem',
            'border-top': '1px solid #ccc',
            'color': '#868686'
        };
        style['.app_intr_con'] = {
            'clear': 'both',
            'max-height': '3.2rem',
            'line-height': '0.8rem',
            'margin-left': '1rem ',
            'margin-right': '1rem',
            'margin-bottom': '0.7rem',
            'font-size': '0.7rem',
            'overflow': 'hidden',
            'color': '#a1a1a1'
        };
        var rem = clientWidth / 16;
        style['html'] = {
            'font-size': clientWidth / 16 + 'px',
            'background-color': '#fff'
        };
        style['.item a'] = {
            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
        };
        style['.item_ul'] = {
            'list-style': 'none',
            'position': 'relative'
        };
        style['#container'] = {
            'position': 'absolute',
            'left': '50%',
            'Top': '50%',
            'margin-top': -fullConfig.templateHeight / 2,
            'margin-left': -fullConfig.templateWidth / 2,
            'z-index': 1,
            'overflow': 'hidden',
            'background-color': '#ffffff',
            'color': '#000000'
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
        item.childNodes.push(closeBtn);
        var closeBtnRadius = 20;
        var closeBtnDivRadius = 50;
        style['div#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnDivRadius + 'px',
                'height': closeBtnDivRadius + 'px',
                'text-align': 'center',
                'top': '0',
                'right': '0'
            };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff',
            'top': '5px',
            'right': '5px'
        };
        var logo = this.logo.getLogo({logoType: 'bd-logo4'});
        logo.id = 'bd-logo4';
        if (fullConfig.logoIsShow) {
            item.childNodes.push(logo);
        }
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
