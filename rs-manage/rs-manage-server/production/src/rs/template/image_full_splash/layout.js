/* global oojs */

/**
* @file image_splash
* @author fanwenjuan
*/
oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_full_splash',
    deps: {
        basic: 'rs.template.basic',
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

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }

        qiushiInfo.innerHTML = 'var stuffSrc = "' + ad.stuffSrc + '";'
                                + 'var adsExtention = '
                                + this.adsExtention(context) + ';'
                                + 'var actionTypeInfo='
                                + JSON.stringify(ad.actionTypeInfo);
        container.childNodes.push(qiushiInfo);

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        container.childNodes.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        a.href = ad.clickUrl;
        a['data-adindex'] = 0;
        item.childNodes.push(a);

        var itemBgImage = engine.getLayout(fullConfig);
        itemBgImage.class = 'item-bg-image';
        a.childNodes.push(itemBgImage);

        // var itemBgMask = engine.getLayout(fullConfig);
        // itemBgMask.class = 'item-bg-mask';
        // a.childNodes.push(itemBgMask);

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 带文字模板 begin
        var imageWrapHeight = containerHeight * 0.9;
        var btnWrapHeight = containerHeight * 0.1;

        var baselineFontSize = 16;
        var baselineWidth = 480;

        var curRootFontSize = baselineFontSize * containerWidth / baselineWidth;
        // 带文字模板 end
        var originImageWidth = ad.width;
        var originImageHeight = ad.height;

        var layoutTypeWithBtn = false;

        var adRatio = containerHeight / containerWidth;
        var imageRatio = Math.round(originImageHeight / originImageWidth * 100) / 100;
        // console.log('adRatio===>', adRatio);
        // console.log('imageRatio===>', imageRatio);
        // 1.6: 500x800/400x640
        if (adRatio >= 1.59 && adRatio <= 1.84 && imageRatio === 1.5) {
            layoutTypeWithBtn = true;
        }
        // 1.5: 500x750/400x600
        else if (adRatio >= 1.41 && adRatio <= 1.57 && imageRatio === 1.67) {
            layoutTypeWithBtn = false;
        }
        // 1.8 500x900/400x720
        else if (adRatio >= 1.73 && adRatio <= 1.84 && imageRatio === 1.67) {
            layoutTypeWithBtn = true;
        }
        // 1.5: 500x750/400x600
        else if (adRatio >= 1.41 && adRatio <= 1.71 && imageRatio === 1.78) {
            layoutTypeWithBtn = false;
        }

        var itemTargetImage = engine.getLayout(fullConfig);
        itemTargetImage.class = 'item-target-image';
        itemTargetImage.tagName = 'img';
        // itemTargetImage.src = ad.stuffSrc;

        if (layoutTypeWithBtn) {
            var imageWrap = engine.getLayout(fullConfig);
            imageWrap.class = 'image-wrap';
            a.childNodes.push(imageWrap);

            imageWrap.childNodes.push(itemTargetImage);

            var btnWrap = engine.getLayout(fullConfig);
            btnWrap.class = 'btn-wrap';
            a.childNodes.push(btnWrap);

            var btn = engine.getLayout(fullConfig);
            btn.tagName = 'button';
            // btn.innerHTML = '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';
            btn.innerHTML = ad.actionType
                ? parseInt(ad.actionType, 10) === 2
                    ? '\u70b9\u51fb\u514d\u8d39\u4e0b\u8f7d' // 点击免费下载
                    : '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a' // 点击了解更多
                : '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';
            btnWrap.childNodes.push(btn);
        }
        else {
            a.childNodes.push(itemTargetImage);
        }

        var curImageWidth;
        var curImageHeight;

        // 物料与容器必须保持一定的间隔
        var beautifulSpace = containerWidth * 0.1;
        var imageHeight = layoutTypeWithBtn ? imageWrapHeight : containerHeight;

        for (var i = 1; i > 0; i -= 0.01) {
            curImageWidth = originImageWidth * i;
            curImageHeight = originImageHeight * i;

            if (curImageWidth <= containerWidth
                && curImageHeight <= imageHeight
                && Math.abs(containerWidth - curImageWidth) >= beautifulSpace
                && Math.abs(imageHeight - curImageHeight) >= beautifulSpace) {
                break;
            }

        }

        style.html = {
            'font-size': curRootFontSize + 'px'
        };
        style.a = {
            '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
            '-webkit-tap-highlight-color': 'transparent',
            '-webkit-focus-ring-color': 'rgba(0, 0, 0, 0)',
            '-webkit-focus-ring-color': 'transparent'
        };
        style['.container'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            overflow: 'hidden',
            position: 'relative'
        };
        style['.item'] = {
            'width': '100%',
            'height': '100%',
            'background-size': 'cover',
            'position': 'relative'
        };
        style['.item a'] = {
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'text-decoration': 'none'
        };
        style['.item a:hover'] = {
            'text-decoration': 'none'
        };
        style['.item a:active'] = {
            'text-decoration': 'none'
        };
        style['.item-bg-image'] = {

            '-webkit-filter': 'blur(30px)',
            '-ms-filter': 'blur(30px)',
            '-moz-filter': 'blur(30px)',
            'filter': 'blur(30px)',
            'filter': 'progid:DXImageTransform.Microsoft.Blur(PixelRadius="30")',

            '-moz-transform': 'scale(1.3)',
            '-webkit-transform': 'scale(1.3)',
            '-o-transform': 'scale(1.3)',
            '-ms-transform': 'scale(1.3)',
            'transform': 'scale(1.3)',

            // 'background-image': 'url(' + ad.stuffSrc + ')',
            'background-size': 'cover',
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'z-index': 1
        };

        // style['.item-bg-mask'] = {
        //     'width': '100%',
        //     'height': '100%',
        //     'position': 'absolute',
        //     'top': 0,
        //     'left': 0,
        //     'opacity': '.9',
        //     'z-index': 2,
        //     'background': '#6f5466'
        // }
        style['.image-wrap'] = {
            width: '100%',
            height: imageWrapHeight + 'px',
            position: 'relative'
        };

        style['.item-target-image'] = {
            'width': curImageWidth + 'px',
            'height': curImageHeight + 'px',
            'box-sizing': 'border-box',
            'border': '4px solid white',
            'position': 'absolute',
            'left': '50%',
            'top': '50%',

            '-moz-transform': 'translate(-50%, -50%) scale(1.0)',
            '-webkit-transform': 'translate(-50%, -50%) scale(1.0)',
            '-o-transform': 'translate(-50%, -50%) scale(1.0)',
            '-ms-transform': 'translate(-50%, -50%) scale(1.0)',
            'transform': 'translate(-50%, -50%) scale(1.0)',
            // 'box-shadow': '0 0 50px #262b4f', // 此处50px有风险，暂且如此处理
            // '-webkit-box-shadow': '0 0 50px #262b4f',
            // '-moz-box-shadow': '0 0 50px #262b4f',
            // '-o-box-shadow': '0 0 50px #262b4f',

            'z-index': 3
        };

        style['.btn-wrap'] = {
            width: '100%',
            height: btnWrapHeight + 'px',
            position: 'relative'
        };

        style['.item button'] = {
            'width': '13.125rem',

            /* 210 / 16 = 13.125 */
            'height': '3.125rem',

            /* 50 / 16 = 3.125 */
            'border-radius': '1.5625rem',
            'border': '2px solid white',
            'font-size': '1.25rem',

            /* 20 / 16 = 1.25 */
            'font-weight': 'bold',
            'background': 'none',
            'color': 'white',
            'cursor': 'pointer',

            'z-index': 3,
            'position': 'absolute',
            'left': '50%',
            'top': '50%',

            'margin-top': '-' + btnWrapHeight / 2 + 'px',
            'margin-left': '-6.5625rem',
            'outline': 'none'

            /* 105 / 16 = 6.5625 */
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
