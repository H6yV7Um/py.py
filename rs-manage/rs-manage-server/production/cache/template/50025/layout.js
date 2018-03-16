/* global oojs */

/**
* @file tuwen_wap_wise
* @author qianxiaoli
*/

/* eslint-disable max-len */
oojs.define({
    name: '50025',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
        adIcon: 'TemplateServer.Business.adIcon'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000',
        logoType: 'feed-logo',
        adIconType: 'feed-adIcon'
    },
    // 秋实Sdk所需信息
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
    recomputeRootFontSize: function (viewportWidth) {
        var comparedWidth = 1000;
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        return currentRootFontSize;
    },
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 4;
        var engine = this.basic;

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        // items
        var items = container.childNodes;
        // item 移动只出一条广告
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        items.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_self';
        // a.id = 'item0';
        a.id = 'res0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;
        // 填充广告数据
        a.title = ad.action[0] && ad.action[0].forward && ad.action[0].forward.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        var ext = JSON.parse(ad.wapAppInfo);
        var tu = (ext && ext.tu) ? ext.tu : 0;
        a['data-tu'] = tu;
        a['data-mcurl'] = ad.mcurl || '';
        item.childNodes.push(a);

        // title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'p';
        title.class = 'title';
        // title.innerHTML = ad.title;
        var textTitle = ad.textTitle[0].length > 18 ? (ad.textTitle[0].substr(0, 18) + '...') : ad.textTitle[0];
        title.innerHTML = textTitle;
        a.childNodes.push(title);

        // pic
        var pic = engine.getLayout(fullConfig);
        pic.tagName = 'img';
        pic.class = 'pic';
        var picHeight = Math.floor((containerWidth - 2) * 27 / 64);
        pic['data-height'] = picHeight;
        pic.src = ad.imgFileSrc[0];
        a.childNodes.push(pic);

        // 广告关闭按钮
        if (fullConfig.closeBtnIsShow) {
            var closeBtn = engine.getLayout(fullConfig);
            closeBtn.tagName = 'div';
            closeBtn.id = 'closeBtn';
            closeBtn.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
            items.push(closeBtn);
        }

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);

        style['*'] = {
            padding: 0,
            margin: 0
        };
        style.html = {
            'font-size': this.recomputeRootFontSize(containerWidth) + 'px'
        };
        style['.item'] = {
            width: '100%',
            height: '100%',
            overflow: 'auto',
            position: 'relative'
        };
        style['.item a'] = {
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none'
        };

        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative',
            'box-sizing': 'border-box',
            'border': '1px solid #eeeeee'
        };

        style['.title'] = {
            'box-sizing': 'border-box',
            'padding': '0 1rem',
            'font-size': '2.8rem',
            'color': '#333',
            'background': '#fff',
            'position': 'absolute',
            'top': '0',
            'opacity': '0',
            'width': '100%',
            'box-sizing': 'border-box'
        };

        style['.pic'] = {
            width: containerWidth - 2 + 'px',
            position: 'absolute',
            bottom: '0px',
            height: picHeight + 'px'
        };

        style['.feed-adIcon'] = {
            position: 'absolute',
            left: '0',
            bottom: '0'
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
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({
                adIconType: 'feed-adIcon'
            }));
        }

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
