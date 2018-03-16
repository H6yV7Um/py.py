oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_mobile',
    deps: {
        basic: 'rs.template.basic',
        string: 'rs.common.utility.string',
        logo: 'rs.business.logo',
        //计算尺寸、调整布局
        size: 'rs.template.tuwen_mobile.size',
        adIcon: 'rs.business.adIcon',
        feedback: 'rs.business.feedback'
    },
    $layout: function () {},
    isNeedLayoutCache: false, //是否缓存Layout的结果
    isNeedRenderData: false,  //是否需要数据引擎渲染数据

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

        //item 移动只出一条广告
        var ad = ads[0];
        var item = engine.getLayout(fullConfig);
        item.class = 'item';

        //广告点击区域——item可点
        var a = engine.getLayout(fullConfig);
        a.tagName = 'a';
        a.target = '_blank';
        a.id = 'item0';

        //广告logo
        var logo = engine.getLayout(fullConfig);
        logo.tagName = 'div';
        logo.id = 'logo0';
        logo.class = 'logo';
        //logo图片
        var logoImg = engine.getLayout(fullConfig);
        logoImg.tagName = 'img';
        logo.childNodes.push(logoImg);
        item.childNodes.push(logo);

        //广告title
        var title = engine.getLayout(fullConfig);
        title.tagName = 'div';
        title.id = 'title0';
        title.class = 'title';
        //title内容
        var titleText = engine.getLayout(fullConfig);
        titleText.tagName = 'span';
        title.childNodes.push(titleText);
        item.childNodes.push(title);

        //广告desc
        var desc = engine.getLayout(fullConfig);
        desc.tagName = 'div';
        desc.id = 'desc0';
        desc.class = 'desc';
        //desc内容
        var descText = engine.getLayout(fullConfig);
        descText.tagName = 'span';
        desc.childNodes.push(descText);
        item.childNodes.push(desc);

        //填充广告数据
        logoImg.src = ad.stuffSrc;
        titleText.innerHTML = ad.title;
        descText.innerHTML = ad.desc;
        a.title = ad.showUrl || '';
        a.href = ad.clickUrl;
        item.childNodes.push(a);
        items.push(item);

        //添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        //根据广告位比例计算尺寸
        // 20.3 - 6.66
        // 20.5 - 4
        // 6.5  - 1.2
        var scale = containerWidth / containerHeight;
        var data;
        if (scale > 6.5) {
            data = this.size.calculate_20_3(containerWidth, containerHeight);
        } else if (scale > 3.5) {
            data = this.size.calculate_20_5(containerWidth, containerHeight);
        } else {
            data = this.size.calculate_6_5(containerWidth, containerHeight);
        }

        //item居中
        var paddingTop = Math.floor((containerHeight - data.itemHeight) / 2);
        var paddingLeft = Math.floor((containerWidth - data.itemWidth) / 2);

        style[".container"] = containerStyle;
        style[".item"] = {
            width: data.itemWidth,
            height: data.itemHeight,
            padding: paddingTop + 'px ' + paddingLeft + 'px',
            position: 'relative'
        };
        //移动广告全区域可点击
        style[".item a"] = {
            width: data.itemWidth + (paddingLeft * 2),
            height: data.itemHeight + (paddingTop * 2),
            position: 'absolute',
            top: 0,
            left: 0
        };
        style[".item a:hover"] = {};
        style[".item div"] = {
            float: 'left',
            overflow: 'hidden'
        };
        style[".item .logo"] = {
            width: data.logoWidth,
            height: data.logoHeight,
            padding: data.logoPadding + 'px'
        };
        style[".item .logo img"] = {
            width: data.logoWidth,
            height: data.logoHeight
        };
        //文本折行
        style[".item span"] = {
            'word-wrap': 'break-word'
        };
        style[".item .title"] = {
            width: data.titleWidth,
            height: data.titleHeight
        };
        style[".item .title span"] = {
            font: 'normal bold ' + data.titleFontSize + 'px/' + data.titleLineHeight + 'px arial,sans-serif;',
            color: data.titleFontColor
        };
        style[".item .desc"] = {
            width: data.descWidth,
            height: data.descHeight,
            'padding-top': data.descPaddingTop
        };
        style[".item .desc span"] = {
            font: 'normal ' + data.descFontSize + 'px/' + data.descLineHeight + 'px arial,sans-serif;',
            color: data.descFontColor
        };

        //add logo
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
                'flowType': 1}, style));// 添加悬浮样式
                container.childNodes.push(this.feedback.addFeedbackIcon({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加红点标识
                container.childNodes.push(this.feedback.getFeedback({'adW': containerStyle.width,
                'adH': containerStyle.height,
                'flowType': 1}, style));// 添加反馈内容
            }
        }
        catch (e) {

        }
        var result = {
            layoutObj: container,
            style: style
        };
        return result;
    }
});