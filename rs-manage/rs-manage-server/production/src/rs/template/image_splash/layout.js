/* global oojs */
/**
* @file image_splash
* @author fanwenjuan
*/
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_splash',
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
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconIsShow: 1
    },
    // 秋实Sdk所需信息
    adsExtention: function (context) {
        var adsExtention = [];
        if (context.requestInfo.adElements && context.requestInfo.adElements.length) {
            for (var i = 0, count = context.requestInfo.adElements.length; i < count; i++) {
                var ad = context.requestInfo.adElements[i];
                var extention = JSON.parse(ad.extention);
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
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引， 必须加
        a['data-adindex'] = '0';
        a.href = ad.clickUrl;

        // img背景层
        var imgbg = engine.getLayout(fullConfig);
        imgbg.class = 'imgbg';
        a.childNodes.push(imgbg);

        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.src = ad.stuffSrc;
        img.class = 'img';
        a.childNodes.push(img);
        // button
        var btn = engine.getLayout(fullConfig);
        btn.class = 'btn';
        // 点击链接更多，点击免费下载
        var btnText = ad.actionType === 2 ? '\u70b9\u51fb\u514d\u8d39\u4e0b\u8f7d' : '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';
        btn.innerHTML = btnText;
        a.childNodes.push(btn);
        item.childNodes.push(a);
        items.push(item);
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
        var pt = containerWidth / 320;
        // container
        style['#container.container'] = {
            position: 'relative',
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            background: '#000',
            overflow: 'hidden'
        };
        // item
        style['.item'] = {
            position: 'relative',
            width: '100%',
            height: '100%'
        };
        // item a
        style['.item a'] = {
            'position': 'relative',
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none'
        };
        var imgbgStyleOpacity = 0.5;
        var userAgent = context.requestInfo.userAgent || '';
        try {
            var isAdroid = userAgent.match(/android (\d+.\d\d?)/i);
            if (isAdroid) {
                var androidVersion = isAdroid[1];
                if (androidVersion < 4.4) {
                    imgbgStyleOpacity = 0.2;
                }
            }
        } catch (ex) {}
        // imgbg
        style['.imgbg'] = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': '100%',
            'height': '100%',
            'background': '#000 url("' + ad.stuffSrc + '") no-repeat',
            'background-size': '300% 300%',
            '-webkit-filter': 'blur(20px)',
            '-ms-filter': 'blur(20px)',
            '-moz-filter': 'blur(20px)',
            'filter': 'blur(20px)',
            'filter': 'progid:DXImageTransform.Microsoft.Blur(PixelRadius="20")',
            'opacity': imgbgStyleOpacity
        };
        // item a img
        var imgWidth = containerWidth;
        var imgHeight = ad.height * containerWidth / ad.width;
        var imgPaddingTop = (containerHeight - imgHeight) / 2;
        style['.img'] = {
            'position': 'relative',
            'width': imgWidth + 'px',
            'height': imgHeight + 'px',
            'padding-top': imgPaddingTop + 'px',
            '-webkit-box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)',
            '-moz-box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)',
            'box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)'
        };

        // btn
        var btnWidth = 120 * pt;
        var btnHeight = 20 * pt;
        var btnFontSize = 14 * pt;
        var btnMarginTop = (imgPaddingTop - btnHeight) / 2;
        var btnMarginLeft = (containerWidth - btnWidth) / 2;
        style['.btn'] = {
            'width': btnWidth + 'px',
            'height': btnHeight + 'px',
            'line-height': btnHeight + 'px',
            'font-size': btnFontSize + 'px',
            'color': '#fff',
            'font-family': '\u9ed1\u4f53',
            'border': '1px solid #fff',
            'border-radius': '6px',
            'text-align': 'center',
            'margin-top': btnMarginTop + 'px',
            'margin-left': btnMarginLeft + 'px'
        };

         // add logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
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