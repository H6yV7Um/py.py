oojs.define({
    name: 'layout',
    namespace: 'rs.template.flash_google_adx',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        flash: 'rs.common.utility.flash',
        adIcon: 'rs.business.adIcon'
    },
    $layout: function () {},
    isNeedLayoutCache: false, // 是否缓存Layout的结果
    isNeedRenderData: false,  // 是否需要数据引擎渲染数据

    defaultValue: {
        containerBorderTop: 1,
        containerBorderRight: 1,
        containerBorderBottom: 1,
        containerBorderLeft: 1,
        containerBorderColor: '333333',
        containerPaddingTop: 0,
        containerPaddingRight: 0,
        containerPaddingBottom: 0,
        containerPaddingLeft: 0,
        adIconType: 1
    },
    /**
        布局, 生成布局对象
        @method layout
        @return {Object} layoutObject布局对象
        */
    render: function (context) {
        var userConfig = context.userConfig;
        var fullConfig = context.fullConfig;
        var ads = context.requestInfo.adElements;

        var engine = this.basic;

        // 添加样式部分
        var style = {};
        var containerStyle = this.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        var itemWidth = containerWidth;
        var itemHeight = containerHeight;

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

        if (context.browser && context.browser.type === 'ie') {
            style['.item a'].filter = 'alpha(opacity=0);';

        }

        style['.item div'] = {
            width: itemWidth,
            height: itemHeight
        };

        // container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items-google广告只有一条item
        var items = container.childNodes;
        // item
        var i = 0;
        var ad = ads[i];
        var extention = {};
        try {
            extention = JSON.parse(ad.extention);
        } catch (e) {};
        var item = engine.getLayout(fullConfig);
        item.class = 'item';
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.onclick = 'adc();';
        var flashDiv = engine.getLayout(fullConfig);
        flashDiv.tagName = 'div';

        var flashOption = {};
        flashOption.width = itemWidth;
        flashOption.height = itemHeight;
        // 加载物料容器壳
        var shellSrc = '{{dupDomain}}/cpro/ui/noexpire/img/2.0.3/baiduadshell.swf';
        shellSrc += '?ad=' + encodeURIComponent(ad.stuffSrc);
        if (extention.snap) {
            shellSrc += '&s=' + encodeURIComponent(extention.snap);
        }
        flashOption.url = shellSrc;
        flashOption.browser = context.browser;
        flashDiv.innerHTML = this.flash.getFlashHtml(flashOption);


        // 填充广告数据
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        a.id = 'res' + i;
        item.childNodes.push(a);
        item.childNodes.push(flashDiv);
        items.push(item);


        // add logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    },

    /**
        生成containerStyle样式队形-提高性能
        @method getContainerStyle
        @return {Object} containerStyle布局对象
        */
    getContainerStyle: function (option) {
        var style = {};
        var containerPaddingTop = parseInt(option.containerPaddingTop, 10),
            containerPaddingRight = parseInt(option.containerPaddingRight, 10),
            containerPaddingBottom = parseInt(option.containerPaddingBottom, 10),
            containerPaddingLeft = parseInt(option.containerPaddingLeft, 10),
            containerBorderTop = parseInt(option.containerBorderTop, 10),
            containerBorderRight = parseInt(option.containerBorderRight, 10),
            containerBorderBottom = parseInt(option.containerBorderBottom, 10),
            containerBorderLeft = parseInt(option.containerBorderLeft, 10);

        var paddingArray = [containerPaddingTop + 'px', containerPaddingRight + 'px', containerPaddingBottom + 'px', containerPaddingLeft + 'px'];
        // padding值都相等时合并，默认情况都为0
        if ((containerPaddingTop === containerPaddingBottom) && (containerPaddingLeft === containerPaddingRight) && (containerPaddingTop === containerPaddingRight)) {
            paddingArray = [containerPaddingTop + 'px'];
        }
        var borderArray = [containerBorderTop + 'px', containerBorderRight + 'px', containerBorderBottom + 'px', containerBorderLeft + 'px'];
       // padding值都相等时合并，默认情况都为0
        if ((containerBorderTop === containerBorderBottom) && (containerBorderLeft === containerBorderRight) && (containerBorderTop === containerBorderRight)) {
            borderArray = [containerBorderTop + 'px'];
        }
        style["outer-width"] = option.templateWidth;
        style["outer-height"] = option.templateHeight;
        style["padding"] = paddingArray.join(' ');
        style["margin-top"] = parseInt(option.containerMarginTop);
        style["border-style"] = option.containerBorderStyle;
        style["border-width"] = borderArray.join(' ');
        style["border-color"] = "#" + option.containerBorderColor.replace("#", "");
        style["width"] = option.templateWidth - containerPaddingLeft - containerPaddingRight - containerBorderRight - containerBorderLeft;
        style["height"] = option.templateHeight - containerPaddingTop - containerPaddingBottom - containerBorderTop - containerBorderBottom;
        style["background-color"] = "#" + option.containerBackgroundColor.replace("#", "");
        if (parseInt(option.containerOpacity) === 1) {
            style["background-color"] = "transparent";
        }
        style["position"] = "relative";
        style["overflow"] = "hidden";
        style["float"] = option.containerFloat;
        return style;
    }
});