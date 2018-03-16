/**
 * @file app横幅基础图文
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: '50011',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
        bannerImgUrl: 'TemplateServer.Common.Model.bannerImgUrl'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        logoType: 'bd-logo4',
        containerPaddingLeft: 0,
        containerPaddingRight: 0,
        containerPaddingTop: 0,
        containerPaddingBottom: 0,
        containerBackgroundColor: '000'
    },
    //  秋实Sdk所需信息
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
    highlight: function (str) {
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
            case 5: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-download.png';
            break;
            case 1: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-sms.png';
            break;
            case 6: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-phone.png';
            break;
            case 4: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png';
            break;
            default: result = '{{dupDomain}}/cpro/ui/noexpire/img/sdk_banner_base_new/tuwen-icon-jump.png';
        }
        return result;
    },
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var engine = this.basic;
        // 移动只出一条广告
        var ad = ads[0];
        var act = parseInt(ad.action[0].actionType, 10) || 4;
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
        // 如果不是下载
        // 或者是下载但是没有二次确认 ,并且不支持下载暂停,基线
        var isNotDoubleConfirm = (act !== 5 || (act === 5 && !(ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink)));
        var isPause = requestInfo.flowInfo && requestInfo.flowInfo.isPause || false;
        // 如果不是下载
        // 或者是下载但是没有二次确认 ,并且不支持下载暂停,基线
        if (isNotDoubleConfirm && !isPause) {
            // 基线模式
            // 广告点击区域——item可点
            var a = engine.getLayout(fullConfig);
            a.tagName = 'a';
            a.target = '_blank';
            a.id = 'item0';
            // 广告索引，必须加
            a['data-adindex'] = '0';
            // 广告推广类型
            a['data-adtype'] = act;
            a['mcurl-val'] = 0;
            // 填充广告数据
            a.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            item.childNodes.push(a);

            // content
            var content = engine.getLayout(fullConfig);
            content.tagName = 'div';
            content.class = 'content';
            a.childNodes.push(content);

            // pic
            var withImage = false;
            if (ad.iconFileSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.iconFileSrc[0];
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
            title.innerHTML = this.highlight(ad.textTitle[0]);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.textDesc1[0] + ad.textDesc2[0]);
            textWrap.childNodes.push(desc);

            // icon
            var icon = engine.getLayout(fullConfig);
            icon.tagName = 'div';
            icon.class = 'icon';
            a.childNodes.push(icon);
            // 如果是给手百拉新，则在左边明确提示是用手百打开的,临时实验使用
            var extention = JSON.parse(ad.sdkInteractionInfo);
            if (extention.apo && extention.apo.page && /(baiduboxapp:\/\/)/.test(extention.apo.page)) {
                var shoubaiTip = engine.getLayout(fullConfig);
                shoubaiTip.tagName = 'img';
                shoubaiTip.class = 'shoubaitip';
                shoubaiTip.src = '{{dupDomain}}/cpro/ui/noexpire/img/shoubaitip.png';
                a.childNodes.push(shoubaiTip);
            }
            // 手百拉新拉活实验结束
        } else if (isPause && isNotDoubleConfirm) {
            // 下载暂停
            var mcurlLink = engine.getLayout(fullConfig);
            mcurlLink.class = 'mcurlContainer';
            mcurlLink.tagName = 'a';
            mcurlLink.target = '_blank';
            mcurlLink.id = 'item0';
            mcurlLink['data-adindex'] = '0';
            mcurlLink['data-adtype'] = '5';
            mcurlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            mcurlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink;
            mcurlLink['mcurl-val'] = '1';
            item.childNodes.push(mcurlLink);

            var clickUrlLink = engine.getLayout(fullConfig);
            clickUrlLink.class = 'clickurlContainer';
            clickUrlLink.tagName = 'a';
            clickUrlLink.target = '_blank';
            clickUrlLink.id = 'item_btn0';
            clickUrlLink['data-adindex'] = '0';
            clickUrlLink['data-adtype'] = '5';
            clickUrlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            clickUrlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            clickUrlLink['data-clickurl'] = '1';
            item.childNodes.push(clickUrlLink);

            // pic
            var withImage = false;
            if (ad.iconFileSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.iconFileSrc[0];
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
            title.innerHTML = this.highlight(ad.textTitle[0]);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.textDesc1[0] + ad.textDesc2[0]);
            textWrap.childNodes.push(desc);

            // icon
            var icon = engine.getLayout(fullConfig);
            icon.tagName = 'div';
            icon.class = 'icon';
            clickUrlLink.childNodes.push(icon);
            // 下载暂停功能
            if (isPause) {
                mcurlLink['data-ispause'] = isPause;
            };
        } else if (isPause && !isNotDoubleConfirm) {
            // 下载暂停&&分区
            var mcurlLink = engine.getLayout(fullConfig);
            mcurlLink.class = 'mcurlContainer';
            mcurlLink.tagName = 'a';
            mcurlLink.target = '_blank';
            mcurlLink.id = 'item0';
            mcurlLink['data-adindex'] = '0';
            mcurlLink['data-adtype'] = '1';
            mcurlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            mcurlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink;
            mcurlLink['data-mcurl'] = '1';
            mcurlLink['mcurl-val'] = 1;
            item.childNodes.push(mcurlLink);

            var clickUrlLink = engine.getLayout(fullConfig);
            clickUrlLink.class = 'clickurlContainer';
            clickUrlLink.tagName = 'a';
            clickUrlLink.target = '_blank';
            clickUrlLink.id = 'item_btn0';
            clickUrlLink['data-adindex'] = '0';
            clickUrlLink['data-adtype'] = '5';
            clickUrlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            clickUrlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            clickUrlLink['data-clickurl'] = '1';
            item.childNodes.push(clickUrlLink);

            // pic
            var withImage = false;
            if (ad.iconFileSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.iconFileSrc[0];
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
            title.innerHTML = this.highlight(ad.textTitle[0]);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.textDesc1[0] + ad.textDesc2[0]);
            textWrap.childNodes.push(desc);

            // icon
            var icon = engine.getLayout(fullConfig);
            icon.tagName = 'div';
            icon.class = 'icon';
            clickUrlLink.childNodes.push(icon);
            // 下载暂停功能
            if (isPause) {
                mcurlLink['data-ispause'] = isPause;
            };
        } else {
            // 分区
            var mcurlLink = engine.getLayout(fullConfig);
            mcurlLink.class = 'mcurlContainer';
            mcurlLink.tagName = 'a';
            mcurlLink.target = '_blank';
            mcurlLink.id = 'item0';
            mcurlLink['data-adindex'] = '0';
            mcurlLink['data-adtype'] = '1';
            mcurlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            mcurlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.middleClickLink;
            mcurlLink['data-mcurl'] = '1';
            mcurlLink['mcurl-val'] = 1;
            item.childNodes.push(mcurlLink);

            var clickUrlLink = engine.getLayout(fullConfig);
            clickUrlLink.class = 'clickurlContainer';
            clickUrlLink.tagName = 'a';
            clickUrlLink.target = '_blank';
            clickUrlLink.id = 'item_btn0';
            clickUrlLink['data-adindex'] = '0';
            clickUrlLink['data-adtype'] = '5';
            clickUrlLink.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
            clickUrlLink.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            clickUrlLink['data-clickurl'] = '1';
            item.childNodes.push(clickUrlLink);

            // pic
            var withImage = false;
            if (ad.iconFileSrc) {
                withImage = true;
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'pic';
                img.src = ad.iconFileSrc[0];
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
            title.innerHTML = this.highlight(ad.textTitle[0]);
            textWrap.childNodes.push(title);

            // desc
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'p';
            desc.id = 'desc0';
            desc.class = 'desc';
            desc.innerHTML = this.highlight(ad.textDesc1[0] + ad.textDesc2[0]);
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

        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(requestInfo) + ';';
        items.push(qiushiInfo);


        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var styleConfig = requestInfo.styleConfig;
        var styleConfigObj = null;
        if (styleConfig) {
            styleConfigObj = styleConfig;
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
            background: backgroundColor,
            position: 'relative'
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
        var iOS = /iPad|iPhone|iPod/.test(requestInfo.device.userAgent);
        style['.icon'] = {
            'margin': (iOS ? '1.9375' : '0.9375') + 'rem ' + (iOS ? '3.575' : '1.575') + 'rem 0 0',
            'width': '5.25rem',
            'height': '5.25rem',
            'border-radius': '3.125rem',
            'float': 'right',
            'background-image': 'url(' + this.getIcon(parseInt(ad.action[0].actionType, 10)
            || 4) + ')',
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

        if (isNotDoubleConfirm && !isPause) {
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
            };
            style['.clickurlContainer'] = {
                'float': 'right'
            };
            style['.mcurlContainer'] = {
                'float': 'left',
                'width': containerWidth - containerHeight + 'px'
            };
            style['#item_btn0'] = {
                'position': 'absolute',
                'right': 0,
                'top': 0,
                'z-index': '2147483647',
                'width': containerHeight + 'px',
                'height': containerHeight + 'px',
                'line-height': containerHeight + 'px',
                'text-decoration': 'none',
                'opacity': 0.9,
                'text-align': 'center',
                'color': '#fff',
                'font-size': '15px',
                'font-family': '微软雅黑',
                'font-weight': 'bold'
            };
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
        style['#fbIconDiv'] = {
            'height': '16px',
            'width': '40px',
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'cursor': 'pointer',
            'z-index': '2147483648'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});