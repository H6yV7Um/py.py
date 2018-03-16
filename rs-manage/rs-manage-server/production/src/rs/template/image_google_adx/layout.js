oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_google_adx',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
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

        //container
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        //items
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
                var ad = ads[adIndex];
                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = engine.getLayout(fullConfig);
                a.tagName = 'a';
                a.target = '_blank';
                a.onclick = 'adc();';
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                a.childNodes.push(img);

                // 填充广告数据
                img.src = ad.stuffSrc;
                a.title = ad.showUrl || '';
                a.href = ad.clickUrl;
                a.id = 'res' + i;
                item.childNodes.push(a);
                items.push(item);

                if (j < columnCount - 1) {
                    items.push(columnSpace);
                }
                else if (i < rowCount - 1) {
                    items.push(rowSpace);
                }
            }
        }

        // 添加样式部分
        var style = {};
        var containerStyle = this.getContainerStyle(fullConfig);
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
            width: itemWidth,
            height: itemHeight
        };
        style['.item img'] = {
            width: itemWidth,
            height: itemHeight
        };

        if (columnCount > 1) {
            style['column-space'] = {
                'width': itemColumnSpace,
                'height': '0px'
            };
        }
        if (rowCount > 1) {
            style['.row-space'] = {
                'width': '100%',
                'height': '0px'
            };
        }

        // add logo
        if (fullConfig.logoIsShow) {
            container.childNodes.push(this.logo.getLogo(fullConfig));
        }
        // add adIcon
        if (fullConfig.adIconIsShow) {
            container.childNodes.push(this.adIcon.getAdIcon(fullConfig));
        }
        try {
            if (fullConfig.isShowCloseFeedBack) {
                var logInfoDiv = engine.getLayout(fullConfig);
                logInfoDiv.class = 'logInfoDiv';
                logInfoDiv.id = 'logInfoDiv';
                style['.logInfoDiv'] = {
                    'display': 'none'
                };
                var dspDiv = engine.getLayout(fullConfig);
                dspDiv.class = 'dspDiv';
                dspDiv.id = 'dspDiv';
                style['.dspDiv'] = {
                    'display': 'none'
                };
                /* eslint-disable max-len */
                dspDiv.innerHTML = context.requestInfo.account;// dspId:发送日志参数
                logInfoDiv.innerHTML = context.requestInfo  && context.requestInfo.logInfo && context.requestInfo.logInfo.closefeedback && context.requestInfo.logInfo.closefeedback.toString('utf8');// s:发送日志参数-反馈日志md5加密字符串
                container.childNodes.push(logInfoDiv);
                container.childNodes.push(dspDiv);
                container.childNodes.push(this.feedback.addFeedbackTip({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 2}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 2}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 2}, style));// 添加反馈内容
            }
        }
        catch (e) {

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
        style['padding'] = paddingArray.join(' ');
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