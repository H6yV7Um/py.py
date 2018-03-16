/**
 * @file tuwen_sdk_banner_base_image template layout
 * @author yuxinxiao
 */
 /* global oojs */
 /* eslint-disable max-len */
oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_sdk_banner_base_image',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },
    //  秋实Sdk所需信息
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

        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // items
        var items = container.childNodes;
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        item.id = 'item';
        // 广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';
        // 广告索引，必须加
        a['data-adindex'] = '0';
        // 广告推广类型
        a['data-adtype'] = act;

        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.class = 'title';
        title.id = 'title';

        var divRes = engine.getLayout(fullConfig);
        divRes.tagName = 'div';
        divRes.class = 'divRes';
        divRes.id = 'divRes';

        item.childNodes.push(divRes);
        item.childNodes.push(title);
        item.childNodes.push(a);
        items.push(item);

        // 秋实Sdk所需数据
        var qiushiInfo = engine.getLayout(fullConfig);
        qiushiInfo.tagName = 'script';
        if (!ad.actionTypeInfo) {
            ad.actionTypeInfo = {};
        }
        qiushiInfo.innerHTML = 'var adsExtention = ' + this.adsExtention(context) + ';'
        + 'var actionTypeInfo=' + JSON.stringify(ad.actionTypeInfo);
        items.push(qiushiInfo);
        // 填充各种数据
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        var ext = {};
        if (ad.extention) {
            ext = JSON.parse(ad.extention);
        }
        ext.appinfo = ext.appinfo || {};
        var apptitle = ext.appinfo.appIntro || '';
        if (act === 2) {
            title.innerHTML = apptitle || '';
        } else {
            title.innerHTML = '\u66f4\u591a\u7cbe\u5f69\u5185\u5bb9\uff0c\u5c3d\u5728\u4e00\u6307\u4e4b\u95f4';
        };

        // 添加样式部分
        var style = {};

        var itemWidth = containerWidth;
        var itemHeight = containerHeight;
        var pt = containerHeight / 375;
        var itemPT = 21 * pt;
        var itemPL = 15 * pt;
        var itemPR = 30 * pt;
        var itemPB = 12 + 20 * pt + 6 * pt;// 广告logo的尺寸 + 广告logo的定位高度 + 随机空余
        var titleFS = 30 * pt;
        var titleH = 36 * pt;
        var titleLH = 36 * pt;
        var length = (apptitle && apptitle.length) ? apptitle.length : 1;
        titleH = (titleFS * length > itemWidth - itemPL * 2) ? titleH * 2 : titleH;
        var divResH = itemHeight;
        var per = 100 - (titleH + itemPB + itemPT / 2) / itemHeight * 100;
        style['.container'] = {
            'width': containerWidth + 'px',
            'height': containerHeight + 'px',
            'position': 'relative'
        };
        style['.item'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'padding-bottom': itemPB + 'px',
            'box-sizing': 'border-box',
            'position': 'relative'
        };
        style['#item0'] = {
            'width': itemWidth + 'px',
            'height': itemHeight + 'px',
            'background-image': 'linear-gradient(rgba(0, 0, 0, 0) 0%,rgba(0, 0, 0, 0) ' + (per - 5) + '%, rgba(0, 0, 0, 0.2) ' + per + '%, rgba(0, 0, 0, 0.8) 100%)',
            'position': 'absolute',
            'top': 0,
            'left': 0
        };
        style['.title'] = {
            'width': itemWidth - itemPL - itemPR + 'px',
            'height': titleH + 'px',
            'line-height': titleLH + 'px',
            'font-size': titleFS + 'px',
            'color': '#ffffff',
            'position': 'absolute',
            'left': itemPL + 'px',
            'bottom': itemPB + 'px',
            'overflow': 'hidden',
            'z-index': 11111
        };
        style['.divRes'] = {
            'width': itemWidth + 'px',
            'height': divResH + 'px',
            'position': 'absolute',
            'overflow': 'hidden',
            'background': 'url(' + ad.stuffSrc + ')',
            'background-size': '100% 100%'
        };
        // add logo
        var logo = this.logo.getLogo({logoType: 'feed-logo'});
        container.childNodes.push(logo);

        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon({adIconType: 'feed-adIcon'}));
        }
        style['.container .feed-logo'] = {
            'left': itemPL + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .feed-adIcon'] = {
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };
        style['.container .logoArea'] = {
            'width': '23px',
            'height': '12px',
            'left': itemPL + 12 + 'px',
            'bottom': 20 * pt + 'px'
        };

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});
