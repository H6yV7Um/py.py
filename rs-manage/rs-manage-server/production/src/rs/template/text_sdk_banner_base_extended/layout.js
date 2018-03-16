/* global oojs */

/**
* @file text_sdk_banner_base_extended
* @author yuxinxiao
*/

/* eslint-disable */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.text_sdk_banner_base_extended',
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
    //  秋实Sdk所需信息
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
        var act = ad.actionType || 1;
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
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        title.innerHTML = ad.title;
        desc.innerHTML = ad.desc;
  
        divContent.childNodes.push(a);
        item.childNodes.push(divContent);

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
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var pt = containerWidth / 714;
        //var titleFontSize = parseInt(42 * pt);
        //var descFontSize = parseInt(32 * pt);
        //var titleHeight =  parseInt(92 * pt);
        //var descHeight =  parseInt(72 * pt);
        // item边距
        var itemPadding = parseInt(20 * pt);
        var itemWidth = containerWidth - (itemPadding * 2);
        var itemHeight = containerHeight - (itemPadding * 2);
        var ItemBackground = '#3a99fe';
        // titleWidth
        var divConTop = (containerHeight - itemPadding - 144 * pt ) / 2;
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
            'padding-left': itemPadding + 'px',
            'padding-right': itemPadding + 'px',
            'padding-top': itemPadding + 'px', 
            'height': containerHeight - itemPadding + 'px',
            'background': ItemBackground + ' url({{dupDomain}}/cpro/ui/noexpire/img/2.0.3/rs_img/text_sdk_extended.png) no-repeat',
            //'background': '#3a99fe url(http://10.99.114.24:8888/text_sdk_bg.png) no-repeat left top',
            'background-size': '100% 100%'
        };
        style['.divCon'] = {
            width: itemWidth + 'px',
            'padding-top': divConTop + 'px',
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

        style['.desc'] = {
            'width': itemWidth + 'px',
            'font-size': Math.round(32 * pt) + 'px',
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
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
