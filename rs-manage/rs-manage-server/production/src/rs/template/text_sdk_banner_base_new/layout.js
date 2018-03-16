/* global oojs */

/**
* @file tuwen_sdk
* @author liguangyi
*/

/* eslint-disable */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_sdk_banner_base_new',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
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
    highlight: function(str) {
        var regex = /{([^}]*)}/g;
        return str.replace(regex, function (match, subMatch, index, s) {
            return '<span style="color: #F1B000;">' + subMatch + '</span>';
        });
    },
    recomputeRootFontSize: function (viewportWidth) {
        var comparedWidth = 1000;
        var scale = viewportWidth / comparedWidth;
        var currentRootFontSize = scale * 16;
        this.currentRootFontSize = currentRootFontSize;
        return currentRootFontSize;
    },
    getIcon: function (actionType) {
        var result;
        switch (actionType) {
            case 2: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-download.png'; break;
            case 8: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-sms.png'; break;
            case 32: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-phone.png'; break;
            case 1: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png'; break;
            default: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png';
        }
        return result;
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
        items.push(item);

        var isNotDoubleConfirm = (act !== 2 || (act === 2 && !ad.mcurl));
        // 如果不是下载
        // 或者是下载但是没有二次确认 
        if (isNotDoubleConfirm) {
            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.id = 'item0';
            // 广告索引，必须加
            a['data-adindex'] = '0';
            // 广告推广类型
            a['data-adtype'] = act;
            // 填充广告数据
            a.title = ad.showUrl || '';
            a.href = ad.clickUrl;
            item.childNodes.push(a);

            // content
            var content = engine.getLayout(fullConfig);
            content.tagName = 'div';
            content.class = 'content';
            a.childNodes.push(content);

            // pic
            var withImage = false;
            if (ad.stuffSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.stuffSrc;
                content.childNodes.push(img);
            }

            // text
            var textWrap = engine.getLayout(fullConfig);
            textWrap.tagName = 'div';
            textWrap.class = 'text';
            content.childNodes.push(textWrap);

            // title
            var title = engine.getLayout(fullConfig);
            title.tagName = 'p';
            title.id = 'title0';
            title.class = 'title';
            title.innerHTML = this.highlight(ad.title);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.desc[0]);
            textWrap.childNodes.push(desc);

            // icon
            var icon = engine.getLayout(fullConfig);
            icon.tagName = 'div';
            icon.class = 'icon';
            a.childNodes.push(icon);
            // 如果是给手百拉新，则在左边明确提示是用手百打开的,临时实验使用
            var extention = JSON.parse(ad.extention);
            if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
                var shoubaiTip = engine.getLayout(fullConfig);
                shoubaiTip.tagName = 'img';
                shoubaiTip.class = 'shoubaitip';
                shoubaiTip.src = '{{dupDomain}}/cpro/ui/noexpire/img/shoubaitip.png';
                a.childNodes.push(shoubaiTip);
            }
            // 手百拉新拉活实验结束
        } else {
            var mcurlLink = engine.getLayout(fullConfig);
            mcurlLink.class = 'mcurlContainer';
            mcurlLink.tagName = 'a';
            mcurlLink.target = '_blank';
            mcurlLink.id = 'item0';
            mcurlLink['data-adindex'] = '0';
            mcurlLink['data-adtype'] = '1';
            mcurlLink.title = ad.showUrl || '';
            mcurlLink.href = ad.mcurl;
            mcurlLink['data-mcurl'] = '1';
            item.childNodes.push(mcurlLink);

            var clickUrlLink = engine.getLayout(fullConfig);
            clickUrlLink.class = 'clickurlContainer';
            clickUrlLink.tagName = 'a';
            clickUrlLink.target = '_blank';
            clickUrlLink.id = 'item_btn0';
            clickUrlLink['data-adindex'] = '0';
            clickUrlLink['data-adtype'] = '2';
            clickUrlLink.title = ad.showUrl || '';
            clickUrlLink.href = ad.clickUrl;
            clickUrlLink['data-clickurl'] = '1';
            item.childNodes.push(clickUrlLink);

            // pic
            var withImage = false;
            if (ad.stuffSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.stuffSrc;
                mcurlLink.childNodes.push(img);
            }

            // text
            var textWrap = engine.getLayout(fullConfig);
            textWrap.tagName = 'div';
            textWrap.class = 'text';
            mcurlLink.childNodes.push(textWrap);

            // title
            var title = engine.getLayout(fullConfig);
            title.tagName = 'p';
            title.id = 'title0';
            title.class = 'title';
            title.innerHTML = this.highlight(ad.title);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.desc[0]);
            textWrap.childNodes.push(desc);

            // icon
            var icon = engine.getLayout(fullConfig);
            icon.tagName = 'div';
            icon.class = 'icon';
            clickUrlLink.childNodes.push(icon);                       
        }

        // 关闭按钮
        var closeBtn = engine.getLayout(fullConfig);
        closeBtn.tagName = 'div';
        closeBtn.id = 'closeBtn';
        var closeDiv = engine.getLayout(fullConfig);
        closeDiv.tagName = 'div';
        closeDiv.id = 'closeDiv';
        closeDiv.innerHTML = '\u0026\u0023\u0032\u0031\u0035\u003b';
        closeBtn.childNodes.push(closeDiv);
        items.push(closeBtn);

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

        var styleConfig = context.requestInfo.styleConfig;
        var styleConfigObj = null;
        if (styleConfig && styleConfig.toLowerCase() !== 'undefined') {
            styleConfigObj = JSON.parse(styleConfig);
        }

        var defaultBackgroundColor = '#00a0e9';
        var defualtTextColor = '#fff';
        var backgroundColor = defaultBackgroundColor;
        var titleColor = defualtTextColor;
        var descColor = defualtTextColor;
        if (styleConfigObj && styleConfigObj.cbackground) {
            backgroundColor = styleConfigObj.cbackground.indexOf('#') > -1
                ? styleConfigObj.cbackground
                : ('#' + styleConfigObj.cbackground);
        }

        if (styleConfigObj && styleConfigObj.ctitle) {
            titleColor = styleConfigObj.ctitle.indexOf('#') > -1
                ? styleConfigObj.ctitle
                : ('#' + styleConfigObj.ctitle);
        }

        if (styleConfigObj && styleConfigObj.cdesc) {
            descColor = styleConfigObj.cdesc.indexOf('#') > -1
                ? styleConfigObj.cdesc
                : ('#' + styleConfigObj.cdesc);
        }

        style['*'] = {
            padding: 0,
            margin: 0
        };
        style.html = {
            'font-size': this.recomputeRootFontSize(containerWidth) + 'px'
        };
        style['.item'] = {
            width: '100%',
            height: '100%'
        };

        style['.container'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            background: backgroundColor
        };

        // 如果没有自定义颜色
        // 添加渐变色背景颜色
        // 只能这么覆盖，不能使用style['.container']['background']
        if (backgroundColor === defaultBackgroundColor) {
            style['.container'] = {
                width: containerWidth + 'px',
                height: containerHeight + 'px',
                background: defaultBackgroundColor,
                background: '-moz-linear-gradient(left,  #00a0e9 0%, #063994 100%, #2989d8 100%, #207cca 100%)',
                background: '-webkit-linear-gradient(left,  #00a0e9 0%,#063994 100%,#2989d8 100%,#207cca 100%)',
                background: 'linear-gradient(to right,  #00a0e9 0%,#063994 100%,#2989d8 100%,#207cca 100%)'
            };
        }

        style['.title'] = {
            'font-size': withImage ? '2.3rem' : '2.8rem',
            'color': titleColor,
            'margin-bottom': '0.625rem'
        };
        style['.desc'] = {
            'color': descColor,
            'font-size': withImage ? '1.9875rem' : '2.4875rem'
        };
        var iOS = /iPad|iPhone|iPod/.test(context.requestInfo.userAgent);
        style['.icon'] = {
            'margin': (iOS ? '1.9375' : '0.9375') + 'rem ' + (iOS ? '3.575' : '1.575') + 'rem 0 0',
            'width': '5.25rem',
            'height': '5.25rem',
            'border-radius': '3.125rem',
            'float': 'right',
            'background-image': 'url(' + this.getIcon(parseInt(ad.actionType, 10)) + ')',
            'background-repeat': 'no-repeat',
            'background-size': '5.25rem 5.25rem'
        };
        var iconWidth = (5.25 + (iOS ? 3.575 : 1.575)) * this.currentRootFontSize;
        style['.highlight'] = {
            color: '#ffff00'
        };
        style['.pic'] = {
            'width': '5.5rem',
            'height': '5.5rem',
            'float': 'left',
            'display': 'block',
            'margin': (iOS ? '1.9375' : '0.9375') + 'rem 0 0 0.9375rem',
            'border-radius': '0.625rem'
        };
        style['.text'] = {
            'float': 'left',
            // 'margin-top': '1.575rem',
            'margin-left': withImage ? '0.9375rem' : '1.875rem'
        };
        if (isNotDoubleConfirm) {
            style['.content'] = {
                'float': 'left',
                'color': 'white'
            };
            style['.item a'] = {
                'display': 'block',
                'width': '100%',
                'height': '100%',
                'text-decoration': 'none',
                'box-sizing': 'border-box'
            };
        } else {
            style['.clickurlContainer, .mcurlContainer'] = {
                'display': 'block'
            }
            style['.clickurlContainer'] = {
                'float': 'right'
            }
            style['.mcurlContainer'] = {
                'float': 'left',
                'width': containerWidth - containerHeight + 'px'
            }
        }

        // 关闭按钮样式
        var closeBtnRadius = 18;
        var closeBtnDivRadius = 25;
        style['div#closeBtn'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnDivRadius + 'px',
            'height': closeBtnDivRadius + 'px',
            'text-align': 'center',
            'color': '#fff'
        };
        style['div#closeDiv'] = {
            'cursor': 'pointer',
            'position': 'absolute',
            'top': '0px',
            'right': '0px',
            'z-index': '2147483647',
            'width': closeBtnRadius + 'px',
            'height': closeBtnRadius + 'px',
            'border-radius': closeBtnRadius + 'px',
            'font': 'normal ' + closeBtnRadius + 'px/' + closeBtnRadius + 'px arial,sans-serif;',
            'text-align': 'center',
            'background': '#888',
            'color': '#fff'
        };

        style['.shoubaitip'] = {
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'z-index': '2147483647',
            'height': '14px',
            'width': '112px'
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
