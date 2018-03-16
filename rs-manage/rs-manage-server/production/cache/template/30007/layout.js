/**
 * @file 30007
 * @author qianxiaoli@baidu.com
 */
/* globals oojs */
oojs.define({
    name: 'flashlayout_hengfu',
    namespace: '',
    deps: {
        basic: 'TemplateServer.Template.basic',
        flash: 'TemplateServer.Common.Utility.Flash'
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
        adIconType: 1
    },

    // 布局, 生成布局对象
    render: function (requestInfo) {
        var userConfig = requestInfo.styleConfig.userConfig;
        var fullConfig = requestInfo.styleConfig.fullConfig;
        var ads = JSON.parse(requestInfo.ads);
        var engine = this.basic;
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;
        var columnCount = fullConfig.adColumnCount;
        var rowCount = fullConfig.adRowCount;

        var itemColumnSpace = fullConfig.itemColumnSpace;
        var itemRowSpace = fullConfig.itemRowSpace;

        var itemWidth = (containerWidth - (columnCount - 1) * itemColumnSpace) / fullConfig.adColumnCount;
        var itemHeight = (containerHeight - (rowCount - 1) * itemRowSpace) / fullConfig.adRowCount;
        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        style['.item a'] = {
            'width': itemWidth,
            'height': itemHeight,
            'position': 'absolute',
            'opacity': 0,
            'top': 0,
            'left': 0,
            'display': 'block',
            'z-index': '9',
            'background-color': '#ffffff'
        };

        if (requestInfo.device.browser && requestInfo.device.browser.type === 'ie') {
            style['.item a'].filter = 'alpha(opacity=0);';

        }

        style['.item a:hover'] = {};
        style['.item div'] = {
            width: itemWidth,
            height: itemHeight
        };

        style['.column-space'] = {
            width: itemColumnSpace,
            height: '0px'
        };
        style['.row-space'] = {
            width: '100%',
            height: '0px'
        };

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;
        var columnSpace = engine.getLayout(fullConfig);
        columnSpace.class = 'column-space';
        var rowSpace = engine.getLayout(fullConfig);
        columnSpace.class = 'row-space';
        var rowCount = fullConfig.adColumnCount;
        var columnCount = fullConfig.adRowCount;

        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                // item
                var adIndex = i * j + j;
                var ad = ads.mainCreatives[adIndex];
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = 'blank';
                var flashDiv = engine.getLayout(fullConfig);
                flashDiv.tagName = 'div';
                var flashOption = {};
                flashOption.width = itemWidth;
                flashOption.height = itemHeight;
                flashOption.url = ad.flash.material.file.fileSrc || '';
                flashOption.browser = requestInfo.device.browser;
                flashDiv.innerHTML = this.flash.getFlashHtml(flashOption);

                // 填充广告数据
                a.title = ad.flash.action.forward.targetPage || '';
                a.href = ad.flash.action.forward.clickLink.clickLink;
                a.id = 'res' + i;
                item.childNodes.push(a);
                item.childNodes.push(flashDiv);
                items.push(item);

                if (j < columnCount - 1) {
                    items.push(columnSpace);
                }
                else if (i < rowCount - 1) {
                    items.push(rowSpace);
                }
            }
        }

        /**********addSubLink************************/
        try {
            var antiArr = [];
            var adSub = ads.mainCreatives[0];
            if (adSub.flash.additionalAction && adSub.flash.additionalAction.length > 0) {
                var estUrlArr = adSub.flash.additionalAction;
                var subLinkCon = engine.getLayout(fullConfig);
                subLinkCon.tagName = 'div';
                subLinkCon.id = 'subLinkCon';
                subLinkCon.class = 'sub_link_con';
                var subLinkArrow = engine.getLayout(fullConfig);
                subLinkArrow.tagName = 'div';
                subLinkArrow.id = 'subLinkArrow';
                subLinkArrow.class = 'sub_link_arrow';
                var subLinkUl = engine.getLayout(fullConfig);
                subLinkUl.tagName = 'ul';
                subLinkUl.id = 'subLinkUl';
                subLinkUl.class = 'sub_link_ul';
                var estShowNum = Math.min(Math.floor(containerHeight / 20), estUrlArr.length);
                for (var i = 0; i < estShowNum; i++) {
                    antiArr.push(estUrlArr[i].forward.clickLink.antiCheating);
                    var subLinkLi = engine.getLayout(fullConfig);
                    subLinkLi.tagName = 'li';
                    subLinkLi.id = 'subLinkLi' + i;
                    subLinkLi.class = 'sub_link_li';
                    if (i === estShowNum - 1) {
                        subLinkLi.class = 'sub_link_li sub_link_li_last';
                    }
                    var subLinkA = engine.getLayout(fullConfig);
                    subLinkA.tagName = 'a';
                    subLinkA.id = 'subLinkA' + parseInt(i + ads.mainCreatives.length, 10);
                    subLinkA.class = 'sub_link_a';
                    subLinkA.target = '_blank';

                    subLinkA.href = estUrlArr[i].forward.clickLink.clickLink;
                    subLinkA.innerHTML = estUrlArr[i].forward.title + '>>';

                    subLinkLi.childNodes.push(subLinkA);
                    subLinkUl.childNodes.push(subLinkLi);
                }
                container.estShowAnti = antiArr.join(',');
                subLinkCon.childNodes.push(subLinkArrow);
                subLinkCon.childNodes.push(subLinkUl);
                items.push(subLinkCon);
                var liHeight = containerHeight / estShowNum;
                style['.sub_link_con'] = {
                    'position': 'absolute',
                    'top': '0px',
                    'right': '0px',
                    'width': '110px',
                    'height': '100%',
                    'z-index': '999'
                };
                style['.sub_link_arrow'] = {
                    'cursor': 'pointer',
                    'height': '26px',
                    'width': '16px',
                    'float': 'left',
                    'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/sublink/subItemLeftArrow.png) no-repeat'
                };
                style['.sub_link_ul'] = {
                    'float': 'left',
                    'width': '94px',
                    'overflow': 'hidden',
                    'list-style': 'none'
                };
                style['.sub_link_li'] = {
                    'height': liHeight - 1 + 'px',
                    'line-height': liHeight - 1 + 'px',
                    'border-bottom': '1px solid #c2c2c2',
                    'border-left': '1px solid #c2c2c2',
                    'background-color': '#f8f8f8',
                    'font-size': '12px'
                };
                style['.sub_link_li_last'] = {
                    'border-bottom': 'none',
                    'height': liHeight + 'px',
                    'line-height': liHeight + 'px'
                };
                style['.sub_link_a'] = {
                    'display': 'block',
                    'cursor': 'pointer',
                    'font-family': '微软雅黑',
                    'text-align': 'center',
                    'color': '#595959',
                    'text-decoration': 'none'
                };
                style['.sub_link_li a:hover'] = {
                    'background-color': '#ffc8ce'
                };
            }
        } catch (e) {}
        /**********addSubLink**************end**********/

        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});