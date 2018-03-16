/**
* @file text_sdk_banner_base_extended
* @author yuxinxiao
*/
/* global oojs */
oojs.define({
    name: '10015',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false,
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
    // 布局,生成布局对象
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
        item.id = 'item';
        items.push(item);
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

        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        divContent.childNodes.push(title);



        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        divContent.childNodes.push(desc);



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

        var itemPadding = parseInt(20 * pt, 10);
        var itemWidth = containerWidth - (itemPadding * 2);
        var itemHeight = containerHeight - (itemPadding * 2);
        var ItemBackground = '#3a99fe';

        var conRatio = containerWidth / containerHeight;
        var divConTop = (containerHeight - itemPadding - 144 * pt) / 2;
        divConTop = conRatio < 3 ? divConTop - 32 * pt : divConTop;
        var fontColor = '#fff';


        style['#container'] = {
            'height': containerHeight + 'px',
            'width': containerWidth + 'px',
            'position': 'relative',
            'overflow': 'hidden',
            'color': fontColor
        };

        style['.item'] = {
            'width': itemWidth,
            'height': itemHeight,
            'padding-left': itemPadding + 'px',
            'padding-right': itemPadding + 'px',
            'padding-top': itemPadding + 'px',
            'height': containerHeight - itemPadding + 'px',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/text_sdk_extended.png) no-repeat',
            'background-size': '100% 100%'
        };
        style['.divCon'] = {
            'width': itemWidth + 'px',
            'padding-top': divConTop + 'px'
        };
        style['.title'] = {
            'width': itemWidth + 'px',
            'height': Math.round(92 * pt) + 'px',
            'line-height': Math.round(92 * pt) + 'px',
            'font-size': Math.round(42 * pt) + 'px',
            'font-family': '\u5fae\u8f6f\u96c5\u9ed1',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'text-align': 'center'
        };

        if (conRatio < 3) {
            style['.desc'] = {
                'width': itemWidth + 'px',
                'font-size': Math.round(32 * pt) + 'px',
                'font-family': '\u5fae\u8f6f\u96c5\u9ed1',
                'text-align': 'center',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'display': '-webkit-box',
                '-webkit-line-clamp': 2,
                '-webkit-box-orient': 'vertical'
            };
        }
        else {
            style['.desc'] = {
                'width': itemWidth + 'px',
                'font-size': Math.round(32 * pt) + 'px',
                'font-family': '\u5fae\u8f6f\u96c5\u9ed1',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap'
            };
        }

        style['.item a'] = {
            'height': containerHeight + 'px',
            'width': containerWidth + 'px',
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'text-decoration': 'none',
            'cursor': 'pointer'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});