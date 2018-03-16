/* global oojs */
/**
* @file 20016-image_splash
* @author qianxiaoli
*/
oojs.define({
    name: '20016',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    // 是否缓存Layout的结果
    isNeedLayoutCache: false,
    // 是否需要数据引擎渲染数据
    isNeedRenderData: false,

    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        titleFontFamily: 'SimHei,arial,sans-serif,Microsoft YaHei;'
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
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var engine = this.basic;
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
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;

        // img背景层
        var imgbg = engine.getLayout(fullConfig);
        imgbg.class = 'imgbg';
        a.childNodes.push(imgbg);

        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.src = ad.imgFileSrc[0];
        img.class = 'img';

        var imgCon = engine.getLayout(fullConfig);
        imgCon.class = 'img-con';
        imgCon.childNodes.push(img);

        a.childNodes.push(imgCon);
        // button
        var btn = engine.getLayout(fullConfig);
        btn.class = 'btn';
        var imgRatio = parseInt(ad.imgHeight[0], 10) / parseInt(ad.imgWidth[0], 10);
        if (imgRatio > 0.706 && imgRatio < 1.16) {
            // 点击链接更多，点击免费下载
            var btnText = parseInt(ad.action[0].actionType, 10) === 5
            ? '\u70b9\u51fb\u514d\u8d39\u4e0b\u8f7d' : '\u70b9\u51fb\u4e86\u89e3\u66f4\u591a';
            btn.innerHTML = btnText;
            a.childNodes.push(btn);
        }
        if (ad.textTitle[0].length > 0) {
            var textCon = engine.getLayout(fullConfig);
            textCon.class = 'text-con';
            imgCon.childNodes.push(textCon);

            var text = engine.getLayout(fullConfig);
            text.class = 'text';
            imgCon.childNodes.push(text);

            var desc2 = engine.getLayout(fullConfig);
            desc2.class = 'text-desc2';
            text.childNodes.push(desc2);

            var desc2Span = engine.getLayout(fullConfig);
            desc2Span.tagName = 'span';
            desc2Span.class = 'text-desc2-span';
            desc2.childNodes.push(desc2Span);

            var title = engine.getLayout(fullConfig);
            title.class = 'text-title';
            text.childNodes.push(title);

            var desc = engine.getLayout(fullConfig);
            desc.class = 'text-desc';
            text.childNodes.push(desc);

            title.innerHTML = ad.textTitle[0] || '';
            desc2Span.innerHTML = ad.textTitle[1] && (ad.textTitle[1]) || '';
            desc.innerHTML = ad.textDesc1[0]  && (ad.textDesc1[0] + (ad.textDesc2[0] && ad.textDesc2)) || '';
        }

        item.childNodes.push(a);
        items.push(item);
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
        var userAgent = requestInfo.device.userAgent || '';
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
            'background': '#000 url("' + ad.imgFileSrc[0] + '") no-repeat',
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
        var imgHeight = containerHeight;
        if (imgRatio > 0.706 && imgRatio < 1.16) {
            imgHeight = containerWidth * ad.imgHeight[0] / ad.imgWidth[0];
            imgWidth = containerWidth;
        }
        /*var imgWidth = ad.imgWidth[0];
        var imgHeight = ad.imgHeight[0];
        var imgRatio = imgWidth / imgHeight;
        var slotRatio = containerWidth / containerHeight;
        if (imgRatio < slotRatio) {
            imgHeight = containerHeight;
            imgWidth = imgHeight * imgRatio;
        }
        else {
            imgHeight = containerWidth * imgHeight / imgWidth;
            imgWidth = containerWidth;
        }*/
        var imgPaddingTop = (containerHeight - imgHeight) / 2;
        var imgMaginLeft = (containerWidth - imgWidth) / 2;
        style['.img'] = {
            'width': imgWidth + 'px',
            'height': imgHeight + 'px',
            'margin-left': imgMaginLeft + 'px',
            '-webkit-box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)',
            '-moz-box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)',
            'box-shadow': '0 50px 20px rgba(0, 0, 0, 0.5)'
        };
        style['.img-con'] = {
            'position': 'relative',
            'width': imgWidth + 'px',
            'height': imgHeight + 'px',
            'padding-top': imgPaddingTop + 'px',
        };

        var textBottom = (containerHeight - imgHeight) > 0 ? 0 : (imgHeight - containerHeight);
        if (imgRatio < 1) { // 此时附加的title一行和desc两行
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
            if (ad.textTitle[0].length > 0) {
                var spanPadding = (ad.textTitle[1] && (ad.textTitle[1]).length > 0) ? '10px' : '0';
                style['.text-con'] = {
                    'width': containerWidth  + 'px',
                    // 'height': '110px',
                    'position': 'absolute',
                    'bottom': textBottom + 'px',
                    'background': '-ms-linear-gradient(top, #7d7a7a,  #000);'  /* IE 10 */
                    + 'background:-webkit-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background: -moz-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000));'
                    + 'background:-webkit-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background:-o-linear-gradient(top, #7d7a7a,  #000)',
                    'opacity': '0.5'
                    // 'background': '-moz-linear-gradient(top, #7d7a7a,  #000)',/*火狐*/
                    // 'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000))',/*谷歌*/
                    // 'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000))',    /* Safari 4-5, Chrome 1-9*/
                    // 'background': '-webkit-linear-gradient(top, #7d7a7a,  #000)',   /*Safari5.1 Chrome 10+*/
                    // 'background': '-o-linear-gradient(top, #7d7a7a,  #000)', /*Opera 11.10+*/
                };
                style['.text'] = {
                    'position': 'absolute',
                    'bottom': textBottom + 'px',
                    'padding': '0px 20px 17px 20px',
                    'width': containerWidth - 40  + 'px'
                };
                style['.text-desc2-span'] = {
                    'background-color': '#fff',
                    'color': '#000',
                    'font-size': '12px',
                    'display': 'inline-block',
                    'height': '20px',
                    'line-height': '20px',
                    'padding-left': spanPadding,
                    'padding-right': spanPadding
                };
                style['.text-desc2'] = {
                    'width': containerWidth - 40 + 'px',
                    'height': '20px',
                    'text-overflow': 'ellipsis',
                    'overflow': 'hidden'
                };
                style['.text-title'] = {
                    'color': '#fff',
                    'font-size': '22px',
                    'font-weight': 'bold',
                    'line-height': '24px',
                    'max-height': '24px',
                    'overflow': 'hidden'
                };
                style['.text-desc'] = {
                    'color': '#fff',
                    'font-size': '14px',
                    'line-height': '20px',
                    'max-height': '40px',
                    'overflow': 'hidden'
                };
            }
        }
        else { // 此时附加的title两行和desc三行
            if (ad.textTitle[0].length > 0) {
                var spanPadding = (ad.textTitle[1] && (ad.textTitle[1]).length > 0) ? '10px' : '0';
                style['.text-con'] = {
                    'width': containerWidth  + 'px',
                    // 'height': '160px',
                    'position': 'absolute',
                    'bottom': textBottom + 'px',
                    'background': '-ms-linear-gradient(top, #7d7a7a,  #000);' /* IE 10 */
                    + 'background:-webkit-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background: -moz-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000));'
                    + 'background:-webkit-linear-gradient(top, #7d7a7a,  #000);'
                    + 'background:-o-linear-gradient(top, #7d7a7a,  #000)',
                    // 'background': '-moz-linear-gradient(top, #7d7a7a,  #000)',/*火狐*/
                    // 'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000))',/*谷歌*/
                    // 'background': '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#7d7a7a), to(#000))',    /* Safari 4-5, Chrome 1-9*/
                    // 'background': '-webkit-linear-gradient(top, #7d7a7a,  #000)',   /*Safari5.1 Chrome 10+*/
                    // 'background': '-o-linear-gradient(top, #7d7a7a,  #000)', /*Opera 11.10+*/
                    'opacity': '0.5'
                };
                style['.text'] = {
                    'position': 'absolute',
                    'bottom': textBottom + 'px',
                    'padding': '0px 20px 17px 20px',
                    'width': containerWidth - 40  + 'px'
                };
                style['.text-desc2-span'] = {
                    'background-color': '#fff',
                    'color': '#000',
                    'font-size': '12px',
                    'display': 'inline-block',
                    'height': '20px',
                    'line-height': '20px',
                    'padding-left': spanPadding,
                    'padding-right': spanPadding
                };
                style['.text-desc2'] = {
                    'width': containerWidth - 40 + 'px',
                    'height': '20px',
                    'text-overflow': 'ellipsis',
                    'overflow': 'hidden'
                };
                style['.text-title'] = {
                    'color': '#fff',
                    'font-size': '22px',
                    'font-weight': 'bold',
                    'line-height': '24px',
                    'max-height': '48px',
                    'overflow': 'hidden',
                    'margin': '5px 0'
                };
                style['.text-desc'] = {
                    'color': '#fff',
                    'font-size': '14px',
                    'line-height': '20px',
                    'max-height': '60px',
                    'overflow': 'hidden'
                };
            }
        }
        style['.feedbackCon'] = {
            'display': 'none'
        };
        style['#fbIcon'] = {
            'display': 'none'
        };
        style['.fbTipDiv'] = {
            'display': 'none'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;

    }
});