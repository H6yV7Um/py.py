/**
* @file tuwen_sdk_banner_base_extended_1
* @author yuxinxiao
*/
/* eslint-disable */
oojs.define({
    name: '50035',
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
    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
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
        item.id = 'item';
        items.push(item);

        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adIndex'] = 0;
        // 广告推广类型
        a['data-adType'] = act;


        // 上半部分区域内容
        var divContent = engine.getLayout(fullConfig);
        divContent.tagName = 'div';
        divContent.class = 'divCon';
        divContent.id = 'divCon';
 
        // 广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.class = 'logo';
        divContent.childNodes.push(logo);

        // logo图片
        var img = engine.getLayout(fullConfig);
        img.tagName = 'img';
        img.class = 'icon';
        img.src = ad.iconFileSrc[0];
        logo.childNodes.push(img);

        // 广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        divContent.childNodes.push(title);


      // 广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        divContent.childNodes.push(desc);

        // 填充广告数据
        a.title = ad.action[0] && ad.action[0].forword && ad.action[0].forword.title || '';
        a.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
        title.innerHTML = ad.textTitle[0];
        desc.innerHTML = ad.textDesc1[0] + ad.textDesc2[0];
  
        divContent.childNodes.push(a);
        item.childNodes.push(divContent);

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
        var pt = containerWidth / 714;
        var logoWidth = 120 * pt;
        var logoHeight = logoWidth;
        // item边距
        var itemPadding = parseInt(20 * pt);
        var itemWidth = containerWidth - (itemPadding * 2);
        var itemHeight = containerHeight - (itemPadding * 2);
        var ItemBackground = '#3a99fe';
        var divConTop = (containerHeight - pt * 232 - itemPadding * 2 ) / 2;
        var fontColor = '#fff';

        // container 区域
        style['#container'] = {
            'height': containerHeight + 'px',
            'width': containerWidth +'px',
            'position': 'relative',
            'overflow': 'hidden',
            'color': fontColor
        };

        style['.item'] = {
            'padding': itemPadding + 'px', 
            'height': containerHeight - itemPadding * 2 + 'px',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/text_sdk_extended.png) no-repeat',
            'background-size': '100% 100%'
        };
        style['.divCon'] = {
            'width': itemWidth + 'px',
            'margin-top':  divConTop + 'px',
        };
        style['.title'] = {
            'width': itemWidth + 'px',
            'padding-top': pt * 8 + 'px',
            'font-size': Math.round(42 * pt) + 'px',
            'font-family': '\u5fae\u8f6f\u96c5\u9ed1',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'text-align': 'center'
        };

        style['.desc'] = {
            'width': itemWidth + 'px',
            'font-size': Math.round(36 * pt) + 'px',
            'font-family': '\u5fae\u8f6f\u96c5\u9ed1',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'text-align': 'center'
        };
        style['.item a'] = {
            'height': containerHeight + 'px',
            'width': containerWidth +'px',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'text-decoration': 'none',
            'cursor': 'pointer'
        };
        style['.logo'] = {
            'width': 100 +'%',
            'height': Math.round(logoWidth) + 'px',
            'text-align': 'center'

        };
        style['.icon'] = {
            'height': Math.round(logoWidth) + 'px',
            'width':  Math.round(logoHeight) +'px',
            'border-radius': 14 * pt + 'px'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
