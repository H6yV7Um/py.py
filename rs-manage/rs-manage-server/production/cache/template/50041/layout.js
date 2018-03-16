/**
 * @file PC信息流图文（左图、右图有描述）
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: '50041',
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

        // content
        var content = engine.getLayout(fullConfig);
        content.tagName = 'div';
        content.class = 'content';
        a.childNodes.push(content);
        // pic
        if (ad.imgFileSrc && ad.imgFileSrc.length > 0) {
            var imgCon = engine.getLayout(fullConfig);
            imgCon.tagName = 'div';
            imgCon.class = 'imgCon';
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.class = 'imgAD';
            img.src = ad.imgFileSrc[0];
            imgCon.childNodes.push(img);
            content.childNodes.push(imgCon);
        }

        // textArea
        var textWrap = engine.getLayout(fullConfig);
        textWrap.tagName = 'div';
        textWrap.class = 'text';
        content.childNodes.push(textWrap);

        // title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        title.innerHTML = ad.textTitle[0];
        textWrap.childNodes.push(title);

        // desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        desc.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
        textWrap.childNodes.push(desc);

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
        var pdp = userConfig['pdp'] || 1;
        var screenWidth = userConfig['width'] || 120;
        var screenHeight = userConfig['height'] || 90;
        var marginDescriptionPicture = userConfig['marginDescriptionPicture'];
        marginDescriptionPicture = (marginDescriptionPicture === null || marginDescriptionPicture === undefined)
        ? 10 : marginDescriptionPicture;
        var marginTitlePicture = userConfig['marginTitlePicture'];
        marginTitlePicture = (marginTitlePicture === null ||  marginTitlePicture === undefined)
        ? 10 : marginTitlePicture;
        var fontName = userConfig['titleFontFamily'] || 'Microsoft Yahei,宋体,Hiragino Sans GB'; // "Microsoft Yahei",'\5B8B\4F53'
        var titleFontSize = parseInt(userConfig['titleFontSize'], 10) || 16;
        var btitle = parseInt(userConfig['titleFontWeight'], 10) === 0 ? '' : 'bold';
        var ctitle = userConfig['titleFontColor'] || '333';
        var descFontName = userConfig['descFontName'] || 'Microsoft Yahei,宋体,Hiragino Sans GB';
        var descFontSize = parseInt(userConfig['descFontSize'], 10) || 14;
        var cdesc = userConfig['descFontColor'] || '333';
        var imgRatio = parseInt(screenWidth) / parseInt(screenHeight);
        var marginTitleDescription = userConfig['marginTitleDescription'];
        marginTitleDescription = (marginTitleDescription === null || marginTitleDescription === undefined)
        ? 10 : marginTitleDescription;
        var paddingTitleTop = userConfig['paddingTitleTop'] || 0;
        var titleMarginLeft = parseInt(pdp) === 1 ? marginTitlePicture : 0;
        var titleMarginRight = parseInt(pdp) === 3 ? marginTitlePicture : 0;
        var imgPos = parseInt(pdp) === 1 ? 'left' : 'right';
        var titleHoverColor = 'ea524f';
        var containerHoverColor = 'f0f0f0';
        var imgMarginTop = (containerHeight - screenHeight) / 2;
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
            'margin-top': paddingTitleTop + 'px',
            'margin-bottom': marginTitleDescription + 'px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'display': '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical'
        };
        style['.title:hover'] = {
            'color': '#' + titleHoverColor
        };
        style['.desc'] = {
            'color': '#' + cdesc,
            'font-size': descFontSize + 'px',
            'line-height': (descFontSize + 2) + 'px',
            'max-height': (descFontSize + 2) * 2 + 'px',
            '_height': (descFontSize + 2) * 2 + 'px',
            'font-family': descFontName,
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'display': '-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical'
        };
        style['.imgCon'] = {
            'width': screenWidth + 'px',
            'height': screenHeight + 'px',
            'margin-top': imgMarginTop + 'px',
            'float': imgPos,
            'overflow': 'hidden'
        };
        style['.imgAD'] = {
            'width': screenWidth + 'px',
            'height': screenHeight + 'px',
            '-webkit-transition': 'transform .5s ease-in',
            'transition': 'transform .5s ease-in'
        };
        style['.imgCon:hover img'] = {
            '-webkit-transform': 'scale(1.1)',
            'transform': 'scale(1.1)'
        };
        
        style['.text'] = {
            'float': 'left',
            'width': (containerWidth - marginTitlePicture - screenWidth) + 'px',
            'margin-left': titleMarginLeft + 'px',
            'margin-right': titleMarginRight + 'px',
            'height': screenHeight + 'px',
            'margin-top': imgMarginTop + 'px',
            'overflow': 'hidden'
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