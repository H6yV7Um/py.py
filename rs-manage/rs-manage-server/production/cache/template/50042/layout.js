/**
 * @file PC信息流图文（三图、四图）
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: '50042',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
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
        containerBackgroundColor: '000',
        adIconType: 1,
        isShowCloseFeedBack: false
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

        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        items.push(item);

        // 广告点击区域——整个item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';

        // 填充广告数据
        a.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        item.childNodes.push(a);

        // textArea
        var textWrap = engine.getLayout(fullConfig);
        textWrap.tagName = 'div';
        textWrap.class = 'text';
        a.childNodes.push(textWrap);

        // title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        title.innerHTML = ad.textTitle[0];
        textWrap.childNodes.push(title);

        // pic
        if (ad.imgFileSrc && ad.imgFileSrc.length > 0) {
            var imgArr = ad.imgFileSrc;
            var imgCon = engine.getLayout(fullConfig);
            imgCon.tagName = 'div';
            imgCon.class = 'imgCon';
            for (var i = 0; i < imgArr.length; i++) {
                var imgEle = engine.getLayout(fullConfig);
                imgEle.tagName = 'div';
                imgEle.class = 'imgEle';
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                img.class = 'imgAD';
                img.id = 'imgAD' + i;
                img.src = imgArr[i];
                imgEle.childNodes.push(img);
                imgCon.childNodes.push(imgEle);
                if (i === imgArr.length - 1) {
                    imgEle.class = 'imgEle imgLast';
                }
            }
            a.childNodes.push(imgCon);
        }

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var backgroundColor = userConfig.containerBackgroundColor || 'fff';
        var paddingTop = userConfig['containerPaddingTop'] || 0;
        var paddingBottom = userConfig['containerPaddingBottom'] || 0;
        var paddingLeft = userConfig['containerPaddingLeft'] || 0;
        var paddingRight = userConfig['containerPaddingRight'] || 0;
        // var pdp = userConfig['pdp'] || 1;
        var screenWidth = userConfig['width'] || 120;
        var screenHeight = userConfig['height'] || 90;
        var marginDescriptionPicture = userConfig['marginDescriptionPicture'];
        marginDescriptionPicture = (marginDescriptionPicture === null || marginDescriptionPicture === undefined) ? 10
        : marginDescriptionPicture; // 多图时候为图片间间距
        var marginTitlePicture = userConfig['marginTitlePicture'];// marginTitlePicture = (imgRatio > 1.6 || imgRatio < 1.4) ? '24' : '14';
        marginTitlePicture = (marginTitlePicture === null || marginTitlePicture
        === undefined) ? 10 : marginTitlePicture;
        var fontName = userConfig['titleFontFamily'] || 'Microsoft Yahei,宋体,Hiragino Sans GB'; // "Microsoft Yahei",'\5B8B\4F53'
        var titleFontSize = parseInt(userConfig['titleFontSize'], 10) || 18;
        var btitle =  parseInt(userConfig['titleFontWeight'], 10) === 0 ? '' : 'bold';
        var ctitle = userConfig['titleFontColor'] || '333';
        var marginTitleDescription = userConfig['marginTitleDescription']; // (imgRatio > 1.6 || imgRatio < 1.4) ? 14 : 24;
        marginTitleDescription = (marginTitleDescription === null || marginTitleDescription === undefined)
        ? 10 : marginTitleDescription;
        var titleHoverColor = 'ea524f'; // 鼠标悬浮时候title颜色
        var containerHoverColor = 'f0f0f0';
        var titleMarginTop = (containerHeight - screenHeight - (titleFontSize + 4) * 2 - marginTitlePicture) / 2;
        titleMarginTop = titleMarginTop > 0 ? titleMarginTop : 0;

        style['.item'] = {
            width: '100%',
            height: '100%'
        };

        style['.container'] = {
            width: containerWidth + 'px',
            height: containerHeight + 'px',
            padding: paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px',
            background: '#' + backgroundColor,
            position: 'relative',
            overflow: 'hidden'
        };

        style['.container:hover'] = {
            background: '#' + containerHoverColor
        };
        style['.title'] = {
            'font-weight': btitle,
            'font-size': titleFontSize + 'px',
            'line-height': (titleFontSize + 4) + 'px',
            'max-height': (titleFontSize + 4) * 2 + 'px',
            '_height': (titleFontSize + 4) * 2 + 'px',
            'font-family': fontName,
            'color': '#' + ctitle,
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'display': '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical'
        };
        style['.title:hover'] = {
            'color': '#' + titleHoverColor
        };
        style['.imgCon'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'overflow': 'hidden',
            'display': 'inline'
        };
        style['.imgEle'] = {
            'width': screenWidth + 'px',
            'height': screenHeight + 'px',
            'overflow': 'hidden',
            'float': 'left',
            'display': 'inline',
            'margin-right': marginDescriptionPicture + 'px'
        };
        style['.imgLast'] = {
            'margin-right': '0px'
        };
        style['.imgAD'] = {
            'width': screenWidth + 'px',
            'height': screenHeight + 'px',
            '-webkit-transition': 'transform .5s ease-in',
            'transition': 'transform .5s ease-in'
        };
        style['.imgCon img:hover'] = {
            '-webkit-transform': 'scale(1.1)',
            'transform': 'scale(1.1)'
        };
        style['.text'] = {
            'width': containerWidth + 'px',
            'max-height': (titleFontSize + 4) * 2 + 'px',
            '_height': (titleFontSize + 4) * 2 + 'px',
            'text-overflow': 'clip',
            'overflow': 'hidden',
            'margin-top': titleMarginTop + 'px',
            'margin-bottom': marginTitlePicture + 'px'
        };
        style['.item a'] = {
            'display': 'block',
            'width': '100%',
            'height': '100%',
            'text-decoration': 'none',
            'box-sizing': 'border-box'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});