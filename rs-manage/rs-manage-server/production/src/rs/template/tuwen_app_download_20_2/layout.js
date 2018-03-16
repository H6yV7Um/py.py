oojs.define({
    name: 'layout',
    namespace: 'rs.template.tuwen_app_download_20_2',
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
    templateRegex: new RegExp('{([^}]*)}', 'g'),

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

        
        // 添加样式部分
        var style = {};
        var containerStyle = engine.getContainerStyle(fullConfig);
        var containerWidth = containerStyle.width;
        var containerHeight = containerStyle.height;

        // 移动广告占满整个广告位
        var itemWidth = containerWidth;
        var itemHeight = containerHeight;

        // 计算组件尺寸
        var dowWidth = Math.round((150 / 640) * itemWidth);
        var logWidth = Math.round((85 / 640) * itemWidth);
        var adconWidth = itemWidth - logWidth - dowWidth;
        var dowHeight = itemHeight, adconHeight = itemHeight, logHeight = itemHeight;

        // 计算一个pt(640 * 64)的像素值
        var pt = containerWidth / 480; 
        // 计算一个640*64像素与当前像素比例
        var px = containerWidth / 640;
        // styleConfig用户设置相对像素单位 —— 移动模板以 320px 宽为基准
        var cpx = containerWidth / 320;

        style['a:-webkit-any-link'] = { // chrome浏览器的reset css
            'text-decoration': 'none'
        };
        // container高度
        style['html'] = {
            'font-size': containerHeight
        };
        style['body'] = {
            'font-size': 14
        };

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
        // 横向排列，排除margin padding border干扰
        style['.item .row'] = {
            float: 'left',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            border: 0
        };

        // logo区背景色
        var txtBgColor = userConfig['appDescribeBackgroundColor'] || 'ffffff';
        if (txtBgColor.indexOf(')') < 0) {
            txtBgColor = '#' + txtBgColor;
        }
        style['.item .log'] = {
            width: logWidth,
            height: logHeight,
            'background-color': txtBgColor
        };
        var logImgWidth = Math.round(50 * px);
        var logImgHeight = Math.round(50 * px);
        var logTop = Math.round(7 * px); // 与文字区title上部空白保持一致
        var logBottom = logHeight - logTop - logImgHeight;
        var logLeft = Math.round(28 * px);
        style['.item .log .con'] = {
            width: logImgWidth,
            height: logImgHeight,
            'margin-top': logTop,
            'margin-bottom': logBottom,
            'margin-left': logLeft
        };
        style['.item .log .con img'] = {
            width: '100%',
            height: '100%'
        };

        // 应用信息区背景色
        var graBgColor = userConfig['appInfoBackgroundColor'] || 'eaeaea';
        // 广告内容区域
        style['.item .adcon'] = {
            width: adconWidth,
            height: adconHeight,
            position: 'relative',
            'background-color': '#' + graBgColor
        };
        style['.item .adcon .turning'] = {
            'width': adconWidth,
            'height': 3 * adconHeight,//三条内容滚动
            'position': 'relative',
            'background-color': '#' + graBgColor
        };
        style['.item .adcon .tit, .item .adcon .dec, .item .adcon .gra'] = {
            width: adconWidth,
            height: adconHeight,
            'background-color': '#' + graBgColor
        };
        var textLeft = Math.round(12 * px);
        var graFontColor = userConfig['appInfoFontColor'] || '999999';
        var graFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appInfoFontFamily'] && (graFontFamily = userConfig['appInfoFontFamily'] + ',' + graFontFamily);
        style['.item .adcon .text span'] = {
            float: 'left',
            'text-align': 'left',
            'margin-left': textLeft,
            'margin-right': textLeft,
            width: adconWidth - textLeft * 2,
            color: '#' + graFontColor,
            font: 'normal normal 18px ' + graFontFamily
        };
        // 强调文字
        var emColor = userConfig['heightLightColor'] || 'ffb92f';
        style['.item .adcon .text span em'] = {
            'text-decoration': 'none',
            'font-style': 'normal',
            color: '#' + emColor
        };
        style['.item .adcon .tit span.title'] = {
            'font-size': Math.round(22 * pt),
            'line-height': adconHeight,// 垂直居中
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',// 文字截断
            overflow: 'hidden'
        };
        style['.item .adcon .dec span.desc'] = {
            overflow: 'hidden',
            'font-size': Math.round(16 * pt),
            'line-height': Math.round(18 * pt),
            height: 2 * Math.round(18 * pt),
            'padding-top': (adconHeight - 2 * Math.round(18 * pt)) / 2
        };

        // 评级内容布局
        var conWidth = Math.round(390 * px);
        var conHeight = adconHeight;
        var conBgWidth = Math.round(240 * px);
        var conBgHeight = Math.round(21 * px);
        style['.item .adcon .gra .con'] = {
            width: conWidth,
            height: conHeight,
            'margin': 'auto'
        };
        // 评级区文字
        var graFontSize = userConfig['appInfoFontSize'] && Number(userConfig['appInfoFontSize']) ? Math.round(Number(userConfig['appInfoFontSize']) * cpx) : Math.round(16 * pt);
        style['.item .adcon .gra .con span'] = {
            'text-align': 'left',
            'float': 'left',
            color: '#' + graFontColor,
            font: 'normal normal ' + graFontSize + 'px/' + conHeight + 'px ' + graFontFamily
        };
        style['.item .adcon .gra .con span.line1'] = {
            'white-space': 'nowrap',
            'width': Math.round(170 * px)
        };
        style['.item .adcon .gra .con .graicon'] = {
            'float': 'right',
            'width': Math.round(120 * px),
            'height': conHeight,
            'right': 0,
            'background': 'url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/grade.png) no-repeat bottom left',
            'background-size': conBgWidth + 'px ' + conBgHeight + 'px'
        };

        // 下载按钮
        var dowBgColor = userConfig['appDownloadBackgroundColor'] || 'ebac51';
        if(dowBgColor.indexOf(')') < 0) {
            dowBgColor = '#' + dowBgColor;
        }
        style['.item .dow'] = {
            'width': dowWidth,
            'height': dowHeight,
            'position': 'relative',
            'background': dowBgColor + ' url({{dupDomain}}/cpro/ui/noexpire/img/appDownload/download.png) no-repeat -3.33% 0',
            'background-size': '53% 125%'
        };
        // “免费下载”文字
        var dowFontSize = userConfig['appDownloadFontSize']&&Number(userConfig['appDownloadFontSize']) ? Math.round(Number(userConfig['appDownloadFontSize']) * cpx) : Math.round(12.5 * pt);
        var dowFontFamily = 'FZLTZHK,\'Microsoft YaHei\'';
        userConfig['appDownloadFontFamily'] && (dowFontFamily = userConfig['appDownloadFontFamily'] + ',' + dowFontFamily);
        style['.item .dow span'] = {
            position: 'absolute',
            'text-align': 'center',
            'text-shadow': '1px 1px 1px rgba(0,0,0,0.38)',
            width: Math.round(94 * px),
            color: '#ffffff',
            font: 'normal normal ' + dowFontSize + 'px/' + dowHeight + 'px ' + dowFontFamily,
            right: 0
        };

        // logo标识的统一化，不需要单独设置logo尺寸
        // style['#container a.bd-logo4'] = {
        //     width: Math.round(25 * px),
        //     height: Math.round(25 * px),
        //     'background-size': 'contain'
        // };

        // 翻页动画
        style['#container .item .adcon .turning'] = {'animation':'turning 21s linear 7s infinite','-moz-animation':'turning 21s linear 7s infinite','-webkit-animation':'turning 21s linear 7s infinite','-o-animation':'turning 21s linear 7s infinite'}

        // 生成广告layout对象
        // container
        // 建立layoutObj，以container作为Root
        var container = engine.getLayout(fullConfig);
        container.class = 'container';
        container.id = 'container';

        // items
        var items = container.childNodes;
        
        // 检索出的广告数
        var adCount = ads.length;

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
            // 应用名称、介绍
            var appName = ext.appinfo.name || '';
            var appDesc = ext.appinfo.appDesc || '';
            // app探测相关
            var deteConf = ext.appinfo.deteConf || {};
            var appData = ext.appinfo.appData || {};
            var item = engine.getLayout(fullConfig);
            item.class = 'item';

            // item内domLink属性
            var createDomLink = function(){
                return {
                    style: {},
                    childNodes: [],
                    title : ad.showUrl || '',
                    href : ad.clickUrl,
                    tagName : 'a',
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

            // 图文物料左侧logo
            var logoImg = engine.getLayout(fullConfig);
            logoImg.tagName = 'div';
            logoImg.class = 'log row';
            var logA = createDomLink();
            logA.id = 'log'+i;
            var logContent = engine.getLayout(fullConfig);
            logContent.tagName = 'div';
            logContent.class = 'con';
            var log = engine.getLayout(fullConfig);
            log.tagName = 'img';
            log.src = ad.stuffSrc;

            // ad content内容动态展示区域
            var content = engine.getLayout(fullConfig);
            content.tagName = 'div';
            content.class = 'adcon row';
            var conA = createDomLink();
            conA.id = 'adcon'+i;
            var turning = engine.getLayout(fullConfig);
            turning.tagName = 'div';
            turning.class = 'turning';

            // title与desc
            var title = engine.getLayout(fullConfig);
            title.tagName = 'div';
            title.class = 'tit text';
            var titleText = engine.getLayout(fullConfig);
            titleText.tagName = 'span';
            titleText.class = 'title';
            // 20*2尺寸设计特殊化，标题与描述内容由appName与appDesc填充
            titleText.innerHTML = this.emphasize(appName);
            var desc = engine.getLayout(fullConfig);
            desc.tagName = 'div';
            desc.class = 'dec text';
            var descText = engine.getLayout(fullConfig);
            descText.tagName = 'span';
            descText.class = 'desc';
            descText.innerHTML = this.emphasize(appDesc);

            // 秋实下载类广告 文字 图文 模板应用评定
            var grade = engine.getLayout(fullConfig);
            grade.tagName = 'div';
            grade.class = 'gra';
            // 应用评定内容模块
            var graContent = engine.getLayout(fullConfig);
            graContent.tagName = 'div';
            graContent.class = 'con';
            // 应用大小
            var size = ext.appinfo.size || 0;
            var sizeText = engine.getLayout(fullConfig);
            sizeText.tagName = 'span';
            sizeText.class = 'line1';
            sizeText.innerHTML = '\u5927\u5c0f\uff1a'+ parseInt(size) +'MB';
            var rank = ext.appinfo.rank || 0;
            rank = Math.min(100, rank);
            rank = Math.max(0, rank);
            rank = Math.round(rank / 20);
            var graText = engine.getLayout(fullConfig);
            graText.tagName = 'span';
            graText.class = 'line2';
            graText.innerHTML = '\u661f\u7ea7\uff1a'; // '星级：'
            // 星级评定样式
            var graIcon = engine.getLayout(fullConfig);
            graIcon.tagName = 'div';
            graIcon.class = 'graicon';
            style['.item .adcon #'+conA.id+' .gra .con .graicon'] = {
                'background-position': ((5 - rank) * 20) + '% 50%'
            };

            // 秋实下载类广告模板右侧统一下载图标
            var download = engine.getLayout(fullConfig);
            download.tagName = 'div';
            download.class = 'dow row';
            var dowA = createDomLink();
            dowA.id = 'dow'+i;
            var dowText = engine.getLayout(fullConfig);
            dowText.tagName = 'span';
            dowText.innerHTML = '\u514d\u8d39\u4e0b\u8f7d';// 免费下载

            // 组装layoutObj
            item.childNodes.push(logoImg, content, download);
            // 组装logo图片
            logoImg.childNodes.push(logA);
            logA.childNodes.push(logContent);
            logContent.childNodes.push(log);
            // 组装content
            content.childNodes.push(conA);
            conA.childNodes.push(turning);
            turning.childNodes.push(title, desc, grade);
            // 组装title
            title.childNodes.push(titleText);
            // 组装desc
            desc.childNodes.push(descText);
            // 组装grade
            grade.childNodes.push(graContent);
            graContent.childNodes.push(sizeText, graText, graIcon);
            // 组装download
            download.childNodes.push(dowA);
            dowA.childNodes.push(dowText);

            items.push(item);
        }
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
    },

    /**
        工具函数，强调通配符{}引用的字符
        @method emphasize
        @return {String} 
        */
    emphasize: function (text) {
        var result = String(text).replace(this.templateRegex, function (match, subMatch, index, s) {
            return '<em>' + subMatch + '</em>';
        });
        this.templateRegex.lastIndex = 0;
        return result;
    }
});