oojs.define({
    name: 'layout',
    namespace: 'rs.template.image_app_download',
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

    defaultValue:{
        logoType:'bd-logo4',
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

        // container
        // 建立layoutObj，以container作为Root
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;

        //检索出的广告数
        var adCount = ads.length;

        //
        for (var i = 0; i < adCount; i++) {
            // item
            var adIndex = i;
            var ad = ads[i];
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
                    target: '_blank',
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

            // 图片物料
            var imgLayout = engine.getLayout(fullConfig);
            imgLayout.tagName = 'div';
            imgLayout.class = 'img row';
            var imgA = createDomLink();
            imgA.id = 'res' + i;
            var img = engine.getLayout(fullConfig);
            img.tagName = 'img';
            img.src = ad.stuffSrc;

            // 秋实下载类广告模板右侧统一下载图标
            var download = engine.getLayout(fullConfig);
            download.tagName = 'div';
            download.class = 'dow row';
            var dowA = createDomLink();
            dowA.id = 'dow' + i;
            var dowText = engine.getLayout(fullConfig);
            dowText.tagName = 'span';
            dowText.innerHTML = '\u514d\u8d39\u4e0b\u8f7d';// 免费下载

            // 组装layoutObj
            item.childNodes.push(imgLayout, download);
            // 组装imgLayout
            imgLayout.childNodes.push(imgA);
            imgA.childNodes.push(img);
            // 组装download
            download.childNodes.push(dowA);
            dowA.childNodes.push(dowText);

            items.push(item);
        }

        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 移动广告占满整个广告位
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;

        // 计算组件尺寸
        var dowWidth = Math.round((3 / 20) * itemWidth);
        var imgWidth = itemWidth - dowWidth;
        var dowHeight = itemHeight, imgHeight = itemHeight;

        // 计算一个pt(800 * 120)的像素值
        var pt = containerWidth / 600;
        // 计算一个800*120像素与当前像素比例
        var px = containerWidth / 800;
        // styleConfig用户设置相对像素单位 —— 移动模板以 320px 宽为基准
        var cpx = containerWidth / 320;

        style['.container'] = containerStyle;
        style['.item'] = {
            width: itemWidth,
            height: itemHeight
        };
        // 全区域可点击
        style['.item a'] = {
            display: 'block',
            width: '100%',
            height: itemHeight
        };
        style['.item a:hover'] = {};
        style['.item img'] = {
            width: imgWidth,
            height: imgHeight
        };
        // 横向排列，排除margin padding border干扰
        style['.item .row'] = {
            'float': 'left',
            'overflow': 'hidden',
            'margin': 0,
            'padding': 0,
            'border': 0
        };
        style['.item .img'] = {
            width: imgWidth,
            height: imgHeight
        };

        // 下载按钮
        var dowBgColor = userConfig['appDownloadBackgroundColor'] || 'ebac51';
        if (dowBgColor.indexOf(')') < 0) {
            dowBgColor = '#' + dowBgColor;
        }
        /* eslint-disable fecs-max-statements */
        style['.item .dow'] = {
            'width': dowWidth,
            'height': dowHeight,
            'position': 'relative',
            'background': dowBgColor + ' url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/download.png) no-repeat top left',
            'background-size': 'contain'
        };
        /* eslint-enable fecs-max-statements */
        // “免费下载”文字
        var dowFontSize = userConfig['appDownloadFontSize'] && Number(userConfig['appDownloadFontSize']) ? Math.round(Number(userConfig['appDownloadFontSize']) * cpx) : Math.round(14 * pt);
        var dowFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appDownloadFontFamily'] && (dowFontFamily = userConfig['appDownloadFontFamily'] + ',' + dowFontFamily);
        style['.item .dow span'] = {
            'position': 'absolute',
            'text-align': 'center',
            'text-shadow': '1px 1px 1px rgba(0,0,0,0.38)',
            'width': '100%',
            'color': '#ffffff',
            'font': 'normal normal ' + dowFontSize + 'px/' + dowFontSize + 'px ' + dowFontFamily,
            'bottom': Math.round(14 * px) + 'px'
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