/* global oojs */
/**
* @file image_sdk_banner_icon
* @author fanwenjuan
*/
/* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_sdk_banner_icon',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        bannerImgUrl: 'rs.common.model.bannerImgUrl',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    //  是否缓存Layout的结果
    isNeedLayoutCache: false,
    //  是否需要数据引擎渲染数据
    isNeedRenderData: false,
    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000'
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
    // 布局, 生成布局对象
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;
        // 移动只出一条广告
        var ad = ads[0];
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
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        // res
        var res = engine.getLayout(fullConfig);
        res.tagName = 'img';
        res.id = 'res';
        res.class = 'res';
        a.childNodes.push(res);

        // icon
        var icon = engine.getLayout(fullConfig);
        icon.class = 'icon';
        a.childNodes.push(icon);

        // 填充广告数据
        res.src = ad.stuffSrc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);
        // 广告关闭按钮
        if (fullConfig['closeBtnIsShow']) {
            var closeBtn = engine.getLayout(fullConfig);
            closeBtn.tagName = 'div';
            closeBtn.id = 'closeBtn';
            closeBtn.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
            items.push(closeBtn);
        }


        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';' + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);

        // 添加logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var pt = containerHeight / 48;

        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px'
        };
        style['.container'] = containerStyle;

        style['.item, .item a'] = {
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none'
        };
        style['.item a'] = {
            display: 'block'
        };
        style['.item div'] = {
            overflow: 'hidden'
        };

        style['.res'] = {
            display: 'block',
            width: '100%',
            height: '100%'
        };
        // icon
        var btnbackground = fullConfig.cbtnbackground || '2e83f7';
        style['.icon, .icon::after'] = {
            'position': 'absolute',
            'right': 0,
            'top': 0,
            'z-index': '2147483647',
            // 'background': '#' + btnbackground,
            'width': containerHeight + 'px',
            'height': containerHeight + 'px',
            'opacity': 0.9
        };
        if (act !== 2) {
            var iconSrc = this.bannerImgUrl.get(act);
            style['.icon'] = {
                'background': '#' + btnbackground
            };
            style['.icon::after'] = {
                'content': '\'\'',
                'background': '#fff',
                '-moz-mask-size': '100% 100%',
                '-webkit-mask-size': '100% 100%',
                '-o-mask-size': '100% 100%',
                '-ms-mask-size': '100% 100%',
                'mask-size': '100% 100%',
                '-moz-mask-image': 'url(' + iconSrc + ')',
                '-webkit-mask-image': 'url(' + iconSrc + ')',
                '-o-mask-image': 'url(' + iconSrc + ')',
                '-ms-mask-image': 'url(' + iconSrc + ')',
                'mask-image': 'url(' + iconSrc + ')'
            };
        }
        if (fullConfig['closeBtnIsShow']) {
            var closeBtnRadius = Math.ceil(6 * pt);
            style['#closeBtn'] = {
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': '2147483647',
                'width': closeBtnRadius * 2,
                'height': closeBtnRadius * 2,
                'border-radius': closeBtnRadius + 'px',
                'font': 'normal ' + (closeBtnRadius * 2) + 'px/' + (closeBtnRadius * 2) + 'px arial,sans-serif;',
                'text-align': 'center',
                'background': '#888',
                'color': '#fff'
            };
            var closeBtnPosition = fullConfig['closeBtnPosition'] || 'top_right';
            var clobpArray = closeBtnPosition.split('_');
            if (clobpArray[0] === 'top') {
                style['#closeBtn'].top = Math.ceil(3 * pt) + 'px';
            } else {
                style['#closeBtn'].bottom = Math.ceil(3 * pt) + 'px';
            }
            if (clobpArray[1] === 'left') {
                style['#closeBtn'].left = Math.ceil(3 * pt) + 'px';
            } else {
                style['#closeBtn'].right = Math.ceil(3 * pt) + 'px';
            }
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
