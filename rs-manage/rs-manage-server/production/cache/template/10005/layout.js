/**
 * @file 移动文字基础模板
 * @author qianxiaoli@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'text_10005',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        logoType: 'bd-logo4',
        containerBorderTop: 0,
        containerBorderRight: 0,
        containerBorderBottom: 0,
        containerBorderLeft: 0,
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0
    },

    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = requestInfo.adElements;
        var engine = this.basic;

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';
        var adsLen = ads.length;
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerOuterW = containerStyle['outer-width'];
        var containerOuterH = containerStyle['outer-height'];
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var zoom = containerWidth / 640;
        var ratio = containerOuterW / containerOuterH;
        var scale = ratio < 7 && ratio > 4 ? '20.3' : (ratio <= 4 && ratio > 3 ? '20.5' : ratio);
        if (scale === '20.3' && adsLen > 3) {
            adsLen = 2;
        } else if (scale === '20.5' && adsLen > 4) {
            adsLen = 4;
        }
        // items
        var items = container.childNodes;

        for (var i = 0; i < adsLen; i++) {
            // item 移动只出一条广告
            var ad = ads[i];
            var act = parseInt(ad.action[0].actionType, 10) || 4;
            var item = engine.getLayout(fullConfig);
            item.tagName = 'a';
            item.class = 'item';
            item.id = 'item' + i;
            item['data-adtype'] = act;
            if (act === 4) {
                item.target = '_blank';
            }

            // 广告title
            var titleNum = engine.getLayout(fullConfig);
            titleNum.tagName = 'i';
            titleNum.id = 'titleNum' + i;
            if (i === 0) {
                titleNum.class = 'titleNum titleNum_top';
            }
            else {
                titleNum.class = 'titleNum';
            }
            // title内容
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.class = 'text';
            item.childNodes.push(titleNum);
            item.childNodes.push(titleText);
            // 填充广告数据
            titleText.innerHTML = ad.textTitle[0];
            titleNum.innerHTML = i + 1;
            if (ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink) {
                item.href = ad.action[0] && ad.action[0].clickLink && ad.action[0].clickLink.clickLink;
            }
            items.push(item);
        }
        // 添加样式部分
        var style = {};
        var col = 1;
        var row = adsLen;

        var defaultConfig = {titFF: 'Microsoft YaHei', titTA: 'left', conBW: 0, titFS: 28};
        var skin = {
            normalSkin: {bc: 'transparent', ic: '#333', fc: '#333'},
            floatNormalSkin: {bc: 'transparent', ic: 'white', fc: 'white'}
        };
        var skinCurrent = requestInfo.styleConfig && requestInfo.styleConfig.adslot_type !== null
        && (!requestInfo.styleConfig.adslot_type) ? skin.normalSkin : skin.floatNormalSkin;
        // item居中
        var itemPadding = 0;
        var itemW = containerWidth - itemPadding;
        var itemH = Math.floor(containerHeight / adsLen - 1);
        var titleStyle = engine.getTitleStyle(fullConfig);
        var titleColor = titleStyle['color'] !== '#0000ff' ? titleStyle['color'] : skinCurrent.fc;
        var titleFS = (titleStyle['font-size'] !== 14 ? titleStyle['font-size'] : defaultConfig.titFS) * zoom;
        var titleFF = titleStyle['font-family'] !== 'arial,simsun,sans-serif'
        ? titleStyle['font-family'] : defaultConfig.titFF;
        skin.floatNormalSkin.bc = containerStyle['background-color'] === '#ffffff'
        ? '#000000' : containerStyle['background-color'];
        style['.container'] = containerStyle;
        style['.item'] = {
            'width': itemW,
            'height': itemH,
            'padding-left': itemPadding + 'px',
            'line-height': itemH,
            'display': 'block',
            'font-family': titleFF,
            'text-align': 'left',
            'font-size': titleFS,
            'background-color': skinCurrent.bc,
            'color': titleColor,
            'overflow': 'hidden',
            'text-decoration': 'none',
            'position': 'relative',
            '-webkit-text-size-adjust': 'none',
            '-moz-transition': 'background-color .25s ease-out, color .25s ease-out',
            '-o-transition': 'background-color .25s ease-out, color .25s ease-out',
            '-webkit-transition': 'background-color .25s ease-out, color .25s ease-out',
            'transition': 'background-color .25s ease-out, color .25s ease-out'
        };
        style['.titleNum'] = {
            'font-family': 'Microsoft YaHei',
            'color': skinCurrent.ic,
            'font-style': 'normal',
            'text-align': 'center',
            'cursor': 'pointer',
            'background-color': 'transparent',
            'float': 'left',
            'overflow': 'hidden',
            'vertical-align': 'middle',
            'display': 'block',
            'text-decoration': 'underline',
            'width': titleFS + 4 + 'px'
        };
        style['.titleNum_top'] = {
            color: '#ec0f1e'
        };
        style['.text'] = {
            'padding-left': '3px',
            'overflow': 'hidden',
            'height': itemH,
            'width': itemW - titleFS - 10 + 'px',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'display': 'block'
        };
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});