oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_app_download_full',
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
        logoType: 'bd-logo4',
        containerBorderTop: 1,
        containerBorderRight: 1,
        containerBorderBottom: 1,
        containerBorderLeft: 1,
        containerBorderColor: 'd9d9d9',
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
                var ext = {};
                if (ad.extention) {
                    ext = JSON.parse(ad.extention);
                }
                // 下载类扩展字段
                ext.appinfo = ext.appinfo || {};
                // app探测相关
                var deteConf = ext.appinfo.deteConf || {};
                var appData = ext.appinfo.appData || {};
                var item = engine.getLayout(fullConfig);
                item.class = 'item';

                // item内domLink属性
                var createDomLink = function () {
                    return {
                        style: {},
                        childNodes: [],
                        title: ad.showUrl || '',
                        href: ad.clickUrl,
                        tagName: 'a',
                        // 解决下载链接打开appstore问题 target : '_blank',
                        // 为了性能逐条属性写入
                        timeInterval: deteConf.timeInterval || '',
                        checkCount: deteConf.checkCount || '',
                        expiredTime: deteConf.expiredTime || '',
                        maxDetectTimes: deteConf.maxDetectTimes || '',
                        appkey: appData.appkey || '',
                        sk: appData.sk || ''
                    };
                };

                var item = engine.getLayout(fullConfig);
                item.class = 'item';
                var a = createDomLink();
                var img = engine.getLayout(fullConfig);
                img.tagName = 'img';
                a.childNodes.push(img);

                // 填充广告数据
                img.src = ad.stuffSrc;
                a.id = 'res' + adIndex;
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
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 计算一个640像素与当前像素比例
        var px = containerWidth / 640;

        var columnCount = fullConfig.adColumnCount;
        var rowCount = fullConfig.adRowCount;

        var itemColumnSpace = fullConfig.itemColumnSpace;
        var itemRowSpace = fullConfig.itemRowSpace;

        var itemWidth = (containerWidth - (columnCount-1) * itemColumnSpace) / fullConfig.adColumnCount;
        var itemHeight = (containerHeight - (rowCount-1) * itemRowSpace) / fullConfig.adRowCount;

        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        style['.item a'] = {
            width: itemWidth,
            height: itemHeight,
            display: 'block'
        };
        style['.item a:hover'] = {};
        style['.item img'] = {
            width: itemWidth,
            height: itemHeight
        };

        style['.column-space'] = {
            width:itemColumnSpace,
            height: "0px"
        };
        style['.row-space'] = {
            width: "100%",
            height: "0px"
        };
        // logo标识的统一化，不需要单独设置logo尺寸
        // style['#container a.bd-logo4'] = {
        //     'width': Math.round(25 * px),
        //     'height': Math.round(25 * px),
        //     'background-size': 'contain'
        // };
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