/**
 * @file tuwen_app_fulllunbo_6_5 template layout
 * @author qianxiaoli
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_app_fulllunbo_6_5',
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

        var itemWidth = clientWidth;
        var itemHeight = parseInt(clientWidth * 5 / 6, 10);
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

        var itemConA = engine.getLayout(fullConfig);
        itemConA.tagName = 'a';
        itemConA.class = 'item_con_a';
        itemConA.id = 'item_con_0';
        itemConA.target = '_blank';

        var itemCon = engine.getLayout(fullConfig);
        itemCon.tagName = 'div';
        itemCon.class = 'item_con';
        itemCon.id = 'item_con';

        var itemImgDiv = engine.getLayout(fullConfig);
        itemImgDiv.tagName = 'div';
        itemImgDiv.class = 'item_img_div';
        itemImgDiv.id = 'item_img_div';

        var itemImg = engine.getLayout(fullConfig);
        itemImg.tagName = 'img';
        itemImg.class = 'item_img';
        itemImg.id = 'item_img';
        // 添加样式部分
        var style = {};
        var extention = ads[0].extention ? JSON.parse(ads[0].extention) : {};
        var appImgArr = ads[0].customizedContent ? ads[0].customizedContent.image : [];
        itemImg.src = appImgArr[0];
        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';';

        var appInfo = extention.appinfo ? extention.appinfo : {};
        appIconImg.src =  ads[0].stuffSrc;

        if (appInfo) {
            var appIntrName = String(appInfo.name);
            if (appIntrName.replace(/[^\x00-\xff]/g, 'ci').length > 34) {
                appIntrName = appIntrName.substr(0, 16).replace(/([^\x00-\xff])/g, '\x241').substr(0, 16).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            }
            appIntr.innerHTML = appIntrName;
            var source = String(appInfo.appDesc);
            if (source.replace(/[^\x00-\xff]/g, 'ci').length > 50) {
                source = source.substr(0, 30).replace(/([^\x00-\xff])/g, '\x241').substr(0, 30).replace(/[^\x00-\xff]$/, '').replace(/([^\x00-\xff]) /g, '\x241') + '…';
            }
            appIntrCon.innerHTML = source;
        }
        itemConA.href = ads[0].clickUrl;
        appDownBtn.src = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/app_down_btn.png';
        item.childNodes.push(qiushiInfo);
        appIcon.childNodes.push(appIconImg);
        itemCon.childNodes.push(appIcon);
        itemCon.childNodes.push(appIntr);
        itemCon.childNodes.push(appIntrCon);
        itemCon.childNodes.push(appDownBtn);
        itemImgDiv.childNodes.push(itemImg);
        itemConA.childNodes.push(itemImgDiv);
        itemConA.childNodes.push(itemCon);
        item.childNodes.push(itemConA);
        items.push(item);
        // 遮罩在应用信息上的a
        style['.item_con_a'] = {
            'width': '16rem',
            'height': '14rem',
            'overflow': 'hidden',
            'display': 'block',
            'text-decoration': 'none'

        };
        style['.item_con'] = {
            'width': '7.5rem',
            'height': '14rem',
            'overflow': 'hidden',
            'display': 'block',
            'float': 'right',
            'padding-left': '0.5rem'
        };
        // logo 图标
        style['.app_icon'] = {
            'margin': '1rem 2rem',
            'width': '3rem',
            'height': '3rem',
            'overflow': 'hidden'
        };
        style['.app_icon_img'] = {
            'width': '3rem',
            'height': '3rem',
            'border-radius': '0.5rem'
        };
        style['.app_down_btn'] = {
            'width': '4.8rem',
            'height': '1.2rem',
            'margin': '0.7rem 1.1rem'
        };

        style['.app_intr'] = {
            'clear': 'both',
            'height': '1.7rem',
            'width': '7rem',
            'line-height': '0.9rem',
            'color': '#000',
            'font-weight': 'bold',
            'font-size': '0.8rem',
            'text-align': 'center',
            'overflow': 'hidden'
        };
        style['.app_intr_con'] = {
            'clear': 'both',
            'width': '7rem',
            'height': '2.7rem',
            'line-height': '0.9rem',
            'margin-top': '0.8rem',
            'font-size': '0.7rem',
            'overflow': 'hidden',
            'color': '#a1a1a1'
        };
        var rem = clientWidth / 16;
        style['html'] = {
            'font-size': clientWidth / 16 + 'px',
            'background-color': '#fff'
        };
        style['.item'] = {
            'width': '16rem',
            'height': '14rem',
            'position': 'relative',
            // 'border': '1px solid #448ACA',
            'border': '1px solid #DFDFD0',
            'overflow': 'hidden',
            'box-sizing': 'border-box'
            // 'top': '0',
            // 'transform': 'translateY(-50%)',
            // 'left': 0,
            // 'padding': '0.5rem'
        };
        style['.item_img_div'] = {
            'width': '8rem',
            'height': '14rem',
            'float': 'left'
        };
        style['.item_img'] = {
            'list-style': 'none',
            'width': '8rem',
            'height': '100%'
        };
        style['.container'] = {
            'position': 'absolute',
            'left': '50%',
            'Top': '50%',
            // 'width': clientWidth + 'px',
            // 'height': clientHeight + 'px',
            'width': '16rem',
            'height': '14rem',
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
        container.childNodes.push(logo);

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
